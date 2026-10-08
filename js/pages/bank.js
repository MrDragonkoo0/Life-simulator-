(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  window.LifePlusPages.bank = {
    title:"🏦 Банк",
    render:function(){ const s=LifePlusState.state; return `<section class="balance-card"><div><span class="muted">Баланс рахунку</span><strong>₴${s.balance.toLocaleString("uk-UA")}</strong></div><div class="wallet-icon">🏦</div></section><section class="info-card"><div class="section-title">🏦 Банківські операції</div><div class="info-row"><span>💳 Картка</span><b>Не оформлена</b></div><div class="info-row"><span>💸 Перекази</span><b>Скоро</b></div><div class="info-row"><span>📜 Історія</span><b>Скоро</b></div></section>`;},
    bind:function(){}
  };
})();
