/**
 * Chrome Event Listeners
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete') {
		getAllTabs();
	}
	setCurrentDate();

	// Save current site regardless
	chrome.storage.local.set({"currentSite": tab.url});
});

chrome.tabs.onHighlighted.addListener(function (highlightInfo){
	chrome.tabs.get(highlightInfo["tabIds"][0] , function(result){
		chrome.storage.local.set({"currentSite":result.url});
	});
});

chrome.tabs.onRemoved.addListener(function(tabId, info) {
	removeTabs(tabId);
});

/**
* 	Action Methods
*/
var removeTabs = function (tabId) {
	chrome.storage.local.get("tabs", function(data){
		var tabs = data["tabs"];
		if (tabs != undefined) {
			if (tabs[tabId] != undefined) {
				processTabs([tabs[tabId]]);
				delete tabs[tabId];
				chrome.storage.local.set({"tabs": tabs});
			}			
		}
	});
};

var getAllTabs = function () {
	chrome.windows.getAll({"populate": true}, function(windows) {
		var tabUrls = [];
		var windowLength = windows.length;
		var tabCount = 0;

		for (var i=0; i<windowLength;i++) {
			var curTabs = windows[i]["tabs"],
				len = curTabs.length;

			for(var j=0;j<len;j++) {
				tabCount++;
				tabUrls.push(curTabs[j]);
			}
		}
		compareTabsAgainstSiteList(tabUrls, tabCount);
	});
};

var compareTabsAgainstSiteList = function(tabs, tabCount) {
	chrome.storage.local.get("sites", function(data) {
		var sites = data["sites"],
			tabsOfInterest = [],
			currentCount = 0;
		for (var siteKey in sites) {
			for(var i=0;i<tabCount;i++) {
				var curHost = getLocation(tabs[i]["url"]);
				if(siteKey == curHost) {
					currentCount++;
					tabs[i]["host"] = curHost;
					tabsOfInterest.push(tabs[i]);
				}
			}
		}
		if (currentCount > 0) {
			updateTabsRecords(tabsOfInterest, currentCount);
		}
	});
};

var updateTabsRecords = function(currentTabs, count) {
	chrome.storage.local.get("tabs", function(data) {
		var tabs = data["tabs"];
		if (tabs == undefined) {
			tabs = {};
		}
		var newTabList = whichTabsAreNewAndUpdated(currentTabs, tabs, count);
		console.log(newTabList);
		chrome.storage.local.set({"tabs": newTabList});
	});
};

var whichTabsAreNewAndUpdated = function(current, old, currentCount) {
	var newTabSet = {},
		sendForProcessing = [];

	for(var i=0;i<currentCount;i++) {
		var currentTab = current[i];
		// Concerns what's present currently
		if (old[currentTab["id"]] == undefined) {
			// Create new tab reference
			currentTab["accessTime"] = Date.now();
			newTabSet[currentTab["id"]] = currentTab;
		} else {
			if (old[currentTab["id"]]["url"] != currentTab["url"]) {
				// Remove tab and then reset to new tab information
				sendForProcessing.push(old[currentTab["id"]]);
				currentTab["accessTime"] = Date.now();
				newTabSet[currentTab["id"]] = currentTab;
			} else {
				newTabSet[currentTab["id"]] = old[currentTab["id"]];
			}
		}
	}
	processTabs(sendForProcessing);
	return newTabSet;
};

var processTabs = function(tabs) {
	chrome.storage.local.get("sites", function(data) {
		var sites = data["sites"];
		if (sites !== undefined) {
			for(var i=0,len=tabs.length;i<len;i++) {
				var endTime = Date.now(),
					startTime = tabs[i]["accessTime"],
					additionalTime = endTime - startTime;

				sites[tabs[i]["host"]]["totalTime"] += additionalTime;
				sites[tabs[i]["host"]]["timeToday"] += additionalTime;
			}
			chrome.storage.local.set({"sites": sites});			
		}
	});
};

var setCurrentDate = function() {
	var d = new Date(),
		dayNum = d.getDate();

	var that = this;
	chrome.storage.local.get("currentDate", function(item) {
		var date = item["currentDate"];

		if (!(date == undefined)) {
			if (date !== dayNum) {
				wipeOldDates();
			} 
		}
		chrome.storage.local.set({"currentDate" : dayNum});
	});		
};

// Clears the current date counts
var wipeOldDates = function () {
	chrome.storage.local.get("sites", function(item) {
		var sites = item["sites"];
		if (sites == undefined) {
			sites = {};
		}

		// Reset all times to zero
		for (var key in sites) {
			sites[key].timeToday = 0;
		}
		
		chrome.storage.local.set({"sites" : sites});
	});
};


/**
 * URL support methods
 */
// Cheap way to parse out the hostname
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname.replace('www.', '')
};