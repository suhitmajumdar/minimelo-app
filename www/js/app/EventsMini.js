define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');

	function EventsMini(uiMini,record){
		this.uiMini=uiMini;
		this.record=record;
	}

	EventsMini.prototype.initEventsMini = function (){
		this.initPisteClick();
		this.initDragAndDrop();
		this.initModalEvents();
		this.initSongClick();
		this.initDeckButtons();
		this.initRecorderEvents();
		this.initSongToDelete();
	}

	EventsMini.prototype.initPisteClick = function(){

		var self=this;
		
		$('.piste').off().mousedown('click', function(event){

		    if($('.piste .song.inDrag').length < 1 && !$('#trash').hasClass("active") )
		    {
				var xOnPiste   = event.clientX-$(this).offset().left;
				var songToLoad = $("#buttons-songs .button.active")[0];
				var newSongDiv = self.uiMini.addSongToPiste(songToLoad, $(this), xOnPiste);
				$("#buttons-songs .button.active").removeClass('active');

			    self.setDragOnSong(newSongDiv);
			}

		});
	}

	EventsMini.prototype.setDragOnSong = function(divSong){

		divSong[0].ontouchstart=divSong[0].onmousedown=function(event){

	  		event.preventDefault();
	  		var clientX;
  			var clientY;

  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}


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

	    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				divSong[0].onmousedown=null;
		}
	}

	EventsMini.prototype.initRecorderEvents=function(){
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

		recordScreen.onmousedown=recordScreen.ontouchstart=function(event){
			var clientX;
  			var clientY;

  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}

			var x=clientX-this.offsetLeft;
			self.record.startSong=x;
		}

		recordScreen.onmousemove=recordScreen.ontouchmove=function(event){
			var clientX;
  			var clientY;
  			// console.log(event);
  			var down=(event.buttons==1);
  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  				down=true;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}
  			if(down){
				var x=clientX-this.offsetLeft;
				self.record.stopSong=x;
				self.record.drawSelector();
			}
			

		}

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				recordScreen.onmousedown=null;
  				recordScreen.onmousemove=null;
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

	EventsMini.prototype.initDragAndDrop = function () {

  		document.ontouchmove=function (event){
  			var clientX;
  			var clientY;

  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}

  			var songDragged=$('.piste .song.inDrag');
  			if(songDragged.length>0)
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

				var pisteOverlayed=null;

				$('.piste').each(function(){

					var topPist=$(this).position().top;
					var bottomPiste=$(this).position().top+$(this).height();
						
					if( centerY >= topPist && centerY <= bottomPiste){
				    	pisteOverlayed=$(this);
				  	}

				});

				if(pisteOverlayed!=null)
				{

					var overSong=false;
					songDragged.css('background-color',songDragged.attr('originalBgColor'));
					pisteOverlayed.find('.song').not(songDragged).each(function()
					{
						var leftOtherSong=$(this).position().left;
						var rigthOtherSong=leftOtherSong+$(this).outerWidth();
						
						if(! (rigthOtherSong<=positionX || leftOtherSong>=positionX+songDragged.outerWidth() ) ){
						
							overSong=true;
						}
					});

					if(overSong){
						songDragged.css('background-color',"red");
					}
					songDragged.attr('overOtherSong',overSong);
	      		}

  			}

      	}

  		document.onmouseup=document.ontouchend=function(event){

			if($('.piste .song.inDrag').length>0)
			{

				var songDragged=$('.piste .song.inDrag');
				

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

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				document.onmousedown=null;
  				document.onmouseup=null;
  		}

    }

    EventsMini.prototype.initDeckButtons = function () {

    	var self=this;

    	trash.ontouchstart=function(event){
    		$(this).toggleClass("active");

    		if($(this).hasClass("active"))
    			$(".song").addClass("todelete");
    		else
    			$(".song").removeClass("todelete");
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

    EventsMini.prototype.initModalEvents = function(){

  //   	$("#choose-song div .button").click(function(){ 

		// 	var numberId = $(this).find("span").text();
		// 	var typeRight = $(this).attr("type");

		// 	$("#buttons-songs-modal .button[type='"+typeRight+"']").find("span").text(numberId);

		// 	var urlSong = $(this).attr('data-song-url');

		// 	$(this).parent().find('.button').removeClass('active');
		// 	$(this).addClass('active');

		// });

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


    EventsMini.prototype.initSongClick=function (){
    	$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen)", function() {

	        var idSong=$(this).attr('data-song-id');
	        ResourcesHandler.playPreview(idSong);

	        if($(this).parent().attr('id')=="buttons-songs"){
	        	$("#buttons-songs .button").removeClass("active");
	        }
	        else if($(this).parent().parent().parent().attr('id')=="choose-song"){
	        	$(this).parent().find('.button').removeClass("active");
	        }
	        $(this).addClass("active");
    	});
    }

    EventsMini.prototype.initSongToDelete=function (){
    	// $( document ).on( "mousedown", ".song.todelete", function() {
    	// 	$(this).remove();
    	// });
    }

	return EventsMini;

});