const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json({limit:'256kb'}));
app.use(express.static(__dirname));

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || '/data';
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, 'lifeplus.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS players (
  telegram_id TEXT PRIMARY KEY,
  username TEXT NOT NULL DEFAULT '',
  first_name TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  purchase_price INTEGER NOT NULL,
  revenue INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  balance INTEGER NOT NULL DEFAULT 0,
  UNIQUE(owner_id, type),
  FOREIGN KEY(owner_id) REFERENCES players(telegram_id)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS friend_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  UNIQUE(from_id,to_id)
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  text TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
`);


function now(){ return Date.now(); }
function userId(req){ return String(req.get('x-telegram-user-id') || 'local').slice(0,64); }
function tgUser(req){ try{return JSON.parse(req.get('x-telegram-user') || '{}')}catch{return {}} }
function defaultState(id){return {playerId:id,registered:false,nickname:'',balance:1000,foodDays:3,foodSpent:0,job:null,housing:'room',xp:0,level:1,workedHours:0,working:false,shiftStartedAt:0,shiftEndsAt:0,shiftPay:0,cars:[],businesses:[],bankHistory:[],debt:0,gameHours:0,lastEconomyAt:now(),rentPaidCount:0,missedBills:0,daily:{day:0,shift:false,food:false,earned:0,rewarded:[]},tasks:{firstJob:false,firstShift:false,firstCar:false},settings:{notifications:true,vibration:true}}}
function validState(s,id){const d=defaultState(id);const x={...d,...(s||{})};x.playerId=id;x.balance=Math.max(0,Number(x.balance)||0);x.businesses=Array.isArray(x.businesses)?x.businesses:[];x.cars=Array.isArray(x.cars)?x.cars:[];x.bankHistory=Array.isArray(x.bankHistory)?x.bankHistory.slice(-100):[];return x}
function getPlayer(id){const row=db.prepare('SELECT * FROM players WHERE telegram_id=?').get(id);if(!row)return null;return {...row,state:JSON.parse(row.state)}}
function ensurePlayer(id,meta={}){let p=getPlayer(id);if(p){const s=validState(p.state,id);if(s.registered===undefined)s.registered=true;db.prepare('UPDATE players SET username=?,first_name=?,state=?,last_seen=? WHERE telegram_id=?').run(meta.username||p.username||'',meta.first_name||p.first_name||'',JSON.stringify(s),now(),id);return {...p,username:meta.username||p.username,first_name:meta.first_name||p.first_name,state:s}}const s=defaultState(id);db.prepare('INSERT INTO players(telegram_id,username,first_name,state,last_seen) VALUES(?,?,?,?,?)').run(id,meta.username||'',meta.first_name||'',JSON.stringify(s),now());return {telegram_id:id,username:meta.username||'',first_name:meta.first_name||'',state:s,created:true}}
function savePlayer(id,state,meta={}){const clean=validState(state,id);db.prepare(`INSERT INTO players(telegram_id,username,first_name,state,last_seen) VALUES(?,?,?,?,?) ON CONFLICT(telegram_id) DO UPDATE SET username=excluded.username,first_name=excluded.first_name,state=excluded.state,last_seen=excluded.last_seen`).run(id,meta.username||'',meta.first_name||'',JSON.stringify(clean),now());return clean}
function businessPrice(type){return {grocery:30000,wash:50000,cafe:80000,service:100000,dealer:150000}[type]||0}
function businessName(type){return {grocery:['Продуктовий магазин','🛒'],wash:['Автомийка','🚿'],cafe:['Кафе','🍔'],service:['Автосервіс','🔧'],dealer:['Автосалон','🚗']}[type]}

app.get('/api/health',(req,res)=>res.json({ok:true,version:'0.12.0',storage:'railway-volume',database:true,dataDir:DATA_DIR}));
app.get('/api/state',(req,res)=>{try{const id=userId(req),p=getPlayer(id);if(!p)return res.json({ok:true,registered:false,state:null,player:{id}});const s=validState(p.state,id);res.json({ok:true,registered:!!s.registered,state:s,created:false,player:{id,username:p.username,firstName:p.first_name,nickname:s.nickname||''}})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.post('/api/state',(req,res)=>{try{const id=userId(req);const p=getPlayer(id);if(!p)return res.status(403).json({ok:false,error:'Потрібна реєстрація'});const current=validState(p.state,id);if(!current.registered)return res.status(403).json({ok:false,error:'Потрібна реєстрація'});const state=savePlayer(id,{...req.body.state,registered:true,nickname:current.nickname},tgUser(req));res.json({ok:true,state})}catch(e){res.status(500).json({ok:false,error:e.message})}});

app.post('/api/register',(req,res)=>{try{const id=userId(req),meta=tgUser(req),nickname=String(req.body.nickname||'').trim().replace(/\s+/g,' ');if(id==='local')throw new Error('Відкрий гру через Telegram');if(nickname.length<3||nickname.length>20)throw new Error('Нікнейм має бути від 3 до 20 символів');if(!/^[\p{L}\p{N}_ -]+$/u.test(nickname))throw new Error('Нікнейм містить недозволені символи');const exists=getPlayer(id);if(exists&&validState(exists.state,id).registered)throw new Error('Акаунт вже зареєстрований');const s=exists?validState(exists.state,id):defaultState(id);s.registered=true;s.nickname=nickname;s.playerId=id;savePlayer(id,s,meta);res.json({ok:true,state:s,player:{id,nickname}})}catch(e){res.status(400).json({ok:false,error:e.message})}});
app.get('/api/players',(req,res)=>{try{const rows=db.prepare(`SELECT telegram_id,username,first_name,last_seen,state FROM players ORDER BY last_seen DESC LIMIT 50`).all();const online=rows.filter(r=>now()-r.last_seen<5*60*1000).length;res.json({ok:true,online,players:rows.map(r=>{const s=JSON.parse(r.state);return {id:r.telegram_id,username:r.username,firstName:r.first_name,balance:Number(s.balance||0),lastSeen:new Date(r.last_seen).toISOString()}})})}catch(e){res.status(500).json({ok:false,error:e.message})}});

app.post('/api/business/purchase',(req,res)=>{const tx=db.transaction(()=>{const id=userId(req),type=String(req.body.type),price=businessPrice(type),info=businessName(type);if(!price||!info)throw new Error('Unknown business');const p=getPlayer(id);if(!p)throw new Error('Player not found');const s=validState(p.state,id);if(s.balance<price)throw new Error('Недостатньо грошей');if(s.businesses.some(b=>b.type===type))throw new Error('Бізнес вже належить тобі');s.balance-=price;s.businesses.push({type,name:info[0],icon:info[1],purchasePrice:price,revenue:0,sales:0,balance:0});s.bankHistory.push({text:'Купівля бізнесу: '+info[0],amount:'-'+price});savePlayer(id,s,tgUser(req));db.prepare('INSERT INTO businesses(owner_id,type,name,icon,purchase_price) VALUES(?,?,?,?,?)').run(id,type,info[0],info[1],price);return s});try{res.json({ok:true,state:tx()})}catch(e){res.status(400).json({ok:false,error:e.message})}});

app.post('/api/market/purchase',(req,res)=>{const tx=db.transaction(()=>{const buyer=userId(req),type=String(req.body.businessType),item=String(req.body.item||''),amount=Math.floor(Number(req.body.amount)||0);if(!type||amount<=0)throw new Error('Invalid purchase');const biz=db.prepare('SELECT * FROM businesses WHERE type=? ORDER BY id LIMIT 1').get(type);if(!biz)throw new Error('Немає доступного бізнесу цього типу');if(biz.owner_id===buyer)throw new Error('Власник не може купувати у власному бізнесі');const bp=getPlayer(buyer);const op=getPlayer(biz.owner_id);if(!bp||!op)throw new Error('Гравця не знайдено');const bs=validState(bp.state,buyer),os=validState(op.state,biz.owner_id);if(bs.balance<amount)throw new Error('Недостатньо грошей');bs.balance-=amount;os.balance+=amount;bs.bankHistory.push({text:'Покупка: '+item+' у '+biz.name,amount:'-'+amount});os.bankHistory.push({text:'Продаж: '+item+' у '+biz.name,amount:'+'+amount});const ob=os.businesses.find(x=>x.type===type);if(ob){ob.revenue=(ob.revenue||0)+amount;ob.sales=(ob.sales||0)+1;ob.balance=(ob.balance||0)+amount}savePlayer(buyer,bs,tgUser(req));savePlayer(biz.owner_id,os,{});db.prepare('UPDATE businesses SET revenue=revenue+?,sales=sales+1,balance=balance+? WHERE id=?').run(amount,amount,biz.id);return {buyerState:bs,ownerId:biz.owner_id}});try{res.json({ok:true,...tx()})}catch(e){res.status(400).json({ok:false,error:e.message})}});

app.post('/api/transfer',(req,res)=>{const tx=db.transaction(()=>{const from=userId(req),to=String(req.body.to||''),amount=Math.floor(Number(req.body.amount)||0);if(!to||to===from||amount<=0)throw new Error('Невірний переказ');const a=getPlayer(from),b=getPlayer(to);if(!a||!b)throw new Error('Гравця не знайдено');const as=validState(a.state,from),bs=validState(b.state,to);if(as.balance<amount)throw new Error('Недостатньо грошей');as.balance-=amount;bs.balance+=amount;as.bankHistory.push({text:'Переказ гравцю '+to,amount:'-'+amount});bs.bankHistory.push({text:'Переказ від '+from,amount:'+'+amount});savePlayer(from,as,tgUser(req));savePlayer(to,bs,{});return as});try{res.json({ok:true,state:tx()})}catch(e){res.status(400).json({ok:false,error:e.message})}});


app.get('/api/social',(req,res)=>{try{const id=userId(req);const rows=db.prepare('SELECT telegram_id,username,first_name,last_seen,state FROM players ORDER BY last_seen DESC LIMIT 100').all();const friends=db.prepare(`SELECT CASE WHEN from_id=? THEN to_id ELSE from_id END AS id FROM friend_requests WHERE status='accepted' AND (from_id=? OR to_id=?)`).all(id,id,id);const friendIds=new Set(friends.map(x=>x.id));const players=rows.map(r=>{const s=JSON.parse(r.state);return {id:r.telegram_id,nickname:s.nickname||'',firstName:r.first_name,level:Number(s.level||1),balance:Number(s.balance||0),businesses:Array.isArray(s.businesses)?s.businesses.length:0,cars:Array.isArray(s.cars)?s.cars.length:0,lastSeen:new Date(r.last_seen).toISOString()}});const friendList=players.filter(x=>friendIds.has(x.id));const messages=db.prepare(`SELECT m.*, COALESCE(json_extract(p.state,'$.nickname'),p.first_name,'Гравець') AS from_nickname FROM messages m LEFT JOIN players p ON p.telegram_id=m.from_id WHERE m.to_id=? OR m.from_id=? ORDER BY m.created_at DESC LIMIT 50`).all(id,id).map(m=>({id:m.id,text:m.text,fromId:m.from_id,fromNickname:m.from_nickname,read:!!m.read,createdAt:new Date(m.created_at).toISOString()}));const unread=db.prepare('SELECT COUNT(*) c FROM messages WHERE to_id=? AND read=0').get(id).c;const rating=[...players].sort((a,b)=>b.balance-a.balance).slice(0,20);res.json({ok:true,friends:friendList,messages,unread,rating})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.post('/api/friends/request',(req,res)=>{try{const from=userId(req),to=String(req.body.to||'');if(!to||to===from)throw new Error('Невірний гравець');if(!getPlayer(to))throw new Error('Гравця не знайдено');const existing=db.prepare('SELECT * FROM friend_requests WHERE (from_id=? AND to_id=?) OR (from_id=? AND to_id=?)').get(from,to,to,from);if(existing){if(existing.status==='accepted')throw new Error('Ви вже друзі');if(existing.status==='pending')throw new Error('Запит уже надіслано');db.prepare('DELETE FROM friend_requests WHERE id=?').run(existing.id)}db.prepare('INSERT INTO friend_requests(from_id,to_id,status,created_at) VALUES(?,?,?,?)').run(from,to,'pending',now());res.json({ok:true})}catch(e){res.status(400).json({ok:false,error:e.message})}});
app.post('/api/friends/accept',(req,res)=>{try{const id=userId(req),from=String(req.body.from||'');const r=db.prepare('SELECT * FROM friend_requests WHERE from_id=? AND to_id=? AND status='pending'').get(from,id);if(!r)throw new Error('Запит не знайдено');db.prepare('UPDATE friend_requests SET status='accepted' WHERE id=?').run(r.id);res.json({ok:true})}catch(e){res.status(400).json({ok:false,error:e.message})}});
app.get('/api/friends/requests',(req,res)=>{try{const id=userId(req);const rows=db.prepare('SELECT f.id,f.from_id,p.state,p.first_name FROM friend_requests f JOIN players p ON p.telegram_id=f.from_id WHERE f.to_id=? AND f.status='pending' ORDER BY f.created_at DESC').all(id);res.json({ok:true,requests:rows.map(x=>({id:x.id,fromId:x.from_id,nickname:(JSON.parse(x.state).nickname||x.first_name||'Гравець')}))})}catch(e){res.status(500).json({ok:false,error:e.message})}});
app.post('/api/messages',(req,res)=>{try{const from=userId(req),toName=String(req.body.to||'').trim(),text=String(req.body.text||'').trim();if(!toName||!text||text.length>300)throw new Error('Заповни отримувача і повідомлення');const rows=db.prepare(`SELECT telegram_id,state,first_name FROM players`).all();const target=rows.find(r=>(JSON.parse(r.state).nickname||r.first_name||'').toLowerCase()===toName.toLowerCase());if(!target)throw new Error('Гравця з таким нікнеймом не знайдено');if(target.telegram_id===from)throw new Error('Не можна писати самому собі');db.prepare('INSERT INTO messages(from_id,to_id,text,created_at) VALUES(?,?,?,?)').run(from,target.telegram_id,text,now());res.json({ok:true})}catch(e){res.status(400).json({ok:false,error:e.message})}});
app.post('/api/messages/read',(req,res)=>{try{db.prepare('UPDATE messages SET read=1 WHERE to_id=?').run(userId(req));res.json({ok:true})}catch(e){res.status(500).json({ok:false,error:e.message})}});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT,()=>console.log(`Life+ v0.12.0 online • Volume: ${DATA_DIR}`));
