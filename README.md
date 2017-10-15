# Mini Mélo

Mini Mélo is an educational app for recognizing and playing with sounds. 
You can use the defaults sounds or record your voice or sounds to play with them too !

## How to install ?

### Prerequisites

To run Minimelo, you will need an android 5.0+ device.

### Quickstart

You can install cordova by following instructions [here](https://cordova.apache.org/#getstarted)

### Run on cordova or phonegap

Add the android platform

	cordova/phonegap platform add android

then run : 

	cordova/phonegap run android

### Add some sounds to your project

You can download the default sound pack [here]() and you just have to add it on www/audio or directly on your tablet, on Android/data/io.cordova.minimelo/files/


## Developer tools 

### How to use scss and gulp

Install gulp in your minimelo directory by running

	npm install gulp
	
then run :

	gulp

### Add needed plugins to the application

	cordova plugin add org.apache.cordova.file
	cordova plugin add org.apache.cordova.file-transfer
	cordova plugin add cordova-plugin-chrome-apps-audiocapture --save


## Thanks 

Special thanks to the LAME.JS team, their work is available [here](https://github.com/zhuker/lamejs), you can also check [their website](http://lame.sourceforge.net/) 

