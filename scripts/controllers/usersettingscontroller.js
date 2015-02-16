/**
 * ContentsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.UserSettingsController = (function () {

  // Form Items
  var userEmail;
  var userAlertType;
  var timeOfDayOption;
  var hourOfDayOption;
  var formTimeOptionsGroup;

  // Buttons
  var submitButton;
  var submitNotice;

  // User Values
  var email = "false@emaile.com";
  var alertType = "yes";
  var hourOption;
  var timeOption;

  // Error Support
  var errorDisplay;

  function init() {
    userEmail = $('input[name="user-email"]');
    userAlertType = $('input[name="alerttype"]');
    submitButton = $('.submit-user-info');
    errorDisplay = $('.error');
    submitNotice = $('.submitted-notice');
    timeOfDayOption = $('.time-of-day-option');
    hourOfDayOption = $('.hour-option');
    formTimeOptionsGroup = $('.form-time-options-group');

    prepareSettingsDisplay();
    applyClickHandlers();
  }

  function applyClickHandlers() {
    submitButton.click(submitUserInfo);
    userAlertType.click(updateAlertState);
  }

  function updateAlertState(event) {
    var currentAlert = userAlertType.where(":checked").val();
    showOrHideHoursOptions(currentAlert);
  }

  function submitUserInfo() {
    var currentEmail = userEmail.val();
    var currentAlert = userAlertType.where(":checked").val();

    if (validateEmail(currentEmail)) {
      email = currentEmail;
      alertType = currentAlert;
      hourOption = hourOfDayOption.val();
      timeOption = timeOfDayOption.val();
      displayUpdatingStatus();
      saveUserSettings();
    } else {
      displayError("Please enter a valid email address");
    }
  }

  function displayError(msg) {
    errorDisplay.html(msg);
    errorDisplay.slideDown();

    setTimeout(function() {
      errorDisplay.slideUp();
    }, 2000);
  }

  function displayUpdatingStatus() {
    submitButton.addClass("submitting");
    submitNotice.fadeIn();
  }

  function removeUpdatingStatus() {
    submitButton.removeClass("submitting");
    submitNotice.fadeOut();
  }

  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } 

  function saveUserSettings() {
    chrome.storage.local.get("settings", function(item) {
      var settings = item["settings"];
      if (settings == undefined) {
        settings = {};
      }

      settings["email"] = email;
      settings["alertType"] = alertType;
      settings["dismissedValue"] = App.BetterSpentsController.getDismissedValue();
      settings["timeOption"] = timeOption;
      settings["hourOption"] = hourOption;

      removeUpdatingStatus();

      chrome.storage.local.set({"settings" : settings});

      App.NotificationsController.setNotificationTime(hourOption, timeOption);

      if(alertType == 'yes') {
        App.NotificationsController.setNotificationStatus(true); 
      } else {
        App.NotificationsController.setNotificationStatus(false);
      }
    });
  }

  function prepareSettingsDisplay() {
    chrome.storage.local.get("settings", function(item) {
      var settings = item["settings"];
      if (settings !== undefined) {

        email = settings["email"];
        alertType = settings["alertType"];

        userEmail.val(email);
        userAlertType.each(function() {
          if ($(this).val() == alertType) {
            $(this).prop('checked', true);
          }
        }); 
        timeOfDayOption.val(settings["timeOption"]);
        hourOfDayOption.val(settings["hourOption"]);
      } else {
        var d = new Date();
        var hours = d.getHours();

        if (hours > 12) {
          hours -= 12;
          timeOfDayOption.val("pm");
        } else {
          timeOfDayOption.val("am");
        }
        hourOfDayOption.val(hours);
      }
      showOrHideHoursOptions(alertType);
    });
  }

  function showOrHideHoursOptions(alertType) {
    if(alertType == 'yes') {
      formTimeOptionsGroup.show();
    } else {
      formTimeOptionsGroup.hide();
    }
  }

  return { 
    init: init,
  };

})();