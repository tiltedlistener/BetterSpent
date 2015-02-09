/**
 * HTML Builder
 * 
 * @author ckahler 'corey@ckplusplus.com' 
 * @version 1.0
 */
App.HTMLBuilder = function () {

	var HISTORICAL = 0,
		TODAY = 1;

	this.state = TODAY;
	this.data = [];						// Keeps track of the data from storage
	this.historicalSection = null;		// Keeps track of historical location
	this.todaySection = null;			// Keeps track of today location

	/**
	 * Set the HTML location where this stuff will be put
	 * @param  {jQuery Object} location HTML ojbect
	 * @return none
	 */
	this.init = function() {}

	/**
	 * Set the HTML location where this stuff will be put today's data
	 * @param  {jQuery Object} location HTML ojbect
	 * @return none
	 */	
	this.setTodaySection = function(section) {
		this.todaySection = section;
	}

	/**
	 * Set the HTML location where this stuff will be put for historical Data
	 * @param  {jQuery Object} location HTML ojbect
	 * @return none
	 */
	this.setHistoricalSection = function(section) {
		this.historicalSection = section;
	}	

	/**
	 * Update the state of the object
	 * @param {const} state  uses in class state constants
	 */
	this.setState = function(state) {
		this.state = state;
	}

	/**
	 * Conveience method for adding bulk data and building as one request
	 * @param  {object} data raw data from the database
	 */
	this.buildListWithData = function(data) {
		this.setState(HISTORICAL);
		this.setData(data);
		var list = this.buildList();
		this.historicalSection.html(list);
		
		this.setState(TODAY);
		var todayList = this.buildList();
		this.todaySection.html(todayList);
	}		

	/**
	 * Convenience method for adding a group of data at once. Like when booting.
	 * @param {object} bulkData raw data from the database
	 */
	this.setData = function (bulkData) {
		this.data = [];
		for (var key in bulkData) {
			this.addData(key, bulkData[key]);
		}
	}

	/**
	 * Adds a single row of data to the classes data holder
	 * @param {object} dataRow an object containing a single row of data
	 */
	this.addData = function(host, dataRow) {	
		dataRow['host'] = host;
		this.data.push(dataRow);
	}

	/**
	 * Creates the HTML List
	 * @return none     Will set HTML directly in APP body
	 */
	this.buildList = function() {
		var list = document.createElement('div');
		list.className = 'status-list';

		var len = this.data.length;
		for (var i=0;i<len;i++) {
			var row = this.buildRow(this.data[i]);
			list.appendChild(row);
		}
		return list;
	}

	/**
	 * Builds a row
	 * @param  {object} dataRow an object containing a single row of data
	 * @return {HTML}    formated list item
	 */
	this.buildRow = function(dataRow) {
		var row = document.createElement('div');
		row.className = 'status-item';

		var	timeData;
		if (this.state == HISTORICAL)
			timeData = dataRow.totalTime;
		else if (this.state == TODAY)
			timeData = dataRow.timeToday;

		var label = this.buildLabel(dataRow.host);
			time = this.buildTime(timeData);

		row.appendChild(label);
		row.appendChild(time);
		return row;
	}

	/**
	 * Builds the label identifying the site
	 * @param  {text} name name of site
	 * @return {HTML}      
	 */
	this.buildLabel = function(name) {
		var label = document.createElement('div');
		label.className = 'status-site';

		var textNode = document.createTextNode(name);
		label.appendChild(textNode);
		return label;
	}

	/**
	 * Builds the HTML representing time
	 * @param  {number} time number of milliseconds
	 * @return {HTML}        formatted html of time, in XX hours XX minutes
	 */
	this.buildTime = function(time) {
		var timeWrapper = document.createElement('div');
		timeWrapper.className = 'status-time';

		var formattedTime = this.formatTime(time),
			textNode = document.createTextNode(formattedTime);

		timeWrapper.appendChild(textNode);
		return timeWrapper;
	}

	/**
	 * Translates milliseconds into XX hours XX minutes
	 * @param  {int} milliseconds  The site's time spent.
	 * @return {text}              Formatted text in XX hours XX minutes
	 */
	this.formatTime = function(milliseconds) {
		var oneHour = 3600000,
			oneMin = 60000;

		var hours = parseInt(parseInt(milliseconds) / oneHour),
			timeMinusHours = milliseconds - (oneHour * hours),
			minutes = parseInt(timeMinusHours/oneMin);

		var text = '';
		if(hours > 0) {
			text += hours + " hour";
			text += this.checkForPlural(hours);
		}
		if(minutes > 0) {
			text += minutes + " minute";
			text += this.checkForPlural(minutes);
		}

		if (minutes == 0 && hours == 0) {
			text = "Less than minute";
		}

		return text;
	}

	/**
	 * Assistant function to add plural
	 * @param  {int} num Number to see if greater than 1
	 * @return {string}     An "s" or an empty space
	 */
	this.checkForPlural = function(num) {
		if (num > 1) {
			return "s ";
		} else {
			return " ";
		}
	}

};