var promise = new Promise(function (resolve, reject) {

			// window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, resolve, reject);
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, resolve, reject);
			// window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, resolve, reject);
			
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
				var promise = new Promise(function(resolve,reject){
					reader.readEntries(resolve,reject);
				}).then(function(files){
					console.log(files);
				});

				promises.push(promise);

			}

			return Promise.all(promises);

		});



		var promise = new Promise(function (resolve, reject) {

			// window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, resolve, reject);
			window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+"/www/audio", resolve, reject);
			// window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, resolve, reject);
			
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
				var promise = new Promise(function(resolve,reject){
					reader.readEntries(resolve,reject);
				}).then(function(files){
					console.log(files);
				});

				promises.push(promise);

			}

			return Promise.all(promises);

		});



		var promise= new Promise(function(resolve,reject){
			
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


		var idInterval={
			id:
		};
	    idInterval=setInterval(function(){
			// clearInterval(this);
			// console.log("test");
		}.bind(idInterval));



		var ressources = require('app/RessourcesHandler');
		console.log(ressources);