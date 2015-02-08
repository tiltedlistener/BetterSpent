/**
 * ContentsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.ContentsController = (function () {

  // Top Nav buttons
  var homeButton;

  // Inner content buttons
  var contentsList,
      contentItem;

  // Utitlity Variables
  var pages;

  // State Vars
  var currentPage = 'user-settings';

  function init() {
    homeButton = $('.contents-page-button');

    contentsList = $('.contents-list');
    contentItem = $('.contents-item');

    pages = $('.page');

    applyClickHandlers();
  }

  function applyClickHandlers() {
    contentItem.click(navigateToContentPage);
    homeButton.click(gotoContentsPage);
  }

  function navigateToContentPage(event) {
    var target = $(event.target),
        page = target.attr('meta-page');

    pages.removeClass('active');
    $('.page.' + page).addClass('active');

    currentPage = page;
  }

  function gotoContentsPage() {
    if (currentPage != 'contents') {
      pages.removeClass('active');
      $('.page.contents').addClass('active');
    }
  }

  return { 
    init: init
  };

})();