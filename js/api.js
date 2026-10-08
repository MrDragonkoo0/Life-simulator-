(function(){
"use strict";
const tg=window.Telegram&&window.Telegram.WebApp;
let timer=0;
function headers(){
  const u=(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user)||{};
  return {'Content-Type':'application/json','X-Telegram-User-ID':String(u.id||'local'),'X-Telegram-User':JSON.stringify(u)};
}
async function request(url,options){const r=await fetch(url,{...options,headers:{...headers(),...(options&&options.headers||{})}});const data=await r.json().catch(()=>({}));if(!r.ok||data.ok===false)throw new Error(data.error||'Помилка сервера');return data}
function queueSave(state){clearTimeout(timer);timer=setTimeout(()=>request('/api/state',{method:'POST',body:JSON.stringify({state})}).catch(()=>{}),1500)}
async function sync(state){const data=await request('/api/state');if(data.created){await request('/api/state',{method:'POST',body:JSON.stringify({state})});return {state,created:true}}return {state:data.state,created:false}}
async function purchaseBusiness(type){return request('/api/business/purchase',{method:'POST',body:JSON.stringify({type})})}
async function purchaseFromBusiness(businessType,item,amount){return request('/api/market/purchase',{method:'POST',body:JSON.stringify({businessType,item,amount})})}
async function players(){return request('/api/players')}
async function transfer(to,amount){return request('/api/transfer',{method:'POST',body:JSON.stringify({to,amount})})}
window.LifePlusAPI={queueSave,sync,purchaseBusiness,purchaseFromBusiness,players,transfer};
})();
