'use strict';

var DEBUG_MODE = 0;

$(document).ready(function() {
	if(DEBUG_MODE == 1) {
		$('.app').first().append('<div id="debug"></div>');
		

		if (typeof console  != "undefined") 
			if (typeof console.log != 'undefined')
				console.olog = console.log;
			else
				console.olog = function() {};

			console.log = function(message) {
				console.olog(message);
				$('#debug').prepend('<p>' + message + '</p>');
			};
			console.error = console.debug = console.info =  console.log

		}
	})

var debug = function(txt) {
	var debug = $('#debug');
	debug.append('<p>' + txt + '</p>');

	if(debug.children().size() > 50) {
		debug.children().first().remove();
	}
}

function errorHandler() { console.log("An error occurred"); }

Date.prototype.today = function () { 
	return ((this.getDate() < 10)?"0":"") + this.getDate() +"_"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"_"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
	return ((this.getHours() < 10)?"0":"") + this.getHours() + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

Date.timestamp = function() {
	var date = new Date();
	return date.timeNow()+date.today();
}

// Compare one song to another to sort them by type
function compare(a, b) {
	if (a.type < b.type)
		return -1;
	else if (a.type > b.type)
		return 1;
	else 
		return 0;
}