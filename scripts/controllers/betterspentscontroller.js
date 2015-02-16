/**
 * BetterSpentsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */

/**
* Note: "spents" is the data lingo for Better Spent entries
*/
App.BetterSpentsController = (function () {

  // Settings booleans
  var tutorialDismissed = false;

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
    // Initialize Variables
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

    // Setup display
    checkIfTutorialShouldDisplay();
    initializeBetterSpent();
    displayBetterSpentEntries();

    // Set behaviors
    applyClickHandlers();
  }

  function checkIfTutorialShouldDisplay() {
    chrome.storage.local.get("settings", function(item) {
      var settings = item["settings"];
      if (settings !== undefined) {
        if (settings["dismissedValue"] !== undefined) {
          setDismissedValue(settings["dismissedValue"]);
          if (tutorialDismissed) dismissTutorial();
        }
      }
    });
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
      saveDismissedValue();
    });
  }

  function showBetterSpentForm() {
    betterSpentMainGroup.animate({"min-height": "250px"}, 500);
    betterSpentForm.animate({left : '0'}, 500);
  }

  function hideBetterSpentForm() {
    betterSpentForm.animate({left : '100%'}, 500, function () {
      betterSpentMainGroup.animate({"min-height": "0px"}, 500);
      resetForm();
    });
  }

  function addBetterSpentItem() {
    textValue = betterSpentTextInput.val().trim();
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

  function resetForm() {
    textValue = null;
    timeValue = null;

    betterSpentTextInput.val('');
    betterSpentTimeInput.where(":checked").attr("checked", false);
    betterSpentTimeInput.eq(0).prop("checked", true);
  }

  function saveBetterSpentEntry() {
    chrome.storage.local.get("spents", function(item) {
      var spents = item["spents"];
      if (spents == undefined) {
        spents = {}
      } 

      var newItem = new App.SpentListItem();
      var newId = Object.keys(spents).length;

      newItem.index = newId;
      newItem.text = textValue;
      newItem.timeValue = timeValue;
      spents[newId] = newItem;

      chrome.storage.local.set({"spents" : spents}, function () {
        displayBetterSpentEntries();
        hideBetterSpentForm();
      });    
    });
  }

  /**
  * Display Better Spent entries 
  */
  function displayBetterSpentEntries() {
    chrome.storage.local.get("spents", function(item) {
      var spents = item["spents"];
      if (spents !== undefined) {
        var indices = Object.keys(spents);

        if (indices.length > 0) {

          var html = '';
          for (var i = 0, len = indices.length; i < len; i++) {
            html += generateHtmlForSpentItem(spents[indices[i]]);
          }
          betterSpentList.html(html);
          applyDeleteBehavior();
        } else {
          betterSpentList.html("None added yet :)");
        }
      }   
    });
  }

  function generateHtmlForSpentItem(data) {
    var html = '<div class="better-spent-list-item">';
    html += '<div class="better-spent-list-item-delete button" meta-item="'+ data.index +'">Delete</div>';
    html += '<div class="better-spent-list-item-name">' + data.text + '</div>';
    html += '<div class="better-spent-list-item-time">Every ' + translateTimeValue(data.timeValue) + '</div>';
    html += '</div>';
    return html;
  }

  function translateTimeValue(time) {
    if (time == '10') return '10 min';
    if (time == '30') return '30 min';
    if (time == '60') return '1 hour';
  }

  function applyDeleteBehavior() {
    $('.better-spent-list-item-delete').bind('click', deleteSpentEntryPushed);
  }

  function removeDeleteBehavior() {
    $('.better-spent-list-item-delete').unbind('click');
  }

  function deleteSpentEntryPushed(event) {
    var target = $(event.target);
    var index = target.attr('meta-item');
    var targetParent = target.closest(".better-spent-list-item");

    targetParent.addClass('deleting');
    setTimeout(function() {
      targetParent.slideUp('fast', function() {
        targetParent.remove();
        deleteBetterSpentEntry(index);
      });
    }, 500);
  }

  function deleteBetterSpentEntry(index) {
    chrome.storage.local.get("spents", function(item) {
      var spents = item["spents"];
      if (spents !== undefined) {
        delete spents[index];

        var newSpents = {};
        var indices = Object.keys(spents);

        for (var i=0, len = indices.length; i < len; i++) {
          var currentObj = spents[indices[i]];
          currentObj.index = i;
          newSpents[i] = currentObj;
        }

        chrome.storage.local.set({"spents" : newSpents}, function () {
          displayBetterSpentEntries();
        });   
      }   
    });
  }

  /**
  * Initialize the Better Spent entries
  */
  function initializeBetterSpent() {
    chrome.storage.local.get("spents", function(item) {
      var spents = item["spents"];
      if (spents === undefined) {

        var spents = initialSpents();

        chrome.storage.local.set({"spents" : spents}, function () {
          displayBetterSpentEntries();
        });   
      }   
    });
  }

  function initialSpents() {
    var tempSpents = {};

    var spentItem = new App.SpentListItem();
    spentItem.index = 0;
    spentItem.timeValue = '10';
    spentItem.text = "Read 8 pages in a novel";
    tempSpents[spentItem.index] = spentItem;

    spentItem = new App.SpentListItem();
    spentItem.index = 1;
    spentItem.timeValue = '30';
    spentItem.text = "Study a foreign language";
    tempSpents[spentItem.index] = spentItem;   

    spentItem = new App.SpentListItem();
    spentItem.index = 2;
    spentItem.timeValue = '60';
    spentItem.text = "Cook a meal at home";
    tempSpents[spentItem.index] = spentItem;   

    return tempSpents;
  }

  /**
  * Support Methods
  */
  function getDismissedValue() {
    return tutorialDismissed;
  }

  function setDismissedValue(val) {
    tutorialDismissed = val;
  }

  function saveDismissedValue() {
    chrome.storage.local.get("settings", function(item) {
      var settings = item["settings"];
      if (settings == undefined) {
        settings = {};
      }

      settings["dismissedValue"] = getDismissedValue();
      chrome.storage.local.set({"settings" : settings});
    });
  }

  return { 
    init: init,
    getDismissedValue: getDismissedValue
  };

})();