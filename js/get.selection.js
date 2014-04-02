function goBold(el){
    var _textarea = d3.select(el).select("textarea"),
        _text = _textarea.node().value;
    _selection = _textarea.node().value.substring(_textarea.node().selectionStart,_textarea.node().selectionEnd);

    _text = _text.replace(_selection,"<b>"+_selection+"</b>");
    _textarea.node().value = _text;
}

function goItal(el){
    var _textarea = d3.select(el).select("textarea"),
        _text = _textarea.node().value;
    _selection = _textarea.node().value.substring(_textarea.node().selectionStart,_textarea.node().selectionEnd);

    _text = _text.replace(_selection,"<em>"+_selection+"</em>");
    _textarea.node().value = _text;
}


function addLense(el){
    var _textarea = d3.select(el).select("textarea"),
        _text = _textarea.node().value;

    _text = "<lense>"+_text+"</lense>";
    _textarea.node().value = _text;
}