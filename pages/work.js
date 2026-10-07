
export function renderWork(root) {
  root.innerHTML = WORK_HTML;
}
export function initWork(root, state, actions) {
  root.querySelectorAll(".job-btn:not(.disabled)").forEach(button => {
    button.addEventListener("click", () => {
      state.job = { name: button.dataset.name, pay: Number(button.dataset.pay) };
      const current = root.querySelector("#currentJob");
      if (current) current.innerHTML = `<b>${state.job.name}</b><small>Роботу обрано. Реальний таймер зміни буде підключено наступним оновленням.</small>`;
      root.querySelectorAll(".job-btn:not(.disabled)").forEach(b => b.textContent = "Обрати");
      button.textContent = "Обрано";
    });
  });
}
const WORK_HTML = `<header class="topbar">
      <button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>
      <div class="page-title">💼 Робота</div>
      <div style="width:44px"></div>
    </header>

    <section class="info-card">
      <div class="section-title">Поточна робота</div>
      <div id="currentJob" class="job-current">
        <b>Без роботи</b>
        <small>Обери професію нижче, щоб почати заробляти.</small>
      </div>
    </section>

    <section class="info-card">
      <div class="section-title">Доступні професії</div>

      <article class="job-card">
        <div class="job-icon">📦</div>
        <div class="job-main">
          <b>Працівник складу</b>
          <small>Початкова робота • без вимог</small>
          <div class="job-meta"><span>💰 ₴700 / зміна</span><span>⏱️ 1 година</span></div>
        </div>
        <button class="job-btn" data-job="warehouse" data-name="Працівник складу" data-pay="700">Обрати</button>
      </article>

      <article class="job-card">
        <div class="job-icon">🛒</div>
        <div class="job-main">
          <b>Касир</b>
          <small>Потрібен 1 рівень</small>
          <div class="job-meta"><span>💰 ₴800 / зміна</span><span>⏱️ 1 година</span></div>
        </div>
        <button class="job-btn" data-job="cashier" data-name="Касир" data-pay="800">Обрати</button>
      </article>

      <article class="job-card">
        <div class="job-icon">🚕</div>
        <div class="job-main">
          <b>Водій таксі</b>
          <small>Потрібен транспорт • буде доступно пізніше</small>
          <div class="job-meta"><span>💰 ₴1 100 / зміна</span><span>⏱️ 1 година</span></div>
        </div>
        <button class="job-btn disabled" disabled>Закрито</button>
      </article>
    </section>

    <section class="info-card">
      <div class="section-title">📈 Досвід роботи</div>
      <div class="xp-line"><span id="workXpText">0 / 100 XP</span><b>0%</b></div>
      <div class="xp-bar"><div style="width:0%"></div></div>
      <small class="muted" style="display:block;margin-top:8px;font-size:10px">
        Досвід і підвищення зарплати будуть розвиватися далі.
      </small>
    </section>`;
