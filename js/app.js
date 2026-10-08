(function () {
  "use strict";

  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    try { tg.ready(); tg.expand(); tg.setHeaderColor("#080b12"); tg.setBackgroundColor("#080b12"); } catch (e) {}
  }

  const view = document.getElementById("view");
  const topbar = document.getElementById("mainTopbar");
  const toast = document.getElementById("toast");
  let toastTimer;

  function toastMsg(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function header(title) {
    topbar.innerHTML = `<button class="icon-btn" id="backBtn" aria-label="Назад">‹</button><div class="page-title">${title}</div><div style="width:44px"></div>`;
    document.getElementById("backBtn").onclick = goHome;
    if (tg && tg.BackButton) {
      try { tg.BackButton.show(); tg.BackButton.offClick(goHome); tg.BackButton.onClick(goHome); } catch(e) {}
    }
  }

  function mainHeader() {
    topbar.innerHTML = `<div class="player"><div class="avatar">👤</div><div><div class="player-name">Новачок</div><div class="player-level">Рівень ${LifePlusState.level()}</div></div></div><button class="notification" id="notifications" aria-label="Сповіщення">🔔<span class="notification-dot"></span></button>`;
    document.getElementById("notifications").onclick = () => toastMsg("Нових сповіщень немає");
    if (tg && tg.BackButton) { try { tg.BackButton.hide(); tg.BackButton.offClick(goHome); } catch(e) {} }
  }

  function homeHTML() {
    const s = LifePlusState.state;
    return `<section class="hero"><div class="hero-content"><div class="logo">LIFE<span>+</span></div><div class="subtitle">Твоє життя. Твої правила.</div></div></section>
      <section class="balance-card"><div class="balance-label">💰 Баланс</div><div class="balance-value">₴${s.balance.toLocaleString("uk-UA")}</div><div class="balance-status">Доступно</div></section>
      <section class="stats"><div class="stat"><div class="stat-icon">🏠</div><div class="stat-title">Житло</div><div class="stat-value">${s.housing === "room" ? "Немає" : "Є"}</div></div><div class="stat"><div class="stat-icon">💼</div><div class="stat-title">Робота</div><div class="stat-value">${s.job ? s.job.name : "Немає"}</div></div><div class="stat"><div class="stat-icon">⭐</div><div class="stat-title">Рівень</div><div class="stat-value">${LifePlusState.level()}</div></div></section>
      <section class="menu">
        <button class="menu-button" data-page="profile"><span class="menu-icon">👤</span><span>Профіль</span></button>
        <button class="menu-button" data-page="work"><span class="menu-icon">💼</span><span>Робота</span></button>
        <button class="menu-button" data-page="housing"><span class="menu-icon">🏠</span><span>Житло</span></button>
        <button class="menu-button" data-page="transport"><span class="menu-icon">🚗</span><span>Транспорт</span></button>
        <button class="menu-button" data-page="business"><span class="menu-icon">🏢</span><span>Бізнеси</span></button>
        <button class="menu-button" data-page="bank"><span class="menu-icon">🏦</span><span>Банк</span></button>
        <button class="menu-button" data-page="shop"><span class="menu-icon">🛒</span><span>Магазин</span></button>
        <button class="menu-button" data-page="tasks"><span class="menu-icon">📋</span><span>Завдання</span></button>
        <button class="menu-button" data-page="players"><span class="menu-icon">👥</span><span>Гравці</span></button>
        <button class="menu-button" data-page="settings"><span class="menu-icon">⚙️</span><span>Налаштування</span></button>
      </section>
      <footer class="footer"><div>Life+ v0.7.0</div><div>Онлайн-симулятор життя</div></footer>`;
  }

  function bindHome() {
    document.querySelectorAll(".menu-button").forEach(btn => btn.onclick = () => openPage(btn.dataset.page));
  }

  function goHome() {
    mainHeader();
    view.innerHTML = homeHTML();
    bindHome();
    try { history.replaceState({page:"home"}, "", "#home"); } catch(e) {}
    scrollTo(0,0);
  }

  function openPage(page, internal) {
    const module = window.LifePlusPages[page];
    if (!module) { toastMsg("Розділ не знайдено"); return; }
    header(module.title);
    view.innerHTML = module.render();
    if (module.bind) module.bind();
    if (!internal) { try { history.pushState({page}, "", "#" + page); } catch(e) {} }
    scrollTo(0,0);
  }

  window.LifePlusApp = {
    openPage,
    goHome,
    toast: toastMsg
  };

  addEventListener("popstate", () => {
    const page = location.hash.replace("#","");
    if (!page || page === "home") goHome();
    else openPage(page, true);
  });

  LifePlusState.load();
  mainHeader();
  view.innerHTML = homeHTML();
  bindHome();
  try { history.replaceState({page:"home"}, "", "#home"); } catch(e) {}
})();
