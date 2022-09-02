// ==UserScript==
// @name         Refresh on inactivity
// @namespace    https://github.com/pirminis/refresh-on-inactivity
// @version      0.0.3
// @description  Automatically refresh the page when the user is idle
// @author       pirminis
// @updateURL    https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @downloadURL  https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @match        http://*/*
// @match        https://*/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function(global) {
  'use strict';

  if (global.refreshOnInactivityLoaded) {
    return;
  }

  const config = {
    counterUpdateInterval: 1000,
    warnWhenCounterReachesValue: 5,
    refreshWhenCounterReachesValue: 10,
    notificationTimeout: 5000
  };

  global.refreshOnInactivityLoaded = true;

  let counter = 0;
  let counterInterval = null;

  resetCounterOnMouseMove();
  startCounterTimer();

  function showNotification() {
    const details = {
      title: "Warning",
      text: "I am about to refresh the page...",
      timeout: config.notificationTimeout,
      silent: true
    };

    GM_notification(details);
  }

  function refresh() {
    global.location.reload();
  }

  function startCounterTimer() {
    clearInterval(counterInterval);

    counterInterval = setInterval(function () {
      const currentValue = counter;
      const newValue = currentValue + 1;

      counter = newValue;

      if (counter == config.warnWhenCounterReachesValue) {
        showNotification();
      } else if (counter == config.refreshWhenCounterReachesValue) {
        refresh();
      }

      console.log(`[DEBUG] increasing idling_counter to ${newValue}`);
    }, config.counterUpdateInterval);
  }

  function resetCounterOnMouseMove() {
    document.removeEventListener("mousemove", periodicallyIncrementCounter);
    document.addEventListener("mousemove", periodicallyIncrementCounter);
  }

  function periodicallyIncrementCounter() {
    requestAnimationFrame(function () {
      counter = 0;

      console.log('[DEBUG] reset idling_counter to 0');
    });
  }
})(window);
