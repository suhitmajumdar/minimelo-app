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
