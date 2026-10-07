
(function () {
  "use strict";

  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    try {
      tg.ready();
      tg.expand();
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
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function hideTelegramBack() {
    if (tg && tg.BackButton) {
      try {
        tg.BackButton.offClick(goHome);
        tg.BackButton.hide();
      } catch (e) {}
    }
  }

  function setSubpageHeader(title) {
    topbar.innerHTML =
      '<button class="icon-btn" id="backBtn" aria-label="Назад">‹</button>' +
      '<div class="page-title">' + title + '</div>' +
      '<div style="width:44px"></div>';

    const back = document.getElementById("backBtn");
    if (back) back.addEventListener("click", goHome);

    if (tg && tg.BackButton) {
      try {
        tg.BackButton.show();
        tg.BackButton.offClick(goHome);
        tg.BackButton.onClick(goHome);
      } catch (e) {}
    }
  }

  function restoreMainHeader() {
    topbar.innerHTML =
      '<div class="player">' +
        '<div class="avatar">👤</div>' +
        '<div>' +
          '<div class="player-name">Новачок</div>' +
          '<div class="player-level">Рівень 1</div>' +
        '</div>' +
      '</div>' +
      '<button class="notification" id="notifications" aria-label="Сповіщення">' +
        '🔔<span class="notification-dot"></span>' +
      '</button>';

    const notifications = document.getElementById("notifications");
    if (notifications) {
      notifications.addEventListener("click", function () {
        showToast("Нових сповіщень немає");
      });
    }

    hideTelegramBack();
  }

  function mainHTML() {
    const jobName = state.job ? state.job.name : "Немає";
    const housingName = state.housing === "room" ? "Немає" : "Є";

    return (
      '<section class="hero">' +
        '<div class="hero-content">' +
          '<div class="logo">LIFE<span>+</span></div>' +
          '<div class="subtitle">Твоє життя. Твої правила.</div>' +
        '</div>' +
      '</section>' +

      '<section class="balance-card">' +
        '<div class="balance-label">💰 Баланс</div>' +
        '<div class="balance-value">₴' + state.balance.toLocaleString("uk-UA") + '</div>' +
        '<div class="balance-status">Доступно</div>' +
      '</section>' +

      '<section class="stats">' +
        '<div class="stat">' +
          '<div class="stat-icon">🏠</div>' +
          '<div class="stat-title">Житло</div>' +
          '<div class="stat-value">' + housingName + '</div>' +
        '</div>' +
        '<div class="stat">' +
          '<div class="stat-icon">💼</div>' +
          '<div class="stat-title">Робота</div>' +
          '<div class="stat-value">' + jobName + '</div>' +
        '</div>' +
        '<div class="stat">' +
          '<div class="stat-icon">⭐</div>' +
          '<div class="stat-title">Рівень</div>' +
          '<div class="stat-value">1</div>' +
        '</div>' +
      '</section>' +

      '<section class="menu">' +
        '<button class="menu-button" data-page="profile"><span class="menu-icon">👤</span><span>Профіль</span></button>' +
        '<button class="menu-button" data-page="work"><span class="menu-icon">💼</span><span>Робота</span></button>' +
        '<button class="menu-button" data-page="housing"><span class="menu-icon">🏠</span><span>Житло</span></button>' +
        '<button class="menu-button" data-page="transport"><span class="menu-icon">🚗</span><span>Транспорт</span></button>' +
        '<button class="menu-button" data-page="business"><span class="menu-icon">🏢</span><span>Бізнеси</span></button>' +
        '<button class="menu-button" data-page="bank"><span class="menu-icon">🏦</span><span>Банк</span></button>' +
        '<button class="menu-button" data-page="shop"><span class="menu-icon">🛒</span><span>Магазин</span></button>' +
        '<button class="menu-button" data-page="tasks"><span class="menu-icon">📋</span><span>Завдання</span></button>' +
        '<button class="menu-button" data-page="players"><span class="menu-icon">👥</span><span>Гравці</span></button>' +
        '<button class="menu-button" data-page="settings"><span class="menu-icon">⚙️</span><span>Налаштування</span></button>' +
      '</section>' +

      '<footer class="footer">' +
        '<div>Life+ v0.5.1</div>' +
        '<div>Онлайн-симулятор життя</div>' +
      '</footer>'
    );
  }

  function profileHTML() {
    return (
      '<section class="profile-card">' +
        '<div class="profile-avatar">👤</div>' +
        '<h1>Гравець</h1>' +
        '<div class="level-pill">РІВЕНЬ <b>1</b></div>' +
      '</section>' +
      '<section class="balance-card">' +
        '<div><span class="muted">Баланс</span><strong id="pageBalance">₴1 000</strong></div>' +
        '<div class="wallet-icon">₴</div>' +
      '</section>' +
      '<section class="profile-info">' +
        '<div class="section-title">📌 Поточний стан</div>' +
        '<div class="info-row"><span>🏠 Житло</span><b>Кімната</b></div>' +
        '<div class="info-row"><span>💼 Робота</span><b>' + (state.job ? state.job.name : "Немає") + '</b></div>' +
        '<div class="info-row"><span>🚗 Транспорт</span><b>Немає</b></div>' +
        '<div class="info-row"><span>🏢 Бізнеси</span><b>0</b></div>' +
      '</section>' +
      '<section class="profile-info">' +
        '<div class="section-title">📊 Статистика</div>' +
        '<div class="stats-grid">' +
          '<div><b>1</b><small>Ігровий день</small></div>' +
          '<div><b>0</b><small>Відпрацьовано годин</small></div>' +
          '<div><b>0</b><small>Куплено авто</small></div>' +
          '<div><b>0</b><small>Бізнесів</small></div>' +
        '</div>' +
      '</section>' +
      '<section class="profile-info">' +
        '<div class="section-title">⭐ Досвід</div>' +
        '<div class="xp-line"><span>0 / 100 XP</span><b>0%</b></div>' +
        '<div class="xp-bar"><div></div></div>' +
      '</section>'
    );
  }

  function workHTML() {
    return (
      '<section class="info-card">' +
        '<div class="section-title">Поточна робота</div>' +
        '<div id="currentJob" class="job-current">' +
          '<b>' + (state.job ? state.job.name : "Без роботи") + '</b>' +
          '<small>' + (state.job ? "Роботу обрано." : "Обери професію нижче, щоб почати заробляти.") + '</small>' +
        '</div>' +
      '</section>' +
      '<section class="info-card">' +
        '<div class="section-title">Доступні професії</div>' +
        '<article class="job-card">' +
          '<div class="job-icon">📦</div><div class="job-main"><b>Працівник складу</b><small>Початкова робота • без вимог</small><div class="job-meta"><span>💰 ₴700 / зміна</span><span>⏱️ 1 година</span></div></div>' +
          '<button class="job-btn" data-name="Працівник складу" data-pay="700">Обрати</button>' +
        '</article>' +
        '<article class="job-card">' +
          '<div class="job-icon">🛒</div><div class="job-main"><b>Касир</b><small>Потрібен 1 рівень</small><div class="job-meta"><span>💰 ₴800 / зміна</span><span>⏱️ 1 година</span></div></div>' +
          '<button class="job-btn" data-name="Касир" data-pay="800">Обрати</button>' +
        '</article>' +
        '<article class="job-card">' +
          '<div class="job-icon">🚕</div><div class="job-main"><b>Водій таксі</b><small>Потрібен транспорт • буде доступно пізніше</small><div class="job-meta"><span>💰 ₴1 100 / зміна</span><span>⏱️ 1 година</span></div></div>' +
          '<button class="job-btn disabled" disabled>Закрито</button>' +
        '</article>' +
      '</section>' +
      '<section class="info-card">' +
        '<div class="section-title">📈 Досвід роботи</div>' +
        '<div class="xp-line"><span>0 / 100 XP</span><b>0%</b></div>' +
        '<div class="xp-bar"><div style="width:0%"></div></div>' +
        '<small class="muted" style="display:block;margin-top:8px;font-size:10px">Досвід і підвищення зарплати будуть розвиватися далі.</small>' +
      '</section>'
    );
  }

  function housingHTML() {
    return (
      '<section class="info-card">' +
        '<div class="section-title">Твоє житло</div>' +
        '<div class="home-current"><div class="home-icon">🛏️</div><div><b>Кімната</b><small>Оренда • ₴5 000 / місяць</small></div></div>' +
        '<div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div>' +
        '<div class="info-row"><span>⭐ Комфорт</span><b>20 / 100</b></div>' +
      '</section>' +
      '<section class="info-card">' +
        '<div class="section-title">🏠 Доступне житло</div>' +
        '<article class="home-card"><div class="home-icon">🛏️</div><div class="home-main"><b>Кімната</b><small>Базове житло для старту</small><div class="home-meta"><span>💰 ₴5 000/міс.</span><span>⭐ 20</span></div></div><button class="home-btn selected">Орендовано</button></article>' +
        '<article class="home-card"><div class="home-icon">🏠</div><div class="home-main"><b>Маленька квартира</b><small>Більше простору та комфорту</small><div class="home-meta"><span>💰 ₴9 000/міс.</span><span>⭐ 40</span></div></div><button class="home-btn" data-home="small">Орендувати</button></article>' +
        '<article class="home-card"><div class="home-icon">🏢</div><div class="home-main"><b>Комфортна квартира</b><small>Для гравця, який уже розвивається</small><div class="home-meta"><span>💰 ₴16 000/міс.</span><span>⭐ 65</span></div></div><button class="home-btn" data-home="comfort">Орендувати</button></article>' +
      '</section>' +
      '<section class="info-card"><div class="section-title">🔒 Купівля нерухомості</div><div class="locked-home"><b>Власне житло</b><small>Можливість купувати нерухомість з'явиться в наступних версіях.</small></div></section>'
    );
  }

  function shopHTML() {
    return (
      '<section class="balance-card"><div><span class="muted">Доступні гроші</span><strong id="shopBalance">₴' + state.balance.toLocaleString("uk-UA") + '</strong></div><div class="wallet-icon">₴</div></section>' +
      '<section class="info-card"><div class="section-title">🍽️ Харчування</div>' +
        '<div class="need-row"><div><b>Стан харчування</b><small>Поточний запас їжі</small></div><strong id="foodStatus">Нормально</strong></div>' +
        '<div class="need-bar"><div id="foodBar" style="width:' + Math.min(100, state.foodDays / 7 * 100) + '%"></div></div>' +
        '<div class="food-meta"><span>Запас: <b id="foodDays">' + state.foodDays + ' дні</b></span><span>Витрати: <b>≈ ₴100/день</b></span></div>' +
      '</section>' +
      '<section class="info-card"><div class="section-title">🛒 Магазин продуктів</div>' +
        '<article class="food-card"><div class="food-icon">🥪</div><div class="food-main"><b>Базовий набір</b><small>Їжа на 1 день</small><div class="food-meta"><span>💰 ₴100</span><span>🍽️ +1 день</span></div></div><button class="food-btn" data-days="1" data-price="100">Купити</button></article>' +
        '<article class="food-card"><div class="food-icon">🛍️</div><div class="food-main"><b>Набір на тиждень</b><small>Вигідніша покупка продуктів</small><div class="food-meta"><span>💰 ₴650</span><span>🍽️ +7 днів</span></div></div><button class="food-btn" data-days="7" data-price="650">Купити</button></article>' +
      '</section>' +
      '<section class="info-card"><div class="section-title">💡 Обов\'язкові витрати</div><div class="info-row"><span>🏠 Оренда</span><b>₴5 000 / місяць</b></div><div class="info-row"><span>💡 Комунальні</span><b>≈ ₴1 200 / місяць</b></div></section>'
    );
  }

  function bindProfile() {
    const el = document.getElementById("pageBalance");
    if (el) el.textContent = "₴" + state.balance.toLocaleString("uk-UA");
  }

  function bindWork() {
    document.querySelectorAll(".job-btn:not(.disabled)").forEach(function (button) {
      button.addEventListener("click", function () {
        state.job = {
          name: button.dataset.name,
          pay: Number(button.dataset.pay)
        };
        const current = document.getElementById("currentJob");
        if (current) {
          current.innerHTML = "<b>" + state.job.name + "</b><small>Роботу обрано. Реальний таймер зміни буде підключено наступним оновленням.</small>";
        }
        document.querySelectorAll(".job-btn:not(.disabled)").forEach(function (b) {
          b.textContent = "Обрати";
        });
        button.textContent = "Обрано";
      });
    });
  }

  function bindHousing() {
    document.querySelectorAll(".home-btn[data-home]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll(".home-btn[data-home]").forEach(function (b) {
          b.textContent = "Орендувати";
        });
        button.textContent = "Обрано";
        state.housing = button.dataset.home;
      });
    });
  }

  function bindShop() {
    document.querySelectorAll(".food-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const days = Number(button.dataset.days);
        const price = Number(button.dataset.price);

        if (state.balance < price) {
          button.textContent = "Недостатньо";
          setTimeout(function () { button.textContent = "Купити"; }, 1200);
          return;
        }

        state.balance -= price;
        state.foodDays += days;
        state.foodSpent += price;

        const balance = document.getElementById("shopBalance");
        const foodDays = document.getElementById("foodDays");
        const foodBar = document.getElementById("foodBar");

        if (balance) balance.textContent = "₴" + state.balance.toLocaleString("uk-UA");
        if (foodDays) foodDays.textContent = state.foodDays + " дні";
        if (foodBar) foodBar.style.width = Math.min(100, state.foodDays / 7 * 100) + "%";

        button.textContent = "Куплено";
        setTimeout(function () { button.textContent = "Купити"; }, 900);
      });
    });
  }

  function goHome() {
    restoreMainHeader();
    view.innerHTML = mainHTML();
    bindMainMenu();
    try {
      window.history.replaceState({ page: "home" }, "", "#home");
    } catch (e) {}
    window.scrollTo(0, 0);
  }

  function openPage(page) {
    if (page === "profile") {
      setSubpageHeader("Профіль");
      view.innerHTML = profileHTML();
      bindProfile();
    } else if (page === "work") {
      setSubpageHeader("💼 Робота");
      view.innerHTML = workHTML();
      bindWork();
    } else if (page === "housing") {
      setSubpageHeader("🏠 Житло");
      view.innerHTML = housingHTML();
      bindHousing();
    } else if (page === "shop") {
      setSubpageHeader("🛒 Магазин");
      view.innerHTML = shopHTML();
      bindShop();
    } else {
      showToast("Розділ «" + (pageNames[page] || "Розділ") + "» поки що в розробці");
      return;
    }

    try {
      window.history.pushState({ page: page }, "", "#" + page);
    } catch (e) {}
    window.scrollTo(0, 0);
  }

  function bindMainMenu() {
    document.querySelectorAll(".menu-button").forEach(function (button) {
      button.addEventListener("click", function () {
        openPage(button.dataset.page);
      });
    });
  }

  window.addEventListener("popstate", function () {
    const page = location.hash.replace("#", "");
    if (!page || page === "home") goHome();
    else if (["profile", "work", "housing", "shop"].includes(page)) openPage(page);
    else goHome();
  });

  // Start screen.
  restoreMainHeader();
  view.innerHTML = mainHTML();
  bindMainMenu();

  try {
    window.history.replaceState({ page: "home" }, "", "#home");
  } catch (e) {}
})();
