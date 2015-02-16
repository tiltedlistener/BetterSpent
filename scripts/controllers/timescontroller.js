/**
 * TimesController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.TimesController = (function () {

  // Form Components
  var deleteForm;
  var addForm;
  
  // Navigation components
  var slides;                         
  var timesSlides;
  var timesHeaderBtns;

  // Slide components
  var todaySection;
  var historicalSection;

  // Service tools
  var dataService;
  var htmlBuilder;

  /**
   * Get view object references and apply handlers
   */
  function init() {
    deleteForm = $('#delete-site');
    addForm = $('#add-site');
    slides = $(".slide");
    timesSlides = $('#times .inner-slide');
    timesHeaderBtns = $('.header-icon');

    todaySection = $('#current .inner');
    historicalSection = $('#historical .inner');

    dataService = new App.Data();
    htmlBuilder = new App.HTMLBuilder();

    applySubmitHandlers();

    initHtmlBuilder();
    initData();
  }

  function initHtmlBuilder() {
    htmlBuilder.setHistoricalSection(historicalSection);
    htmlBuilder.setTodaySection(todaySection);
  }

  function initData() {
    dataService.testForSiteAlreadySelected();
    dataService.setCurrentDate();
    dataService.getDataAndBuild(htmlBuilder);
  }

  function applySubmitHandlers() {
    $('.save-site-submit').click(function(event) {
        dataService.addSite();
        switchToDeleteMode();
        setTimeout(function () { buildLists(); }, 250);
    });

    $('.delete-site-submit').click(function(event){
        dataService.removeSite();
        switchToAddMode();
        setTimeout(function () { buildLists(); }, 250);
    });

    timesHeaderBtns.click(changeTimeDisplay);
  }

  function switchToDeleteMode() {
    deleteForm.addClass('active');
    addForm.removeClass('active');
  }

  function switchToAddMode() {
    deleteForm.removeClass('active');
    addForm.addClass('active');
  }

  function buildLists() {
    dataService.getDataAndBuild(htmlBuilder);
  }

  function changeTimeDisplay(event) {
    var clicked = $(event.target);
    if (!clicked.hasClass('active')) {
      $('.header-icon.active').removeClass('active');
      $('#times .inner-slide.active').removeClass('active');

      var slideChoice = clicked.attr('meta-slide');
      $('#' + slideChoice).addClass('active');
      clicked.addClass('active');
    }
  }

  /**
  * Module support methods
  */
  function getCurrentData() {
    var sites = dataService.getOpenTabs();
    return sites;
  }

  function clearSitesData() {
    dataService.clearSitesData();
  }

  function formatTime(time) {
    return htmlBuilder.formatTime(time);
  }

  return { 
    init: init,
    switchToDeleteMode: switchToDeleteMode, 
    getCurrentData: getCurrentData,
    clearSitesData: clearSitesData,
    formatTime: formatTime
  };

})();