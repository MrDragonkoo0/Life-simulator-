const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#090b11");
    tg.setBackgroundColor("#090b11");
  } catch (e) {}
}

const player = {
  name: "Гравець",
  level: 1,
  balance: 1000
};

const nameEl = document.getElementById("playerName");
const levelEl = document.getElementById("level");
const balanceEl = document.getElementById("balance");

nameEl.textContent = player.name;
levelEl.textContent = player.level;
balanceEl.textContent = "₴" + player.balance.toLocaleString("uk-UA");

function openSection(section) {
  if (section === "profile") {
    window.location.href = "profile.html";
    return;
  }

  const titles = {
    work: "Робота",
    housing: "Житло",
    transport: "Транспорт",
    businesses: "Бізнеси",
    bank: "Банк",
    shop: "Магазин",
    tasks: "Завдання",
    players: "Гравці",
    settings: "Налаштування"
  };

  showToast(`${titles[section] || "Розділ"} — скоро буде доступний`);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
}

document.querySelectorAll(".menu-card").forEach(btn => {
  btn.addEventListener("click", () => openSection(btn.dataset.section));
});

document.getElementById("profileTop").addEventListener("click", () => {
  window.location.href = "profile.html";
});
