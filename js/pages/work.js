(function () {
  window.LifePlusPages = window.LifePlusPages || {};
  const S = () => LifePlusState.state;
  let timer = null;

  function format(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v,i) => (i === 0 ? String(v) : String(v).padStart(2,"0"))).join(":");
  }

  function finish(full) {
    const s = S();
    if (!s.working) return;
    const total = 3600000;
    const worked = Math.max(0, Math.min(total, Date.now() - s.shiftStartedAt));
    const ratio = full ? 1 : worked / total;
    const pay = Math.floor(s.shiftPay * ratio);
    s.balance += pay;
    s.xp += Math.max(1, Math.floor(25 * ratio));
    s.working = false;
    s.shiftStartedAt = 0; s.shiftEndsAt = 0; s.shiftPay = 0;
    LifePlusState.save();
    if (window.LifePlusApp) window.LifePlusApp.toast(full ? `Зміну завершено: +₴${pay}` : `Зміну завершено раніше: +₴${pay}`);
  }

  function check() {
    const s = S();
    if (s.working && Date.now() >= s.shiftEndsAt) finish(true);
  }

  window.LifePlusPages.work = {
    title: "💼 Робота",
    render: function () {
      check();
      const s = S();
      let current = "Без роботи";
      let action = "";
      if (s.job) {
        if (s.working) {
          action = `<div class="job-timer" id="shiftTimer">${format(s.shiftEndsAt - Date.now())}</div>
                    <button class="job-btn" id="leaveWork">Завершити раніше</button>`;
          current = s.job.name;
        } else {
          action = `<button class="job-btn" id="startWork">▶️ Почати зміну</button>`;
          current = s.job.name;
        }
      }
      return `
        <section class="info-card">
          <div class="section-title">Поточна робота</div>
          <div class="job-current"><b>${current}</b><small>${s.working ? "Зміна триває. Повна зміна — 1 година." : (s.job ? "Професію обрано." : "Обери професію нижче.")}</small>${action}</div>
        </section>
        <section class="info-card">
          <div class="section-title">Доступні професії</div>
          <article class="job-card"><div class="job-icon">📦</div><div class="job-main"><b>Працівник складу</b><small>Початкова робота • без вимог</small><div class="job-meta"><span>💰 ₴700 / зміна</span><span>⏱️ 1 година</span></div></div><button class="job-btn" data-job="warehouse" data-name="Працівник складу" data-pay="700">${s.job && s.job.name === "Працівник складу" ? "Обрано" : "Обрати"}</button></article>
          <article class="job-card"><div class="job-icon">🛒</div><div class="job-main"><b>Касир</b><small>Потрібен 1 рівень</small><div class="job-meta"><span>💰 ₴800 / зміна</span><span>⏱️ 1 година</span></div></div><button class="job-btn" data-job="cashier" data-name="Касир" data-pay="800">${s.job && s.job.name === "Касир" ? "Обрано" : "Обрати"}</button></article>
          <article class="job-card"><div class="job-icon">🚕</div><div class="job-main"><b>Водій таксі</b><small>Потрібен транспорт • буде доступно пізніше</small><div class="job-meta"><span>💰 ₴1 100 / зміна</span><span>⏱️ 1 година</span></div></div><button class="job-btn disabled" disabled>Закрито</button></article>
        </section>`;
    },
    bind: function () {
      const s = S();
      document.querySelectorAll("[data-job]").forEach(btn => btn.addEventListener("click", function () {
        if (s.working) return;
        s.job = { name: btn.dataset.name, pay: Number(btn.dataset.pay) };
        LifePlusState.save();
        LifePlusApp.openPage("work", true);
      }));
      const start = document.getElementById("startWork");
      if (start) start.addEventListener("click", function () {
        if (!s.job || s.working) return;
        s.working = true;
        s.shiftStartedAt = Date.now();
        s.shiftEndsAt = s.shiftStartedAt + 3600000;
        s.shiftPay = s.job.pay;
        LifePlusState.save();
        LifePlusApp.openPage("work", true);
      });
      const leave = document.getElementById("leaveWork");
      if (leave) leave.addEventListener("click", function () {
        finish(false);
        LifePlusApp.openPage("work", true);
      });
      clearInterval(timer);
      if (s.working) {
        timer = setInterval(function () {
          check();
          const el = document.getElementById("shiftTimer");
          if (!S().working) { clearInterval(timer); LifePlusApp.openPage("work", true); return; }
          if (el) el.textContent = format(S().shiftEndsAt - Date.now());
        }, 1000);
      }
    }
  };
})();
