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

document.querySelectorAll('.menu-button[data-page="needs"]').forEach(button => {
  button.addEventListener("click", () => {
    window.location.href = "needs.html";
  });
});


// v0.4.1 navigation fix
document.querySelectorAll('[data-section="profile"]').forEach(button => {
  button.onclick = () => { window.location.href = "profile.html"; };
});

document.querySelectorAll('[data-section="work"]').forEach(button => {
  button.onclick = () => { window.location.href = "work.html"; };
});

document.querySelectorAll('[data-section="housing"]').forEach(button => {
  button.onclick = () => { window.location.href = "housing.html"; };
});

// Потреби — доступні з головного меню через цей розділ.
document.querySelectorAll('[data-section="needs"]').forEach(button => {
  button.onclick = () => { window.location.href = "needs.html"; };
});
