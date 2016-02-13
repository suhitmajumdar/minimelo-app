define(function( require ) {

	var ResourcesHandler  = require('app/ResourcesHandler');
	var Timeline 		  = require('app/Timeline');

	function SoundElements() {
		this.initButtonsSongs();
		this.initButtonsModal();
	}

	SoundElements.prototype.initButtonsSongs = function () {

		var types = ResourcesHandler.getActivesTypes();
		var self=this;
		for ( var type in types ) {
			var buttonSong = $('<div class="button disabled soundChoose"></div>');
			buttonSong.attr('type', types[type]);
			buttonSong.append("<span class='numberSong'></span>")

			$('#buttons-songs').append(buttonSong);

		}

		$('#songsSelector').modal('show');
	}

	SoundElements.prototype.initButtonsModal = function () {

		var songsByType = ResourcesHandler.songsDirectories;

		for ( var type in songsByType )
		{
			if(type != "indefini") {
				
				var containerLine=$('<div class="container-line">');

				var line=$("<div type="+type+"></div>");

				containerLine.append(line);

				$("#choose-song").append(containerLine);
				
				var songs = songsByType[type];

				for ( var song in songs)
				{
					var buttonSong=$('<div class="button"></div>');
					buttonSong.attr('type',type);
					buttonSong.attr('data-song-id', songs[song].id);

					buttonSong.append("<span>" + ++song  + "</span>");

					line.append(buttonSong);
				}

				var cloneLine = line.clone();

				line.css('width',songs.length*$('#choose-song .button').outerWidth());

				cloneLine.addClass('quick-select');
				cloneLine.append($('<div class="round_btn validate_btn"></div>'));

				$('#buttons-songs .button[type="'+type+'"]').append(cloneLine);


			}
		}
	}

	// SoundElements.prototype.createDivSong= function(soundButton){

	// 	var divSong    = $("<div class='song'></div>");

	// 	var idSong     = $(soundButton).attr('data-song-id');
	// 	var song       = ResourcesHandler.getSong(idSong);
	// 	var widthSong  = Timeline.secondsToPxInTimeline(song.getDuration());
	// 	var colorClass = divSong.css('background-color');


	// 	divSong.attr('type',song.type);
	// 	divSong.append("<span class='numberSong'>" + $(soundButton).find('span.numberSong').text() + "</span>")
	// 	divSong.attr('data-song-id',idSong);
	// 	divSong.attr('originalBgColor', colorClass);
	// 	divSong.width(widthSong);

	// 	return divSong;

	// }

	return SoundElements;

})