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

  				var positionX  		= clientX-$('#timeline').offset().left+scrollLeft;
		     	var positionY  		= clientY-$('#timeline').offset().top;

		     	positionX -= $(songDragged).attr('posSourisX');
		      	positionY -= $(songDragged).attr('posSourisY');

				var finalPosition = self.correctPosition(songDragged,positionX,positionY);

				songDragged.style.left = finalPosition.positionX+"px";
				songDragged.style.top  = finalPosition.positionY+"px";

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

	SoundEvents.prototype.initEventsButtonsSong=function(){
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
				var widthSong  	   = this.songToPlace.offsetWidth;
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

					var xOnPiste = event.changedTouches[0].clientX-$(trackOverlayed).offset().left;
					$(trackOverlayed).append(this.songToPlace);

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

				var positionX = event.touches[0].clientX - $('#timeline').offset().left + $( "#timeline" ).scrollLeft();
		     	var positionY = event.touches[0].clientY - $('#timeline').offset().top;

				var position = self.correctPosition(this.songToPlace,positionX,positionY);

				this.songToPlace.style.left = position.positionX+"px";
				this.songToPlace.style.top  = position.positionY+"px";

				var trackOverlayed = self.getTrackOverlayed(this.songToPlace);
				
				if(trackOverlayed != null){
					var overSong = self.isMovedOverSong(this.songToPlace,trackOverlayed);
					this.songToPlace.setAttribute('overOtherSong',overSong);
				}
			}

    	});
    	
    }

    SoundEvents.prototype.correctPosition=function(divDragged,positionX,positionY){

		var heightSong  	= divDragged.offsetHeight;
		var widthSong  		= divDragged.offsetWidth;

		var widthTrack  	= $('.track').width();
		var heightTimeline  = $('.track').height()*$('.track').length;

		if(positionX < 0){
			positionX = 0;
		}
		if(positionX > widthTrack - widthSong){
			positionX = widthTrack - widthSong;
		}

		if(positionY<0){
			positionY=0;
		}

		if(positionY + heightSong > heightTimeline ){
			positionY = heightTimeline - heightSong;
		}
		return { positionX : positionX, positionY : positionY };
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