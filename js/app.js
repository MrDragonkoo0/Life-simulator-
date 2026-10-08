(function(){
"use strict";
const tg=window.Telegram&&window.Telegram.WebApp,view=document.getElementById("view"),topbar=document.getElementById("mainTopbar"),toast=document.getElementById("toast");
let toastTimer;
const S=()=>LifePlusState.state;
function toastMsg(x){toast.textContent=x;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),1800)}
function header(t){topbar.innerHTML=`<button class="icon-btn" id="backBtn">‹</button><div class="page-title">${t}</div><div style="width:44px"></div>`;document.getElementById("backBtn").onclick=goHome}
function mainHeader(){topbar.innerHTML=`<div class="player"><div class="avatar">👤</div><div><div class="player-name">Новачок</div><div class="player-level">Рівень ${S().level}</div></div></div><button class="notification" id="notifications">🔔<span class="notification-dot"></span></button>`;document.getElementById("notifications").onclick=()=>toastMsg("Нових сповіщень немає")}
const icons={profile:"👤",work:"💼",housing:"🏠",transport:"🚗",business:"🏢",bank:"🏦",shop:"🛒",tasks:"📋",players:"👥",settings:"⚙️"};
function home(){let s=S();return `<section class="hero"><div class="hero-content"><div class="logo">LIFE<span>+</span></div><div class="subtitle">Твоє життя. Твої правила.</div></div></section><section class="balance-card"><div class="balance-label">💰 Баланс</div><div class="balance-value">${LifePlusState.money(s.balance)}</div><div class="balance-status">Доступно</div></section><section class="stats"><div class="stat"><div class="stat-icon">🏠</div><div class="stat-title">Житло</div><div class="stat-value">${s.housing==="room"?"Кімната":"Є"}</div></div><div class="stat"><div class="stat-icon">💼</div><div class="stat-title">Робота</div><div class="stat-value">${s.job?s.job.name:"Немає"}</div></div><div class="stat"><div class="stat-icon">⭐</div><div class="stat-title">Рівень</div><div class="stat-value">${s.level}</div></div></section><section class="menu">${Object.entries(LifePlusNavigation.names).map(([k,n])=>`<button class="menu-button" data-page="${k}"><span class="menu-icon">${icons[k]}</span><span>${n}</span></button>`).join("")}</section><footer class="footer"><div>Life+ v0.8.0</div><div>Онлайн-симулятор життя</div></footer>`}
function bindHome(){document.querySelectorAll(".menu-button").forEach(b=>b.onclick=()=>openPage(b.dataset.page))}
function goHome(){mainHeader();view.innerHTML=home();bindHome();history.replaceState({page:"home"},"","#home");scrollTo(0,0)}
function openPage(p,internal){const m=LifePlusPages[p];if(!m){toastMsg("Розділ не знайдено");return}header(m.title);view.innerHTML=m.render();m.bind&&m.bind();if(!internal)history.pushState({page:p},"","#"+p);scrollTo(0,0)}
window.LifePlusApp={openPage,goHome,toast:toastMsg};
addEventListener("popstate",()=>{const p=location.hash.slice(1);p&&p!=="home"?openPage(p,true):goHome()});
function tick(){const s=S();if(s.working&&Date.now()>=s.shiftEndsAt){const pay=s.shiftPay;s.balance+=pay;s.workedHours+=1;s.working=false;s.shiftStartedAt=s.shiftEndsAt=s.shiftPay=0;s.tasks.firstShift=true;LifePlusState.addXP(25);toastMsg("Зміну завершено! +"+LifePlusState.money(pay))}LifePlusState.save()}
if(tg)try{tg.ready();tg.expand()}catch(e){}
LifePlusState.load();setInterval(tick,1000);mainHeader();view.innerHTML=home();bindHome();history.replaceState({page:"home"},"","#home");
})();