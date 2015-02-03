/**
 * Bootstrap. Application starts here. 
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
document.addEventListener('DOMContentLoaded', function () {

	// Gets all objects and sets behaviors
 	App.ContentsController.init();	
 	App.FormController.init();	 
 	App.ListController.init();
 	App.UserSettingsController.init();

 	// TODO put in form controller
 	// Update form display
 	var data = new App.Data();
 	data.testForSiteAlreadySelected();

 	// Update current date
 	data.setCurrentDate();

 	// Display
	App.ListController.buildLists();
});