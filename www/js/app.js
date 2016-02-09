requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib',
        impl:'../js/app/impl',
    }
});

$(document).ready(function() {

    require(['app/Timeline', 'app/Utils','app/UiMini','app/EventsMini','app/ResourcesHandler'], function(Timeline, Utils, UiMini,EventsMini,ressources) {

        'use strict';

        var application = {

            init : function () {
                document.addEventListener("deviceready", this.onDeviceReady, false);
            },

            onDeviceReady : function () {

                var uiMini       = new UiMini();
                var eventsMini   = new EventsMini(uiMini);

                eventsMini.initEventsMini();
                ressources.loadSongs().then(function(data){
                    uiMini.initUiMini();
                });

            }
        };


        application.onDeviceReady();
    });


});
