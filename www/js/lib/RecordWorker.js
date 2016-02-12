importScripts('lame.min.js');

var liblame = new lamejs();

var buffer,
  sampleRate,
  numChannels;

this.onmessage = function(e){
  sampleRate = e.data.config.sampleRate;
  numChannels = e.data.config.numChannels;
  buffer = e.data.config.buffer;
  exportMP3();
};

function exportMP3(){
  
  var arrayBuffer = encodeBufferInt16(buffer);

  var samples = new Int16Array(arrayBuffer);

  var blobMp3=encodeMono(numChannels, sampleRate, samples);
  
  this.postMessage(blobMp3);

}

function encodeMono(channels, sampleRate, samples) {
    var buffer = [];
    var mp3enc = new liblame.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var maxSamples = 1152;
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var mono = samples.subarray(i, i + maxSamples);
        var mp3buf = mp3enc.encodeBuffer(mono);
        if (mp3buf.length > 0) {
            buffer.push(new Int8Array(mp3buf));
        }
        remaining -= maxSamples;
    }
    var d = mp3enc.flush();
    if(d.length > 0){
        buffer.push(new Int8Array(d));
    }
    return new Blob(buffer, {type: 'audio/mp3'});
}

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function encodeBufferInt16(samples){
  var buffer = new ArrayBuffer(samples.length * 2);
  var view = new DataView(buffer);

  floatTo16BitPCM(view, 0, samples);
  console.log(samples.length);

  return buffer;
}