// ==UserScript==
// @name         Refresh on inactivity
// @namespace    https://github.com/pirminis/refresh-on-inactivity
// @version      0.0.6
// @description  Automatically refresh the page when the user is idle
// @author       pirminis
// @updateURL    https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @downloadURL  https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @match        http://*/*
// @match        https://*/*
// @grant        GM_notification
// ==/UserScript==

(function(global) {
  'use strict';

  if (global.refreshOnInactivityLoaded) {
    return;
  }

  const oneSecond = 1000;

  let timerInterval = 1000;

  let notifications = [
    {
      showNotification: true,
      refresh: false,
      triggerFrom: 10,
      triggerTo: 20,
      notificationTimeout: 10000,
      notificationText: "Refreshing page in 20 seconds",
      processed: false
    },
    {
      showNotification: true,
      refresh: false,
      triggerFrom: 20,
      triggerTo: 30,
      notificationTimeout: 10000,
      notificationText: "Refreshing page in 10 seconds",
      processed: false
    },
    {
      showNotification: false,
      refresh: true,
      triggerFrom: 30,
      triggerTo: 9999999,
      processed: false
    }
  ];

  global.refreshOnInactivityLoaded = true;

  let startTime = Date.now();
  let timer = null;

  startTimer();

  function showNotification(text, timeout) {
    const options = {
      title: "Warning",
      text: text,
      timeout: timeout,
      silent: true
    };

    GM_notification(options);
  }

  function refresh() {
    global.location.reload();
  }

  function startTimer() {
    clearInterval(timer);

    timer = setInterval(function () {
      let counter = Math.floor((Date.now() - startTime) / oneSecond);

      for (let i = 0; i < notifications.length; i++) {
        let item = notifications[i];

        if (item.processed || counter < item.triggerFrom || counter >= item.triggerTo) {
          continue;
        }

        if (item.showNotification) {
          showNotification(item.notificationText, item.notificationTimeout);
          item.processed = true;
          break;
        } else if (item.refresh) {
          item.processed = true;
          refresh();
          break;
        }
      }
    }, timerInterval);
  }
})(window);
