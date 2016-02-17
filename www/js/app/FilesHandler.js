define( function ( require ) {


	var Song = require('app/Song');

	var directoriesUrl = {
		"indefini": cordova.file.externalDataDirectory+"indefini",
		"save": cordova.file.externalDataDirectory+"save",
		"record": cordova.file.externalDataDirectory+"record",
		"type-1": cordova.file.externalDataDirectory+"type-1",
		"type-2": cordova.file.externalDataDirectory+"type-2",
		"type-3": cordova.file.externalDataDirectory+"type-3",
		"type-4": cordova.file.externalDataDirectory+"type-4",
		"type-5": cordova.file.externalDataDirectory+"type-5",
		"type-6": cordova.file.externalDataDirectory+"type-6",
		"type-7": cordova.file.externalDataDirectory+"type-7",
		"type-8": cordova.file.externalDataDirectory+"type-8",
		"originalApplication": cordova.file.applicationDirectory+"www/audio",
		"application" : cordova.file.externalDataDirectory
	}

	function FilesHandler() {
		this.filesDirectories  = {};
	}

	FilesHandler.prototype.loadSongs = function( soundsArray ) {

		var self = this;

		return new Promise(function (resolve, reject) {

			window.resolveLocalFileSystemURL(directoriesUrl.application, resolve, reject);
			
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
			
			window.resolveLocalFileSystemURL(directoriesUrl.application,resolve,reject);
		
		}).then(function(entryToCopy){

			console.log(entryToCopy);
				
			return new Promise(function (resolve, reject) {

			window.resolveLocalFileSystemURL(directoriesUrl.originalApplication, resolve, reject);
			
			}).then(function(fileSystem){
				console.log(fileSystem);
				var directoryReader = fileSystem.createReader();

				return new Promise(function(resolve,reject){
					directoryReader.readEntries(resolve,reject);
				});

			}).then(function(directories){
				var promises = [];
				for (var i = 0; i < directories.length; i++) {
					var directory   = directories[i];

					var promise = new Promise(function(resolve,reject){
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
	}

	FilesHandler.prototype.moveSound = function (sound,destination) {
    	return new Promise(
    		function(resolve,reject){
				sound.fileEntry.moveTo(destination, sound.fileEntry.name, success, fail); 
    		}
    	);
	}

	FilesHandler.prototype.saveRecord = function (blobData,fileName) {
		return this.saveFile(blobData,fileName,directoriesUrl.record);
	}

	FilesHandler.prototype.saveComposition = function (blobData,fileName) {
		return this.saveFile(blobData,fileName,directoriesUrl.save);
	}

	FilesHandler.prototype.saveFile = function(blobData,fileName,directory) {
		
		var fileEntryForSong=null;

		return new Promise(function(resolve,reject){
			window.resolveLocalFileSystemURL(directory,resolve,reject);
		}).then(function(fileSystem){
			return new Promise(function(resolve,reject){
				fileSystem.getFile(fileName,{create: true, exclusive: false},resolve,reject);
			})
		}).then(function(fileEntry){
			fileEntryForSong=fileEntry;
			return new Promise(function(resolve,reject){
				fileEntry.createWriter(resolve,reject);
			});
		}).then(function(writer){
			return new Promise(function(resolve,reject){
				writer.onwriteend=resolve;
				writer.write(blobData);
			});
		}).then(function(evt){
			// console.log("audio enregistre "+fileName);
			// var song = new Song("record", fileEntryForSong.nativeURL);
			// song.fileEntry = fileEntryForSong;
			$("#success-export").addClass("active");
			$("#traitement-popup").removeClass("active");
			$('.panel').removeClass('active');
			$('#panel-compose').addClass('active');

			return Promise.resolve(fileEntryForSong);

		});



		// return new Promise(function(resolve,reject){
		// 	console.log(blobData,fileName,directory);
		// 	window.resolveLocalFileSystemURL(directory,resolve,reject);
		// }).then(function(fileSystem){
		// 	console.log(fileSystem);
		// 	return new Promise(function(resolve,reject){
		// 		fileSystem.getFile(fileName,{create: true, exclusive: false},resolve,reject);
		// 	})
		// }).then(function(fileEntry){
		// 	console.log(fileEntry);
		// 	return new Promise(function(resolve,reject){
		// 		fileEntry.createWriter(resolve,reject);
		// 	}).then(function(writer){
		// 	console.log(writer);
		// 	console.log(fileEntry);

		// 	return new Promise(function(resolve,reject){
		// 		writer.onwriteend=resolve;
		// 		writer.write(blobData);

		// 		var song = new Song(this.name, file.nativeURL);
		// 		song.fileEntry = fileEntry;
		// 		soundsArray.push(song);

		// 	});
		// }).then(function(){
		// 	console.log("audio enregistre "+fileName);
		// 	$("#success-export").addClass("active");
		// 	$("#traitement-popup").removeClass("active");
		// 	$('.panel').removeClass('active');
		// 	$('#panel-compose').addClass('active');
		// });;
		// })

		// return new Promise(function(resolve,reject){
		// 	console.log(blobData,fileName,directory);
		// 	window.resolveLocalFileSystemURL(directory,resolve,reject);
		// }).then(function(fileSystem){
		// 	console.log(fileSystem);
		// 	return new Promise(function(resolve,reject){
		// 		fileSystem.getFile(fileName,{create: true, exclusive: false},resolve,reject);
		// 	})
		// }).then(function(fileEntry){
		// 	console.log(fileEntry);
		// 	return new Promise(function(resolve,reject){
		// 		fileEntry.createWriter(resolve,reject);
		// 	});
		// }).then(function(writer){
		// 	console.log(writer);
		// 	return new Promise(function(resolve,reject){
		// 		writer.onwriteend=resolve;
		// 		writer.write(blobData);
		// 	});
		// }).then(function(){
		// 	console.log("audio enregistre "+fileName);
		// 	$("#success-export").addClass("active");
		// 	$("#traitement-popup").removeClass("active");
		// 	$('.panel').removeClass('active');
		// 	$('#panel-compose').addClass('active');
		// });

		// window.resolveLocalFileSystemURL(directory, function (fileSystem) {

		// 		fileSystem.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){
								
		// 		fileEntry.createWriter(function(writer){
		// 			writer.onwriteend=function(evt){
		// 				console.log("audio enregistre "+fileName);
		// 				$("#success-export").addClass("active");
		// 				$("#traitement-popup").removeClass("active");
		// 				$('.panel').removeClass('active');
		// 				$('#panel-compose').addClass('active');
		// 			}
		// 		    writer.write(blobData);

		// 		}, fail);

		// 	}, fail);

		// 	}, function(error){
		// 		console.log(error);
		// 	});
	}

	return FilesHandler;

})