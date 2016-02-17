define(function( require ) {

	var ResourcesHandler  = require('app/ResourcesHandler');
	var Timeline 		  = require('app/Timeline');

	function SoundElements() {
		this.initButtonsSongs();
		this.initButtonsModal();
	}

	SoundElements.prototype.reload = function () {
		$("#buttons-songs").empty();
		$("#choose-song").empty();

		this.initButtonsSongs();
		this.initButtonsModal();
	}

	SoundElements.prototype.initButtonsSongs = function () {

		var types = ResourcesHandler.getActivesTypes();

		for ( var type in types ) {
			var buttonSong = $('<div class="button disabled soundChoose"></div>');
			buttonSong.attr('type', types[type]);
			buttonSong.append("<span class='numberSong'></span>")

			$('#buttons-songs').append(buttonSong);

		}
	}

	SoundElements.prototype.initButtonsModal = function () {

		var songsByType = ResourcesHandler.getActivesCollections();

		for ( var type in songsByType )
		{
			var containerLine = $('<div class="container-line">');

			var line = $("<div type="+type+"></div>");

			containerLine.append(line);

			$("#choose-song").append(containerLine);

			var songs = songsByType[type];

			for ( var song in songs )
			{
				var buttonSong = $('<div class="button"></div>');
				buttonSong.attr('type',type);
				buttonSong.attr('data-song-id', songs[song].id);

				buttonSong.append("<span>" + ++song  + "</span>");

				line.append(buttonSong);
			}

			var cloneLine = line.clone();

			line.css('width',songs.length*$('#choose-song .button').outerWidth());

			//todo : get this out
			cloneLine.addClass('quick-select');
			cloneLine.append($('<div class="round_btn validate_btn"></div>'));

			$('#buttons-songs .button[type="'+type+'"]').append(cloneLine);
		}
	}

	return SoundElements;

})