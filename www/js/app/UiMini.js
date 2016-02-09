define(function( require ) {

	'use strict';

	var ressources 		 = require('app/ressources');
	var Timeline         = require('app/Timeline');
	var EventsHandler    = require('app/EventsHandler'); 
	var ResourcesHandler = require('app/ResourcesHandler');

	function UiMini(){
		this.timeline = new Timeline();
	}

	
	UiMini.prototype.hideLoader = function() {
		$( ".loader" ).fadeOut( "slow" );
	}

	UiMini.prototype.initButtonsSongs = function () {

		var types=ResourcesHandler.getTypes();

	   	for (var i = 1; i < 9; i++) {
	   		var type="type-"+i;
	        var buttonSong=$('<div class="button instrument"></div>');
	        buttonSong.attr('type',type);
	        buttonSong.append("<span class='numberSong'></span>")

	        $('#buttons-songs').append(buttonSong);
	   	};

		$('#myModal').modal('show');
	}

	UiMini.prototype.initButtonsModal = function () {


	    var songsByType = ResourcesHandler.songsDirectories;

		for ( var type in songsByType )
		{
			if(type!="indefini"){
				var line=$("<div type="+type+"></div>");
				$("#choose-song").append(line);
				
				var songs=songsByType[type];
				for (var i = 0; i < songs.length; i++){

					var song=songs[i];

					var buttonSong=$('<div class="button instrument"></div>');
					buttonSong.attr('type',type);
					buttonSong.attr('data-song-id', song.id);

					buttonSong.append("<span>" +i+ "</span>");

					line.append(buttonSong);
				}
			}
		}
	}

	UiMini.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();

		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiMini.prototype.initUiMini = function (){
		this.initTimelineHeight();
		this.initButtonsSongs();
		this.initDeckButtons();
		this.initPistes();
	}

	UiMini.prototype.initPistes = function () {
		$('.piste').css('width', this.timeline.getDurationInPx());
	}


	UiMini.prototype.initDeckButtons = function () {

		var self=this;

		$(".round_btn.trash_btn").click(function(){
			$('.piste').empty();
		});

		$('#play_stop').click(function() {
			if($(this).hasClass('play_btn'))
			{
				$(this).removeClass('play_btn');
				$(this).addClass('stop_btn');
				self.timeline.play();
			} else {
				$(this).removeClass('stop_btn');
				$(this).addClass('play_btn');
				self.timeline.stop();
			}
			
		});

		$('#zoom').click(function(){
			self.timeline.zoom();
		});

		$('#unzoom').click(function(){
			self.timeline.unzoom();
		});

	}

	UiMini.prototype.addSongToPiste = function(songButton,piste,xOnPiste)
	{
		var idSong=$(songButton).attr('data-song-id');
		var song=ResourcesHandler.getSong(idSong);
		var widthSong=this.timeline.secondsToPxInTimeline(song.getDuration());
		
		var divSong=$("<div class='song'></div>");

		divSong.attr('type',song.type);
		var colorClass=divSong.css('background-color');
		divSong.attr('data-song-id',idSong);
		divSong.attr('originalBgColor',colorClass);
		divSong.css('left',xOnPiste-widthSong/2);

		divSong.width(widthSong);

		piste.append(divSong);

		return divSong;
	}

	return UiMini;

});
