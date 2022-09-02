// ==UserScript==
// @name         Refresh on inactivity
// @namespace    https://github.com/pirminis/refresh-on-inactivity
// @version      0.0.4
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
    warnWhenCounterReachesValue: 50,
    refreshWhenCounterReachesValue: 60,
    notificationTimeout: 10000
  };

  global.refreshOnInactivityLoaded = true;

  let counter = 0;
  let counterInterval = null;

  resetCounterOnMouseMove();
  resetCounterOnScroll();
  resetCounterOnKeyUp();
  resetCounterOnClick();
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
    }, config.counterUpdateInterval);
  }

  function resetCounterOnMouseMove() {
    document.removeEventListener("mousemove", resetCounter);
    document.addEventListener("mousemove", resetCounter);
  }

  function resetCounterOnScroll() {
    document.removeEventListener("scroll", resetCounter);
    document.addEventListener("scroll", resetCounter);
  }

  function resetCounterOnKeyUp() {
    document.removeEventListener("keyup", resetCounter);
    document.addEventListener("keyup", resetCounter);
  }

  function resetCounterOnClick() {
    document.removeEventListener("click", resetCounter);
    document.addEventListener("click", resetCounter);
  }

  function resetCounter() {
    requestAnimationFrame(function () {
      counter = 0;
    });
  }
})(window);
