define( function ( require ) {


	var Song = require('app/Song');

	function FilesHandler() {
		this.filesDirectories  = {};
		
	}

	FilesHandler.prototype.loadSongs = function( soundsArray ) {

		var self = this;

		return new Promise(function (resolve, reject) {

			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, resolve, reject);
			
		}).then(function(fileSystem){
			var directoryReader = fileSystem.createReader();

			return new Promise(function(resolve,reject){
				directoryReader.readEntries(resolve,reject);
			});

		}).then(function(directories){
			console.log(directories);
			var promises = [];
			for (var i = 0; i < directories.length; i++) {
				var directory   = directories[i];
				var reader      = directory.createReader();
				directory.files = [];

				var promise = new Promise(function(resolve,reject){
					reader.readEntries(resolve.bind(directory),reject);
				}).then(function(files){
					for (var j = 0; j < files.length; j++) {
						var file = files[j];
						this.files.push(file);

						var song = new Song(this.name, file.nativeURL);
						song.fileEntry = file;
						soundsArray.push(song);
					}
					self.filesDirectories[this.name] = this;
				}.bind(directory));

				promises.push(promise);

			}

			return Promise.all(promises);

		});

	}

	FilesHandler.prototype.initDefaultsSongs = function( soundsArray ) {
		
		return new Promise(function(resolve,reject){
			
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,resolve,reject);
		
		}).then(function(entryToCopy){

				
			return new Promise(function (resolve, reject) {

			window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+"/www/audio", resolve, reject);
			
			}).then(function(fileSystem){
				var directoryReader = fileSystem.createReader();

				return new Promise(function(resolve,reject){
					directoryReader.readEntries(resolve,reject);
				});

			}).then(function(directories){
				console.log(directories);
				var promises = [];
				for (var i = 0; i < directories.length; i++) {
					var directory   = directories[i];

					var promise = new Promise(function(resolve,reject){
						console.log(entryToCopy,'entryToCopy');
						directory.copyTo(entryToCopy,directory.name,resolve,reject);
					}).then(function(data){
						console.log(data);
					},function(error){
						console.log(error);
					});

					promises.push(promise);

				}

				return Promise.all(promises);

			});
		});

		// return new Promise(function(resolve,reject){
		// 	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,success,fail);
		// }).then(function(entryToCopy){

		// 	return new Promise(function (resolve, reject) {

		// 	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+"/www/audio", resolve, reject);
			
		// 	}).then(function(fileSystem){
		// 		var directoryReader = fileSystem.createReader();

		// 		return new Promise(function(resolve,reject){
		// 			directoryReader.readEntries(resolve,reject);
		// 		});

		// 	}).then(function(directories){
		// 		console.log(directories);
		// 		var promises = [];
		// 		for (var i = 0; i < directories.length; i++) {
		// 			var directory   = directories[i];

		// 			var promise = new Promise(function(resolve,reject){
		// 				directory.copyTo(entryToCopy,directory.name,resolve,reject);
		// 			}).then(function(data){
		// 				console.log(data);
		// 			},function(error){
		// 				console.log(error);
		// 			});

		// 			promises.push(promise);

		// 		}

		// 		return Promise.all(promises);

		// 	});
		// });
		


		

	}

	FilesHandler.prototype.loadTestSongs = function() {

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

	FilesHandler.prototype.moveSound = function (sound,destination) {
    	return new Promise(
    		function(resolve,reject){
				sound.fileEntry.moveTo(destination, sound.fileEntry.name, success, fail); 
    		}
    	);
	}

	FilesHandler.prototype.saveRecord = function () {

	}

	FilesHandler.prototype.saveComposition = function () {

	}

	function saveFile ( file, path ) {

	}

	return FilesHandler;

})