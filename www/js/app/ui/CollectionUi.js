define( function ( require ) {

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
				addSoundButtonToElement(collection[type][sound] , $('#sorted_sounds'));
			}	
		}
	}

	CollectionUi.prototype.initNotSortedSounds = function () {
		var collection = ResourcesHandler.getNotClassifiedCollections();

		$('#sound_to_sort').empty();

		for ( var type in collection ) {
			for ( var sound in collection[type] ) {
				addSoundButtonToElement(collection[type][sound] , $('#sound_to_sort'));
			}	
		}
	}


	function addSoundButtonToElement ( sound, element ) {
		var newButton = $('<div class="button" type="' + sound.type + '" data-song-id="' + sound.id + '"></div>');

		element.append(newButton);
	}


	return CollectionUi;

})