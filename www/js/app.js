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

	require(['app/Timeline', 'app/Utils', 'ui/UiHandler', 'events/EventsHandler', 'app/ResourcesHandler', 'app/Record'], 
		function(Timeline, Utils, UiHandler, EventsHandler, ressources, Record) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
			},

			onDeviceReady : function () {

				var uiHandler = new UiHandler();
				var record    = new Record();

				ressources.loadSongs().then(function(data) {
					uiHandler.initSoundElements();
				});

				var eventsHandler = new EventsHandler(uiHandler, record);
				uiHandler.initUI();

			}
		};


		application.onDeviceReady();
	});


});
