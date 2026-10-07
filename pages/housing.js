
export function renderHousing(root) {
  root.innerHTML = HOUSING_HTML;
}
export function initHousing(root, state) {
  root.querySelectorAll(".home-btn[data-home]").forEach(button => {
    button.addEventListener("click", () => {
      root.querySelectorAll(".home-btn[data-home]").forEach(b => b.textContent = "Орендувати");
      button.textContent = "Обрано";
      state.housing = button.dataset.home;
    });
  });
}
const HOUSING_HTML = `<header class="topbar">
      <button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>
      <div class="page-title">🏠 Житло</div>
      <div style="width:44px"></div>
    </header>

    <section class="info-card">
      <div class="section-title">Твоє житло</div>
      <div class="home-current">
        <div class="home-icon">🛏️</div>
        <div>
          <b>Кімната</b>
          <small>Оренда • ₴5 000 / місяць</small>
        </div>
      </div>
      <div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div>
      <div class="info-row"><span>⭐ Комфорт</span><b>20 / 100</b></div>
    </section>

    <section class="info-card">
      <div class="section-title">🏠 Доступне житло</div>

      <article class="home-card">
        <div class="home-icon">🛏️</div>
        <div class="home-main">
          <b>Кімната</b>
          <small>Базове житло для старту</small>
          <div class="home-meta"><span>💰 ₴5 000/міс.</span><span>⭐ 20</span></div>
        </div>
        <button class="home-btn selected">Орендовано</button>
      </article>

      <article class="home-card">
        <div class="home-icon">🏠</div>
        <div class="home-main">
          <b>Маленька квартира</b>
          <small>Більше простору та комфорту</small>
          <div class="home-meta"><span>💰 ₴9 000/міс.</span><span>⭐ 40</span></div>
        </div>
        <button class="home-btn" data-home="small">Орендувати</button>
      </article>

      <article class="home-card">
        <div class="home-icon">🏢</div>
        <div class="home-main">
          <b>Комфортна квартира</b>
          <small>Для гравця, який уже розвивається</small>
          <div class="home-meta"><span>💰 ₴16 000/міс.</span><span>⭐ 65</span></div>
        </div>
        <button class="home-btn" data-home="comfort">Орендувати</button>
      </article>
    </section>

    <section class="info-card">
      <div class="section-title">🔒 Купівля нерухомості</div>
      <div class="locked-home">
        <b>Власне житло</b>
        <small>Можливість купувати нерухомість з'явиться в наступних версіях.</small>
      </div>
    </section>`;
