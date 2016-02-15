define(function( require ){

	'use strict';

	var Song         = require('app/Song');
	var Utils        = require('app/Utils');
	var FilesHandler = require('app/FilesHandler');


	// distinction between not indexed and not classified ( ie usable sounds that are not in a collection )
	var unwantedTypes     = ['indefini'];
	var unclassifiedTypes = ['indefini'];
	
	var audioCtx    = new AudioContext();

	function ResourcesHandler() {
		this.songs           = [];
		this.songsByType     = {};

		this.sourceInPreview = null;
		this.filesHandler     = new FilesHandler();
	}

	ResourcesHandler.prototype.postProcessing = function () {

		this.songs.sort(compare);

		for (var index in this.songs) {
			var song = this.songs[index];
			if(this.songsByType[song.type] == undefined)
				this.songsByType[song.type] = [];
			this.songsByType[song.type].push(song);
		}

	}

	ResourcesHandler.prototype.playPreview = function(idSong) {

		if(this.sourceInPreview != null) {
			this.sourceInPreview.stop();
		}

		if(this.songs[idSong].buffer != null) {
			this.sourceInPreview = this.songs[idSong].play();
		} else {
			var self = this;

			this.songs[idSong].playForPreview().then( function(source) {
				self.sourceInPreview = source;
			});
		}
	}

	ResourcesHandler.prototype.loadSong = function(id) {
		console.log(id);
		console.log(this.songs[id]);
		this.songs[id].load();
	}

	ResourcesHandler.prototype.getSong = function( id ) {

		for ( var song in this.songs )
		{
			if (this.songs[song].id == id) {
				return this.songs[song];
			}
		}

		return null;
	}

	ResourcesHandler.prototype.getSongs = function() {
		return this.songs;
	}

	ResourcesHandler.prototype.getTypes = function() {
		return Object.keys(this.songsByType);
	}

	ResourcesHandler.prototype.getActivesTypes = function() {

		var actives = this.getTypes().filter(function(x) {
			return unwantedTypes.indexOf(x) < 0;
		});

		return actives;
	}

	// todo : need to fix this to avoid unnecessary redundant calculus
	ResourcesHandler.prototype.getActivesCollections = function() {

		var actives = {};

		for ( var type in this.songsByType ) {
			if( unwantedTypes.indexOf( type ) < 0 )
				actives[type] = this.songsByType[type];
		}

		return actives;
	}

	// todo : need to fix this to avoid unnecessary redundant calculus
	ResourcesHandler.prototype.getNotClassifiedCollections = function() {

		var notClassified = {};

		for ( var type in this.songsByType ) {
			if( !(unclassifiedTypes.indexOf( type ) < 0) )
				notClassified[type] = this.songsByType[type];
		}

		return notClassified;
	}

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	}

	return ResourcesHandler;
});