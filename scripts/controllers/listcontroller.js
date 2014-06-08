/**
 * ListController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.ListController = (function () {

	var htmlBuilder,
		todaySection,
		historicalSection,
		data;

	function init() {
		data = new App.Data();
		htmlBuilder = new App.HTMLBuilder();

		todaySection = $('#current .inner');
		historicalSection = $('#historical .inner');

		htmlBuilder.setHistoricalSection(historicalSection);
		htmlBuilder.setTodaySection(todaySection);
	}

	function buildLists() {
 		data.getDataAndBuild(htmlBuilder);
	}

	return { 
		init: init,
		buildLists: buildLists,
	};

})();