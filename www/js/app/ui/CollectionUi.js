define( function ( require ) {

	// sorted_sounds
	// sorting_colors
	// sound_to_sort

	var ResourcesHandler = require('app/ResourcesHandler');

	function CollectionUi() {
		this.displayCollection();
	}

	CollectionUi.prototype.displayCollection = function () {
		this.initSortedSounds();
		this.initNotSortedSounds();
	}

	CollectionUi.prototype.initSortedSounds = function () {
		var collection = ResourcesHandler.getActivesCollections();

		$('#sorted_sounds').empty();

		for( var type in collection ) {
			for ( var sound in collection[type] ) {
				this.addSoundButtonToElement(collection[type][sound] , $('#sorted_sounds'));
			}	
		}
	}

	CollectionUi.prototype.initNotSortedSounds = function () {
		var collection = ResourcesHandler.getNotClassifiedCollections();

		$('#sound_to_sort').empty();

		for ( var type in collection ) {
			for ( var sound in collection[type] ) {
				this.addSoundButtonToElement(collection[type][sound] , $('#sound_to_sort'));
			}	
		}
	}


	CollectionUi.prototype.addSoundButtonToElement = function ( sound, element ) {
		var newButton = $('<div class="button" type="' + sound.type + '" data-song-id="' + sound.id + '"></div>');

		element.append(newButton);
	}


	return CollectionUi;

})