var $ = function(i) {
    return document.querySelector(i);
};

var cssEl  = $('#c');
var jsEl   = $('#j');
var htmlEl = $('#h');



/* based on this http://pallieter.org/Projects/insertTab/ */
var insertTab = function(o, e) {
    var tabChar = '    ';
    var tabLen = tabChar.length;

    var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        var oS = o.scrollTop;
        if (o.setSelectionRange) {
            var sS = o.selectionStart;
            var sE = o.selectionEnd;
            o.value = o.value.substring(0, sS) + tabChar + o.value.substr(sE);
            o.setSelectionRange(sS + tabLen, sS + tabLen);
            o.focus();
        }
        else if (o.createTextRange) {
            document.selection.createRange().text = tabChar;
            e.returnValue = false;
        }
        o.scrollTop = oS;
        e.preventDefault();
        return false;
    }
    return true;
};



var updateCSS = function() {
    var dims = [
        window.innerWidth,
        window.innerHeight
    ];
    var d = [
        ~~(dims[0] / 2) - 2,
        ~~(dims[1] / 2) - 2
    ];
    var styleEl = $('style');
    styleEl.innerHTML = [
        'textarea, iframe {',
            'width:  ', d[0], 'px;',
            'height: ', d[1], 'px;',
        '}'
    ].join('');
    //console.log(dims.join(', '));
};
updateCSS();
window.addEventListener('resize', updateCSS);



var saveMock = function() {
    var html = htmlEl.value;
    var css  = cssEl.value;
    var js   = jsEl.value;
    localStorage.setItem('html', html);
    localStorage.setItem('css',  css);
    localStorage.setItem('js',   js);
};



var loadMock = function() {
    var html = localStorage.getItem('html');
    var css  = localStorage.getItem('css');
    var js   = localStorage.getItem('js');
    htmlEl.value = html;
    cssEl.value  = css;
    jsEl.value   = js;
};



var refresh = function() {
    var html = htmlEl.value;
    var css  = cssEl.value;
    var js   = jsEl.value;
    var markup = html.replace('{css}', css).replace('{js}', js);
    //$('iframe').setAttribute('srcdoc', markup);

    var ifrEl = $('iframe');
    var preview =  ifrEl.contentDocument || ifrEl.contentWindow.document;
    preview.open();
    preview.write( markup );
    preview.close();
};



window.addEventListener('keydown', function(ev) {
    var keys = ['S', 'L', 'G'];
    var k = String.fromCharCode( ev.keyCode );
    if ( (ev.ctrlKey || ev.metaKey) && keys.indexOf(k) !== -1) {
        ev.preventDefault();
        if      (k === 'S') { saveMock(); console.log('SAVED!');  }
        else if (k === 'L') { loadMock(); console.log('LOADED!');  }
        else if (k === 'G') { refresh();  }
    }
});



//setInterval(refresh, 1000);
