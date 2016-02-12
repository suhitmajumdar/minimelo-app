define(function( require ) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');
	var Menu 			 = require('events/Menu');

	function EventsHandler(UiHandler, record){
		this.uiHandler = UiHandler;
		this.record = record;
		this.menu   = new Menu();

		this.initTrackClick();
		this.initDragAndDrop();
		this.initModalEvents();
		this.initSongClick();
		this.initDeckButtons();
		this.initRecorderEvents();
		this.initValidQuickSelect();
	}

	EventsHandler.prototype.initTrackClick = function(){

		var self=this;

		$('.track').each(function(){

			this.ontouchstart = function(event) {

				var songToLoad = self.getSongToLoad();
				var xOnTrack = event.touches[0].clientX-$(this).offset().left;
				
				if ( songToLoad != null && self.isValidPosition(xOnTrack, songToLoad, $(this)) == true )
				{				

					if(self.getSongDragged() == null && !$('#trash').hasClass("active") && songToLoad!=null)
					{
						
						var newSongDiv = self.uiHandler.addSongTotrack(songToLoad, $(this), xOnTrack);
						$("#buttons-songs .button.active").removeClass('active');

						self.setDragOnSong(newSongDiv);
					}
				}
			}

		});
	}

	EventsHandler.prototype.setDragOnSong = function(divSong){

		divSong[0].ontouchstart=function(event){

			event.preventDefault();
			var	clientX=event.touches[0].clientX;
			var clientY=event.touches[0].clientY;


			if($(this).hasClass('todelete'))
			{
				$(this).remove();
			}
			else
			{

				$(this).addClass('inDrag');

				$(this).attr('posSongX',$(this).position().left);
				$(this).attr('track',$(this).parent().attr('id'));


				var top=$(this).parent().position().top;
				$(this).css('top',top);

				$('.track:first').append($(this));


				var posSourisOnSongX=clientX-$('.track .song.inDrag').offset().left;
				var posSourisOnSongY=clientY-$('.track .song.inDrag').offset().top;
				$(this).attr('posSourisX',posSourisOnSongX);
				$(this).attr('posSourisY',posSourisOnSongY);

			}
		}
	}

	EventsHandler.prototype.initRecorderEvents=function(){
		var self=this;
		playRecord.onmousedown=function(){
			self.record.playRecord();
		}

		recordButton.onclick=function(event){
			if($(this).attr("action")=="record"){
				self.record.startRecord();
				$(this).attr("action","stop");
			}else{
				self.record.stopRecord();
				$(this).attr("action","record");
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
			self.record.saveRecord();
		}
	}

	EventsHandler.prototype.initDragAndDrop = function () {
		var self=this;
		timeline.ontouchmove=function (event){
			
			
			var clientX=event.touches[0].clientX;
			var clientY=event.touches[0].clientY;
			

			var songDragged=self.getSongDragged();

			if(songDragged!=null)
			{
				event.preventDefault();
				var scrollLeft=$( "#timeline" ).scrollLeft();
				
				var positionX=clientX-$('#timeline').offset().left+scrollLeft;
				var positionY=clientY-$('#timeline').offset().top;

				positionX-=songDragged.attr('posSourisX');
				positionY-=songDragged.attr('posSourisY');

				if(positionX<0){
					positionX=0;
				}
				if(positionX>$('.track').width()-songDragged.width()){
					positionX=$('.track').width()-songDragged.width();
				}

				if(positionY<0){
					positionY=0;
				}

				var heightTimeline=$('.track').outerHeight()*$('.track').length;

				if(positionY + songDragged.height() > heightTimeline ){
					positionY=heightTimeline - songDragged.height();
				}

				songDragged.css('left',positionX);
				songDragged.css('top',positionY);

				var centerY = songDragged.position().top + songDragged.height() / 2;


				trackOverlayed = self.getTrackOverlayed(centerY);

				if(trackOverlayed != null)
				{
					var overSong = self.isMovedOverSong(songDragged,trackOverlayed);
					songDragged.css('background-color',songDragged.attr('originalBgColor'));
					songDragged.attr('overOtherSong',overSong);
				}

			}

		}

		timeline.ontouchend = function(event){

			var songDragged=self.getSongDragged();

			if(songDragged!=null)
			{
				if(songDragged.attr('overOtherSong')=='false')
				{

					var offset = songDragged.offset();
					var height = songDragged.height();
					var centerY = offset.top + height / 2;

					$('.track').each(function(){
					  if( centerY>$(this).offset().top && centerY < $(this).offset().top+$(this).height()){
						$(this).append(songDragged);
					  }
					});

					
					songDragged.removeClass('inDrag');
				}
				else{
					var leftOriginal=songDragged.attr('posSongX');
					var trackOriginal=songDragged.attr('track');
					
					$("#"+trackOriginal).append(songDragged);
					songDragged.css('left',leftOriginal+"px");
					
					songDragged.removeClass('inDrag');
					songDragged.attr('overOtherSong', false);
				}
				songDragged.css('top',0);
				songDragged.css('background-color',songDragged.attr('originalBgColor'));
			}
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

		$(".validate_btn.button").click(function(){

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


	EventsHandler.prototype.initSongClick=function (){
		$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen)", function() {

			var idSong=$(this).attr('data-song-id');
			ResourcesHandler.playPreview(idSong);

			$(this).parent().find('.button').removeClass("active");
			
			$(this).addClass("active");
		});
	}

	EventsHandler.prototype.initValidQuickSelect=function (){
		$( document ).on( "mousedown", "#buttons-songs .button .validate_btn", function() {
			
			var btnSelected=$(this).prevAll('.button.active:not(.disabled)');
			if(btnSelected.length>0){

				var idSong=btnSelected.find(" > span").text();
				var dataIdSong=btnSelected.attr('data-song-id');

				var buttonToSwitch=$(this).parent().parent();
				buttonToSwitch.find('span.numberSong').text(idSong);
				buttonToSwitch.attr('data-song-id',dataIdSong);
				buttonToSwitch.removeClass('qsopen');
				buttonToSwitch.removeClass('disabled');
				buttonToSwitch.removeClass('active');
				buttonToSwitch.find('.quick-select').removeClass('active');
				ResourcesHandler.loadSong(dataIdSong);
			}
		   
		});
	}

	EventsHandler.prototype.getTrackOverlayed = function(y) {
		var trackOverlayed=null;

		$('.track').each(function(){

			var topPist=$(this).position().top;
			var bottomtrack=$(this).position().top+$(this).height();
				
			if( y >= topPist && y <= bottomtrack){
				trackOverlayed=$(this);
			}

		});

		return trackOverlayed;
	}

	EventsHandler.prototype.getSongToLoad = function() {
		return (this.getFirstElementOrNull($("#buttons-songs > .button.active")));
	}

	EventsHandler.prototype.getSongDragged = function() {
		return (this.getFirstElementOrNull($('.track .song.inDrag')));
	}

	EventsHandler.prototype.isMovedOverSong = function(songDiv, trackOverlayed) {
		var overSong = false;

		trackOverlayed.find('.song').not(songDiv).each(function()
		{
			var leftOtherSong  = $(this).position().left;
			var rightOtherSong = leftOtherSong+$(this).outerWidth();
			
			if(! (rightOtherSong<=songDiv.position().left || leftOtherSong>=songDiv.position().left+songDiv.outerWidth() ) ){
			
				overSong = true;
			}
		});

		return overSong;
	}

	EventsHandler.prototype.isCreatedOverSong = function (track, beginSound, endSound ) {

		var overSong = false;

		track.find('.song').each(function() {
			var leftOtherSong  = $(this).position().left;
			var rightOtherSong = leftOtherSong+$(this).outerWidth();
			
			if(! (rightOtherSong <= beginSound || leftOtherSong >= endSound ) ){
			
				overSong = true;
			}
		});

		return overSong;
	}

	// unused
	EventsHandler.prototype.active = function(selector){

		selector.click(function(){
			$(selector).filter(".active").removeClass('active');
			$(this).addClass("active");
		})
	}

	EventsHandler.prototype.isValidPosition = function( positionOnX, song, track ) {

		var idSound    = $(song).attr('data-song-id');
		var sound      = ResourcesHandler.getSong(idSound);

		var songWidth  = Timeline.secondsToPxInTimeline(sound.getDuration());
		var beginSound = positionOnX - songWidth / 2;  
		var endSound   = positionOnX + songWidth / 2;  

		if( beginSound < 0 || this.isCreatedOverSong(track, beginSound, endSound) == true ) {
			return false;
		}

		return true;
	}

	EventsHandler.prototype.getFirstElementOrNull = function(element) {
		if(element.length > 0){
			return element;
		}

		return null;
	}

	return EventsHandler;

});