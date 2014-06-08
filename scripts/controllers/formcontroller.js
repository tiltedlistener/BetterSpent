/**
 * FormController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.FormController = (function () {

  var form,
      deleteForm,
      addForm,
      dataService;

  /**
   * Get view object references and apply handlers
   */
  function init() {
    form = $('#form');
    deleteForm = $('#delete-site');
    addForm = $('#add-site');
    dataService = new App.Data();

    applySubmitHandlers();
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

  function switchToDeleteMode() {
    deleteForm.addClass('active');
    addForm.removeClass('active');
  }

  function switchToAddMode() {
    deleteForm.removeClass('active');
    addForm.addClass('active');
  }

  return { 
    init: init,
    switchToDeleteMode: switchToDeleteMode
  };

})();