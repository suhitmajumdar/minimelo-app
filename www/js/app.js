requirejs.config({
	baseUrl: 'lib',
	paths: {
		app: '../js/app',
		lib: '../js/lib',
		impl:'../js/app/impl',
	}
});

$(document).ready(function() {

    require(['app/Timeline', 'app/Utils', 'app/UiMini', 'app/EventsMini', 'app/ResourcesHandler', 'app/Record', 'app/GeneralMenu'], function(Timeline, Utils, UiMini, EventsMini, ressources, Record) {

		'use strict';

		var application = {

			init : function () {
				document.addEventListener("deviceready", this.onDeviceReady, false);
			},

			onDeviceReady : function () {

				var uiMini       = new UiMini();
				var record       = new Record();
				var eventsMini   = new EventsMini(uiMini, record);

				ressources.loadSongs().then(function(data){
					uiMini.initButtonsSongs();
					uiMini.initButtonsModal();
				});

				uiMini.initUI();

			}
		};


		application.onDeviceReady();
	});


});
