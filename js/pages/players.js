(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.players = {
    title:"👥 Гравці",
    render:function(){ return `<section class="info-card"><div class="section-title">👥 Онлайн-гравці</div><div class="locked-home"><b>Поки що ти перший у списку</b><small>Коли до Life+ приєднаються інші гравці, вони з'являться тут.</small></div></section><section class="info-card"><div class="section-title">🌐 Онлайн</div><div class="info-row"><span>Гравців онлайн</span><b>1</b></div></section>`;},
    bind:function(){}
  };
})();
