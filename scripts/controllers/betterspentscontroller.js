/**
 * BetterSpentsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.BetterSpentsController = (function () {

  // Settings booleans
  var tutorialDismissed = true;

  // Controls
  var tutorialDismissBtn;
  var tutorialDisplay;
  var betterSpentForm;
  var betterSpentFormError;
  var betterSpentMainGroup;
  var betterSpentList;
  var startBetterSpentFormBtn;
  var endBetterSpentFormBtn;
  var addBetterSpentItemBtn;

  // Form Components
  var betterSpentTextInput;
  var betterSpentTimeInput;

  // Form values
  var textValue = null;
  var timeValue = null;

  function init() {
    tutorialDismissBtn = $('.tutorial-dismiss');
    tutorialDisplay = $('.tutorial');
    betterSpentMainGroup = $('.better-spent-main-group');
    betterSpentForm = $('.better-spent-form');
    betterSpentFormError = $('.better-spent-error');
    betterSpentList = $('.better-spent-list-inner');
    startBetterSpentFormBtn = $('.start-better-spent-addition');
    endBetterSpentFormBtn = $('.abort-better-spent-add');
    addBetterSpentItemBtn = $('.add-better-spent');

    betterSpentTextInput = $('.better-spent-text');
    betterSpentTimeInput = $('input[name="timeinterval"]');

    checkIfTutorialShouldDisplay();

    applyClickHandlers();
  }

  function checkIfTutorialShouldDisplay() {
    if (tutorialDismissed) dismissTutorial();
  }

  function applyClickHandlers() {
    tutorialDismissBtn.click(dismissTutorial);
    startBetterSpentFormBtn.click(showBetterSpentForm);
    endBetterSpentFormBtn.click(hideBetterSpentForm);
    addBetterSpentItemBtn.click(addBetterSpentItem);
  }

  function dismissTutorial() {
    tutorialDisplay.fadeOut(500, function() {
      betterSpentMainGroup.fadeIn();
      tutorialDismissed = true;
    });
  }

  function showBetterSpentForm() {
    betterSpentForm.animate({left : '0'}, 500);
  }

  function hideBetterSpentForm() {
    betterSpentForm.animate({left : '100%'}, 500, function () {
      resetForm();
    });
  }

  function addBetterSpentItem() {
    textValue = betterSpentTextInput.val().trim();
    console.log(textValue);
    timeValue = betterSpentTimeInput.where(":checked").val();

    if (validateForm()) {
      saveBetterSpentEntry();
    } else {
      displayFormError();
    }
  }

  function validateForm() {
    if ((textValue !== null && textValue.length > 0) && 
      (timeValue !== null)) {
      return true;
    } else {
      return false;
    }
  }

  function displayFormError() {
    betterSpentFormError.html("Your form is incomplete, please try again.");
    betterSpentFormError.fadeIn('fast');
    setTimeout(hideFormError, 1000);
  }

  function hideFormError() {
    betterSpentFormError.html("");
    betterSpentFormError.fadeOut('fast');    
  }

  function saveBetterSpentEntry() {

    
    
    hideBetterSpentForm();
  }

  function resetForm() {
    textValue = null;
    timeValue = null;

    betterSpentTextInput.val('');
    betterSpentTimeInput.where(":checked").attr("checked", false);
    betterSpentTimeInput.eq(0).prop("checked", true);
  }

  return { 
    init: init
  };

})();