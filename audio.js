var $ = function(i) { return document.querySelector(i); };

var n = navigator;
var isWebkit = false;
var s;

var onSuc = function(stream) {
    var audEL = $('audio'), src;
 
    //audEL.autoplay = true;
 
    src = isWebkit ? window.webkitURL.createObjectURL(stream) : stream;
    s = stream; console.log(src);

    setTimeout(function() { s.stop(); $('audio').play(); console.log('stopped'); }, 4000);
 
    audEL.src = src;
};

var onErr = function() { console.log('ERROR'); };

if (n.getUserMedia) {
    n.getUserMedia({video: false, audio: true}, onSuc, onErr);
}
else if (n.webkitGetUserMedia) {
    isWebkit = true;
    n.webkitGetUserMedia({video: false, audio: true}, onSuc, onErr);
}
else { onErr(); }
