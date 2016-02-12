define(function( require ){

	var Song       = require('app/Song');
	var Utils      = require('app/Utils');

	var audioCtx   = new AudioContext();

	var unwantedTypes = ['indefini'];

	'use strict';

	function ResourcesHandler() {
		this.songs      = [];

		this.filesDirectories  = {};
		this.songsDirectories  = {};
		this.sourceInPreview   = null;
	}

	ResourcesHandler.prototype.playPreview=function(idSong){

		if(this.songs[idSong].buffer != null){
			if(this.sourceInPreview != null){
				this.sourceInPreview.stop();
			}
			this.sourceInPreview = this.songs[idSong].play();
		} else {
			var self = this;

			this.songs[idSong].playForPreview().then(function(source) {
				
				if(self.sourceInPreview != null){
					self.sourceInPreview.stop();
				}
				self.sourceInPreview=source;
				
			});
		}
	}

	ResourcesHandler.prototype.loadSongs = function() {

		var self=this;

		return new Promise(function (resolve, reject) {

			window.resolveLocalFileSystemURL("file:///sdcard/Minimelo", resolve, reject);
			
		}).then(function(fileSystem){
			var directoryReader = fileSystem.createReader();

			return new Promise(function(resolve,reject){
				directoryReader.readEntries(resolve,reject);
			});

		}).then(function(directories){
			var promises = [];
			for (var i = 0; i < directories.length; i++) {
				var directory   = directories[i];
				var reader      = directory.createReader();
				directory.files = [];
				self.songsDirectories[directory.name] = [];

				var promise = new Promise(function(resolve,reject){
					reader.readEntries(resolve.bind(directory),reject);
				});
				promise.then(function(files){
					for (var j = 0; j < files.length; j++) {
						var file=files[j];
						this.files.push(file);

						var song = new Song(this.name,file.nativeURL);
						song.fileEntry = file;
						self.songs.push(song);
						self.songsDirectories[this.name].push(song);
					};
					self.filesDirectories[this.name] = this;
				}.bind(directory));

				promises.push(promise);

			};

			return Promise.all(promises);

		});

	}

	ResourcesHandler.prototype.loadSong = function(idNewSong) {
		this.songs[idNewSong].load();
	}

	ResourcesHandler.prototype.loadTestSongs = function() {

		var self = this;
		for ( var type in ressources )
		{
			var songsOfType = ressources[type];
			for ( var i in songsOfType )
			{
				var urlSong = songsOfType[i];
				self.songs.push(new Song(type, urlSong));
			}
		}
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

	ResourcesHandler.prototype.getIdFirstSongType = function(type) {
		var found = false;
		var id 	  = 0;

		while ( found == false && id < this.songs.length)
		{
			if ( this.songs[id].type == type)
			{
				found = true;
			}
			id++;
		}
		if(found)
			return id-1;
		else
			return -1;
	}

	ResourcesHandler.prototype.getIdFirstSongUrl = function(url) {
		var found = false;
		var id 	  = 0;

		while ( found == false && id < this.songs.length)
		{
			if ( this.songs[id].url == url)
			{
				found = true;
			}
			id++;
		}
		if(found)
			return id-1;
		else
			return -1;
	}

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	}

	ResourcesHandler.prototype.getTypes = function() {
		return Object.keys(this.songsDirectories);
	}

	ResourcesHandler.prototype.getActivesTypes = function() {

		var actives = this.getTypes().filter(function(x) {
			return unwantedTypes.indexOf(x) < 0;
		});

		return actives;
	}

	return ResourcesHandler;
});