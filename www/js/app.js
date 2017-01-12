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

var audioCtx = new AudioContext();

$(document).ready(function() {

	require(['app/Timeline', 'app/Utils', 'ui/UiHandler', 'events/EventsHandler', 'app/ResourcesHandler'],
		function(Timeline, Utils, UiHandler, EventsHandler, Resources) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
        document.addEventListener("pause", this.onDevicePaused, false);
			},

			onDeviceReady : function () {

				var uiHandler = new UiHandler();
				var eventsHandler = new EventsHandler(uiHandler); // todo :init this after load songs to avoid spending more time

				Resources.filesHandler.initDefaultsSongs().then(function(){

					Resources.filesHandler.loadSongs(Resources.songs).then(function(data) {
						Resources.postProcessing();
						uiHandler.initSoundElements();
						eventsHandler.initSoundEvents();
						uiHandler.hideLoader();
					});

				});

				uiHandler.initUI();

			},

      onDevicePaused : function () {
        Timeline.stop();
      }

		};

		application.init();
	});


});
