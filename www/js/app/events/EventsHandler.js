define(function( require ) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');
	var Menu 			 = require('events/Menu');
	var SoundEvents		 = require('events/SoundEvents');
	var Record		     = require('app/Record');

	function EventsHandler(uiHandler){
		this.uiHandler = uiHandler;
		this.record = new Record();
		this.menu   = new Menu( this );

		this.initSoundEvents();

		this.initDeckButtons();
		this.initRecorderEvents();
		this.initCollectionManagerEvents();
	}

	EventsHandler.prototype.initSoundEvents = function () {
		this.initModalEvents();
		this.soundEvents = new SoundEvents();
		this.soundEvents.initEventsButtonsSong();
		this.initValidQuickSelect();
	}

	EventsHandler.prototype.initRecorderEvents = function(){
		var self=this;

		playRecord.onmousedown=function(){
			self.record.playRecord();
			var parent = $(this).parent();
			if(parent.hasClass("playing")){
				$(this).parent().removeClass("playing");
			}
			else{
				$(this).parent().addClass("playing");
			}
		}

		recordButton.onclick = function(event){
			if($(this).attr("action")=="record"){
				self.record.startRecord();
				$(this).attr("action","stop");
				$(this).parent().addClass("recording");
			}else{
				self.record.stopRecord();
				$(this).attr("action","record");
				$(this).parent().removeClass("recording");
			}
		}

		recordScreen.ontouchstart=function(event){

			var clientX=event.touches[0].clientX;
			var clientY=event.touches[0].clientY;

			var x=clientX-this.offsetLeft;
			self.record.startSong=x;
		}

		recordScreen.onmousemove=recordScreen.ontouchmove=function(event){
		
			var clientX=event.touches[0].clientX;
			var clientY=event.touches[0].clientY;

			var x=clientX-this.offsetLeft;
			self.record.stopSong=x;
			self.record.drawSelector();

		}

		cutRecord.onclick=function(){
			self.record.cutRecord();
			self.record.drawRecord();
			selector.style.left='0px';
			selector.style.width='0px';
		}

		saveRecord.onclick=function(){
			$("#overlay-traitement").addClass("active");
			self.record.saveRecord();
		}

		closeRecorder.onclick=function(event){
			$('.panel').removeClass('active');
			$('#panel-compose').addClass('active');
		}
    }


	EventsHandler.prototype.initDeckButtons = function () {

		var self = this;

		trash.ontouchstart = function(event){
			$(this).toggleClass("active");

			if($(this).hasClass("active"))
				$(".song").addClass("todelete");
			else
				$(".song").removeClass("todelete");
		}

		showSongsSelector.ontouchstart=function(event){
			openPanel('#songsSelector');
		}

		$('#play_stop').click(function() {
			if( $('.track .song').length > 0) {
				if($(this).hasClass('play_btn'))
				{
					$(this).removeClass('play_btn');
					$(this).addClass('stop_btn');
					Timeline.play();

				} else {
					$(this).removeClass('stop_btn');
					$(this).addClass('play_btn');
					Timeline.stop();
				}
			}
			
		});

		$('#zoom').click(function(){
			Timeline.zoom();
		});

		$('#unzoom').click(function(){
			Timeline.unzoom();
		});

	}

	EventsHandler.prototype.initModalEvents = function(){

		$("#validSongSelection").click(function(){

			$("#choose-song div .button.active:not(.disabled)").each( function(){

				var typeSong = $(this).attr('type');

				var numberId = $(this).find("span").text();

				var dataIdSong=$(this).attr('data-song-id');

				var buttonToReplace= $("#buttons-songs > .button[type='"+typeSong+"']");

				buttonToReplace.find(" > span.numberSong").text(numberId);
				buttonToReplace.attr('data-song-id',dataIdSong);
				buttonToReplace.removeClass('disabled');

				ResourcesHandler.loadSong(dataIdSong);

			});
			openPanel('#panel-compose');
		});
	}

	EventsHandler.prototype.initCollectionManagerEvents = function() {
		var self = this;

		$('#closeCollections').click(function () { 
			openPanel('#panel-compose');
		});

		$('#saveCollections').click(function() { 
			self.reloadSoundElements( self );
			openPanel('#panel-compose');
		 });
	}

	EventsHandler.prototype.initValidQuickSelect=function (){
		var btnsValidQuickSelect=document.querySelectorAll('#buttons-songs .button .validate_btn');
		
		for (var i = 0; i < btnsValidQuickSelect.length; i++) {
			var btnValid=btnsValidQuickSelect[i];
			
			btnValid.onmousedown=function(event)
			{
				var btnSelected=$(this).prevAll('.button.active:not(.disabled)');
    			if(btnSelected.length>0){

		    		var idSong = btnSelected.find(" > span").text();
		    		var dataIdSong = btnSelected.attr('data-song-id');

		    		var buttonToSwitch=$(this).parent().parent();
		    		buttonToSwitch.find('span.numberSong').text(idSong);
		    		buttonToSwitch.attr('data-song-id',dataIdSong);
		    		buttonToSwitch.removeClass('qsopen');
		    		buttonToSwitch.removeClass('disabled');
		    		buttonToSwitch.removeClass('active');
		    		ResourcesHandler.loadSong(dataIdSong);

	    		}
	    		$('.quick-select').removeClass('active');
	    		$('.qsopen').removeClass('qsopen');
			}

		};
	}

	EventsHandler.prototype.reloadSoundElements = function ( events ) {
		ResourcesHandler.postProcessing();
		events.uiHandler.reloadSoundElements();
		events.initSoundEvents();
	}


	return EventsHandler;

});