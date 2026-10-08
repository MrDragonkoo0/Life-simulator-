(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.tasks = {
    title:"📋 Завдання",
    render:function(){ return `<section class="info-card"><div class="section-title">📋 Поточні завдання</div><article class="job-card"><div class="job-icon">👋</div><div class="job-main"><b>Початок нового життя</b><small>Обери свою першу роботу.</small><div class="job-meta"><span>⭐ +10 XP</span><span>💰 +₴100</span></div></div><button class="job-btn disabled" disabled>У процесі</button></article><article class="job-card"><div class="job-icon">💼</div><div class="job-main"><b>Перша зміна</b><small>Повністю відпрацюй одну зміну.</small><div class="job-meta"><span>⭐ +25 XP</span></div></div><button class="job-btn disabled" disabled>Скоро</button></article></section>`;},
    bind:function(){}
  };
})();
