(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.settings = {
    title:"⚙️ Налаштування",
    render:function(){ return `<section class="info-card"><div class="section-title">⚙️ Налаштування</div><div class="info-row"><span>🔔 Сповіщення</span><button class="home-btn selected">Увімкнено</button></div><div class="info-row"><span>📱 Вібрація</span><button class="home-btn selected">Увімкнено</button></div><div class="info-row"><span>🌙 Тема</span><b>Темна</b></div></section><section class="info-card"><div class="section-title">ℹ️ Про гру</div><div class="info-row"><span>Версія</span><b>v0.7.0</b></div><div class="info-row"><span>Гра</span><b>Life+</b></div></section>`;},
    bind:function(){}
  };
})();
