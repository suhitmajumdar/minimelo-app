define(function( require ){

	var Song       = require('app/Song');
	var Utils      = require('app/Utils');
	var ressources = require('app/ressources');

	var audioCtx   = new (window.AudioContext || window.webkitAudioContext)();

	'use strict';

	function ResourcesHandler() {
		this.songs      = [];
		this.loadedOnes = 0;
		this.loadable   = 0;
		this.filesDirectories = {};
		this.songsDirectories = {};
		this.numberDirectories=0;
		this.numberDirectoriesReaded=0;
		this.initApplication=null;
		this.sourceInPreview=null;
	}




	ResourcesHandler.prototype.playPreview=function(idSong){
		var self=this;

		if(self.songs[idSong].buffer!=null){
			if(self.sourceInPreview!=null){
				self.sourceInPreview.stop();
			}
			self.sourceInPreview=self.songs[idSong].play();
		}
		else{
			this.songs[idSong].playForPreview().then(function(source){
				
				if(self.sourceInPreview!=null){
					self.sourceInPreview.stop();
				}
				self.sourceInPreview=source;
				
			});
		}
	}

	ResourcesHandler.prototype.loadSongs = function() {

		var self=this;
		if (true)
		{

			return new Promise(function (resolve, reject) {
				
				window.resolveLocalFileSystemURL("file:///sdcard/Minimelo",resolve,reject);
			
			}).then(function(fileSystem){
				var directoryReader = fileSystem.createReader();

				return new Promise(function(resolve,reject){
					directoryReader.readEntries(resolve,reject);
				});

			}).then(function(directories){
				var promises=[];
				console.log(directories);
				for (var i = 0; i < directories.length; i++) {
					var directory=directories[i];
					var reader=directory.createReader();
					directory.files=[];
					self.songsDirectories[directory.name]=[];

					var promise=new Promise(function(resolve,reject){
						reader.readEntries(resolve.bind(directory),reject);
					});
					promise.then(function(files){
						for (var j = 0; j < files.length; j++) {
							var file=files[j];
	            			this.files.push(file);

	            			var song=new Song(this.name,file.nativeURL);
							song.fileEntry=file;
							self.songs.push(song);
							self.songsDirectories[this.name].push(song);
	            		};
	            		self.filesDirectories[this.name] = this;
					}.bind(directory));

					promises.push(promise);

				};
				
				return Promise.all(promises);

			});
			// window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	
		 //    var directoryReader = fileSystem.createReader();
			//     directoryReader.readEntries(function(directories) {
			//         var i;
			//         for (i=0; i<directories.length; i++) {
			//             if(directories[i].isDirectory===true){
			//             	var directory=directories[i];
			//             	var reader = directory.createReader();

			//             	directory.filesList=[];
			//             	reader.readEntries(function(files) {
			//             		for (var j = 0; j < files.length; j++) {
			//             			this.filesList.push(files[j]);           			      			
			//             		};
			//             		self.callbackDirectoryReaded(this);
			//             	}.bind(directory));
			//             }
			//         }
			//         self.callbackDirectories(directories.length);

			//     }, function (error) {
			//         console.log(error);
			//     });

			// }, function(error){
			// 	console.log(error);
			// });

		}
		else {
			this.loadTestSongs();
		}


	}

	ResourcesHandler.prototype.loadSong=function(idNewSong){
		this.songs[idNewSong].loadByFile();
	}

	ResourcesHandler.prototype.loadTestSongs = function() {

		var self = this;
		for ( var type in ressources )
		{
			var songsOfType=ressources[type];
			for ( var i in songsOfType )
			{
				var urlSong=songsOfType[i];
				self.songs.push(new Song(type,urlSong));
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

	ResourcesHandler.prototype.getTypes=function(){
		return Object.keys(this.songsDirectories);
	}

	return ResourcesHandler;
});

// define(function( require ){

// 	var Song       = require('app/Song');
// 	var Utils      = require('app/Utils');
// 	var ressources = require('app/ressources');

// 	var audioCtx   = new (window.AudioContext || window.webkitAudioContext)();

// 	'use strict';

// 	function ResourcesHandler() {
// 		this.songs      = [];
// 		this.loadedOnes = 0;
// 		this.loadable   = 0;
// 		this.getSongsByType();
// 	}

// 	ResourcesHandler.prototype.loadSongs = function() {


// 		if (false)
// 		{} // si on récupère pas la liste du prof
// 		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotFS, fail);

// 		function gotFS(fileSystem) {
// 			console.log(fileSystem); // what is this shit please ?
// 			fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
// 		}

// 		function gotFileEntry(fileEntry) {
// 			fileEntry.createWriter(gotFileWriter, fail);
// 		}

// 		function gotFileWriter(writer) {
// 			writer.onwriteend = function(evt) {
// 				console.log("contents of file now 'some sample text'");
// 				writer.truncate(11);
// 				writer.onwriteend = function(evt) {
// 					console.log("contents of file now 'some sample'");
// 					writer.seek(4);
// 					writer.write(" different text");
// 					writer.onwriteend = function(evt){
// 						console.log("contents of file now 'some different text'");
// 					}
// 				};
// 			};
// 			writer.write("some sample text");
// 		}

// 		function fail(error) {
// 			console.log(error.code);
// 		}
// 		else {
// 			this.loadTestSongs();
// 		}


// 	}

// 	ResourcesHandler.prototype.loadTestSongs = function() {

// 		var self = this;
// 		for ( var type in ressources )
// 		{
// 			var songsOfType=ressources[type];
// 			for ( var i in songsOfType )
// 			{
// 				var urlSong=songsOfType[i];
// 				self.songs.push(new Song(type,urlSong));
// 			}
// 		}
// 	}

// 	ResourcesHandler.prototype.getSong = function( id ) {

// 		for ( var song in this.songs )
// 		{
// 			if (this.songs[song].id == id) {
// 				return this.songs[song];
// 			}
// 		}

// 		return null;
// 	}

// 	ResourcesHandler.prototype.getSongs = function() {
// 		return this.songs;
// 	}

// 	ResourcesHandler.prototype.getSongsByType = function() {
// 		var songsByType = {};

// 		for ( var song in this.songs )
// 		{
// 			if(songsByType[this.songs[song].type] == null)
// 			{
// 				songsByType[this.songs[song].type] = [];
// 			}
// 			songsByType[this.songs[song].type].push(this.songs[song]);
// 		}

// 		return songsByType;

// 	}

// 	ResourcesHandler.prototype.getInstance = function() {
// 		return this;
// 	}

// 	return ResourcesHandler;
// });
