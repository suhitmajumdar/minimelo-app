define(function( require ) {

	'use strict';

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline         = require('app/Timeline');

	function UiMini(){
	}

	UiMini.prototype.initUI = function () {
		this.initTimelineHeight();
		this.initPistes();
		this.initRecorder();
	} 

	UiMini.prototype.hideLoader = function() {
		$( ".loader" ).fadeOut( "slow" );
	}

	UiMini.prototype.initButtonsSongs = function () {

		var types = ResourcesHandler.getActivesTypes();
		var self=this;
		for ( var type in types ) {
			var buttonSong = $('<div class="button disabled soundChoose"></div>');
			buttonSong.attr('type', types[type]);
			buttonSong.append("<span class='numberSong'></span>")

			$('#buttons-songs').append(buttonSong);

			// buttonSong[0].ontouchstart=function(event){
			// 	$(this).attr('touchstartTime',Date.now());
			// 	$(this).attr('move','false');

			// 	var divSong=self.createDivSong($(this));
			// 	$("#timeline").prepend(divSong);
			// 	divSong.addClass('songToPlace');
			// 	divSong.css('height',$('#piste-1').height());
			// 	divSong.css('top',$('#timeline').position().top+$('#timeline').outerHeight()/2-divSong.height()/2);
			// 	divSong.css('left',$('#timeline').position().left+$('#timeline').width()/2-divSong.width()/2);
			// 	//self.setDragOnSong(divSong);
			// 	// console.log(divSong);
			// 	this.miniSong=divSong[0];
			// 	$('#panel-compose').prepend(this.miniSong);

			// }
			// buttonSong[0].ontouchend=function(event){

			// 	if(Date.now()-$(this).attr('touchstartTime')>500 && $(this).attr('move')=="false" ){
			// 		$(".qsopen").removeClass('qsopen');
			// 		$(".quick-select").removeClass('active');
			// 		$(this).find(".quick-select").addClass('active');
			// 		$(this).addClass('qsopen');
			// 	}
			// 	else{
			// 		if( !$(this).hasClass('disabled') && !$(this).hasClass('qsopen')){ 
			// 			var idSong=$(this).attr('data-song-id');
			// 			ResourcesHandler.playPreview(idSong);
			// 		}
			// 	}

			// 	console.log(this.miniSong);
			// 	// console.log(event);

			// 	var centerMiniSongY=this.miniSong.getBoundingClientRect().top+$(this.miniSong).height()/2;
			// 	var pisteOverlayed=self.getPisteOverlayed(centerMiniSongY);
			// 	console.log(centerMiniSongY);
			// 	console.log(pisteOverlayed);
			// 	if(pisteOverlayed!=null){
			// 		var xOnPiste = event.changedTouches[0].clientX-$(pisteOverlayed).offset().left;
			// 		pisteOverlayed.append(this.miniSong);
			// 		$(this.miniSong).css('left',xOnPiste);
			// 		$(this.miniSong).css('top',0);
			// 		$(this.miniSong).removeClass('songToPlace');
			// 	}else
			// 	{
			// 		$(this.miniSong).remove();
			// 	}




			// }
			// buttonSong[0].ontouchmove=function(event){
			// 	$(this).attr('move','true');
			// 	// console.log(this.miniSong);
			// 	$(this.miniSong).css('left',event.touches[0].clientX);
			// 	$(this.miniSong).css('top',event.touches[0].clientY);

			// }

		}

		$('#songsSelector').modal('show');
	}

	UiMini.prototype.initButtonsModal = function () {


		var songsByType = ResourcesHandler.songsDirectories;

		for ( var type in songsByType )
		{
			if(type != "indefini"){
				
				var containerLine=$('<div class="container-line">');

				var line=$("<div type="+type+"></div>");

				containerLine.append(line);

				$("#choose-song").append(containerLine);
				
				var songs = songsByType[type];

				for ( var song in songs)
				{
					var buttonSong=$('<div class="button"></div>');
					buttonSong.attr('type',type);
					buttonSong.attr('data-song-id', songs[song].id);

					buttonSong.append("<span>" + ++song  + "</span>");

					line.append(buttonSong);
				}

				var cloneLine=line.clone();

				line.css('width',songs.length*$('#choose-song .button').outerWidth());
				// console.log(songs.length);
				// console.log($('#choose-song .button').outerWidth());

				cloneLine.addClass('quick-select');
				cloneLine.append($('<div class="round_btn validate_btn"></div>'));

				// cloneLine[0].ontouchmove=function(event){
				// 	// console.log(this);
				// 	$(this).removeClass('active');
				// 	console.log(this,"quick-select");
				// 	event.preventDefault();
				// }

				$('#buttons-songs .button[type="'+type+'"]').append(cloneLine);
			}
		}
	}

	UiMini.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();

		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiMini.prototype.initPistes = function () {
		$('.piste').css('width', Timeline.getDurationInPx());
		// for (var i = 0; i < Timeline.getDurationInPx(); i+=200) {
		// 	var lineTempo=$('<div class="lineTempo"></div>');
		// 	lineTempo.css('left',i);
		// 	$('#timeline').prepend(lineTempo);
		// };
	}

	UiMini.prototype.createDivSong= function(soundButton){

		var divSong    = $("<div class='song'></div>");

		var idSong     = $(soundButton).attr('data-song-id');
		var song       = ResourcesHandler.getSong(idSong);
		var widthSong  = Timeline.secondsToPxInTimeline(song.getDuration());
		var colorClass = divSong.css('background-color');


		divSong.attr('type',song.type);
		divSong.append("<span class='numberSong'>" + $(soundButton).find('span.numberSong').text() + "</span>")
		divSong.attr('data-song-id',idSong);
		divSong.attr('originalBgColor', colorClass);
		divSong.width(widthSong);

		return divSong;

	}

	UiMini.prototype.addSongToPiste = function(soundButton, piste, xOnPiste)
	{
		var divSong = this.createDivSong(soundButton);
		divSong.css( 'left' , xOnPiste - divSong.width()/2 );
		divSong.attr( 'piste' , piste.attr('id') );
		
		piste.append(divSong);

		return divSong;
	}

	UiMini.prototype.addSongToPlace = function(soundButton, piste, xOnPiste)
	{
		var divSong = this.createDivSong(soundButton)

		divSong.width(widthSong);

		piste.append(divSong);


		return divSong;
	}

	UiMini.prototype.initRecorder=function(){
		
		$('#canvasRecord').attr('width',$('#recordScreen').width());
		$('#canvasRecord').attr('height',$('#recordScreen').height());

	}

	// UiMini.prototype.getPisteOverlayed=function(y){
 //    	var pisteOverlayed=null;

	// 	$('.piste').each(function(){

	// 		var topPiste = this.getBoundingClientRect().top;
 //  			var bottomPiste = this.getBoundingClientRect().bottom;
			
	// 		if( y >= topPiste && y <= bottomPiste){
	// 	    	pisteOverlayed=$(this);
	// 	  	}

	// 	});
	// 	return pisteOverlayed;
 //    }

	return UiMini;

});
