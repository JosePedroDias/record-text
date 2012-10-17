var $ = function(i) {
    return document.querySelector(i);
};



var t1El = $('#t1'),
    t2El = $('#t2'),
    pEl  = $('pre'),
    o    = '',
    n,
    events,
    isRecording = false;



var diff2 = function(o, n) {
    var d = diff(o, n);
    //console.log(d);
    var D = [];
    var a, b, c, B, C;
    var idx = 0;
    for (var i = 0, f = d.length; i < f; ++i) {
        a = d[i];
        if ('common' in a) {
            idx += a.common.length;
            continue;
        }
        b = a.file1;
        c = a.file2;
        B = b.join('');
        C = c.join('');

        D.push([idx, B, C]);
        idx += c.length - b.length;
    }
    return D;
};



var updateString = function(d) {
    var v = t2El.value.split('');

    var kind, idx, b, c, o;
    for (var i = 0, f = d.length; i < f; ++i) {
        o   = d[i];
        idx = o[0];
        b   = o[1].split('');
        c   = o[2].split('');
        v.splice.apply(v, [idx, b.length].concat(c));
    }

    t2El.value = v.join('');
};





t1El.addEventListener('keydown', function(ev) {
    if (ev.keyCode !== 9) { return; }
    ev.preventDefault();
});

var check4Changes = function() {
    n = t1El.value;
    var d = diff2(o, n);
    if (d.length === 0) { return; }
    pEl.innerHTML = JSON.stringify(d);      // DEBUG
    o = n;
    updateString(d);
};

t1El.addEventListener('keyup', check4Changes);



var startRecording = function() {

};



var stopRecording = function() {

};



var play = function() {

};
