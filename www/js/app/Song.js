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

	Song.prototype.load = function () {
		var self = this;

		$.ajax({
			url: self.url,
			xhrFields : {responseType : 'arraybuffer'},
		}).done(function(arrayBuffer){

			audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
				self.buffer = buffer;
				
		  }, function(e) {"Error with decoding audio data" + e.err;} );  
		});

	}

	Song.prototype.loadAndPlayOnce = function ( ) {
		var self = this;

		$.ajax({
			url: self.url,
			xhrFields : {responseType : 'arraybuffer'},
		}).done(function(arrayBuffer){

			audioCtx.decodeAudioData(arrayBuffer, function( buffer ) {
				var source    = audioCtx.createBufferSource();
				source.buffer = buffer;
				source.connect(audioCtx.destination);
				source.start(audioCtx.currentTime);

				return source;
				
		  }, function(e) {"Error with decoding audio data" + e.err;} );  
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

	Song.prototype.playOnce = function () 
	{
		var self = this;

		if( self.buffer != null ) 
		{
			this.play();
		}
		else
		{
			this.loadAndPlayOnce();
		}
	};

	Song.prototype.getDuration = function (){
		return this.buffer.duration;
	};

	Song.prototype.loaded = function() {
		return ( this.buffer != null )
	}

	return Song;

});

