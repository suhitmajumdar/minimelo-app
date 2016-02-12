define(function( require ) {

	'use strict';

	var SoundElements = require('ui/SoundElements');
	var Timeline 	  = require('app/Timeline');

	function UiHandler() {
		this.soundElements = null;
	}

	UiHandler.prototype.initUI = function () {
		this.initTimelineHeight();
		this.initTracks();
		this.initRecorder();
		this.hideLoader();
	} 

	UiHandler.prototype.initSoundElements = function() {
		this.soundElements = new SoundElements();
	}

	UiHandler.prototype.hideLoader = function() {
		$( ".loader" ).fadeOut( "slow" );
	}

	UiHandler.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();

		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiHandler.prototype.initTracks = function () {
		$('.track').css('width', Timeline.getDurationInPx());
	}

	UiHandler.prototype.addSongTotrack = function(songButton, track, xOntrack)
	{
		return this.soundElements.addSongTotrack(songButton, track, xOntrack);
	}

	UiHandler.prototype.initRecorder=function(){
		
		$('#canvasRecord').attr('width',$('#recordScreen').width());
		$('#canvasRecord').attr('height',$('#recordScreen').height());

	}

	return UiHandler;

});
