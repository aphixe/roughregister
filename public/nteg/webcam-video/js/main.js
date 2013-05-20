var localStream;
var streamRecorder;

var audio = document.querySelector('audio');
var result = document.getElementById('result');

var btnStart = document.getElementById('btn_start');
var btnStop = document.getElementById('btn_stop');
var btnPlay = document.getElementById('btn_play');

var theAudio = document.getElementById('the_audio');

btnStop.disabled = true;
btnPlay.disabled = true;

audio.addEventListener('ended', function () {
    console.log('ended');
});


function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function Success(stream) {
    // window.stream = stream;
    if ('mozSrcObject' in audio) {
        audio.mozSrcObject = stream;
    } else if (window.webkitURL) {
        audio.src = window.webkitURL.createObjectURL(stream);
    } else {
        audio.src = stream;
    }
    //video.controls = false;
    localStream = stream;
    streamRecorder = localStream.record();
    //audio.play();
    //    audio.onloadedmetadata = function (e) {
    //        localStream = stream;
    //        // streamRecorder = localMediaStream.record();
    //    };
}

function prepareMicrophone() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, Success, onRejected);
    }
}

function recordData(blob) {
    var x = new XMLHttpRequest();

    x.onload = function () {
        console.log(this.responseText);
    };

    x.open('POST', 'record.php');
    x.send(blob);
}

var onRejected = function (e) {
    console.log('Rejected, bro!', e);
};

function startRecording() {
    if (hasGetUserMedia()) {
        // good to go!
        btnStart.disabled = true;
        btnStop.disabled = false;
        btnPlay.disabled = true;
        prepareMicrophone();
    } else {
        alert("Your browser didn't support the getUserMedia()");
    }
}

function stopRecording() {
    localStream.stop();
    btnStop.disabled = true;
    btnStart.disabled = false;
    btnPlay.disabled = false;
}

function playRecording() {
    audio.play();
}

function sendRecording() {
    // streamRecorder.getRecordedData(recordData);
}
