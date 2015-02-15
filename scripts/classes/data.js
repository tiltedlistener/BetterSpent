/**
 * Data: save user stats and app state. 
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.Data = function () {

	this._cachedOpenSites = null;

	/**
	*	Sets the current date to see if we need to wipe the 
	*	"today" times and send those times to historical times.
	*/
	this.setCurrentDate = function() {
		var d = new Date();
		var dayNum = d.getDate();

		var that = this;
		chrome.storage.local.get("currentDate", function(item) {
			var date = item["currentDate"];
			if (date !== undefined) {
				if (date !== dayNum) {
					that.wipeOldDates();
				} 
			}
			chrome.storage.local.set({"currentDate" : dayNum});
		});		
	}

	// Clears the current date counts
	this.wipeOldDates = function () {
		chrome.storage.local.get("sites", function(item) {
			var sites = item["sites"];
			if (sites == undefined) {
				sites = {};
			}

			for (var key in sites) {
				sites[key].timeToday = 0;
			}
			
			chrome.storage.local.set({"sites" : sites});
		});
	}

	// This is a bit redundant, however, I'd like to avoid too much visual nesting
	this.addSite = function() {
		var that = this;
		chrome.storage.local.get("currentSite", function(site) {
			var host = that.gethost(site["currentSite"]);
			that.saveSite(host);
		});		
	}

	this.removeSite = function() {
		var that = this;		
		chrome.storage.local.get("currentSite", function(site) {
			var host = that.gethost(site["currentSite"]);			
			that.deleteSite(host);
		});
	}	

	this.saveSite = function(site) {
		chrome.storage.local.get("sites", function(item) {
			var sites = item["sites"];
			if (sites == undefined) {
				sites = {};
			}

			var siteObj = new App.Site();
			sites[site] = siteObj;
			chrome.storage.local.set({"sites" : sites});
		});
	}

	this.deleteSite = function(site) {
		chrome.storage.local.get("sites", function(item) {
			var sites = item["sites"];
			delete sites[site]
			chrome.storage.local.set({"sites" : sites});
		});		
	}

	/**
	*	Properly build out our html display
	*/
	this.getDataAndBuild = function(htmlBuilder) {
		var that = this;
		chrome.storage.local.get("sites", function(sites) {
			chrome.storage.local.get("tabs", function(tabs) {
				if (sites !== undefined) {
					var updatedSites = that.testWhichTabsAreOpen(sites["sites"], tabs["tabs"]);
					htmlBuilder.buildListWithData(updatedSites);
				}
			});
		});
	}

	/**
	*	This allows us to see the updated time as we open and close the extension
	* 	for sites that are curently open. Meaning, time updates as we go. 
	*/
	this.testWhichTabsAreOpen = function (sites, tabs) {
		for(var tabKey in tabs){
			for (var siteKey in sites) {
				var curHost = tabs[tabKey]["host"];
				if(siteKey == curHost) {
					var updateTime = this.getUpdatedTime(tabs[tabKey]["accessTime"], sites[siteKey]["totalTime"]),
						updateTimeToday = this.getUpdatedTime(tabs[tabKey]["accessTime"], sites[siteKey]["timeToday"]);
					sites[siteKey]["totalTime"] = updateTime;
					sites[siteKey]["timeToday"] = updateTimeToday;				
				}
			}
		}
		this._cachedOpenSites = sites;
		return sites;
	};

	this.getUpdatedTime = function(lastAccess, totalTime) {
		return (Date.now() - lastAccess) + totalTime;
	};

	this.getOpenTabs = function() {	
		return this._cachedOpenSites;
	};
	
	/**
	*	Test if we should show the remove button on a site that is already in our list. 
	*/
	this.testForSiteAlreadySelected = function () {
		var that = this;
		chrome.storage.local.get("currentSite", function(currentSite) {
			if(currentSite !== undefined) {
				chrome.storage.local.get("sites", function(data) {
					var sites = data["sites"];
					if (sites !== undefined) {
						var host = that.gethost(currentSite["currentSite"]);
						if (sites[host] !== undefined)
							App.TimesController.switchToDeleteMode();
					}
				});
			}
		});		
	}

	this.gethost = function(href) {
	    var l = document.createElement("a");
	    l.href = href;
	  	l = l.hostname.replace('www.', '');
	  	return l;
	};


}