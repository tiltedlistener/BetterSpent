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
  
    submitButton = $('#submit-user-info');

    errorDisplay = $('.error');

    applyClickHandlers();
  }

  function applyClickHandlers() {
    submitButton.click(submitUserInfo);
  }

  function submitUserInfo() {
    var currentEmail = userEmail.val();
    var currentAlert = userAlertType.where(":checked").val()

    if (validateEmail(currentEmail)) {
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

  }


  return { 
    init: init
  };

})();