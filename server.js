const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
app.use(express.json({limit:'256kb'}));
app.use(express.static(__dirname));
const pool = process.env.DATABASE_URL ? new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}}) : null;
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '';

async function db(){
  if(!pool) throw new Error('DATABASE_URL is not configured');
  await pool.query(`CREATE TABLE IF NOT EXISTS players(
    telegram_id TEXT PRIMARY KEY,
    username TEXT DEFAULT '',
    first_name TEXT DEFAULT '',
    state JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS businesses(
    id BIGSERIAL PRIMARY KEY,
    owner_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    purchase_price INTEGER NOT NULL,
    revenue BIGINT NOT NULL DEFAULT 0,
    sales INTEGER NOT NULL DEFAULT 0,
    balance BIGINT NOT NULL DEFAULT 0,
    UNIQUE(owner_id,type)
  );`);
}
function userId(req){return String(req.get('x-telegram-user-id')||'local').slice(0,64)}
function tgUser(req){try{return JSON.parse(req.get('x-telegram-user')||'{}')}catch{return {}}}
async function ensurePlayer(id,meta={}){
  const existed=await pool.query('SELECT 1 FROM players WHERE telegram_id=$1',[id]);
  const q=await pool.query(`INSERT INTO players(telegram_id,username,first_name,state) VALUES($1,$2,$3,$4)
    ON CONFLICT(telegram_id) DO UPDATE SET username=EXCLUDED.username,first_name=EXCLUDED.first_name,last_seen=NOW()
    RETURNING *`,[id,meta.username||'',meta.first_name||'',JSON.stringify(defaultState(id))]);
  return {...q.rows[0],created:!existed.rowCount};
}
function defaultState(id){return {playerId:id,balance:1000,foodDays:3,foodSpent:0,job:null,housing:'room',xp:0,level:1,workedHours:0,working:false,shiftStartedAt:0,shiftEndsAt:0,shiftPay:0,cars:[],businesses:[],bankHistory:[],debt:0,gameHours:0,lastEconomyAt:Date.now(),rentPaidCount:0,missedBills:0,daily:{day:0,shift:false,food:false,earned:0,rewarded:[]},tasks:{firstJob:false,firstShift:false,firstCar:false},settings:{notifications:true,vibration:true}}}
function validState(s,id){return {...defaultState(id),...(s||{}),playerId:id,balance:Math.max(0,Number(s?.balance)||0),businesses:Array.isArray(s?.businesses)?s.businesses:[],cars:Array.isArray(s?.cars)?s.cars:[],bankHistory:Array.isArray(s?.bankHistory)?s.bankHistory.slice(-100):[]}}
async function upsertState(id,state,meta={}){
  const clean=validState(state,id);
  await pool.query(`INSERT INTO players(telegram_id,username,first_name,state,last_seen) VALUES($1,$2,$3,$4,NOW())
    ON CONFLICT(telegram_id) DO UPDATE SET state=EXCLUDED.state,username=EXCLUDED.username,first_name=EXCLUDED.first_name,last_seen=NOW()`,[id,meta.username||'',meta.first_name||'',JSON.stringify(clean)]);
  return clean;
}
function businessPrice(type){return {grocery:30000,wash:50000,cafe:80000,service:100000,dealer:150000}[type]||0}
function businessName(type){return {grocery:['Продуктовий магазин','🛒'],wash:['Автомийка','🚿'],cafe:['Кафе','🍔'],service:['Автосервіс','🔧'],dealer:['Автосалон','🚗']}[type]}
function carPrice(name){return {'Lada 2107':8000,'Daewoo Lanos':12000,'Skoda Octavia':25000}[name]||0}

