requirejs.config({
	baseUrl: 'lib',
	paths: {
		app: '../js/app',
		lib: '../js/lib',
		events: '../js/app/events',
		ui: '../js/app/ui',
		impl: '../js/app/impl'
	}
});

$(document).ready(function() {

	require(['app/Timeline', 'app/Utils', 'ui/UiHandler', 'events/EventsHandler', 'app/ResourcesHandler', 'app/Record','app/Export'], 
		function(Timeline, Utils, UiHandler, EventsHandler, Resources, Record, Export) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
			},

			onDeviceReady : function () {

				var uiHandler = new UiHandler();
				var eventsHandler = new EventsHandler(uiHandler); // todo :init this after load songs to avoid spending more time


				Resources.filesHandler.initDefaultsSongs().then(function(){
					
					Resources.filesHandler.loadSongs(Resources.songs).then(function(data) {
						Resources.postProcessing();
						uiHandler.initSoundElements();
						eventsHandler.soundEvents.initEventsButtonsSong();
						uiHandler.hideLoader();
					});

				});
				
				uiHandler.initUI();

			}
		};

		application.init();
	});


});
