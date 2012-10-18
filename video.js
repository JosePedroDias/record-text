var $ = function(i) { return document.querySelector(i); };

var n = navigator;
var isWebkit = false;

var onSuc = function(stream) {
    var vidEL = $('video'), src;
 
    vidEL.autoplay = true;
 
    src = isWebkit ? window.webkitURL.createObjectURL(stream) : stream;
 
    vidEL.src = src;
};

var onErr = function() { console.log('ERROR'); };

if (n.getUserMedia) {
    n.getUserMedia({video: true, audio: true}, onSuc, onErr);
}
else if (n.webkitGetUserMedia) {
    isWebkit = true;
    n.webkitGetUserMedia({video: true, audio: true}, onSuc, onErr);
}
else { onErr(); }
