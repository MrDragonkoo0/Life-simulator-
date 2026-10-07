
export function renderProfile(root) {
  root.innerHTML = PROFILE_HTML;
}
export function initProfile(root, state) {
  const balance = root.querySelector("#balance");
  if (balance) balance.textContent = "₴" + state.balance.toLocaleString("uk-UA");
}
const PROFILE_HTML = `<header class="topbar">
      <button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>
      <div class="page-title">Профіль</div>
      <div style="width:44px"></div>
    </header>

    <section class="profile-card">
      <div class="profile-avatar">👤</div>
      <h1 id="playerName">Гравець</h1>
      <div class="level-pill">РІВЕНЬ <b id="level">1</b></div>
    </section>

    <section class="balance-card">
      <div>
        <span class="muted">Баланс</span>
        <strong id="balance">₴1 000</strong>
      </div>
      <div class="wallet-icon">₴</div>
    </section>

    <section class="profile-info">
      <div class="section-title">📌 Поточний стан</div>
      <div class="info-row"><span>🏠 Житло</span><b>Кімната</b></div>
      <div class="info-row"><span>💼 Робота</span><b>Немає</b></div>
      <div class="info-row"><span>🚗 Транспорт</span><b>Немає</b></div>
      <div class="info-row"><span>🏢 Бізнеси</span><b>0</b></div>
    </section>

    <section class="profile-info">
      <div class="section-title">📊 Статистика</div>
      <div class="stats-grid">
        <div><b>1</b><small>Ігровий день</small></div>
        <div><b>0</b><small>Відпрацьовано годин</small></div>
        <div><b>0</b><small>Куплено авто</small></div>
        <div><b>0</b><small>Бізнесів</small></div>
      </div>
    </section>

    <section class="profile-info">
      <div class="section-title">⭐ Досвід</div>
      <div class="xp-line"><span>0 / 100 XP</span><b>0%</b></div>
      <div class="xp-bar"><div></div></div>
    </section>`;
