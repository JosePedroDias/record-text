var $ = function(i) {
    return document.querySelector(i);
};



var t1El = $('#t1'),        // RECORD   TA
    t2El = $('#t2'),        // PLAYBACK TA
    pEl  = $('pre'),

    isRecording = false,    // BOTH
    t0,
    events,

    o = '',                 // RECORD
    n,

    currEventI,             // PLAYBACK
    playTimer;
    


/**********
 * RECORD *
 **********/

var diff2 = function(o, n) {
    var d = diff(o, n);
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



t1El.addEventListener('keydown', function(ev) {
    if (ev.keyCode !== 9) { return; }
    ev.preventDefault();
});

var check4Changes = function() {
    n = t1El.value;
    var d = diff2(o, n);
    if (d.length === 0) { return; }
    o = n;

    if (isRecording) {
        d.unshift( new Date().valueOf() - t0);
        events.push(d);
    }
    else {
        pEl.innerHTML = JSON.stringify(d);      // DEBUG
        updateStrings(d);
    }
    
};

t1El.addEventListener('keyup', check4Changes);



var startRecording = function() {
    $('#r').className = 'recording';
    events = [];
    t0 = new Date().valueOf();
    isRecording = true;
};



var stopRecording = function() {
    $('#r').className = '';
    isRecording = false;
};



/************
 * PLAYBACK *
 ************/

var updateStrings = function(d) {
    var v = t2El.value.split('');

    var idx, b, c, o;
    for (var i = 0, f = d.length; i < f; ++i) {
        o   = d[i];
        idx = o[0];
        b   = o[1].split('');
        c   = o[2].split('');
        v.splice.apply(v, [idx, b.length].concat(c));
    }

    t2El.value = v.join('');
};



var updateString = function(d) {
    var v = t2El.value.split('');

    var idx, b, c, o;
    idx = d[0];
    b   = d[1].split('');
    c   = d[2].split('');
    v.splice.apply(v, [idx, b.length].concat(c));

    t2El.value = v.join('');
};



var startPlayback = function() {
    $('#p').className = 'playing';
    currEventI = 0;
    t0 = new Date().valueOf();
    playTimer = setInterval(play, 100);
};



var play = function() {
    var f = events.length;
    var t = new Date().valueOf() - t0;
    var e;
    while (currEventI < f) {
        e = events[currEventI];
        if (t < e[0]) { return; }
        ++currEventI;
        updateString( e[1] );
    }
    stopPlayback();
};



var stopPlayback = function() {
    $('#p').className = '';
    clearInterval(playTimer);
    playTimer = undefined;
};
