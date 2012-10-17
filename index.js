var $ = function(i) {
    return document.querySelector(i);
};



var t1El = $('#t1'),        // RECORD   TA
    t2El = $('#t2'),        // PLAYBACK TA

    isRecording = false,    // BOTH
    t0,
    events,

    o = '',                 // RECORD
    n,

    currEventI,             // PLAYBACK
    playTimer,
    playSpeed = 2,

    preEl = $('pre'),       // AUX UI
    recEl = $('#rec'),
    plyEl = $('#ply'),
    tmeEl = $('#tme'),
    pctEl = $('#pct');
    


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
        var t = new Date().valueOf() - t0;
        d.unshift(t);
        events.push(d);

        // UI
        tmeEl.innerHTML = (t/1000).toFixed(1);
    }
    else {
        //UI
        preEl.innerHTML = JSON.stringify(d);      // DEBUG

        updateStrings(d);
    }
    
};

t1El.addEventListener('keyup', check4Changes);



var startRecording = function() {
    // UI
    recEl.className = 'recording';

    events = [];
    t0 = new Date().valueOf();
    isRecording = true;
};



var stopRecording = function() {
    // UI
    recEl.className = '';
    tmeEl.innerHTML = [
        'Saved ', events.length ,' events in ', (events[events.length-1][0] / 1000).toFixed(1), ' seconds.<br/>',
        'They take ', JSON.stringify(events).length, ' bytes.'
    ].join('');

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
    // UI
    plyEl.className = 'playing';

    currEventI = 0;
    t0 = new Date().valueOf();
    playTimer = setInterval(play, 100);
};



var play = function() {
    var f = events.length;
    var t = (new Date().valueOf() - t0) * playSpeed;

    // UI
    tmeEl.innerHTML = (t/1000            ).toFixed(1);
    pctEl.innerHTML = (currEventI/f * 100).toFixed(0) + '%';

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
    // UI
    plyEl.className = '';
    tmeEl.innerHTML = '';
    pctEl.innerHTML = '';

    clearInterval(playTimer);
    playTimer = undefined;
};
