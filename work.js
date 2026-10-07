const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#090b11");
    tg.setBackgroundColor("#090b11");
  } catch (e) {}
}

const state = {
  job: null,
  balance: 1000,
  xp: 0
};

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelectorAll(".job-btn:not(.disabled)").forEach(button => {
  button.addEventListener("click", () => {
    state.job = {
      name: button.dataset.name,
      pay: Number(button.dataset.pay)
    };

    document.getElementById("currentJob").innerHTML = `
      <b>${state.job.name}</b>
      <small>Роботу обрано. Реальний таймер зміни буде підключено наступним оновленням.</small>
    `;

    document.querySelectorAll(".job-btn").forEach(b => {
      if (!b.disabled) b.textContent = "Обрано";
    });
    button.textContent = "Обрано";
  });
});
