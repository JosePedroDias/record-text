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



/**
 * @class RecordText
 * @param {TextArea} taR
 * @param {TextArea} taP
 * @param {Number}   playSpeed
 */

var RecordText = function(taR, taP, playSpeed) {
    this._taR = taR;
    this._taP = taP || taR;
    this._playSpeed = playSpeed || 1;

    this._o = this._taR.value;
    this._n = '';

    this._isRecording = false;
    this._isPlaying   = false;
    this._t0     = undefined;
    this._timer  = undefined;
    this._events = undefined;
    this._currEventI = 0;

    this._handlers = {
        keyup:  this._check4Changes.bind(this),
        timer:  this._play.bind(this)
    };

    this._taR.addEventListener('keyup', this._handlers.keyup);
};

RecordText.prototype = {

    record: function() {
        this._events = [];
        this._t0 = new Date().valueOf();
        this._isRecording = true;

        var v = this._taR.value;
        if (v.length > 0) {
            this._events.push([0, [0, '', v]]); // TODO BUGGY?
        }
        if (this._onRecord) { this._onRecord(this); }
    },

    play: function() {
        this._taP.value = '';
        this._currEventI = 0;
        this._t0 = new Date().valueOf();
        this._timer = setInterval(this._handlers.timer, 50);
        if (this._onPlay) { this._onPlay(this); }
    },

    stop: function() {
        if (this._isRecording) {
            this._isRecording = false;
        }
        else if (this._isPlaying) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
        if (this._onStop) { this._onStop(this); }
    },

    isRecording: function() {
        return this._isRecording;
    },

    isPlaying: function() {
        return this._isPlaying;
    },

    getEvents: function(evts) {
        return this._events;
    },

    setEvents: function(evts) {
        this._events = evts;
    },

    _check4Changes: function() {
        this._n = this._taR.value;
        var d = diff2(this._o, this._n);
        if (d.length === 0) { return; }
        this._o = this._n;

        if (this._isRecording) {
            var t = new Date().valueOf() - this._t0;
            d.unshift(t);
            this._events.push(d);
        }
        else {
            this._updateStrings(d);
        }
    },

    _play: function() {
        var f = this._events.length;
        var t = (new Date().valueOf() - this._t0) * this._playSpeed;

        var e;
        while (this._currEventI < f) {
            e = this._events[this._currEventI];
            if (t < e[0]) { return; }
            ++this._currEventI;
            this._updateString( e[1] );
        }
        this.stop();
    },

    _updateStrings: function(d) {
        var v = this._taP.value.split('');

        var idx, b, c, o;
        for (var i = 0, f = d.length; i < f; ++i) {
            o   = d[i];
            idx = o[0];
            b   = o[1].split('');
            c   = o[2].split('');
            v.splice.apply(v, [idx, b.length].concat(c));
        }

        this._taP.value = v.join('');
    },

    _updateString: function(d) {
        var v = this._taP.value.split('');

        var idx, b, c, o;
        idx = d[0];
        b   = d[1].split('');
        c   = d[2].split('');
        v.splice.apply(v, [idx, b.length].concat(c));

        this._taP.value = v.join('');
    }

};
