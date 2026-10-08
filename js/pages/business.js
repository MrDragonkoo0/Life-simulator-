(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.business = {
    title:"🏢 Бізнеси",
    render:function(){ const list=["🛒 Продуктовий магазин","🚗 Автосалон","🔧 СТО","🧽 Автомийка","☕ Кафе","🍔 Фастфуд"]; return `<section class="info-card"><div class="section-title">🏢 Бізнеси</div><div class="locked-home"><b>Твій бізнес</b><small>Поки що бізнесів немає. Спочатку накопичуй капітал.</small></div></section><section class="info-card"><div class="section-title">📋 Категорії</div>${list.map(x=>`<div class="info-row"><span>${x}</span><b>Пізніше</b></div>`).join("")}</section>`;},
    bind:function(){}
  };
})();
