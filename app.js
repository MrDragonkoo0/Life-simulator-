
import { renderProfile, initProfile } from "./pages/profile.js";
import { renderWork, initWork } from "./pages/work.js";
import { renderHousing, initHousing } from "./pages/housing.js";
import { renderNeeds, initNeeds } from "./pages/needs.js";

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#080b12");
    tg.setBackgroundColor("#080b12");
  } catch (e) {}
}

const view = document.getElementById("view");
const topbar = document.getElementById("mainTopbar");
const toast = document.getElementById("toast");
let toastTimer;

const state = {
  balance: 1000,
  foodDays: 3,
  foodSpent: 0,
  job: null,
  housing: "room"
};

const pageNames = {
  profile: "Профіль",
  work: "Робота",
  housing: "Житло",
  transport: "Транспорт",
  business: "Бізнеси",
  bank: "Банк",
  shop: "Магазин",
  tasks: "Завдання",
  players: "Гравці",
  settings: "Налаштування"
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function telegramBack() {
  if (tg?.BackButton) {
    tg.BackButton.offClick(goHome);
    tg.BackButton.hide();
  }
}

function setSubpageHeader(title) {
  topbar.innerHTML = `
    <button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>
    <div class="page-title">${title}</div>
    <div style="width:44px"></div>
  `;
  document.getElementById("backBtn").addEventListener("click", goHome);
  if (tg?.BackButton) {
    tg.BackButton.show();
    tg.BackButton.offClick(goHome);
    tg.BackButton.onClick(goHome);
  }
}

function restoreMainHeader() {
  topbar.innerHTML = `
    <div class="player">
      <div class="avatar">👤</div>
      <div>
        <div class="player-name">Новачок</div>
        <div class="player-level">Рівень 1</div>
      </div>
    </div>
    <button class="notification" id="notifications" aria-label="Сповіщення">
      🔔<span class="notification-dot"></span>
    </button>
  `;
  document.getElementById("notifications").addEventListener("click", () => {
    showToast("Нових сповіщень немає");
  });
  telegramBack();
}

function mainHTML() {
  return `
    <section class="hero">
      <div class="hero-content">
        <div class="logo">LIFE<span>+</span></div>
        <div class="subtitle">Твоє життя. Твої правила.</div>
      </div>
    </section>

    <section class="balance-card">
      <div class="balance-label">💰 Баланс</div>
      <div class="balance-value">₴${state.balance.toLocaleString("uk-UA")}</div>
      <div class="balance-status">Доступно</div>
    </section>

    <section class="stats">
      <div class="stat">
        <div class="stat-icon">🏠</div>
        <div class="stat-title">Житло</div>
        <div class="stat-value">${state.housing === "room" ? "Немає" : "Є"}</div>
      </div>
      <div class="stat">
        <div class="stat-icon">💼</div>
        <div class="stat-title">Робота</div>
        <div class="stat-value">${state.job ? state.job.name : "Немає"}</div>
      </div>
      <div class="stat">
        <div class="stat-icon">⭐</div>
        <div class="stat-title">Рівень</div>
        <div class="stat-value">1</div>
      </div>
    </section>

    <section class="menu">
      ${[
        ["profile","👤","Профіль"],["work","💼","Робота"],["housing","🏠","Житло"],
        ["transport","🚗","Транспорт"],["business","🏢","Бізнеси"],["bank","🏦","Банк"],
        ["shop","🛒","Магазин"],["tasks","📋","Завдання"],["players","👥","Гравці"],
        ["settings","⚙️","Налаштування"]
      ].map(([page,icon,label]) =>
        `<button class="menu-button" data-page="${page}"><span class="menu-icon">${icon}</span><span>${label}</span></button>`
      ).join("")}
    </section>

    <footer class="footer">
      <div>Life+ v0.5.0</div>
      <div>Онлайн-симулятор життя</div>
    </footer>
  `;
}

function goHome() {
  restoreMainHeader();
  view.innerHTML = mainHTML();
  bindMainMenu();
  window.history.replaceState({ page: "home" }, "", "#home");
}

function openPage(page) {
  if (page === "profile") {
    setSubpageHeader("Профіль");
    renderProfile(view);
    initProfile(view, state);
  } else if (page === "work") {
    setSubpageHeader("💼 Робота");
    renderWork(view);
    initWork(view, state);
  } else if (page === "housing") {
    setSubpageHeader("🏠 Житло");
    renderHousing(view);
    initHousing(view, state);
  } else if (page === "shop") {
    setSubpageHeader("🛒 Магазин");
    renderNeeds(view);
    initNeeds(view, state);
  } else {
    showToast(`Розділ «${pageNames[page] || "Розділ"}» поки що в розробці`);
    return;
  }
  window.history.pushState({ page }, "", `#${page}`);
  view.scrollIntoView({ block: "start" });
}

function bindMainMenu() {
  document.querySelectorAll(".menu-button").forEach(button => {
    button.addEventListener("click", () => openPage(button.dataset.page));
  });
}

window.addEventListener("popstate", () => {
  const page = location.hash.replace("#", "");
  if (!page || page === "home") goHome();
  else if (["profile","work","housing","shop"].includes(page)) openPage(page);
  else goHome();
});

restoreMainHeader();
view.innerHTML = mainHTML();
bindMainMenu();
history.replaceState({ page: "home" }, "", "#home");
