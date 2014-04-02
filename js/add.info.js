
function addInfo(){
	var _table = d3.select("#main-table").select("tbody");
	var _tr = _table.insert("tr",":first-child");

	_headers = window["th-headers"];

	var _tds = _tr.selectAll("td")
		.data(_headers);

	_tds.enter()
	.append("td")
	.attr("class",function(d){
		return "c-"+d+" editing";
	});


	_tds.append("i")
	.attr("class",function(d,i){
			if(d=="Year"){
				return "icon-ok-sign icon-white";
			}else{
				return "icon-ok-sign";
			}
		/*}else{
			d3.select(this).remove();
			return null;
		}*/
	})
	.style("float","right")
	.style("display","block")
	.style("cursor","pointer")
	.style("margin-bottom","5px")
	.style("margin-top",function(d,i){
		if(d=="Year"){
			return "8px";
		}else{
			return null;
		}		
	})
	.on("mouseup",function(){
		saveContent(this.parentNode);
	});


	_tds.append("i")
	.attr("class",function(d,i){
		if(d=="Year"){
			return "icon-share-alt icon-white";
		}else{
			return "icon-share-alt";
		}
	})
	.style("float","left")
	.style("display","block")
	.style("cursor","pointer")
	.style("margin-bottom","5px")
	.style("margin-right","5px")
	.style("margin-top",function(d,i){
		if(d=="Year"){
			return "8px";
		}else{
			return null;
		}		
	})
	.on("mouseup",function(){
		//saveContent(this.parentNode);
	});


	_tds.append("i")
	.attr("class",function(d,i){
		if(d=="Year"){
			return "icon-bold icon-white";
		}else{
			return "icon-bold";
		}
	})
	.style("float","left")
	.style("display","block")
	.style("cursor","pointer")
	.style("margin-bottom","5px")
	.style("margin-right","5px")
	.style("margin-top",function(d,i){
		if(d=="Year"){
			return "8px";
		}else{
			return null;
		}		
	})
	.on("mouseup",function(){
		goBold(this.parentNode)
	});


	_tds.append("i")
	.attr("class",function(d,i){
		if(d=="Year"){
			return "icon-italic icon-white";
		}else{
			return "icon-italic";
		}
	})
	.style("float","left")
	.style("display","block")
	.style("cursor","pointer")
	.style("margin-bottom","5px")
	.style("margin-right","5px")
	.style("margin-top",function(d,i){
		if(d=="Year"){
			return "8px";
		}else{
			return null;
		}		
	})
	.on("mouseup",function(){
		goItal(this.parentNode)
	});




	_tds.append("br");

	_tds.append("textarea")
	.style("width",function(){
		var _width = d3.select(this.parentNode).style("width");
		return _width;
	})
	.style("float","none")
	.style("clear","both")
	.style("background-color",function(d){
		console.log(d)
		if(d=="Year"){
			//return "#2B2B2B";
			return "royalblue";
		}else{
			return null;
		}
	})
	.style("border-color",function(d){
		if(d=="Year"){
			//return "#202020";
			return "cornflowerblue";
		}else{
			return null;
		}
	})
	.style("color",function(d){
		if(d=="Year"){
			return "#F9F9F9";
		}else{
			return null;
		}
	})
	/*.style("margin-top",function(d,i){
		if(i!=1){
			return "20px";
		}else{
			return null;
		}
	})*/
	.attr("placeholder","Éditer");

	toggleSidebar();

};

function saveContent(_el){
	var _sel = d3.select(_el);


	_sel.classed("editing",false);
	var _textarea = _sel.select("textarea");
	
	var _txtDEF = $(_el).find("textarea").length;

	if(_txtDEF!=0){
		var _text = _textarea.node().value;
		_text = _text.replace(/(\r\n|\n|\r)/g, ' <br />');

		_textarea.remove();
		_sel.select("br").remove();
		_sel.selectAll("i").remove();
		_sel.insert("p",":first-child")
		.html(_text);

	}else{
		_sel.selectAll("i").remove();
		_sel.select("form").remove();
		_sel.select("button").remove();
		var _p = _sel.append("p");
		_sel.selectAll("img").each(function(){
			_p.node().appendChild(this);
		});
		_sel.selectAll("span").remove();
	}

	d3.select("#save-button")
	.style("top",0);

	setLenses();
};

function sendDataCSV(){

	var _csv = new Array(),
		_keys = new Array();

	var _trs = d3.select("#main-table").select("tbody")
	.selectAll("tr");

	var _ths = d3.select("#main-table").select("thead")
	.selectAll("th");

	_ths.each(function(){
		var _key = d3.select(this)
		.select("p").html()
		_keys.push(_key);
	});

		_keys = _keys.filter(function(elem, pos) {
		    return _keys.indexOf(elem) == pos;
		});

	_trs.each(function(){
		var _datum_obj = new Array();
		d3.select(this).selectAll("td")
		.each(function(){
			var _class = d3.select(this).attr("class");
			//var _key = _class.replace("c-","");

			var _datum = d3.select(this).select("p").html();
			_datum_obj.push(_datum.toString());

			//_keys.push(_key);
		});
		_csv.push(_datum_obj);

	});



	var _jsonObject = JSON.stringify(_csv, null, 4);
	var _csvObject = convertToCSV(_jsonObject);
    //writeCSVToDom(convertToCSV(jsonObject));

    var _string_keys = _keys.toString();
    _string_keys = _string_keys.replace(new RegExp(",", "g"),"	");

    //console.log(_csv)

	$.post("ajax/clear.csv.php",{ data: _string_keys},function(){


		_csv.forEach(function(d){

			var _string_d = "";
			for(var _m=0;_m<d.length;_m++){
				_string_d += d[_m]+"	"
			};

		    $.post("ajax/write.csv.php",{ data: _string_d },function(data){
		    	console.log("Sending")
		    });
		});

		d3.select("#save-button")
		.style("top","-100px");

	});

};



