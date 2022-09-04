// ==UserScript==
// @name         Refresh on inactivity
// @namespace    https://github.com/pirminis/refresh-on-inactivity
// @version      0.0.10
// @description  Automatically refresh the page when the user is idle
// @author       pirminis
// @updateURL    https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @downloadURL  https://github.com/pirminis/refresh-on-inactivity/raw/master/refresh-on-inactivity.user.js
// @grant        GM_notification
// ==/UserScript==

/* global GM_notification */
(function(global) {
  'use strict';

  if (global.refreshOnInactivityLoaded) {
    return;
  }

  const oneSecond = 1000;
  const timerInterval = 1000;

  let notifications = [
    {
      showNotification: true,
      refresh: false,
      triggerFrom: stringToSeconds('49m'),
      triggerTo: stringToSeconds('54m'),
      notificationTimeout: secondsToMilliseconds(stringToSeconds('5m')),
      notificationText: "Refreshing page in 10 minutes",
      processed: false
    },
    {
      showNotification: true,
      refresh: false,
      triggerFrom: stringToSeconds('54m'),
      triggerTo: stringToSeconds('58m'),
      notificationTimeout: secondsToMilliseconds(stringToSeconds('4m')),
      notificationText: "Refreshing page in 5 minutes",
      processed: false
    },
    {
      showNotification: true,
      refresh: false,
      triggerFrom: stringToSeconds('58m'),
      triggerTo: stringToSeconds('59m'),
      notificationTimeout: secondsToMilliseconds(stringToSeconds('1m')),
      notificationText: "Refreshing page in 1 minute",
      processed: false
    },
    {
      showNotification: false,
      refresh: true,
      triggerFrom: stringToSeconds('59m'),
      triggerTo: stringToSeconds('999h'),
      processed: false
    }
  ];

  global.refreshOnInactivityLoaded = true;

  let startTime = Date.now();
  let timer = null;

  startTimer();

  function secondsToMilliseconds(number) {
    return parseInt(number) * 1000;
  }

  function stringToSeconds(value) {
    const timePattern = /^(?:(\d+)h\s?)?(?:(\d+)m\s?)?(?:(\d+)s\s?)?/;

    let parsedString = value.toString().match(timePattern);

    let hours = parseInt(parsedString[1] || 0);
    let minutes = parseInt(parsedString[2] || 0);
    let seconds = parseInt(parsedString[3] || 0);

    return hours * 60 * 60 + minutes * 60 + seconds;
  }

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
