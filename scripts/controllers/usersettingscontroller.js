/**
 * ContentsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.UserSettingsController = (function () {

  // Form Items
  var userEmail,
      userAlertType;

  // Buttons
  var submitButton;

  // User Values
  var email,
      alertType;

  // Error Support
  var errorDisplay;

  function init() {
    userEmail = $('input[name="user-email"]');
    userAlertType = $('input[name="alerttype"]');
    submitButton = $('.submit-user-info');
    errorDisplay = $('.error');

    prepareSettingsDisplay();
    applyClickHandlers();
  }

  function applyClickHandlers() {
    submitButton.click(submitUserInfo);
  }

  function submitUserInfo() {
    var currentEmail = userEmail.val();
    var currentAlert = userAlertType.where(":checked").val()

    if (validateEmail(currentEmail)) {
      email = currentEmail;
      alertType = currentAlert;
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

      chrome.storage.local.set({"settings" : settings});
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
      }
    });
  }

  return { 
    init: init,
  };

})();