/**
 * NotificationsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.NotificationsController = (function () {

  // Notification settings
  var notificationStatus;
  var notificationTime;


  function init() {

  }

  function createNotification() {
    var options = {};
    options["type"] = "basic";
    options["title"] = "Sample title";
    options["message"] = "Sample message";
    options["iconUrl"] = "icons/icon16.png";
    chrome.notifications.create('', options, function(){});
  }

  function setNotificationTime(hour, ampm) {
    var finalHour = 0;
    if (ampm == "pm") {
      finalHour += 12;
    }
    notificationTime = finalHour + hour; 
  }

  function setNotificationStatus(status) {
    notificationStatus = status;

    if (!notificationStatus) {
       deleteNotification();
    }
  }

  function scheduleNotification() {
    chrome.alarms.create("notify", {});
  }

  function deleteNotification() {
     chrome.alarms.clear("notify", function(result){});
  }

  return { 
    init: init,
    setNotificationTime: setNotificationTime,
    setNotificationStatus: setNotificationStatus,
  };

})();