const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#090b11");
    tg.setBackgroundColor("#090b11");
  } catch (e) {}
}

const player = { name: "Гравець", level: 1, balance: 1000 };
document.getElementById("playerName").textContent = player.name;
document.getElementById("level").textContent = player.level;
document.getElementById("balance").textContent =
  "₴" + player.balance.toLocaleString("uk-UA");

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
