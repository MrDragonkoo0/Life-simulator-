(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  const S = () => LifePlusState.state;
  window.LifePlusPages.housing = {
    title: "🏠 Житло",
    render: function () {
      const s = S();
      const homes = [
        ["room","🛏️","Кімната","Базове житло для старту","₴5 000/міс.","⭐ 20"],
        ["small","🏠","Маленька квартира","Більше простору та комфорту","₴9 000/міс.","⭐ 40"],
        ["comfort","🏢","Комфортна квартира","Для гравця, який уже розвивається","₴16 000/міс.","⭐ 65"]
      ];
      return `<section class="info-card"><div class="section-title">Твоє житло</div><div class="home-current"><div class="home-icon">🛏️</div><div><b>${homes.find(h=>h[0]===s.housing)[2]}</b><small>Оренда • ${homes.find(h=>h[0]===s.housing)[4]}</small></div></div><div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div><div class="info-row"><span>⭐ Комфорт</span><b>${homes.find(h=>h[0]===s.housing)[5].replace("⭐ ","")} / 100</b></div></section>
      <section class="info-card"><div class="section-title">🏠 Доступне житло</div>${homes.map(h=>`<article class="home-card"><div class="home-icon">${h[1]}</div><div class="home-main"><b>${h[2]}</b><small>${h[3]}</small><div class="home-meta"><span>💰 ${h[4]}</span><span>${h[5]}</span></div></div><button class="home-btn ${s.housing===h[0]?"selected":""}" data-home="${h[0]}">${s.housing===h[0]?"Обрано":"Орендувати"}</button></article>`).join("")}</section>
      <section class="info-card"><div class="section-title">🔒 Купівля нерухомості</div><div class="locked-home"><b>Власне житло</b><small>Купівля нерухомості буде доступна в наступних оновленнях.</small></div></section>`;
    },
    bind: function () {
      document.querySelectorAll("[data-home]").forEach(btn => btn.addEventListener("click", function () {
        S().housing = btn.dataset.home; LifePlusState.save(); LifePlusApp.openPage("housing", true);
      }));
    }
  };
})();
