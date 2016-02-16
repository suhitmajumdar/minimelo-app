define(function( require ) {

	'use strict';

	var Timeline      = require('app/Timeline');
	var SoundElements = require('ui/SoundElements');
	var CollectionUi  = require('ui/CollectionUi');

	function UiHandler() {
		this.soundElements = null;
		this.collectionUi  = null;
	}

	UiHandler.prototype.initUI = function () {
		this.initTimelineHeight();
		this.initTracks();
		this.initRecorder();
		Timeline.setTimelapse();
	} 

	UiHandler.prototype.initCollectionManager = function () {
		this.collectionUi = new CollectionUi();
	}

	UiHandler.prototype.reloadSoundElements = function () {
		this.soundElements.reload();
	}

	UiHandler.prototype.initSoundElements = function() {
		this.soundElements = new SoundElements();
	}

	UiHandler.prototype.hideLoader = function() {
		$( ".loader" ).fadeOut( "medium" );
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

	UiHandler.prototype.initRecorder = function(){
		$('#canvasRecord').attr('width',$('#recordScreen').width());
		$('#canvasRecord').attr('height',$('#recordScreen').height());
	}

	return UiHandler;

});