app.get('/api/health',async(req,res)=>res.json({ok:true,version:'0.12.0',database:!!pool}));
app.get('/api/state',async(req,res)=>{try{const id=userId(req);const meta=tgUser(req);const row=await ensurePlayer(id,meta);res.json({ok:true,state:row.state,created:row.created,player:{id,username:row.username,firstName:row.first_name}})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.post('/api/state',async(req,res)=>{try{const id=userId(req);const state=await upsertState(id,req.body.state,tgUser(req));res.json({ok:true,state})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.get('/api/players',async(req,res)=>{try{const rows=await pool.query(`SELECT telegram_id,username,first_name,last_seen,state->>'balance' AS balance FROM players ORDER BY last_seen DESC LIMIT 50`);res.json({ok:true,online:rows.rows.filter(r=>Date.now()-new Date(r.last_seen).getTime()<5*60*1000).length,players:rows.rows.map(r=>({id:r.telegram_id,username:r.username,firstName:r.first_name,balance:Number(r.balance||0),lastSeen:r.last_seen}))})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.post('/api/business/purchase',async(req,res)=>{
  const client=await pool.connect(); try{const id=userId(req),type=String(req.body.type);const price=businessPrice(type),info=businessName(type);if(!price||!info) return res.status(400).json({ok:false,error:'Unknown business'});await client.query('BEGIN');
    const row=await client.query('SELECT state FROM players WHERE telegram_id=$1 FOR UPDATE',[id]); if(!row.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Player not found'})}
    const s=validState(row.rows[0].state,id); if(s.balance<price)return res.status(400).json({ok:false,error:'Недостатньо грошей'}); if(s.businesses.some(b=>b.type===type))return res.status(400).json({ok:false,error:'Бізнес вже належить тобі'});
    s.balance-=price;s.businesses.push({type,name:info[0],icon:info[1],purchasePrice:price,revenue:0,sales:0,balance:0});s.bankHistory.push({text:'Купівля бізнесу: '+info[0],amount:'-'+price});
    await client.query('UPDATE players SET state=$2,last_seen=NOW() WHERE telegram_id=$1',[id,JSON.stringify(s)]);
    await client.query('INSERT INTO businesses(owner_id,type,name,icon,purchase_price) VALUES($1,$2,$3,$4,$5)',[id,type,info[0],info[1],price]);await client.query('COMMIT');res.json({ok:true,state:s});
  }catch(e){await client.query('ROLLBACK').catch(()=>{});res.status(500).json({ok:false,error:e.message})}finally{client.release()}
});
app.post('/api/market/purchase',async(req,res)=>{
  const client=await pool.connect(); try{const buyer=userId(req),type=String(req.body.businessType),item=String(req.body.item||''),amount=Math.floor(Number(req.body.amount)||0);if(!type||amount<=0)return res.status(400).json({ok:false,error:'Invalid purchase'});await client.query('BEGIN');
    const b=await client.query('SELECT * FROM businesses WHERE type=$1 LIMIT 1 FOR UPDATE',[type]);if(!b.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Немає доступного бізнесу цього типу'})}const biz=b.rows[0];if(biz.owner_id===buyer){await client.query('ROLLBACK');return res.status(400).json({ok:false,error:'Власник не може купувати у власному бізнесі'})}
    const br=await client.query('SELECT state FROM players WHERE telegram_id=$1 FOR UPDATE',[buyer]);if(!br.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Покупця не знайдено'})}const bs=validState(br.rows[0].state,buyer);if(bs.balance<amount){await client.query('ROLLBACK');return res.status(400).json({ok:false,error:'Недостатньо грошей'})}
    const or=await client.query('SELECT state FROM players WHERE telegram_id=$1 FOR UPDATE',[biz.owner_id]);const os=validState(or.rows[0].state,biz.owner_id);bs.balance-=amount;os.balance+=amount;bs.bankHistory.push({text:'Покупка: '+item+' у '+biz.name,amount:'-'+amount});os.bankHistory.push({text:'Продаж: '+item+' у '+biz.name,amount:'+'+amount});
    const ob=os.businesses.find(x=>x.type===type);if(ob){ob.revenue=(ob.revenue||0)+amount;ob.sales=(ob.sales||0)+1;ob.balance=(ob.balance||0)+amount}
    await client.query('UPDATE players SET state=$2,last_seen=NOW() WHERE telegram_id=$1',[buyer,JSON.stringify(bs)]);await client.query('UPDATE players SET state=$2,last_seen=NOW() WHERE telegram_id=$1',[biz.owner_id,JSON.stringify(os)]);await client.query('UPDATE businesses SET revenue=revenue+$2,sales=sales+1,balance=balance+$2 WHERE id=$1',[biz.id,amount]);await client.query('COMMIT');res.json({ok:true,buyerState:bs,ownerId:biz.owner_id});
  }catch(e){await client.query('ROLLBACK').catch(()=>{});res.status(500).json({ok:false,error:e.message})}finally{client.release()}
});
app.post('/api/transfer',async(req,res)=>{
  const client=await pool.connect();try{const from=userId(req),to=String(req.body.to||''),amount=Math.floor(Number(req.body.amount)||0);if(!to||to===from||amount<=0)return res.status(400).json({ok:false,error:'Невірний переказ'});await client.query('BEGIN');const a=await client.query('SELECT state FROM players WHERE telegram_id=$1 FOR UPDATE',[from]);const b=await client.query('SELECT state FROM players WHERE telegram_id=$1 FOR UPDATE',[to]);if(!a.rowCount||!b.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Гравця не знайдено'})}const as=validState(a.rows[0].state,from),bs=validState(b.rows[0].state,to);if(as.balance<amount){await client.query('ROLLBACK');return res.status(400).json({ok:false,error:'Недостатньо грошей'})}as.balance-=amount;bs.balance+=amount;as.bankHistory.push({text:'Переказ гравцю '+to,amount:'-'+amount});bs.bankHistory.push({text:'Переказ від '+from,amount:'+'+amount});await client.query('UPDATE players SET state=$2 WHERE telegram_id=$1',[from,JSON.stringify(as)]);await client.query('UPDATE players SET state=$2 WHERE telegram_id=$1',[to,JSON.stringify(bs)]);await client.query('COMMIT');res.json({ok:true,state:as})}catch(e){await client.query('ROLLBACK').catch(()=>{});res.status(500).json({ok:false,error:e.message})}finally{client.release()}});

if(!pool) console.warn('Life+: DATABASE_URL not set. Configure Railway PostgreSQL before using online persistence.');
db().then(()=>app.listen(PORT,()=>console.log(`Life+ v0.12.0 listening on ${PORT}`))).catch(e=>{console.error(e);process.exit(1)});
