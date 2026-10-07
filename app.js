const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    try {
        tg.setHeaderColor("#080b12");
        tg.setBackgroundColor("#080b12");
    } catch (e) {}
}

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
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

const pages = {
    profile: "profile.html",
    work: "work.html",
    housing: "housing.html"
};

document.querySelectorAll(".menu-button").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.page;

        if (pages[page]) {
            window.location.href = pages[page];
            return;
        }

        showToast(`Розділ «${pageNames[page] || "Розділ"}» поки що в розробці`);
    });
});

const notifications = document.getElementById("notifications");
if (notifications) {
    notifications.addEventListener("click", () => {
        showToast("Нових сповіщень немає");
    });
}
