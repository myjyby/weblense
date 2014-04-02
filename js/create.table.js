var _filters = new Array();

function createTable(data){
	
	// CREATE ALL POSSIBLE FILTERS
	_main_col.forEach(function(d){

		var _filter_key = d.replace(/ /g,'');
		_filter_key = _filter_key.toLowerCase();
		_filter_key = removeDiacritics(_filter_key);
		_filter_key = removeSpecialChars(_filter_key);

		_filters[_filter_key] = "tout";

		return null;
	});


	// SET ALL INPUT VARS TO MACHINE READABLE
	/*_main_col = _main_col.replace(/ /g,'');
	_main_col = _main_col.toLowerCase();
	_main_col = removeDiacritics(_main_col);
	_main_col = removeSpecialChars(_main_col);

	_order_col = _order_col.replace(/ /g,'');
	_order_col = _order_col.toLowerCase();
	_order_col = removeDiacritics(_order_col);
	_order_col = removeSpecialChars(_order_col);*/

	window["_simple_tag_column"] = _tag_column.replace(/ /g,'');
	window["_simple_tag_column"] = window["_simple_tag_column"].toLowerCase();
	window["_simple_tag_column"] = removeDiacritics(window["_simple_tag_column"]);
	window["_simple_tag_column"] = removeSpecialChars(window["_simple_tag_column"]);



	d3.select(".title").html(_title);

	var _title_height = parseInt(d3.select(".title").style("height"));

	var _container = d3.select("#container");
	var _table = _container.append("table")
		.attr("id","main-table")
		.attr("class","table table-bordered table-striped")
		.style("margin-top",(_title_height+50)+"px")

	//var _headers = ["id"];
	var _headers = new Array();
	var _keys = d3.keys(data[0]);
	_keys.forEach(function(d,i){
		/*var _key = d.replace(/ /g,'');
		_key = _key.toLowerCase();
		_key = removeDiacritics(_key);
		_key = removeSpecialChars(_key);*/
		_headers.push(d);
	});


	var _trHead = _table.append("thead");
	var _trBody = _table.append("tbody");
	var _trFoot = _table.append("tfoot");

	var _tr = _trHead.append("tr");
	var _ths = _tr.selectAll("th")
		.data(_headers);

	_ths.enter()
	.append("th")
	.attr("class",function(d){ 
		var _classname = d.replace(/ /g,'');
		_classname = _classname.toLowerCase();
		_classname = removeDiacritics(_classname);
		_classname = removeSpecialChars(_classname);
		return "c-"+_classname; 
	})
	.html(function(d){ return "<p>"+d+"</p>"; });

	if(typeof _main_col == "string"){
		_strip_main_col = _main_col.replace(/ /g,'');
		_strip_main_col = _strip_main_col.toLowerCase();
		_strip_main_col = removeDiacritics(_strip_main_col);
		_strip_main_col = removeSpecialChars(_strip_main_col);

		
		var _select = d3.select(".c-"+_strip_main_col)
		.append("select")
		.datum(_main_col)
		.attr("id","w-"+_strip_main_col)
		.attr("class","btn-block")
		.on("change",function(){
			return filterTopicSelect(this)
		});

		var _options = d3.nest()
		.key(function(d){ return d[_main_col] })
		.sortKeys(d3.descending)
		.entries(data);

		var _optvalues = [{ val: "tout", num: "" }];
		_options.forEach(function(d){
			_optvalues.push({ val: d.key, num: d.values.length });
		});

		var _opts = _select.selectAll("option")
		.data(_optvalues);

		_opts.enter()
		.append("option")
		.attr("value",function(d){ 
			var _classKey = d.val;
			_classKey = _classKey.replace(/ /g,'');
			_classKey = _classKey.toLowerCase();
			_classKey = removeDiacritics(_classKey);
			_classKey = removeSpecialChars(_classKey);
			return _classKey; 
		})
		.attr("class",function(d){ return "op"+d; })
		.html(function(d){ 
			if(d.val!="tout"){
				return d.val+" ("+d.num+")"; 
			}else{
				return d.val;
			}
		});
	}else if(typeof _main_col == "object"){

		for(var _h=0; _h<_main_col.length; _h++){

			_strip_main_col = _main_col[_h].replace(/ /g,'');
			_strip_main_col = _strip_main_col.toLowerCase();
			_strip_main_col = removeDiacritics(_strip_main_col);
			_strip_main_col = removeSpecialChars(_strip_main_col);

			
			var _select = d3.select(".c-"+_strip_main_col)
			.append("select")
			.attr("id","w-"+_strip_main_col)
			.attr("class","btn-block")
			.on("change",function(){
				return filterTopicSelect(this)
			});

			var _options = d3.nest()
			.key(function(d){ return d[_main_col[_h]] })
			.sortKeys(d3.descending)
			.entries(data);


			var _optvalues = [{ val: "tout", num: "" }];
			_options.forEach(function(d){
				_optvalues.push({ val: d.key, num: d.values.length });
			});


			var _opts = _select.selectAll("option")
			.data(_optvalues);

			_opts.enter()
			.append("option")
			.attr("value",function(d){ 
				var _classKey = d.val;
				_classKey = _classKey.replace(/ /g,'');
				_classKey = _classKey.toLowerCase();
				_classKey = removeDiacritics(_classKey);
				_classKey = removeSpecialChars(_classKey);
				return _classKey; 
			})
			.attr("class",function(d){ return "op"+d; })
			.html(function(d){ 
				if(d.val!="tout"){
					return d.val+" ("+d.num+")"; 
				}else{
					return d.val;
				}
			});

		}

	}

	_trFoot.append("tr")
	.append("th")
	.attr("colspan",_headers.length)
	.html("This website uses WebLense, designed by Jeremy Boy");

	popTable(data);

}