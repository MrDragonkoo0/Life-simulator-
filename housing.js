const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#090b11");
    tg.setBackgroundColor("#090b11");
  } catch (e) {}
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelectorAll(".home-btn[data-home]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".home-btn").forEach(b => {
      if (!b.classList.contains("selected")) {
        b.textContent = "Орендувати";
      }
    });
    button.textContent = "Обрано";
  });
});
