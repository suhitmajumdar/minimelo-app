define(function( require ) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');
	var Menu 			 = require('events/Menu');
	var SoundEvents		 = require('events/SoundEvents');

	function EventsHandler(uiHandler, record){
		this.uiHandler = uiHandler;
		this.record = record;
		this.menu   = new Menu(uiHandler);

		this.initModalEvents();
		this.soundEvents = new SoundEvents();

		this.initDeckButtons();
		this.initRecorderEvents();
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
			$("#traitement-popup").addClass("active");
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
			$('#songsSelector').modal('show');
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

		$("#songsSelector .validate_btn.button").click(function(){

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

		});
	}

	EventsHandler.prototype.initValidQuickSelect=function (){
		$( document ).on( "mousedown", "#buttons-songs .button .validate_btn", function() {
    		
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
	       
    	});
	}


	return EventsHandler;

});