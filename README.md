# Mini Mélo

Mini Mélo is an educational app for recognizing and playing with sounds. 
You can use the defaults sounds or record your voice or sounds to play with them too !

## How to install ?

### Prerequisites

To run Minimelo, you will need an android 5.0+ device.

However, you can try the app in your browser by running a simple server on the www folder.

### Quickstart

You can install cordova by following instructions [here](https://cordova.apache.org/#getstarted)

### Run on cordova or phonegap

Add the android platform

	cordova/phonegap platform add android

then run : 

	cordova/phonegap run android


## Developer tools 

### How to use scss and gulp

Install gulp in your minimelo directory by running

	npm install gulp
	
then run :

	gulp

### Add plugin to application
cordova plugin add org.apache.cordova.file
cordova plugin add org.apache.cordova.file-transfer
cordova plugin add cordova-plugin-chrome-apps-audiocapture --save
