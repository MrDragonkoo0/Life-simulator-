(function(){
"use strict";

function startLifePlus(){
  const tg=window.Telegram&&window.Telegram.WebApp;
  const view=document.getElementById("view");
  const topbar=document.getElementById("mainTopbar");
  const toast=document.getElementById("toast");
  if(!view||!topbar||!toast||!window.LifePlusState||!window.LifePlusNavigation||!window.LifePlusPages){
    return;
  }

  const S=()=>LifePlusState.state;
  let toastTimer;

  function toastMsg(text){
    toast.textContent=text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove("show"),1800);
  }

  function header(title){
    topbar.innerHTML=
      '<button class="icon-btn" id="backBtn" type="button">‹</button>'+
      '<div class="page-title">'+title+'</div>'+
      '<div style="width:44px"></div>';
    const back=document.getElementById("backBtn");
    if(back) back.addEventListener("click",goHome);
    if(tg&&tg.BackButton){
      try{tg.BackButton.show();tg.BackButton.offClick(goHome);tg.BackButton.onClick(goHome)}catch(e){}
    }
  }

  function mainHeader(){
    topbar.innerHTML=
      '<div class="player">'+
        '<div class="avatar">👤</div>'+
        '<div><div class="player-name">Новачок</div>'+
        '<div class="player-level">Рівень '+S().level+'</div></div>'+
      '</div>'+
      '<button class="notification" id="notifications" type="button">🔔<span class="notification-dot"></span></button>';

    const n=document.getElementById("notifications");
    if(n)n.addEventListener("click",()=>toastMsg("Нових сповіщень немає"));

    if(tg&&tg.BackButton){
      try{tg.BackButton.hide();tg.BackButton.offClick(goHome)}catch(e){}
    }
  }

  const icons={
    profile:"👤",work:"💼",housing:"🏠",transport:"🚗",business:"🏢",
    bank:"🏦",shop:"🛒",tasks:"📋",players:"👥",settings:"⚙️"
  };

  function home(){
    const s=S();
    return '<section class="hero"><div class="hero-content">'+
      '<div class="logo">LIFE<span>+</span></div>'+
      '<div class="subtitle">Твоє життя. Твої правила.</div></div></section>'+
      '<section class="balance-card"><div class="balance-label">💰 Баланс</div>'+
      '<div class="balance-value">'+LifePlusState.money(s.balance)+'</div>'+
      '<div class="balance-status">Доступно</div></section>'+
      '<section class="stats">'+
      '<div class="stat"><div class="stat-icon">🏠</div><div class="stat-title">Житло</div><div class="stat-value">'+(s.housing==="room"?"Кімната":"Є")+'</div></div>'+
      '<div class="stat"><div class="stat-icon">💼</div><div class="stat-title">Робота</div><div class="stat-value">'+(s.job?s.job.name:"Немає")+'</div></div>'+
      '<div class="stat"><div class="stat-icon">⭐</div><div class="stat-title">Рівень</div><div class="stat-value">'+s.level+'</div></div>'+
      '</section>'+
      '<section class="menu">'+
      Object.entries(LifePlusNavigation.names).map(([key,name])=>
        '<button class="menu-button" type="button" data-page="'+key+'"><span class="menu-icon">'+icons[key]+'</span><span>'+name+'</span></button>'
      ).join("")+
      '</section>'+
      '<footer class="footer"><div>Life+ v0.12.0</div><div>Онлайн-симулятор життя</div></footer>';
  }

  function goHome(){
    mainHeader();
    view.innerHTML=home();
    try{history.replaceState({page:"home"},"","#home")}catch(e){}
    window.scrollTo(0,0);
  }

  function openPage(page,internal){
    const module=window.LifePlusPages[page];
    if(!module){toastMsg("Розділ не знайдено");return}
    header(module.title);
    try{
      view.innerHTML=module.render();
      if(typeof module.bind==="function")module.bind();
    }catch(err){
      console.error(err);
      toastMsg("Помилка завантаження розділу");
      return;
    }
    if(!internal){
      try{history.pushState({page:page},"","#"+page)}catch(e){}
    }
    window.scrollTo(0,0);
  }

  window.LifePlusApp={openPage:openPage,goHome:goHome,toast:toastMsg};

  // Event delegation: menu buttons remain clickable even after the view is redrawn.
  document.addEventListener("click",function(event){
    const button=event.target.closest(".menu-button");
    if(button){
      event.preventDefault();
      event.stopPropagation();
      openPage(button.getAttribute("data-page"),false);
      return;
    }
    const back=event.target.closest("#backBtn");
    if(back){
      event.preventDefault();
      goHome();
    }
  },true);

  window.addEventListener("popstate",function(){
    const page=location.hash.replace("#","");
    if(!page||page==="home")goHome();
    else openPage(page,true);
  });

  function tick(){
    const economy=LifePlusState.processEconomy(Date.now());
    if(economy.warnings.length){
      const last=economy.warnings[economy.warnings.length-1];
      toastMsg(last);
    }
    const s=S();
    if(s.working&&Date.now()>=s.shiftEndsAt){
      const pay=s.shiftPay;
      s.balance+=pay;
      s.workedHours+=1;
      s.working=false;
      s.shiftStartedAt=0;
      s.shiftEndsAt=0;
      s.shiftPay=0;
      s.tasks.firstShift=true;
      LifePlusState.addXP(25);
      toastMsg("Зміну завершено! +"+LifePlusState.money(pay));
    }
    LifePlusState.save();
  }

  try{
    if(tg){tg.ready();tg.expand()}
  }catch(e){}

  LifePlusState.load();
  if(window.LifePlusAPI){
    window.LifePlusAPI.sync(LifePlusState.state).then(result=>{
      if(!result.created){Object.assign(LifePlusState.state,result.state);LifePlusState.save();}
      mainHeader();view.innerHTML=home();
    }).catch(()=>{mainHeader();view.innerHTML=home();});
  }else{mainHeader();view.innerHTML=home();}
  try{history.replaceState({page:"home"},"","#home")}catch(e){}
  window.setInterval(tick,1000);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",startLifePlus,{once:true});
}else{
  startLifePlus();
}
})();