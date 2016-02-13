define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');

	function SoundEvents() {
		this.initDragAndDrop();
		this.initSoundClick();
	}


	SoundEvents.prototype.initSoundClick = function (){
		$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen):not(.soundChoose)", function() {

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

				//var centerY = positionY + songDragged.height() / 2;

				trackOverlayed=self.getTrackOverlayed(songDragged[0]);

				if(trackOverlayed!=null)
				{

					var overSong=self.isMovedOverSong(songDragged,trackOverlayed);
					songDragged.attr('overOtherSong',overSong);
	      		}

  			}

      	}

  		timeline.ontouchend=function(event){

  			var songDragged=self.getSoundDragged();

			if(songDragged!=null)
			{
				if(songDragged.attr('overOtherSong')=='false')
				{

					var trackOverlayed=self.getTrackOverlayed(songDragged[0]);
					trackOverlayed.append(songDragged);
					songDragged.removeClass('inDrag');
				}
				else{
					var leftOriginal=songDragged.attr('posSongX');
					var pisteOriginal=songDragged.attr('piste');
					
					$("#"+pisteOriginal).append(songDragged);
					songDragged.css('left',leftOriginal+"px");
					
					songDragged.removeClass('inDrag');
					songDragged.attr('overOtherSong',false);
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

	SoundEvents.prototype.getTrackOverlayed = function(div) {
		var trackOverlayed=null;
    	var divRect=div.getBoundingClientRect();
    	var centerYDiv=divRect.top+divRect.height/2;
		
		$('.track').each(function(){

			var pisteRect = this.getBoundingClientRect();
			var topPiste = pisteRect.top;
  			var bottomPiste = pisteRect.bottom;
			
			if( centerYDiv >= topPiste && centerYDiv <= bottomPiste){
		    	trackOverlayed=$(this);
		  	}

		});
		return trackOverlayed;
	}

	SoundEvents.prototype.isMovedOverSong = function(songDiv, trackOverlayed) {
		var overSong=false;

    	var divRectSong=songDiv[0].getBoundingClientRect();
    	var leftSong=divRectSong.left;
    	var rightSong=divRectSong.right;
		

    	trackOverlayed.find('.song').not(songDiv).each(function()
		{
			var songToCompareRect = this.getBoundingClientRect();
			var rightSongToCompare = songToCompareRect.right;
			var leftSongToCompare = songToCompareRect.left;
			
			if(! (rightSongToCompare<=leftSong || leftSongToCompare>=rightSong ) ){
			
				overSong=true;
			}
		});
		return overSong;
	}

	SoundEvents.prototype.initEventsButtonsSong=function(){
		var self=this;
    	$('.button.soundChoose').each(function(){

    		var buttonSong=this;
    		buttonSong.ontouchstart=function(event){
				$(this).attr('touchstartTime',Date.now());
				$(this).attr('move','false');

				var divSong=self.createDivSong($(this));
				$("#timeline").prepend(divSong);
				divSong.addClass('songToPlace');
				divSong.css('height',$('#track-1').height());
				divSong.css('top','-300px');
				divSong.css('left','0px');

				this.miniSong=divSong[0];
				$('#panel-compose').prepend(this.miniSong);

			}
			buttonSong.ontouchend=function(event){

				if(Date.now()-$(this).attr('touchstartTime')>500 && $(this).attr('move')=="false" ){
					$(".qsopen").removeClass('qsopen');
					$(".quick-select").removeClass('active');
					$(this).find(".quick-select").addClass('active');
					$(this).addClass('qsopen');
				}
				else{
					if( !$(this).hasClass('disabled') && !$(this).hasClass('qsopen') && $(this).attr('move')=="false"){ 
						var idSong=$(this).attr('data-song-id');
						ResourcesHandler.playPreview(idSong);
					}
				}

				var trackOverlayed=self.getTrackOverlayed(this.miniSong);


				if(trackOverlayed!=null && $(this.miniSong).attr('overOtherSong') == "false" ){

					var xOnPiste = event.changedTouches[0].clientX-$(trackOverlayed).offset().left;
					trackOverlayed.append(this.miniSong);
					$(this.miniSong).css('left',xOnPiste);
					$(this.miniSong).css('top',0);
					$(this.miniSong).removeClass('songToPlace');
					self.setDragOnSong($(this.miniSong));
					$(this.miniSong).attr( 'piste' , trackOverlayed.attr('id') );
				
				}
				else{

					$(this.miniSong).remove();
				}
			}
			buttonSong.ontouchmove=function(event){
				event.preventDefault();
				$(this).attr('move','true');
				$(this.miniSong).css('left',event.touches[0].clientX);
				$(this.miniSong).css('top',event.touches[0].clientY);

				var trackOverlayed=self.getTrackOverlayed(this.miniSong);
				var overSong=self.isMovedOverSong($(this.miniSong),trackOverlayed);
				$(this.miniSong).attr('overOtherSong',overSong);
				// $(this.miniSong).css('background-color',$(this.miniSong).attr('originalBgColor'));

				// if(overSong){
				// 	$(this.miniSong).css('background-color',"red");
				// }
				// $(this.miniSong).attr('overOtherSong',overSong);
			}

    	});
    	
    }

    SoundEvents.prototype.createDivSong= function(soundButton){

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