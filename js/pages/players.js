(function(){
"use strict";
function esc(v){return String(v??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));}
function money(n){return "₴"+Math.max(0,Math.round(Number(n)||0)).toLocaleString("uk-UA")}
window.LifePlusPages.players={
 title:"👥 Гравці",
 render:function(){return `<section class="info-card"><div class="section-title">👥 Соціальний центр</div><div id="socialContent"><div class="locked-home"><b>Завантаження…</b><small>Підключаємо онлайн-систему.</small></div></div></section>`},
 bind:function(){
  const root=document.getElementById("socialContent"); if(!root)return;
  const load=async()=>{try{const [p,r]=await Promise.all([LifePlusAPI.players(),LifePlusAPI.social()]);
    const me=LifePlusState.state;
    root.innerHTML=`
      <div class="social-tabs"><button class="social-tab active" data-tab="players">👥 Гравці</button><button class="social-tab" data-tab="friends">⭐ Друзі</button><button class="social-tab" data-tab="messages">💬 Повідомлення</button><button class="social-tab" data-tab="rating">🏆 Рейтинг</button></div>
      <div id="socialPanel"></div>`;
    const panel=document.getElementById("socialPanel");
    function playerCard(x){const online=Date.now()-new Date(x.lastSeen).getTime()<5*60*1000;return `<div class="social-player"><div class="social-avatar">👤</div><div class="social-main"><b>${esc(x.nickname||x.firstName||"Гравець")}</b><small>${online?"🟢 Онлайн":"⚫ Офлайн"} · рівень ${x.level}</small></div><button class="social-btn" data-action="profile" data-id="${esc(x.id)}">Профіль</button></div>`}
    function playersTab(){panel.innerHTML=`<div class="social-search"><input id="playerSearch" placeholder="Пошук за нікнеймом"><button class="social-btn" id="refreshPlayers">↻</button></div><div class="social-meta">Онлайн: <b>${p.online}</b> · Усього: <b>${p.players.length}</b></div><div id="playerList">${p.players.map(playerCard).join("")||'<div class="locked-home"><b>Поки немає інших гравців</b><small>Запроси друзів у Life+.</small></div>'}</div>`;document.getElementById("refreshPlayers").onclick=load;document.getElementById("playerSearch").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#playerList .social-player").forEach(el=>el.style.display=el.textContent.toLowerCase().includes(q)?"":"none")}}
    function friendsTab(){panel.innerHTML=`<div class="social-meta">Друзів: <b>${r.friends.length}</b></div>${r.friends.map(x=>playerCard(x)).join("")||'<div class="locked-home"><b>Друзів поки немає</b><small>Додай гравця з його профілю.</small></div>'}`}
    function messagesTab(){panel.innerHTML=`<div class="social-meta">Непрочитаних: <b>${r.unread}</b></div><div class="message-box"><input id="msgTo" placeholder="Нікнейм отримувача"><textarea id="msgText" maxlength="300" placeholder="Повідомлення"></textarea><button class="social-btn wide" id="sendMsg">Надіслати</button></div><div id="messageList">${r.messages.map(m=>`<div class="message-item"><b>${esc(m.fromNickname)}</b><small>${new Date(m.createdAt).toLocaleString("uk-UA")}</small><div>${esc(m.text)}</div></div>`).join("")||'<div class="locked-home"><b>Повідомлень немає</b></div>'}</div>`;document.getElementById("sendMsg").onclick=async()=>{try{await LifePlusAPI.sendMessage(document.getElementById("msgTo").value,document.getElementById("msgText").value);LifePlusApp.toast("Повідомлення надіслано");load()}catch(e){LifePlusApp.toast(e.message)}}}
    function ratingTab(){panel.innerHTML=`<div class="rating-list">${r.rating.map((x,i)=>`<div class="rating-row"><b>#${i+1}</b><span>👤 ${esc(x.nickname||x.firstName||"Гравець")}</span><strong>${money(x.balance)}</strong></div>`).join("")}</div>`}
    function showProfile(id){const x=p.players.find(z=>String(z.id)===String(id));if(!x)return;panel.innerHTML=`<button class="social-back" id="socialBack">← Назад</button><div class="other-profile"><div class="big-avatar">👤</div><h3>${esc(x.nickname||x.firstName||"Гравець")}</h3><small>${Date.now()-new Date(x.lastSeen).getTime()<300000?"🟢 Онлайн":"⚫ Офлайн"}</small><div class="profile-mini-grid"><div><b>${x.level}</b><small>Рівень</small></div><div><b>${x.businesses}</b><small>Бізнесів</small></div><div><b>${x.cars}</b><small>Авто</small></div></div><div class="social-actions"><button class="social-btn" id="addFriend">⭐ Додати в друзі</button><button class="social-btn" id="transferMoney">💸 Переказати</button></div></div>`;document.getElementById("socialBack").onclick=playersTab;document.getElementById("addFriend").onclick=async()=>{try{await LifePlusAPI.friendRequest(id);LifePlusApp.toast("Запит надіслано")}catch(e){LifePlusApp.toast(e.message)}};document.getElementById("transferMoney").onclick=async()=>{const a=prompt("Сума переказу, ₴");if(!a)return;try{await LifePlusAPI.transfer(id,Number(a));LifePlusState.load();LifePlusApp.toast("Гроші переказано")}catch(e){LifePlusApp.toast(e.message)}}}
    function switchTab(tab){document.querySelectorAll(".social-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));if(tab==="players")playersTab();if(tab==="friends")friendsTab();if(tab==="messages")messagesTab();if(tab==="rating")ratingTab()}
    root.addEventListener("click",e=>{const b=e.target.closest(".social-tab");if(b)switchTab(b.dataset.tab);const prof=e.target.closest('[data-action="profile"]');if(prof)showProfile(prof.dataset.id)});
    playersTab();
  }catch(e){root.innerHTML=`<div class="locked-home"><b>Не вдалося завантажити соціальну систему</b><small>${esc(e.message)}</small></div>`}}
  ;load();
 }
};
})();
