define(function( require ) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');
	var Menu 			 = require('events/Menu');

	function EventsHandler(UiHandler, record){
		this.UiHandler = UiHandler;
		this.record = record;
		this.menu   = new Menu();

		this.initPisteClick();
		this.initDragAndDrop();
		this.initModalEvents();
		this.initSongClick();
		this.initDeckButtons();
		this.initRecorderEvents();
		this.initValidQuickSelect();
	}

	EventsHandler.prototype.initPisteClick = function(){

		var self=this;

		
		$('.piste').each(function(){

			this.ontouchstart=function(event){

				var songToLoad = self.getSongToLoad();

				if(self.getSongDragged()==null && !$('#trash').hasClass("active") && songToLoad!=null)
			    {
					var xOnPiste = event.touches[0].clientX-$(this).offset().left;
					
					var newSongDiv = self.UiHandler.addSongToPiste(songToLoad, $(this), xOnPiste);
					$("#buttons-songs .button.active").removeClass('active');

				    self.setDragOnSong(newSongDiv);
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
				$(this).attr('piste',$(this).parent().attr('id'));



				var top=$(this).parent().position().top;
				$(this).css('top',top);

				$('.piste:first').append($(this));


				var posSourisOnSongX=clientX-$('.piste .song.inDrag').offset().left;
				var posSourisOnSongY=clientY-$('.piste .song.inDrag').offset().top;
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
				if(positionX>$('.piste').width()-songDragged.width()){
					positionX=$('.piste').width()-songDragged.width();
				}

				if(positionY<0){
					positionY=0;
				}

				var heightTimeline=$('.piste').outerHeight()*$('.piste').length;

				if(positionY + songDragged.height() > heightTimeline ){
					positionY=heightTimeline - songDragged.height();
				}

				songDragged.css('left',positionX);
				songDragged.css('top',positionY);

				var centerY = songDragged.position().top + songDragged.height() / 2;

				pisteOverlayed=self.getPisteOverlayed(centerY);

				if(pisteOverlayed!=null)
				{

					var overSong=self.isOverSong(songDragged,pisteOverlayed);
					songDragged.css('background-color',songDragged.attr('originalBgColor'));
				
					if(overSong){
						songDragged.css('background-color',"red");
					}
					songDragged.attr('overOtherSong',overSong);
	      		}

  			}

      	}

  		timeline.ontouchend=function(event){

  			var songDragged=self.getSongDragged();

			if(songDragged!=null)
			{
				if(songDragged.attr('overOtherSong')=='false')
				{

					var offset = songDragged.offset();
					var height = songDragged.height();
					var centerY = offset.top + height / 2;

					$('.piste').each(function(){
					  if( centerY>$(this).offset().top && centerY < $(this).offset().top+$(this).height()){
					    $(this).append(songDragged);
					  }
					});

					
					songDragged.removeClass('inDrag');
				}
				else{
					var leftOriginal=songDragged.attr('posSongX');
					var pisteOriginal=songDragged.attr('piste');
					
					$("#"+pisteOriginal).append(songDragged);
					songDragged.css('left',leftOriginal+"px");
					
					songDragged.removeClass('inDrag');
				}
				songDragged.css('top',0);
				songDragged.css('background-color',songDragged.attr('originalBgColor'));
			}
		}
    }

    EventsHandler.prototype.initDeckButtons = function () {

    	var self=this;

    	trash.ontouchstart=function(event){
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
			if( $('.piste .song').length > 0) {
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

    EventsHandler.prototype.getSongDragged=function(){
    	var songDragged=null;
    	if($('.piste .song.inDrag').length>0){
    		songDragged=$('.piste .song.inDrag');
    	}
    	return songDragged;
    }

    EventsHandler.prototype.getPisteOverlayed=function(y){
    	var pisteOverlayed=null;

		$('.piste').each(function(){

			var topPist=$(this).position().top;
			var bottomPiste=$(this).position().top+$(this).height();
				
			if( y >= topPist && y <= bottomPiste){
		    	pisteOverlayed=$(this);
		  	}

		});
		return pisteOverlayed;
    }

    EventsHandler.prototype.getSongToLoad=function(y){
		var song=null;
		if($("#buttons-songs > .button.active").length>0){
			song=$("#buttons-songs > .button.active")[0];
		}
		return song;
	
    }

    EventsHandler.prototype.isOverSong=function(songDiv,pisteOverlayed){
    	var overSong=false;

    	pisteOverlayed.find('.song').not(songDiv).each(function()
		{
			var leftOtherSong  = $(this).position().left;
			var rigthOtherSong = leftOtherSong+$(this).outerWidth();
			
			if(! (rigthOtherSong<=songDiv.position().left || leftOtherSong>=songDiv.position().left+songDiv.outerWidth() ) ){
			
				overSong=true;
			}
		});
		return overSong;
    }

	EventsHandler.prototype.active = function(selector){

		selector.click(function(){
			$(selector).filter(".active").removeClass('active');
			$(this).addClass("active");
		})
	}

	return EventsHandler;

});