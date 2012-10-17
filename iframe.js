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



setInterval(function() {
    var css  = cssEl.value;
    var js   = jsEl.value;
    var html = htmlEl.value;
    var markup = html.replace('{css}', css).replace('{js}', js);
    $('iframe').setAttribute('srcdoc', markup);
}, 1000);
