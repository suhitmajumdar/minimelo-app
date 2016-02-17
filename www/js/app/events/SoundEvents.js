define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');

	function SoundEvents() {
		this.initDragAndDrop();
		this.initSoundClick();
	}


	SoundEvents.prototype.initSoundClick = function (){
		$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen):not(.soundChoose)", function() {

			var idSong = $(this).attr('data-song-id');
			ResourcesHandler.playPreview(idSong);

			$(this).parent().find('.button').removeClass("active");
			
			$(this).addClass("active");
		});
	}

	SoundEvents.prototype.initDragAndDrop = function () {

		var self=this;
		
		timeline.ontouchmove=function (event){
			
			var clientX=event.touches[0].clientX;
			var clientY=event.touches[0].clientY;
			
			var songDragged=self.getSoundDragged();

			if(songDragged!=null)
			{
				event.preventDefault();
				
				var scrollLeft = $( "#timeline" ).scrollLeft();

				var position = self.getPostionOnTimeline(event.touches[0].clientX,event.touches[0].clientY);

				position.x -= $(songDragged).attr('posSourisX');
				position.y -= $(songDragged).attr('posSourisY');

				var finalPosition = self.correctPosition(songDragged,position);

				songDragged.style.left = finalPosition.x+"px";
				songDragged.style.top  = finalPosition.y+"px";

				trackOverlayed = self.getTrackOverlayed(songDragged);

				if(trackOverlayed!=null)
				{
					var overSong=self.isMovedOverSong(songDragged,trackOverlayed);
					$(songDragged).attr('overOtherSong',overSong);
				}

			}
		}

		timeline.ontouchend=function(event){

			var songDragged = self.getSoundDragged();

			if(songDragged != null)
			{
				if($(songDragged).attr('overOtherSong') == 'false')
				{
					var trackOverlayed=self.getTrackOverlayed(songDragged);
					$(trackOverlayed).append(songDragged);
					$(songDragged).removeClass('inDrag');
					$(songDragged).attr('track',trackOverlayed.id);
				}
				else{
					var leftOriginal  = $(songDragged).attr('posSongX');
					var pisteOriginal = $(songDragged).attr('track');
					
					$("#"+pisteOriginal).append(songDragged);
					$(songDragged).css('left',leftOriginal+"px");
					
					$(songDragged).removeClass('inDrag');
					$(songDragged).attr('overOtherSong',false);
				}
				$(songDragged).css('top',0);
			}
		}
	}


	SoundEvents.prototype.setDragOnSong = function(divSong){

		divSong.ontouchstart=function(event){

			if($(this).hasClass('todelete'))
			{
				$(this).remove();
			}
			else
			{
				var	clientX=event.touches[0].clientX;
				var clientY=event.touches[0].clientY;

				var topTimelineTouch = clientY-$('#timeline').offset().top;
				var topSong          = this.getBoundingClientRect().top;
				var leftSong         = this.getBoundingClientRect().left;
				var topSongTouch     = clientY - topSong;
				var leftSongTouch    = clientX - leftSong;
				

				$(this).addClass('inDrag');
				$(this).removeClass('songToPlace');

				$(this).attr('posSongX',$(this).position().left);

				$('#timeline').prepend(this);
				$(this).css('top',topTimelineTouch-topSongTouch);
				
				$(this).attr('posSourisX',leftSongTouch);
				$(this).attr('posSourisY',topSongTouch);

			}
		}
	}

	SoundEvents.prototype.getTrackOverlayed = function(div) {
		var trackOverlayed = null;
		var divRect        = div.getBoundingClientRect();
		var centerYDiv     = divRect.top+divRect.height/2;
		
		var tracks = timeline.querySelectorAll('.track');

		var i=0;
		while(i<tracks.length && trackOverlayed==null){

			var trackRect   = tracks[i].getBoundingClientRect();
			
			if( centerYDiv >= trackRect.top && centerYDiv <= trackRect.bottom){
				trackOverlayed=tracks[i];
			}
			i++;
		}

		return trackOverlayed;
	}

	SoundEvents.prototype.isMovedOverSong = function(songDiv, trackOverlayed) {
		var overSong = false;

		var divRectSong = songDiv.getBoundingClientRect();
		var leftSong    = divRectSong.left;
		var rightSong   = divRectSong.right;
		
		var songsInTrack = trackOverlayed.querySelectorAll('.song:not(.inDrag)');

		var i=0;
		while(i<songsInTrack.length && !overSong){


			var songToCompareRect  = songsInTrack[i].getBoundingClientRect();
			
			if(! (songToCompareRect.right <= leftSong || songToCompareRect.left >= rightSong ) ){
			
				overSong=true;
			}
			i++;
		}
		
		return overSong;
	}

	SoundEvents.prototype.initEventsButtonsSong = function() {

		var self=this;

		$('.button.soundChoose').each(function(){

			var buttonSong=this;
			buttonSong.ontouchstart=function(event){

				if(!$(this).hasClass('disabled'))
				{
					var divSong=self.createDivSong($(this));
					this.songToPlace=divSong[0];
					$('#timeline').prepend(this.songToPlace);
				}
				$(this).attr('touchstartTime',Date.now());
				$(this).attr('move','false');

			}
			buttonSong.ontouchend=function(event){

				var longTouch      = Date.now() - $(this).attr('touchstartTime') > 500;
				var hasMoved       = $(this).attr('move') == "true";
				var overOtherSong  = $(this.songToPlace).attr('overOtherSong') == "true";
				var widthSong  	   = this.songToPlace == null ? 0 : this.songToPlace.offsetWidth;
				var widthTrack     = $('.track').width();
				var trackOverlayed = null;
				var isDropped      = false;

				if(this.songToPlace!=null){
					trackOverlayed=self.getTrackOverlayed(this.songToPlace)
				}

				if(longTouch && !hasMoved)
				{
					$(this).openQuickSelect();
				}
				else if(trackOverlayed != null && !overOtherSong ){

					var xOnPiste = event.changedTouches[0].clientX-trackOverlayed.getBoundingClientRect().left;
					
					if(xOnPiste < 0){
						xOnPiste = 0;
					}
					if(xOnPiste > widthTrack - widthSong){
						xOnPiste = widthTrack - widthSong;
					}

					this.songToPlace.style.left = xOnPiste + "px";
					this.songToPlace.style.top  = 0 + "px";
					
					this.songToPlace.classList.remove('songToPlace');
					
					self.setDragOnSong(this.songToPlace);
					this.songToPlace.setAttribute('track' , trackOverlayed.id);

					$(trackOverlayed).prepend(this.songToPlace);
					isDropped = true;
				}
				else
				{
					if( !$(this).hasClass('disabled') && !$(this).hasClass('qsopen') && !hasMoved){ 
						var idSong = $(this).attr('data-song-id');
						ResourcesHandler.playPreview(idSong);
					}
				}

				if(!isDropped){
					$(this.songToPlace).remove();
				}

			}
			buttonSong.ontouchmove=function(event){
				this.setAttribute('move',true);
				
				var position = self.getPostionOnTimeline(event.touches[0].clientX,event.touches[0].clientY);

				var finalPosition = self.correctPosition(this.songToPlace,position);

				this.songToPlace.style.left = finalPosition.x+"px";
				this.songToPlace.style.top  = finalPosition.y+"px";

				var trackOverlayed = self.getTrackOverlayed(this.songToPlace);
				
				if(trackOverlayed != null){
					var overSong = self.isMovedOverSong(this.songToPlace,trackOverlayed);
					this.songToPlace.setAttribute('overOtherSong',overSong);
				}
			}

		});
		
	}

	SoundEvents.prototype.correctPosition=function(divDragged,position){

		var heightSong  	= divDragged.offsetHeight;
		var widthSong  		= divDragged.offsetWidth;

		var widthTrack  	= $('.track').width();
		var heightTimeline  = timeline.clientHeight;

		if(position.x < 0){
			position.x = 0;
		}
		if(position.x > widthTrack - widthSong){
			position.x = widthTrack - widthSong;
		}

		if(position.y<0){
			position.y=0;
		}

		if(position.y + heightSong > heightTimeline ){
			position.y = heightTimeline - heightSong;
		}
		return position;
	}

	SoundEvents.prototype.getPostionOnTimeline=function(clientX,clientY){
		var rectTimeline=timeline.getBoundingClientRect();
		var x = clientX - rectTimeline.left + timeline.scrollLeft;
		var y = clientY - rectTimeline.top;

		return {x:x,y:y};
	}

	SoundEvents.prototype.createDivSong= function(soundButton){

		var divSong    = $("<div class='song'></div>");

		var idSong     = $(soundButton).attr('data-song-id');
		var song       = ResourcesHandler.getSong(idSong);
		var widthSong  = Timeline.secondsToPxInTimeline(song.getDuration());
		var heightSong = $('#track-1').height();
		

		divSong.attr('type',song.type);
		divSong.append("<span class='numberSong'>" + $(soundButton).find('span.numberSong').text() + "</span>")
		divSong.attr('data-song-id',idSong);
		divSong.css('top',-300);
		divSong.css('width',widthSong);
		divSong.css('height',heightSong);
		divSong.addClass('songToPlace');
				

		return divSong;

	}

	SoundEvents.prototype.getSoundDragged = function() {
		return timeline.querySelector('.song.inDrag');
	}

	return SoundEvents;

})