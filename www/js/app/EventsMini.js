define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline 		 = require('app/Timeline');

	function EventsMini(uiMini,record){
		this.uiMini=uiMini;
		this.record=record;

		this.initPisteClick();
		this.initDragAndDrop();
		this.initModalEvents();
		this.initSongClick();
		this.initDeckButtons();
		this.initRecorderEvents();
		this.initValideQuickSelect();
	}

	EventsMini.prototype.initPisteClick = function(){

		var self=this;

		
		$('.piste').each(function(){

			var piste=this;
			piste.ontouchstart=function(event){

				var songToLoad = self.getSongToLoad();

				if(self.getSongDragged()==null && !$('#trash').hasClass("active") && songToLoad!=null)
			    {
					// var xOnPiste = event.touches[0].clientX-$(this).offset().left;
					
					// var newSongDiv = self.uiMini.addSongToPiste(songToLoad, $(this), xOnPiste);
					// $("#buttons-songs .button.active").removeClass('active');

				 //    self.setDragOnSong(newSongDiv);
				}
			}

		});
	}

	EventsMini.prototype.setDragOnSong = function(divSong){

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
  				var topTimelineTouch=clientY-$('#timeline').offset().top;
  				var topSong = this.getBoundingClientRect().top;
  				var leftSong = this.getBoundingClientRect().left;
  				var topSongTouch = clientY-topSong;
  				var leftSongTouch = clientX-leftSong;
  				

  				console.log(topSongTouch,'topSong');
  				console.log(topTimelineTouch,'topTimelineTouch');
  				console.log(clientY,'clientY');
  				


  				// var topTouchOnSong=clientY-$(this).parent().offset().top;
  				// if($(this).parent().attr('id')=='timeline'){

  				// }

  				// console.log(topTouchOnSong);
				$(this).addClass('inDrag');
				$(this).removeClass('songToPlace');

				$(this).attr('posSongX',$(this).position().left);
				// $(this).attr('piste',$(this).parent().attr('id'));

				$('#timeline').prepend($(this));
				$(this).css('top',topTimelineTouch-topSongTouch);

				


				// var posSourisOnSongX=clientX-$('#timeline').offset().left;
				//var posSourisOnSongY=topTimelineTouch-topInitialSong;
				// var posSourisOnSongY=clientY;
				
				$(this).attr('posSourisX',leftSongTouch);
				$(this).attr('posSourisY',topSongTouch);

			}
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

		closeRecorder.onclick=function(event){
			$('.panel').removeClass('active');
			$('#panel-compose').addClass('active');
		}
    }

	EventsMini.prototype.initDragAndDrop = function () {
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

				//var centerY = positionY + songDragged.height() / 2;

				pisteOverlayed=self.getPisteOverlayed(songDragged[0]);

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

    EventsMini.prototype.initDeckButtons = function () {

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

    EventsMini.prototype.initModalEvents = function(){

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
    	var self=this;
    	$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled):not(.qsopen):not(.soundChoose)", function() {

	        var idSong=$(this).attr('data-song-id');
	        ResourcesHandler.playPreview(idSong);

	        $(this).parent().find('.button').removeClass("active");
	        
	        $(this).addClass("active");
    	});

   //  	$( document ).on( "mousedown", "#buttons-songs > .button[data-song-id]:not(.disabled):not(.qsopen)", function() {

   //  		var songToLoad = $(this);

			// if(self.getSongDragged()==null && !$('#trash').hasClass("active") && songToLoad!=null)
		 //    {
			// 	// var xOnPiste = event.touches[0].clientX-$(this).offset().left;
			// 	var divSong=self.uiMini.createDivSong(songToLoad);
			// 	$("#timeline").prepend(divSong);
			// 	divSong.addClass('songToPlace');
			// 	divSong.css('height',$('#piste-1').height());
			// 	divSong.css('top',$('#timeline').position().top+$('#timeline').outerHeight()/2-divSong.height()/2);
			// 	divSong.css('left',$('#timeline').position().left+$('#timeline').width()/2-divSong.width()/2);
			// 	self.setDragOnSong(divSong);
				
			// 	// //var newSongDiv = self.uiMini.addSongToPiste(songToLoad, $(this), );
			// 	// $("#buttons-songs .button.active").removeClass('active');

			//  //    self.setDragOnSong(newSongDiv);
			// }
	        
   //  	});
    }

    EventsMini.prototype.initValideQuickSelect=function (){
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
	    		ResourcesHandler.loadSong(dataIdSong);
    		}
    		$('.quick-select').removeClass('active');
    		$('.qsopen').removeClass('qsopen');
	       
    	});
    }

    EventsMini.prototype.getSongDragged=function(){
    	var songDragged=null;
    	if($('.song.inDrag').length>0){
    		songDragged=$('.song.inDrag');
    	}
    	return songDragged;
    }

    EventsMini.prototype.getPisteOverlayed=function(div){
    	var pisteOverlayed=null;
    	var divRect=div.getBoundingClientRect();
    	var centerYDiv=divRect.top+divRect.height/2;
		
		$('.piste').each(function(){

			var pisteRect = this.getBoundingClientRect();
			var topPiste = pisteRect.top;
  			var bottomPiste = pisteRect.bottom;
			
			if( centerYDiv >= topPiste && centerYDiv <= bottomPiste){
		    	pisteOverlayed=$(this);
		  	}

		});
		return pisteOverlayed;
    }

  //   EventsMini.prototype.getPisteOverlayedFixed=function(y){
  //   	var pisteOverlayed=null;

		// $('.piste').each(function(){

		// 	var topPiste = this.getBoundingClientRect().top;
  // 			var bottomPiste = this.getBoundingClientRect().bottom;
			
		// 	if( y >= topPiste && y <= bottomPiste){
		//     	pisteOverlayed=$(this);
		//   	}

		// });
		// return pisteOverlayed;
  //   }

    EventsMini.prototype.getSongToLoad=function(y){
		var song=null;
		if($("#buttons-songs > .button.active").length>0){
			song=$("#buttons-songs > .button.active")[0];
		}
		return song;
	
    }

    EventsMini.prototype.isOverSong=function(songDiv,pisteOverlayed){
    	var overSong=false;

    	var divRectSong=songDiv[0].getBoundingClientRect();
    	var leftSong=divRectSong.left;
    	var rightSong=divRectSong.right;
		

    	pisteOverlayed.find('.song').not(songDiv).each(function()
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


    EventsMini.prototype.initButtonSongs=function(){

    	var self=this;
    	$('.button.soundChoose').each(function(){

    		var buttonSong=this;
    		buttonSong.ontouchstart=function(event){
				$(this).attr('touchstartTime',Date.now());
				$(this).attr('move','false');

				var divSong=self.uiMini.createDivSong($(this));
				$("#timeline").prepend(divSong);
				divSong.addClass('songToPlace');
				divSong.css('height',$('#piste-1').height());
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

				var pisteOverlayed=self.getPisteOverlayed(this.miniSong);


				if(pisteOverlayed!=null && $(this.miniSong).attr('overOtherSong') == "false" ){

					var xOnPiste = event.changedTouches[0].clientX-$(pisteOverlayed).offset().left;
					pisteOverlayed.append(this.miniSong);
					$(this.miniSong).css('left',xOnPiste);
					$(this.miniSong).css('top',0);
					$(this.miniSong).removeClass('songToPlace');
					self.setDragOnSong($(this.miniSong));
					$(this.miniSong).attr( 'piste' , pisteOverlayed.attr('id') );
				
				}
				else{

					$(this.miniSong).remove();
				}
			}
			buttonSong.ontouchmove=function(event){
				$(this).attr('move','true');
				$(this.miniSong).css('left',event.touches[0].clientX);
				$(this.miniSong).css('top',event.touches[0].clientY);

				var pisteOverlayed=self.getPisteOverlayed(this.miniSong);
				var overSong=self.isOverSong($(this.miniSong),pisteOverlayed);

				$(this.miniSong).css('background-color',$(this.miniSong).attr('originalBgColor'));

				if(overSong){
					$(this.miniSong).css('background-color',"red");
				}
				$(this.miniSong).attr('overOtherSong',overSong);
			}

    	});
    	
    }


    // General Menu Events
	$('#general-menu-button')       .click( openGeneralMenu );
	$('#general-menu-help')         .click( openGeneralMenuHelp );
	$('#general-menu-overlay')      .click( closeGeneralMenu );
	$('#save-menu-validate')        .click( saveComposition )
	$('#export-menu-validate')      .click( exportComposition );
	$('#load-menu-validate')        .click( loadSave )
	$('#new-menu-validate')         .click( newComposition )
	$('#micro-menu-validate')       .click( launchRecordView )
	$('#manage-menu-validate')      .click( launchSoundManagementView)
	$('#general-menu .sub-menu-btn').click( function() { openSubMenu($(this).attr('menu')); });



	return EventsMini;

});