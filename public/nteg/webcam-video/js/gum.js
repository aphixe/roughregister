var video = document.querySelector('video');
var canvas = document.querySelector('rec');
var localMediaStream = null;
var fs = null; // file system 
var error = 0; // if file system API error
var _stop = false; // if user presses stop
var frames = 0; // index for the image files (files0 files1 etc)
var _files = []; // store the path of the images recoreded

function Success(stream) {
    // window.stream = stream;
    if ('mozSrcObject' in video) {
        video.mozSrcObject = stream;
    } else if (window.webkitURL) {
        video.src = window.webkitURL.createObjectURL(stream);
    } else {
        video.src = stream;
    }
    video.play();
}

function Error(error1) {
    console.error('Error on getUserMedia', error1);
}

function Init() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, Success, Error);
    }
}


document.getElementById('play').addEventListener('click', Init, Error);