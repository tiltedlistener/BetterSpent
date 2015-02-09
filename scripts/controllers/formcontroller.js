/**
 * FormController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.FormController = (function () {

  // Form Components
  var form;
  var deleteForm;
  var addForm;
  
  // Navigation components
  var slides;                         // Main slides
  var navButtons;                     // Buttons to control transition
  var statsSlides;
  var statsHeaderOptions;

  // Service tools
  var dataService;

  /**
   * Get view object references and apply handlers
   */
  function init() {
    form = $('#form');
    deleteForm = $('#delete-site');
    addForm = $('#add-site');
    navButtons = $(".nav-button");
    slides = $(".slide");
    statsSlides = $('#stats .inner-slide');
    statsHeaderOptions = $('.header-icon');

    dataService = new App.Data();

    applySubmitHandlers();
    applyClickToNavButtons();
  }

  function applySubmitHandlers() {
    $('.save-site-submit').click(function(event) {
        dataService.addSite();
        switchToDeleteMode();
        setTimeout(function () { App.ListController.buildLists(); }, 500);
    });

    $('.delete-site-submit').click(function(event){
        dataService.removeSite();
        switchToAddMode();
        setTimeout(function () { App.ListController.buildLists(); }, 500);
    });
  }

  function applyClickToNavButtons() {
    navButtons.click(navButtonClicked);
    statsHeaderOptions.click(statOptionClicked);
  }

  function switchToDeleteMode() {
    deleteForm.addClass('active');
    addForm.removeClass('active');
  }

  function switchToAddMode() {
    deleteForm.removeClass('active');
    addForm.addClass('active');
  }

  function navButtonClicked(event) {
    var clicked = $(event.target);
    if (!clicked.hasClass('active')) {
      $('.nav-button.active').removeClass('active');
      $('.slide.active').removeClass('active');
      var slideName = clicked.attr("meta-slide");
      $('#' + slideName).addClass('active');
      clicked.addClass('active');
    }
  }

  function statOptionClicked(event) {
    var clicked = $(event.target);
    if (!clicked.hasClass('active')) {
      $('.header-icon.active').removeClass('active');
      $('#stats .inner-slide.active').removeClass('active');

      var slideChoice = clicked.attr('meta-slide');
      $('#' + slideChoice).addClass('active');
      clicked.addClass('active');
    }
  }

  return { 
    init: init,
    switchToDeleteMode: switchToDeleteMode
  };

})();