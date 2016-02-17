define(['app/ResourcesHandler'], function(ResourcesHandler) {

	'use strict';

  	var audioCtx = new AudioContext();

	function Timeline() {
		this.songsInPlay = [];
		this.idIntervalScroll = null;

		this.tempo       = 90;
		this.bars        = 20;
		this.stepByBars  = 4;

		this.songPlayedCount = 0;

		this.ratioSecondPixel = 20;

		this.debutSong = 0;
		this.lineTimeOut = 0;
		this.duration = 180;

	}

	Timeline.prototype.stopIntervalScroll = function(){
		clearInterval(this.idIntervalScroll);
	}

  	Timeline.prototype.play = function () {

		var self = this;

		self.songPlayedCount = 0;
		self.songsInPlay = [];

		self.debutSong = audioCtx.currentTime;
		$("#timeline").scrollLeft(0);


		self.lineTimeOut = setInterval(function(){
			var playingTime = audioCtx.currentTime-self.debutSong;

			var timeInTimeline = self.secondsToPxInTimeline(playingTime);
			$("#line").css('width',timeInTimeline);

			var middleTimeline = timeline.getBoundingClientRect().right/2;
			var positionLine = line.getBoundingClientRect().right;

			if (positionLine >= middleTimeline)	{
				$("#timeline").animate({scrollLeft: '+=200'}, 'slow');
			}
				
		},100)



		$('.track .song').each(function(){
			
			var xSong=$(this).position().left;
			var beginSong=self.pxToSecondsInTimeline(xSong);

			var song=this;

			var idSong=song.getAttribute('data-song-id');
			var step=song.getAttribute('step');

			var sourcePlaying = ResourcesHandler.getSong(idSong).playWithTime(beginSong);
			sourcePlaying.songRef=song;

			var idTimeOutInactive;

			var idTimeOutActive = setTimeout(function(song){

				song.classList.add('active');

			}, beginSong*1000,song);


			var index = self.songsInPlay.length;

			self.songsInPlay.push({
								    source          : sourcePlaying,
					 				timeOutActive   : idTimeOutActive,
					 				});

			sourcePlaying.onended=function(){

				self.songPlayedCount++;
				this.songRef.classList.remove('active');

				if(self.songPlayedCount == self.songsInPlay.length)
				{
					$('#play_stop').removeClass('stop_btn');
					$('#play_stop').addClass('play_btn');
					clearInterval(self.lineTimeOut);
					$("#line").css('width',0);
					$("#timeline").scrollLeft(0);
					self.songsInPlay = [];
				}
			}

		})

	}

	Timeline.prototype.stop = function () {

		clearInterval(this.lineTimeOut);
		for (var i = 0; i < this.songsInPlay.length; i++) {
			this.songsInPlay[i].source.stop();
			clearTimeout(this.songsInPlay[i].timeOutActive);
		};
		this.songsInPlay=[];
		$("#line").css('width',0);
  	}

	Timeline.prototype.secondsToPxInTimeline = function (second){
		return second*this.ratioSecondPixel;
	}

	Timeline.prototype.pxToSecondsInTimeline = function (px){
		return px/this.ratioSecondPixel;
	}

	Timeline.prototype.zoom = function(){
		if(this.songsInPlay.length == 0){

			var self = this;
			var lastRatio = this.ratioSecondPixel;

			if(this.ratioSecondPixel<=300)
			{

				this.ratioSecondPixel+=10;

				$(".track").each(function(){
					var widthPiste = $(this).width();
					var newWidth=widthPiste*self.ratioSecondPixel/lastRatio;
					$(this).css('width',newWidth);
				});
				this.redrawSongs(lastRatio);
			}
		}
	}

	Timeline.prototype.unzoom = function(){
		if(this.songsInPlay.length == 0){

			var self = this;
			var lastRatio = this.ratioSecondPixel;

			if(this.ratioSecondPixel>=15)
			{
				this.ratioSecondPixel-=10;

				$(".track").each(function(){
					var widthPiste = $(this).width();
					var newWidth=widthPiste*self.ratioSecondPixel/lastRatio;
					$(this).css('width',newWidth);
				});

				this.redrawSongs(lastRatio);
			}	
		}
	}

	Timeline.prototype.redrawSongs=function(lastRatio){
		var self = this;

		$('.track .song').each(function()
		{	
			var idSong = $(this).attr('data-song-id');
			var song = ResourcesHandler.getSong(idSong);
			$(this).css('width',self.ratioSecondPixel*song.getDuration());
			$(this).css('left',self.ratioSecondPixel*$(this).position().left/lastRatio);
		});
		this.setTimelapse();
	}

	Timeline.prototype.setTimelapse = function(){
		$('#timeInfo').css('width', this.getDurationInPx());
		$('#timeInfo').empty();
		var everyTwentySecond = this.secondsToPxInTimeline(20);
		var second = 0;
		for (var i = 0; i < this.getDurationInPx(); i+=everyTwentySecond) {
			var lapseLine=$('<div class="lapseLine"><span>'+second+'</span></div>');
			lapseLine.css('left',i);
			$('#timeInfo').append(lapseLine);
			second+=20;
		}
	}

	Timeline.prototype.getDurationInPx=function(){
		return this.duration*this.ratioSecondPixel;
	}

	return Timeline;
});
