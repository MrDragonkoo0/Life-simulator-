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
  balance: 1000,
  foodDays: 3,
  foodSpent: 0
};

const balanceEl = document.getElementById("balance");
const foodDaysEl = document.getElementById("foodDays");
const foodBarEl = document.getElementById("foodBar");
const foodStatusEl = document.getElementById("foodStatus");
const foodSpentEl = document.getElementById("foodSpent");

function render() {
  balanceEl.textContent = "₴" + state.balance.toLocaleString("uk-UA");
  foodDaysEl.textContent = `${state.foodDays} ${state.foodDays === 1 ? "день" : "дні"}`;
  foodSpentEl.textContent = "₴" + state.foodSpent.toLocaleString("uk-UA");

  const percent = Math.max(0, Math.min(100, state.foodDays / 7 * 100));
  foodBarEl.style.width = percent + "%";

  if (state.foodDays <= 0) {
    foodStatusEl.textContent = "Немає запасу";
  } else if (state.foodDays <= 1) {
    foodStatusEl.textContent = "Мало";
  } else {
    foodStatusEl.textContent = "Нормально";
  }
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelectorAll(".food-btn").forEach(button => {
  button.addEventListener("click", () => {
    const days = Number(button.dataset.days);
    const price = Number(button.dataset.price);

    if (state.balance < price) {
      button.textContent = "Недостатньо";
      setTimeout(() => button.textContent = "Купити", 1200);
      return;
    }

    state.balance -= price;
    state.foodDays += days;
    state.foodSpent += price;
    render();

    button.textContent = "Куплено";
    setTimeout(() => button.textContent = "Купити", 900);
  });
});

render();
