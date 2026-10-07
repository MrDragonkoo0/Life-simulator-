
export function renderNeeds(root) {
  root.innerHTML = NEEDS_HTML;
}
export function initNeeds(root, state) {
  const balanceEl = root.querySelector("#balance");
  const foodDaysEl = root.querySelector("#foodDays");
  const foodBarEl = root.querySelector("#foodBar");
  const foodStatusEl = root.querySelector("#foodStatus");
  const foodSpentEl = root.querySelector("#foodSpent");

  function render() {
    if (balanceEl) balanceEl.textContent = "₴" + state.balance.toLocaleString("uk-UA");
    if (foodDaysEl) foodDaysEl.textContent = `${state.foodDays} ${state.foodDays === 1 ? "день" : "дні"}`;
    if (foodSpentEl) foodSpentEl.textContent = "₴" + state.foodSpent.toLocaleString("uk-UA");
    if (foodBarEl) foodBarEl.style.width = Math.max(0, Math.min(100, state.foodDays / 7 * 100)) + "%";
    if (foodStatusEl) foodStatusEl.textContent = state.foodDays <= 0 ? "Немає запасу" : (state.foodDays <= 1 ? "Мало" : "Нормально");
  }

  root.querySelectorAll(".food-btn").forEach(button => {
    button.addEventListener("click", () => {
      const days = Number(button.dataset.days);
      const price = Number(button.dataset.price);
      if (state.balance < price) {
        button.textContent = "Недостатньо";
        setTimeout(() => button.textContent = "Купити", 1200);
        return;
      }
      state.balance -= price;
      state.foodDays += days;
      state.foodSpent += price;
      render();
      button.textContent = "Куплено";
      setTimeout(() => button.textContent = "Купити", 900);
    });
  });
  render();
}
const NEEDS_HTML = `<header class="topbar">
      <button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>
      <div class="page-title">🍔 Потреби</div>
      <div style="width:44px"></div>
    </header>

    <section class="balance-card">
      <div>
        <span class="muted">Доступні гроші</span>
        <strong id="balance">₴1 000</strong>
      </div>
      <div class="wallet-icon">₴</div>
    </section>

    <section class="info-card">
      <div class="section-title">🍽️ Харчування</div>
      <div class="need-row">
        <div><b>Стан харчування</b><small>Поточний запас їжі</small></div>
        <strong id="foodStatus">Нормально</strong>
      </div>
      <div class="need-bar"><div id="foodBar" style="width:75%"></div></div>
      <div class="food-meta"><span>Запас: <b id="foodDays">3 дні</b></span><span>Витрати: <b>≈ ₴100/день</b></span></div>
    </section>

    <section class="info-card">
      <div class="section-title">🛒 Магазин продуктів</div>

      <article class="food-card">
        <div class="food-icon">🥪</div>
        <div class="food-main">
          <b>Базовий набір</b>
          <small>Їжа на 1 день</small>
          <div class="food-meta"><span>💰 ₴100</span><span>🍽️ +1 день</span></div>
        </div>
        <button class="food-btn" data-days="1" data-price="100">Купити</button>
      </article>

      <article class="food-card">
        <div class="food-icon">🛍️</div>
        <div class="food-main">
          <b>Набір на тиждень</b>
          <small>Вигідніша покупка продуктів</small>
          <div class="food-meta"><span>💰 ₴650</span><span>🍽️ +7 днів</span></div>
        </div>
        <button class="food-btn" data-days="7" data-price="650">Купити</button>
      </article>
    </section>

    <section class="info-card">
      <div class="section-title">💡 Обов'язкові витрати</div>
      <div class="info-row"><span>🏠 Оренда</span><b>₴5 000 / місяць</b></div>
      <div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div>
      <small class="muted expense-note">Поки що платежі показуються як інформація. Автоматичне списання буде підключено окремо.</small>
    </section>

    <section class="info-card">
      <div class="section-title">📊 Витрати</div>
      <div class="stats-grid">
        <div><b id="foodSpent">₴0</b><small>На їжу</small></div>
        <div><b>₴0</b><small>Інші витрати</small></div>
      </div>
    </section>`;
