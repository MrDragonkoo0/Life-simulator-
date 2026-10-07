const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#080b12");
    tg.setBackgroundColor("#080b12");
}

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

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

document.querySelectorAll(".menu-button").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.page;
        showToast(`Розділ «${pageNames[page] || "Розділ"}» поки що в розробці`);
    });
});

document.getElementById("notifications").addEventListener("click", () => {
    showToast("Нових сповіщень немає");
});

// Профіль
document.querySelectorAll('.menu-button[data-page="profile"]').forEach(button => {
    button.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
});

document.querySelectorAll('.menu-button[data-page="work"]').forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "work.html";
  });
});

document.querySelectorAll('.menu-button[data-page="housing"]').forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "housing.html";
  });
});

});



// Life+ v0.4.2 — stable navigation
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-section]");
  if (!button) return;

  const section = button.dataset.section;
  const pages = {
    profile: "profile.html",
    work: "work.html",
    housing: "housing.html"
  };

  if (pages[section]) {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = pages[section];
  }
}, true);
