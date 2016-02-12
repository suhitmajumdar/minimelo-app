define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');

	function SoundEvents() {
		this.initDragAndDrop();
		this.initSoundClick();
	}


	SoundEvents.prototype.initSoundClick = function (){
		$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen)", function() {

			var idSong=$(this).attr('data-song-id');
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

			var songDragged=self.getSoundDragged();

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


	SoundEvents.prototype.setDragOnSong = function(divSong){

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

	SoundEvents.prototype.isValidPosition = function( positionOnX, song, track ) {

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

	SoundEvents.prototype.isCreatedOverSong = function (track, beginSound, endSound ) {

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

	SoundEvents.prototype.getTrackOverlayed = function(y) {
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

	SoundEvents.prototype.isMovedOverSong = function(songDiv, trackOverlayed) {
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



	SoundEvents.prototype.getSoundToLoad = function() {
		return (this.getFirstElementOrNull($("#buttons-songs > .button.active")));
	}

	SoundEvents.prototype.getSoundDragged = function() {
		return (this.getFirstElementOrNull($('.track .song.inDrag')));
	}

	SoundEvents.prototype.getFirstElementOrNull = function(element) {
		if(element.length > 0){
			return element;
		}

		return null;
	}



	return SoundEvents;

})