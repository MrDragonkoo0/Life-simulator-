(function(){
  "use strict";

  function getState(){
    const s = window.LifePlusState && window.LifePlusState.state ? window.LifePlusState.state : {};
    if(!s.career || typeof s.career !== "object") s.career = {level:1,promotions:0};
    if(!Number.isFinite(Number(s.career.level))) s.career.level = 1;
    if(!Number.isFinite(Number(s.career.promotions))) s.career.promotions = 0;
    if(!Number.isFinite(Number(s.workedHours))) s.workedHours = 0;
    if(!Number.isFinite(Number(s.balance))) s.balance = 0;
    if(!s.tasks || typeof s.tasks !== "object") s.tasks = {};
    if(!s.daily || typeof s.daily !== "object") s.daily = {earned:0,shift:false};
    if(!s.weekly || typeof s.weekly !== "object") s.weekly = {earned:0,worked:0};
    return s;
  }

  const S = getState;
  const jobs = [
    [1,[
      ['📦','Працівник складу',18000],['🛒','Касир',20000],['🧹','Прибиральник',18000],['🚴','Кур’єр',22000],
      ['🍽️','Працівник кафе',20000],['🧑‍💼','Продавець',21000],['☎️','Оператор кол-центру',23000],['⛽','Заправник',22000],
      ['📦','Пакувальник',19000],['🚿','Мийник авто',21000],['🧺','Працівник пральні',20000],['🛍️','Працівник супермаркету',22000],
      ['📮','Працівник пошти',23000],['🍔','Працівник фастфуду',22000],['🧑‍🌾','Різноробочий',24000]
    ]],
    [2,[
      ['🚕','Водій таксі',28000],['🚚','Водій доставки',30000],['🛡️','Охоронець',27000],['👨‍🍳','Кухар',32000],
      ['☕','Бариста',27000],['✂️','Перукар',30000],['🧑‍💼','Адміністратор',32000],['🔧','Механік',34000],
      ['⚡','Електрик',36000],['🚰','Сантехнік',35000],['🏗️','Будівельник',36000],['🎨','Маляр',32000],
      ['🔥','Зварювальник',40000],['🏭','Оператор виробництва',35000],['📦','Комірник',30000],['📡','Диспетчер',33000],
      ['🛍️','Продавець-консультант',31000],['🏠','Рієлтор',38000],['📷','Фотограф',35000],['🧁','Кондитер',36000]
    ]],
    [3,[
      ['💻','Програміст',60000],['🌐','Веброзробник',58000],['🎨','Дизайнер',48000],['📊','Бухгалтер',50000],
      ['📈','Економіст',52000],['📣','Маркетолог',50000],['🚛','Логіст',52000],['⚙️','Інженер',62000],
      ['🔧','Автомеханік',50000],['🧪','Лаборант',48000],['🖥️','Системний адміністратор',55000],['🎬','Відеомонтажер',50000],
      ['🧊','3D-моделер',58000],['🏛️','Архітектор',70000],['⚖️','Юрист',65000],['👥','HR-менеджер',52000],
      ['💹','Фінансовий аналітик',68000],['📋','Менеджер проєктів',65000],['💱','Брокер',72000],['🧑‍⚕️','Фармацевт',50000],
      ['🩺','Медсестра',42000],['🚑','Фельдшер',50000],['👨‍🏫','Вчитель',42000],['🎤','Журналіст',45000],['🎥','Оператор',48000]
    ]],
    [4,[
      ['🧑‍💻','Senior-програміст',85000],['☁️','DevOps-спеціаліст',90000],['🛡️','Кібербезпекар',95000],['🧾','Головний бухгалтер',85000],
      ['💰','Фінансовий менеджер',90000],['🏗️','Інженер-проєктувальник',88000],['🎮','Game Developer',80000],['🧠','Data Analyst',82000],
      ['🎨','Артдиректор',78000],['👔','Керівник відділу',95000],['🏪','Директор магазину',85000],['🍽️','Директор ресторану',90000],
      ['🚛','Керівник логістики',92000],['🔩','Головний механік',80000],['⚖️','Старший юрист',90000],['📈','Інвестиційний аналітик',100000],
      ['🏥','Лікар',85000],['🦷','Стоматолог',95000],['🏫','Директор школи',85000],['🎬','Продюсер',80000]
    ]],
    [5,[
      ['🏢','Директор компанії',150000],['💰','Фінансовий директор',180000],['⚙️','Операційний директор',170000],['💻','IT-директор',180000],
      ['📣','Комерційний директор',160000],['🚗','Директор автосалону',150000],['🛍️','Директор мережі магазинів',170000],['🏭','Керівник підприємства',180000],
      ['🏨','Генеральний менеджер',150000],['🌍','Регіональний директор',190000],['🏦','Директор банківського відділення',170000],['📊','Директор з розвитку',165000]
    ]],
    [6,[
      ['👑','CEO',300000],['💻','CTO',320000],['💰','CFO',330000],['🏢','Керівник корпорації',400000],
      ['📈','Інвестиційний директор',350000],['🌐','Корпоративний консультант',280000],['🚀','Топовий IT-фахівець',350000],
      ['🏦','Керівник великої мережі',380000],['🏭','Генеральний директор холдингу',450000],['💼','Партнер великої компанії',500000]
    ]]
  ];

  function money(n){
    return window.LifePlusState && LifePlusState.money ? LifePlusState.money(n) : ('₴'+Math.round(n||0).toLocaleString('uk-UA'));
  }
  function xp(n){ if(window.LifePlusState && LifePlusState.addXP) LifePlusState.addXP(n); }
  function save(){ if(window.LifePlusState && LifePlusState.save) LifePlusState.save(); }
  function toast(t){ if(window.LifePlusApp && LifePlusApp.toast) LifePlusApp.toast(t); }
  function open(){ if(window.LifePlusApp && LifePlusApp.openPage) LifePlusApp.openPage('work',true); }
  function fmt(ms){
    let sec=Math.max(0,Math.floor(ms/1000));
    const h=Math.floor(sec/3600); sec%=3600;
    const m=Math.floor(sec/60), s=sec%60;
    return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
  }
  function dailyPay(monthly){
    const s=S();
    const bonus=1+Math.min(0.25,Math.floor(Number(s.workedHours||0)/10)*0.025);
    return Math.max(0,Math.floor(Number(monthly||0)/30*bonus));
  }
  function esc(v){
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function card(level,j,career,s){
    const icon=j[0], name=j[1], monthly=j[2];
    const locked=level>Number(career.level||1);
    return '<article class="job-card">'+
      '<div class="job-icon">'+icon+'</div>'+
      '<div class="job-main"><b>'+esc(name)+'</b><small>'+(locked?'🔒 Потрібен кар’єрний рівень '+level:'Доступно • '+money(monthly)+'/міс.')+'</small>'+
      '<div class="job-meta"><span>💰 '+money(dailyPay(monthly))+' / зміна</span><span>⏱️ 1 год.</span></div></div>'+
      '<button class="job-btn" data-job-level="'+level+'" data-job-name="'+esc(name)+'" data-job-icon="'+esc(icon)+'" data-job-monthly="'+monthly+'" '+(locked?'disabled':'')+'>'+((s.job&&s.job.name===name)?'Обрано':'Обрати')+'</button>'+ 
      '</article>';
  }

  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.work = {
    title:'💼 Робота',
    render:function(){
      const s=S(), career=s.career;
      let html='<section class="info-card"><div class="section-title">Поточна робота</div><div class="job-current">'+
        '<b>'+(s.job?esc(s.job.name):'Без роботи')+'</b>'+ 
        '<small>'+(s.job?'Кар’єрний рівень '+Number(s.job.level||1)+' • '+money(s.job.monthly)+'/міс.':'Обери професію')+'</small>'+
        (s.working ? '<div class="job-timer" id="shiftTimer">'+fmt(Number(s.shiftEndsAt||0)-Date.now())+'</div><button class="job-btn" id="leaveWork" type="button">Завершити раніше</button>' : '<button class="job-btn" id="startWork" type="button">▶️ Почати зміну</button>')+
        '</div></section>'+
        '<section class="info-card"><div class="section-title">📈 Кар’єра</div>'+ 
        '<div class="info-row"><span>⭐ Рівень кар’єри</span><b>'+Number(career.level||1)+'/6</b></div>'+ 
        '<div class="info-row"><span>⏱️ Відпрацьовано</span><b>'+Number(s.workedHours||0).toFixed(1)+' год.</b></div>'+ 
        '<div class="info-row"><span>⬆️ Підвищень</span><b>'+Number(career.promotions||0)+'</b></div></section>';
      jobs.forEach(g=>{
        const badge=['','🟢','🔵','🟣','🟠','🔴','👑'][g[0]]||'⭐';
        html+='<section class="info-card"><div class="section-title">'+badge+' Рівень '+g[0]+'</div>';
        g[1].forEach(j=>html+=card(g[0],j,career,s));
        html+='</section>';
      });
      return html;
    },
    bind:function(){
      const s=S();
      document.querySelectorAll('[data-job-name]').forEach(btn=>{
        btn.onclick=function(){
          if(s.working){toast('Спочатку заверши поточну зміну');return;}
          const j={level:Number(btn.dataset.jobLevel)||1,name:btn.dataset.jobName,icon:btn.dataset.jobIcon,monthly:Number(btn.dataset.jobMonthly)||0};
          s.job=j;
          s.tasks.firstJob=true;
          xp(10); save(); open();
          toast('Роботу обрано: '+j.name);
        };
      });
      const start=document.getElementById('startWork');
      if(start) start.onclick=function(){
        if(!s.job){toast('Спочатку обери професію');return;}
        if(s.working){toast('Зміна вже триває');return;}
        s.working=true; s.shiftStartedAt=Date.now(); s.shiftEndsAt=Date.now()+3600000; s.shiftPay=dailyPay(s.job.monthly);
        save(); open(); toast('Зміна розпочата');
      };
      const leave=document.getElementById('leaveWork');
      if(leave) leave.onclick=function(){
        if(!s.working)return;
        const duration=3600000;
        const ratio=Math.min(1,Math.max(0,(Date.now()-Number(s.shiftStartedAt||Date.now()))/duration));
        const pay=Math.floor(Number(s.shiftPay||0)*ratio);
        s.balance+=pay; s.workedHours=Number(s.workedHours||0)+ratio;
        s.daily.earned=Number(s.daily.earned||0)+pay; s.weekly.earned=Number(s.weekly.earned||0)+pay; s.weekly.worked=Number(s.weekly.worked||0)+ratio;
        if(ratio>=0.99){s.daily.shift=true; xp(25);} else xp(Math.max(1,Math.floor(25*ratio)));
        s.working=false; s.shiftStartedAt=0; s.shiftEndsAt=0; s.shiftPay=0;
        if(window.LifePlusState && LifePlusState.addHistory) LifePlusState.addHistory('Зарплата','+'+money(pay));
        const newLevel=Math.min(6,Math.floor(Number(s.workedHours||0)/20)+1);
        if(newLevel>Number(s.career.level||1)){s.career.level=newLevel;s.career.promotions=Number(s.career.promotions||0)+1;toast('🎉 Підвищення до кар’єрного рівня '+newLevel);}
        save(); open(); toast('Отримано '+money(pay));
      };
      if(s.working){
        clearInterval(window.lifeWorkTimer);
        window.lifeWorkTimer=setInterval(function(){
          const el=document.getElementById('shiftTimer');
          if(!el){clearInterval(window.lifeWorkTimer);return;}
          el.textContent=fmt(Number(s.shiftEndsAt||0)-Date.now());
        },1000);
      }
    }
  };
})();
