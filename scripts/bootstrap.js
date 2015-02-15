/**
 * Bootstrap. Application starts here. 
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
document.addEventListener('DOMContentLoaded', function () {
 	App.ContentsController.init();	
 	App.TimesController.init();	 
 	App.UserSettingsController.init();
 	App.BetterSpentsController.init();
 	App.StatsController.init();
 	App.NotificationsController.init();
});