# Life+ v0.7.0 — Modular Structure

Life+ now uses a maintainable modular structure.

LifePlus/
- index.html — application shell
- css/style.css — shared visual design
- js/app.js — application/router
- js/state.js — saved game state
- js/navigation.js — navigation names
- js/pages/*.js — independent game systems
- assets/icons/ — future icons
- assets/images/ — future images

Implemented pages:
Profile, Work, Housing, Transport, Business, Bank, Shop, Tasks, Players, Settings.

The main menu design is preserved. Classic scripts are used instead of ES modules so the Telegram WebView can load the game reliably.
