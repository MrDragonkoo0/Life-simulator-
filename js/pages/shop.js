(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  const S = () => LifePlusState.state;
  window.LifePlusPages.shop = {
    title: "🛒 Магазин",
    render: function () {
      const s = S();
      return `<section class="balance-card"><div><span class="muted">Доступні гроші</span><strong>₴${s.balance.toLocaleString("uk-UA")}</strong></div><div class="wallet-icon">₴</div></section>
      <section class="info-card"><div class="section-title">🍽️ Харчування</div><div class="need-row"><div><b>Стан харчування</b><small>Поточний запас їжі</small></div><strong>Нормально</strong></div><div class="need-bar"><div style="width:${Math.min(100,s.foodDays/7*100)}%"></div></div><div class="food-meta"><span>Запас: <b>${s.foodDays} дні</b></span><span>Витрати: <b>≈ ₴100/день</b></span></div></section>
      <section class="info-card"><div class="section-title">🛒 Продукти</div>
      <article class="food-card"><div class="food-icon">🥪</div><div class="food-main"><b>Базовий набір</b><small>Їжа на 1 день</small><div class="food-meta"><span>💰 ₴100</span><span>🍽️ +1 день</span></div></div><button class="food-btn" data-days="1" data-price="100">Купити</button></article>
      <article class="food-card"><div class="food-icon">🛍️</div><div class="food-main"><b>Набір на тиждень</b><small>Вигідніша покупка продуктів</small><div class="food-meta"><span>💰 ₴650</span><span>🍽️ +7 днів</span></div></div><button class="food-btn" data-days="7" data-price="650">Купити</button></article></section>
      <section class="info-card"><div class="section-title">💡 Обов'язкові витрати</div><div class="info-row"><span>🏠 Оренда</span><b>₴5 000 / місяць</b></div><div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div></section>`;
    },
    bind: function () {
      document.querySelectorAll(".food-btn").forEach(btn => btn.addEventListener("click", function () {
        const s=S(), price=Number(btn.dataset.price), days=Number(btn.dataset.days);
        if (s.balance < price) { LifePlusApp.toast("Недостатньо грошей"); return; }
        s.balance-=price; s.foodDays+=days; s.foodSpent+=price; LifePlusState.save();
        LifePlusApp.openPage("shop", true);
      }));
    }
  };
})();
