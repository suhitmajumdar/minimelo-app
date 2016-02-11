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

    require(['app/Timeline', 'app/Utils', 'ui/UiMini', 'events/EventsHandler', 'app/ResourcesHandler', 'app/Record'], function(Timeline, Utils, UiMini, EventsMini, ressources, Record) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
			},

			onDeviceReady : function () {

				var uiMini       = new UiMini();
				var record       = new Record();

				ressources.loadSongs().then(function(data){
					uiMini.initButtonsSongs();
					uiMini.initButtonsModal();
				});

				var eventsMini   = new EventsMini(uiMini, record);
				uiMini.initUI();

			}
		};


		application.onDeviceReady();
	});


});
