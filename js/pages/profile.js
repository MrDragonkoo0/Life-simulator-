(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  const S = () => LifePlusState.state;
  window.LifePlusPages.profile = {
    title: "Профіль",
    render: function () {
      const s = S();
      return `
        <section class="profile-card">
          <div class="profile-avatar">👤</div>
          <h1>Гравець</h1>
          <div class="level-pill">РІВЕНЬ <b>${LifePlusState.level()}</b></div>
        </section>
        <section class="balance-card">
          <div><span class="muted">Баланс</span><strong>₴${s.balance.toLocaleString("uk-UA")}</strong></div>
          <div class="wallet-icon">₴</div>
        </section>
        <section class="profile-info">
          <div class="section-title">📌 Поточний стан</div>
          <div class="info-row"><span>🏠 Житло</span><b>${s.housing === "room" ? "Кімната" : "Квартира"}</b></div>
          <div class="info-row"><span>💼 Робота</span><b>${s.job ? s.job.name : "Немає"}</b></div>
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
          <div class="xp-line"><span>${s.xp % 100} / 100 XP</span><b>${s.xp % 100}%</b></div>
          <div class="xp-bar"><div style="width:${s.xp % 100}%"></div></div>
        </section>`;
    },
    bind: function () {}
  };
})();
