const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#090b11");
    tg.setBackgroundColor("#090b11");
  } catch (e) {}
}

// Тимчасові дані v0.1.0.
// Пізніше вони підключаться до бази даних Railway.
const player = {
  name: "Гравець",
  level: 1,
  balance: 1000
};

document.getElementById("profileName").textContent = player.name;
document.getElementById("profileLevel").textContent = player.level;
document.getElementById("profileBalance").textContent =
  "₴" + player.balance.toLocaleString("uk-UA");

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
