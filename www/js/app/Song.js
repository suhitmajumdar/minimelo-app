define(function( require ) {
	
	'use strict';

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	
	var lastId   = 0;

	function Song( type, url ) {
		this.id        = lastId++;
		this.url       = url;
		this.type      = type;
		this.buffer    = null;
		this.startTime = 0;
		this.stopTime  = 0;
	}

	Song.prototype.loadByFile = function () {
		var self = this;

		return new Promise(function (resolve, reject) {
			
			window.resolveLocalFileSystemURL(self.url,resolve,reject);
			
		}).then(function(fileEntry){

			return new Promise(function(resolve,reject){
				fileEntry.file(resolve,reject);
			});

		}).then(function(file){
			
			return new Promise(function(resolve,reject){
				var reader = new FileReader();

                reader.onloadend = resolve;

                reader.readAsArrayBuffer(file);
				
			});

		}).then(function(e){
			var arrayBuffer=e.target.result;
			return new Promise(function(resolve,reject){
				audioCtx.decodeAudioData(arrayBuffer,resolve,reject);  
			});
		}).then(

			function(audioBuffer){
				self.buffer=audioBuffer;
			},
			function(){
				console.log("Impossible de lire "+self.url);
				$('.button[data-song-id="'+self.id+'"]').addClass('disabled');
				
			}
		);

	}

	Song.prototype.playForPreview = function ( ) {
		var self = this;

		return self.loadByFile().then(function(){
			var source=self.play();
			self.buffer=null;
			return Promise.resolve(source);
		});
	}

	Song.prototype.playWithTime = function ( time ) {
		if ( this.buffer == null ) {
			throw "PlayWithTime error : buffer is not set, the sound has not been loaded.";
		}

		var source    = audioCtx.createBufferSource();
		source.buffer = this.buffer;
		source.connect(audioCtx.destination);
		source.start(audioCtx.currentTime + time);

		return source;
	};

	Song.prototype.play = function ()
	{
		return this.playWithTime(0);
	};

	Song.prototype.getDuration = function (){
		return this.buffer.duration;
	};

	Song.prototype.loaded = function() {
		return ( this.buffer != null )
	}

	return Song;

});