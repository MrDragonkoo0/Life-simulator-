(function () {
  "use strict";
  const STORAGE_KEY = "lifeplus_v07_state";

  const state = {
    balance: 1000,
    foodDays: 3,
    foodSpent: 0,
    job: null,
    housing: "room",
    xp: 0,
    working: false,
    shiftStartedAt: 0,
    shiftEndsAt: 0,
    shiftPay: 0
  };

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) Object.keys(state).forEach(k => {
        if (saved[k] !== undefined) state[k] = saved[k];
      });
    } catch (e) {}
  }

  function level() { return Math.floor(state.xp / 100) + 1; }

  window.LifePlusState = { state, save, load, level };
})();
