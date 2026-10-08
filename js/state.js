(function(){
"use strict";
const KEY="lifeplus_v10_state",OLD_KEYS=["lifeplus_v09_state","lifeplus_v08_state"];
const state={
  playerId:"local",balance:1000,foodDays:3,foodSpent:0,job:null,housing:"room",xp:0,level:1,workedHours:0,
  working:false,shiftStartedAt:0,shiftEndsAt:0,shiftPay:0,cars:[],businesses:[],bankHistory:[],
  debt:0,gameHours:0,lastEconomyAt:Date.now(),rentPaidCount:0,missedBills:0,
  daily:{day:0,shift:false,food:false,earned:0,rewarded:[]},
  tasks:{firstJob:false,firstShift:false,firstCar:false},settings:{notifications:true,vibration:true}
};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));if(window.LifePlusAPI)window.LifePlusAPI.queueSave(state)}catch(e){}}
function load(){try{let raw=localStorage.getItem(KEY);if(!raw)for(const k of OLD_KEYS){raw=localStorage.getItem(k);if(raw)break}const x=JSON.parse(raw||"null");if(x)Object.keys(state).forEach(k=>{if(x[k]!==undefined)state[k]=x[k]});}catch(e){} if(!state.lastEconomyAt)state.lastEconomyAt=Date.now(); if(!state.playerId)state.playerId="local"; if(!Array.isArray(state.businesses))state.businesses=[]; if(!Array.isArray(state.cars))state.cars=[]; state.cars.forEach(c=>{if(c.fuel===undefined)c.fuel=100;if(c.condition===undefined)c.condition=100;if(c.price===undefined){const base={"Lada 2107":8000,"Daewoo Lanos":12000,"Skoda Octavia":25000}[c.name]||0;c.price=base}});}
function addXP(n){state.xp+=n;state.level=Math.floor(state.xp/100)+1;save()}
function money(n){return "₴"+Math.max(0,Math.round(n)).toLocaleString("uk-UA")}
function addHistory(text,amount){state.bankHistory.push({text,amount});if(state.bankHistory.length>100)state.bankHistory=state.bankHistory.slice(-100)}
function housingData(){return {room:{name:"Кімната",rent:5000,utility:1200},small:{name:"Маленька квартира",rent:9000,utility:1600},comfort:{name:"Комфортна квартира",rent:16000,utility:2200}}[state.housing]||{name:"Кімната",rent:5000,utility:1200}}
function processEconomy(now){const elapsed=Math.floor((now-state.lastEconomyAt)/3600000);if(elapsed<=0)return {hours:0,warnings:[]};const warnings=[];for(let i=0;i<elapsed;i++){state.gameHours++;state.foodDays=Math.max(0,Number(state.foodDays||0)-1);if(state.foodDays===0)warnings.push("Запас їжі закінчився");const day=Math.floor(state.gameHours/24);if(day!==state.daily.day)state.daily={day,shift:false,food:false,earned:0,rewarded:[]};if(state.gameHours%30===0){const h=housingData(),bill=h.rent+h.utility;if(state.balance>=bill){state.balance-=bill;state.rentPaidCount++;addHistory("Оренда + комунальні","-"+money(bill));warnings.push("Сплачено житло та комунальні: "+money(bill))}else{const paid=state.balance;state.balance=0;state.debt+=bill-paid;state.missedBills++;addHistory("Борг за житло та комунальні","+"+money(bill-paid)+" боргу");warnings.push("Не вистачило грошей на житло. Борг: "+money(state.debt))}}}state.lastEconomyAt+=elapsed*3600000;save();return {hours:elapsed,warnings:[...new Set(warnings)]}}
function ownedBusiness(type){return state.businesses.find(b=>b.type===type)||null}
function businessIncome(type,amount,label){const b=ownedBusiness(type);if(!b)return false;b.revenue=(b.revenue||0)+amount;b.sales=(b.sales||0)+1;b.balance=(b.balance||0)+amount;return true}
window.LifePlusState={state,save,load,addXP,money,addHistory,processEconomy,housingData,ownedBusiness,businessIncome};
})();