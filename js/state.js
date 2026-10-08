(function(){
"use strict";
const KEY="lifeplus_v08_state";
const state={balance:1000,foodDays:3,foodSpent:0,job:null,housing:"room",xp:0,level:1,workedHours:0,working:false,shiftStartedAt:0,shiftEndsAt:0,shiftPay:0,cars:[],businesses:[],bankHistory:[],tasks:{firstJob:false,firstShift:false,firstCar:false},settings:{notifications:true,vibration:true}};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x)Object.keys(state).forEach(k=>{if(x[k]!==undefined)state[k]=x[k]});}catch(e){}}
function addXP(n){state.xp+=n;state.level=Math.floor(state.xp/100)+1;save()}
function money(n){return "₴"+Math.max(0,n).toLocaleString("uk-UA")}
window.LifePlusState={state,save,load,addXP,money};
})();