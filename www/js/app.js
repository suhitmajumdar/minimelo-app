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
		function(Timeline, Utils, UiHandler, EventsHandler, Resources, Record) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
			},

			onDeviceReady : function () {

				var uiHandler = new UiHandler();
				var record    = new Record();
				var eventsHandler = new EventsHandler(uiHandler, record); // todo :init this after load songs to avoid spending more time 

				Resources.filesHandler.loadSongs(Resources.songs).then(function(data) {
					Resources.postProcessing();
					uiHandler.initSoundElements();
					eventsHandler.soundEvents.initEventsButtonsSong();
					uiHandler.hideLoader();

					$("*[data-dismiss=modal]").trigger( "click" );
					$("#general-menu-button").trigger( "click");
					$("[menu=manage-menu]").trigger( "click");
				});

				
				uiHandler.initUI();

			}
		};

		application.init();
	});


});
