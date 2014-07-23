/**
 * NavController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.NavController = (function () {

  var slides,                         // Main slides
      navButtons,                     // Buttons to control transition
      statsSlides,
      statsHeaderOptions;

  /**
   * Get view object references and apply handlers
   */
  function init() {
    navButtons = $(".nav-button");
    slides = $(".slide");
    statsSlides = $('#stats .inner-slide');
    statsHeaderOptions = $('.header-icon');

    applyClickToNavButtons();
  }

  /**
   * Apply click behavior
   */
  function applyClickToNavButtons() {
    navButtons.click(navButtonClicked);
    statsHeaderOptions.click(statOptionClicked);
  }

  /**
   * Move between the slides of the application
   * @param  {event} event click event
   */
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
    init: init
  };

})();