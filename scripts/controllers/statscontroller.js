/**
 * StatsController
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.StatsController = (function () {

  // Stats Components
  var statsList;

  // Data components
  var sitesData;
  var spentsData;
  var statsData = {};

  // Totals
  var totalTimeSpent = 0;

  function init() {
     statsList = $('.stats-list');

     buildStatsData();
  }

  /**
  * Data fetching
  */
  // Kick off build process
  // Callback for navigation click
  function buildStatsData() {
    fetchSites();
  }

  function fetchSites() {
    chrome.storage.local.get("sites", function(item) {
      var sites = item["sites"];
      if (sites == undefined) {
        sites = {};
      }
      sitesData = sites;
      fetchSpents();
    });
  }

  function fetchSpents() {
    chrome.storage.local.get("spents", function(item) {
      var spents = item["spents"];
      if (spents == undefined) {
        spents = {};
      }
      spentsData = spents;
      computeResults();
    });
  }

  function computeResults() {
    // Compute all our time
    for (var keySites in sitesData) {
      var current = sitesData[keySites];
      totalTimeSpent += current.totalTime;
    }

    // Then divide the total time by our spents
    for (var key in spentsData) {
      var currentSpent = spentsData[key];
      var timeInterval = getMsValueByReadableTime(currentSpent.timeValue);
      var timesAmount = parseInt(totalTimeSpent / timeInterval);

      if (timesAmount > 0) {
        statsData[key] = {
          "text" : currentSpent.text,
          "times" : timesAmount
        };
      }        
    }

    buildResultsList();
  }

  /**
  * Utility Methods
  */
  function getMsValueByReadableTime(time) {
    // 60000 is one minute in milliseconds
    if (time == '10') return 60000 * 10;
    if (time == '30') return 60000 * 30;
    if (time == '60') return 60000 * 60;
  }

  /**
  * HTML methods
  */
  function buildResultsList() {
    var html = '';
    for (var key in statsData) {
      var current = statsData[key];
      html += buildResultsItem(current);
    }
    statsList.html(html);
  }

  function buildResultsItem(data) {
    var html = '<div class="results-item">';
    html += buildResultsLabel(data.text);
    html += buildResultsCount(data.times);
    html += '</div>';
    return html;
  }

  function buildResultsLabel(label) {
    return '<div class="results-label">' + label + '</div>';
  }

  function buildResultsCount(times) {
    return '<div class="results-times">' + times + ' times</div>';
  }

  return { 
    init: init,
    buildStatsData: buildStatsData
  };

})();