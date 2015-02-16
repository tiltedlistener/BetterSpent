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

  function init() {}

  function setNotificationTime(hour, ampm) {
    var finalHour = 0;
    if (ampm == "pm") {
      finalHour += 12;
    }
    notificationTime = finalHour + Number(hour);
  }

  function setNotificationStatus(status) {
    notificationStatus = status;

    if (!notificationStatus) {
       deleteNotification();
    } else {
      scheduleNotification();
    }
  }

  function scheduleNotification() {
    var d = new Date();
    var currentHours = d.getHours();
    var currentMinutes = d.getMinutes();

    // First determine if we have an upcoming alarm that day
    var diffMinutesToNextHour = 0;
    var diffHourToNextAlarm = 0;
    var finalMillToNextTime = 0;

    if (notificationTime - currentHours > 1) {
      diffMinutesToNextHour = 60 - currentMinutes;
      diffHourToNextAlarm = notificationTime - (currentHours + 1);
      finalMillToNextTime = 1000*(diffMinutesToNextHour * 60 + diffHourToNextAlarm * 60 * 60);
    } else {
      diffMinutesToNextHour = 60 - currentMinutes;
      diffHourToNextAlarm = 24 - (currentHours + 1);
      finalMillToNextTime = 1000*(diffMinutesToNextHour * 60 + (diffHourToNextAlarm + notificationTime) * 60 * 60);
    }

    chrome.alarms.onAlarm.addListener(fireNotification);
    chrome.alarms.create("notify", {
      "when" : Date.now() + finalMillToNextTime,
      "periodInMinutes" : 1440,
    });
  }

  function deleteNotification() {
     chrome.alarms.clear("notify", function(result){});
  }

  function fireNotification(alarm) {
    createNotification();
  }

  function createNotification() {
    var options = {};
    options["type"] = "list";
    options["title"] = "Current Times";
    options["message"] = "Here are your current times:";
    options["iconUrl"] = "icons/icon16.png";
    options["items"] = [];

    var sites = App.TimesController.getCurrentData();
    for (var site in sites) {
      var currentSite = sites[site];
      console.log(currentSite);
      var formattedTime = App.TimesController.formatTime(currentSite.totalTime);
      options["items"].push({title: currentSite.host, message: formattedTime});
    }

    chrome.notifications.create('', options, function(){});
  }

  return { 
    init: init,
    setNotificationTime: setNotificationTime,
    setNotificationStatus: setNotificationStatus,
    scheduleNotification: scheduleNotification,
    createNotification: createNotification,
  };

})();