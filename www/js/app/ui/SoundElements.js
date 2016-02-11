define(function( require ) {

	var ResourcesHandler  = require('app/ResourcesHandler');
	var Timeline 		  = require('app/Timeline');

	function SoundElements() {
		this.initButtonsModal();
		this.initButtonsSongs();
	}

	SoundElements.prototype.initButtonsSongs = function () {

		var types = ResourcesHandler.getActivesTypes();

		for ( var type in types ) {
			var buttonSong = $('<div class="button disabled"></div>');
			buttonSong.attr('type', types[type]);
			buttonSong.append("<span class='numberSong'></span>")

			$('#buttons-songs').append(buttonSong);

			buttonSong[0].ontouchstart=function(event){
				$(this).attr('xswip',event.touches[0].clientX);
			}
			buttonSong[0].ontouchmove=function(event){
				
				var xswip=$(this).attr('xswip');
				if(xswip<event.touches[0].clientX)
				{
					$(".quick-select").removeClass('active');
					$(this).find(".quick-select").addClass('active');
					$(this).addClass('qsopen');
				}
				else{
					$(this).find(".quick-select").removeClass('active');
					$(this).removeClass('qsopen');
				}
			}

		}

		$('#songsSelector').modal('show');
	}

	SoundElements.prototype.initButtonsModal = function () {


		var songsByType = ResourcesHandler.songsDirectories;

		for ( var type in songsByType )
		{
			if(type != "indefini"){
				
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

				var cloneLine=line.clone();

				line.css('width',songs.length*$('#choose-song .button').outerWidth());

				cloneLine.addClass('quick-select');
				cloneLine.append($('<div class="round_btn validate_btn"></div>'));

				$('#buttons-songs .button[type="'+type+'"]').append(cloneLine);
			}
		}
	}

	SoundElements.prototype.addSongTotrack = function(songButton, track, xOntrack)
	{
		var idSong    = $(songButton).attr('data-song-id');
		var song      = ResourcesHandler.getSong(idSong);
		var widthSong = Timeline.secondsToPxInTimeline(song.getDuration());
		var divSong   = $("<div class='song'></div>");
		var colorClass = divSong.css('background-color');

		divSong.attr('type',song.type);
		divSong.append("<span class='numberSong'>" + $(songButton).find('span.numberSong').text() + "</span>")
		divSong.attr('data-song-id',idSong);
		divSong.attr('originalBgColor', colorClass);
		divSong.css('left',xOntrack-widthSong/2);

		divSong.width(widthSong);

		track.append(divSong);


		return divSong;
	}

	return SoundElements;

})