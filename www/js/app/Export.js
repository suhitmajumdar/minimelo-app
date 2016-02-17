define(function( require ) {
  
  'use strict';

  var ResourcesHandler = require('app/ResourcesHandler');
  var Timeline = require('app/Timeline');
  var audioCtx = new AudioContext();

  function Export () {
    this.tracks=[];
  }

  Export.prototype.mergeTrack = function(track){
    var durationTrack     = this.getEndTrack(track);
    var bufferTrackLength = durationTrack*audioCtx.sampleRate;
    var bufferTrack=new Float32Array(bufferTrackLength);
    
    for (var i = 0; i < track.length; i++) {
      var begin           = track[i].begin;
      var song            = track[i].song;
      var dataSong        = song.buffer.getChannelData(0);
      var lengthDataSong  = dataSong.length;
      var offsetSong      = Math.round(begin*audioCtx.sampleRate);

      for (var k = 0; k < lengthDataSong; k++) {
        
        bufferTrack[offsetSong + k] = dataSong[k];
      
      };
    };
    return bufferTrack;
  }

  Export.prototype.getEndTrack = function(track){
    var endTrack   = 0;
    var nbSongTrack = track.length;
    for (var i = 0; i < nbSongTrack; i++) 
    {
      var begin  = track[i].begin;
      var song   = track[i].song;
      var endSong= begin+song.buffer.duration;

      if(endTrack<endSong){
        endTrack=endSong;
      }
    }
    return endTrack;
  }

  // Export.prototype.playBufferTest=function(arraybuffer){
  //   var buffer = audioCtx.createBuffer(1, arraybuffer.length, audioCtx.sampleRate);
  //   var data =buffer.getChannelData(0);
  //   for (var i = 0; i < data.length; i++) {
  //     data[i]=arraybuffer[i];
  //   };

  //   var source = audioCtx.createBufferSource();
  //   // set the buffer in the AudioBufferSourceNode
  //   source.buffer = buffer;
  //   // connect the AudioBufferSourceNode to the
  //   // destination so we can hear the sound
  //   source.connect(audioCtx.destination);
  //   // start the source playing
  //   source.start();
  // }

  Export.prototype.mergeAllBuffers = function(){
    var tracksBuffer=[];
    var maxLenghtTrack=0;

    for (var i = 0; i < this.tracks.length; i++){

      var track=this.tracks[i];
      var bufferTrack=this.mergeTrack(track);
      if(maxLenghtTrack<bufferTrack.length){
        maxLenghtTrack=bufferTrack.length;
      }
      tracksBuffer.push(bufferTrack);
    }

    var finalBuffer = audioCtx.createBuffer(1, maxLenghtTrack, audioCtx.sampleRate);
    var output = finalBuffer.getChannelData(0);
    
    for(var i=0;i<tracksBuffer.length;i++)
    { 
      var newValue = 0;
      var bufferToAdd=tracksBuffer[i];
      var bufferToAddLenght=bufferToAdd.length;

      for (var j = 0; j < bufferToAddLenght; j++) {
        output[j]+=bufferToAdd[j];
      }
      
    };

    return finalBuffer;
  }

  Export.prototype.saveAsMp3 = function(buffer,nameComposition){
    var worker = new Worker('js/lib/RecordWorker.js');
      
      worker.postMessage({
        config: {
          sampleRate  : buffer.sampleRate,
          numChannels : 1,
          buffer      : buffer.getChannelData(0)
        }
      });

      // callback for `exportWAV`
      worker.onmessage = function( event ) {
        var blobMp3=event.data;


        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+"/undefined", function (fileSystem) {

          fileSystem.getFile(nameComposition, {create: true, exclusive: false}, function(fileEntry){
                  
          fileEntry.createWriter(function(writer){
            writer.onwriteend=function(evt){
              console.log("audio enregistre "+nameComposition);
              $("#success-export").addClass("active");
              $("#overlay-traitement").removeClass("active");
            }
              writer.write(blobMp3);

          }, fail);

        }, fail);

        },fail);
        

      };

  }

  function fail(error) {
    console.log(error.code);
  }

  Export.prototype.buildTracks = function ()
  {
    this.tracks=[];
    var tracksDiv = timeline.querySelectorAll('.track');
    
    for (var i = 0; i < tracksDiv.length; i++) {
      var trackDiv=tracksDiv[i];
      var trackSongs=[];
      var songsDiv=trackDiv.querySelectorAll('.song');

      for (var k = 0; k < songsDiv.length; k++) {
        var songDiv   = songsDiv[k];
        var idSong    = $(songDiv).attr('data-song-id');
        var song      = ResourcesHandler.getSong(idSong);
        var xSong     = $(songDiv).position().left;
        var beginSong = Timeline.pxToSecondsInTimeline(xSong);
        
        trackSongs.push({song:song,begin:beginSong});
      };

      this.tracks.push(trackSongs);
    
    };
    console.log(this);
  }

  Export.prototype.exportMp3 = function (nameComposition){
    this.buildTracks();
    var finalBuffer = this.mergeAllBuffers();
    this.saveAsMp3(finalBuffer,nameComposition);
  }

  // Export.prototype.playTrackTest=function(idTrack){
  //   this.buildTracks();
  //   var track=this.tracks[idTrack];
  //   var bufferTrack= this.mergeTrack(track);
  //   console.log(track);
  //   // console.log(bufferTrack);
  //   this.playBufferTest(bufferTrack);
  // }

  // Export.prototype.playExportTest=function(){
  //   this.buildTracks();
  //   var finalBuffer = this.mergeAllBuffers();
  //   this.playBufferTest(finalBuffer);
  // }

  return Export;

});
