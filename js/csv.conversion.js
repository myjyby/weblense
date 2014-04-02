function writeJSONToDom(title, content) {
  d3.select("body").html("<div class='header'>var " + title + " = </div><div><pre>" + content + "</pre></div>");
}

function writeCSVToDom(content) {
  d3.select("body").html(content);
}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';


    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}