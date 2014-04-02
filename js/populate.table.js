window["s-up"]=false;


function popTable(data){

	var _table = d3.select("tbody");

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

	window["th-headers"] = _headers;

	data = d3.nest()
	//.key(function(d){ return d[_order_col].split("/")[2]+""+d[_order_col].split("/")[1]+""+d[_order_col].split("/")[0]; })
	.key(function(d){ return d[_order_col] })
	.sortKeys(d3.descending)
	.entries(data);

	data.forEach(function(d,i){

		var _temp_data = data[i];

		// Get max number of gifs to add to the table
		var _gifs = new Array(),
			_path = _temp_data.values;
	


		/*for(var _n=0;_n<_path.length;_n++){

			var _temp_path = _path[_n].charts;

			for(var _i=0; _i<_temp_path.length;_i++){

				var dm = _temp_path[_i].dm.length,
					dq = _temp_path[_i].dq.length;

				_gifs.push([dm,dq]);

			}


		}*/

		var _max = 1;

		/*for(var _h=0;_h<_gifs.length;_h++){

			_max = d3.max(_gifs[_h]);

		}*/


		// Add information to the table

		for (var _n=0;_n<_path.length;_n++){

			var _idx = 0;
			//console.log(_path[_n])

			var _classKey = _path[_n][_order_col];
			_classKey = _classKey.replace(/ /g,'');
			_classKey = _classKey.toLowerCase();
			_classKey = removeDiacritics(_classKey);
			_classKey = removeSpecialChars(_classKey);

			var _tr = _table.append("tr")
			.datum(_path[_n])
			.attr("class",_classKey+i+" entry y-"+_classKey+" noshow");

			//console.log(d3.values(_path[_n]))

			// INDEX COLUMN
			/*_tr.append("td")
			//.attr("rowspan",_max)
			.attr("class",function(){
				var _class = "c-"+_headers[_idx];
				_idx++;
				return _class;
			})
			.html("<p>"+i+"</p>");*/

			for(var _m=0;_m<d3.keys(_path[_n]).length;_m++){

				_tr.append("td")
				//.attr("rowspan",_max)
				.attr("width",function(){
					_w = 100/_headers.length;
					return _w+"%";
					//return "10px";
				})
				.attr("class",function(){
					var _classname = _headers[_m].replace(/ /g,'');
					_classname = _classname.toLowerCase();
					_classname = removeDiacritics(_classname);
					_classname = removeSpecialChars(_classname);
					return "c-"+_classname;
				})
				//.attr("title","Double cliquer pour éditer")
				.html(function(){
					if(typeof _path[_n][_headers[_m]]=="string"){
						_path[_n][_headers[_m]] = _path[_n][_headers[_m]].replace(/	/g,' ');
						_path[_n][_headers[_m]] = _path[_n][_headers[_m]].replace(/\s+/g," ");
						_path[_n][_headers[_m]] = _path[_n][_headers[_m]].replace(/(\r\n|\n|\r)/g,"<br/>");
						var _ishttp = _path[_n][_headers[_m]].slice(0,4);
						//var _isImg = _path[_n][_headers[_m]].slice(-4);
						var _isImg = -1;
					};

					var _imgType = [".png",".jpg",".jpeg",".gif"];
					for(var _j=0; _j<_imgType.length; _j++){
						if(_path[_n][_headers[_m]].indexOf(_imgType[_j])!=-1){
							_isImg = _path[_n][_headers[_m]].indexOf(_imgType[_j]);
						};
					}

					//.replace(/\//g," / ")

					if(_ishttp=="http" && _isImg==-1){
						var _link = _path[_n][_headers[_m]].replace(/http/g,'');
						_link = _link.split("//")[1];
						_link = _link.split("/");
						_link = _link[0];
						var _text = "<p><a href='"+_path[_n][_headers[_m]]+"' target='_blank'>"+_link+"</a></p>";
					
					}else if(_ishttp=="www." && _isImg==-1){
						var _link = _path[_n][_headers[_m]].replace(/http/g,'');
						_link = _link.split("//")[1];
						_link = _link.split("/");
						_link = _link[0];
						var _text = "<p><a href='"+_link+"' target='_blank'>"+_path[_n][_headers[_m]]+"</a></p>";
					
					}else if(_ishttp=="http" && _isImg!=-1){
						var _text = "<p><a href='"+_path[_n][_headers[_m]]+"' target='_blank'><img src='"+_path[_n][_headers[_m]]+"'/></a></p>";
					
					}else if(_ishttp=="www." && _isImg!=-1){
						var _text = "<p><a href='"+_path[_n][_headers[_m]]+"' target='_blank'><img src='"+_path[_n][_headers[_m]]+"'/></a></p>";

					}else if(_path[_n][_headers[_m]].indexOf("iframe")==-1){
						//console.log(_path[_n][_headers[_m]])
						if(_path[_n][_headers[_m]]!=undefined){
							var _islinkinTxt = _path[_n][_headers[_m]].split("http://");
							var _isSecurelinkinTxt = _path[_n][_headers[_m]].split("https://");
							var _isSimplelinkinTxt = _path[_n][_headers[_m]].split("www.");
							if(_islinkinTxt.length>1){

								var _fulltxt = "";

								var _words = _path[_n][_headers[_m]].split(" ");
								var _foundLinks = new Array();
								for(var _h=0; _h<_words.length; _h++){
									if(_words[_h].indexOf("http")!=-1){
										_words[_h] = _words[_h].replace("<br>","")
										_words[_h] = _words[_h].replace("<br/>","")
										_words[_h] = _words[_h].replace("<br />","")
										//console.log(_words[_h])
										if(_h>0 && _words[_h-1].indexOf("<a")==-1 && _words[_h-1].indexOf("<img")==-1 && _words[_h-1].indexOf("target=")==-1){
											//console.log(_words[_h])
											// ANCHOR
											var _isImg = -1;
											for(var _j=0; _j<_imgType.length; _j++){
												if(_words[_h].indexOf(_imgType[_j])!=-1){
													_isImg = _words[_h].indexOf(_imgType[_j]);
													console.log(_isImg)

												};
											};
											if(_isImg == -1){
												_fulltxt += "<a href="+_words[_h]+" target='_blank' title="+_words[_h]+">[Lien]</a> ";
											}else{
												_fulltxt += "<br/><a href="+_words[_h]+" target='_blank' title="+_words[_h]+"><img src="+_words[_h]+" /></a><br/> ";
											}
										}else{
											_fulltxt += _words[_h]+" ";
										}
									}else{
										_fulltxt += _words[_h]+" ";
									}
								};
								//console.log(_foundLinks)



								//console.log(_islinkinTxt.length)
								/*var _fulltxt = "";
								for(var _j=0; _j<_islinkinTxt.length; _j++){
									if(_j%2==0){
										_fulltxt += _islinkinTxt[_j];
									}else{
										_fulltxt += " <a href='http://"+_islinkinTxt[_j]+"' target='_blank'>[Lien]</a> ";
									}
								}*/
								/*var _p1 = _islinkinTxt[0];
								var _p2 = _islinkinTxt[1].split(" ")[0];
								var _string = "http://"+_p2;
								var _fulltxt = _path[_n][_headers[_m]].split(_string)[0]+" <a href='"+_string+"' target='_blank'>[Lien]</a> "+_path[_n][_headers[_m]].split(_string)[1];*/
							}else if(_isSecurelinkinTxt.length>1){

								var _fulltxt = "";

								var _words = _path[_n][_headers[_m]].split(" ");
								var _foundLinks = new Array();
								for(var _h=0; _h<_words.length; _h++){
									if(_words[_h].indexOf("http")!=-1){
										if(_h>0 && _words[_h-1].indexOf("<a")==-1 && _words[_h-1].indexOf("<img")==-1 && _words[_h-1].indexOf("target=")==-1){
											_fulltxt += "<a href="+_words[_h]+" target='_blank' title="+_words[_h]+">[Lien]</a> ";
											//console.log(_words[_h])
										}else{
											_fulltxt += _words[_h]+" ";
										}
									}else{
										_fulltxt += _words[_h]+" ";
									}
								};

								/*var _p1 = _isSecurelinkinTxt[0];
								var _p2 = _isSecurelinkinTxt[1].split(" ")[0];
								var _string = "https://"+_p2;
								var _fulltxt = _path[_n][_headers[_m]].split(_string)[0]+" <a href='"+_string+"' target='_blank'>[Lien]</a> "+_path[_n][_headers[_m]].split(_string)[1];*/
							}else if(_isSimplelinkinTxt.length>1){

								var _fulltxt = "";

								var _words = _path[_n][_headers[_m]].split(" ");
								var _foundLinks = new Array();
								for(var _h=0; _h<_words.length; _h++){
									if(_words[_h].indexOf("www")!=-1){
										if(_h>0 && _words[_h-1].indexOf("<a")==-1 && _words[_h-1].indexOf("<img")==-1 && _words[_h-1].indexOf("target=")==-1){
											_fulltxt += "<a href="+_words[_h]+" target='_blank' title="+_words[_h]+">[Lien]</a> ";
										}else{
											_fulltxt += _words[_h]+" ";
										}
									}else{
										_fulltxt += _words[_h]+" ";
									}
								};
								/*var _p1 = _isSimplelinkinTxt[0];
								var _p2 = _isSimplelinkinTxt[1].split(" ")[0];
								var _string = "https://"+_p2;
								var _fulltxt = _path[_n][_headers[_m]].split(_string)[0]+" <a href='"+_string+"' target='_blank'>[Lien]</a> "+_path[_n][_headers[_m]].split(_string)[1];*/
							}else{
								var _fulltxt = _path[_n][_headers[_m]];
							}
						}else{
							var _fulltxt = _path[_n][_headers[_m]];
						}
						var _text = "<p>"+_fulltxt+"</p>";
					}else{
						var _fulltxt = _path[_n][_headers[_m]];
						var _text = "<p>"+_fulltxt+"</p>";
					};

					/*if(d3.select(this).classed("c-"+_tag_column)==true){
						d3.select(this)
						.style("background-color",function(d,i){_tag_color(i)})
					}*/

					return _text;
				})
				//.style("line-height",_max*56+"px")
				.on("dblclick",function(){
					var _text = d3.select(this).select("p").html();
					var _width = d3.select(this).style("width");

					d3.select(this).selectAll("p").remove();
					d3.select(this).classed("editing",true)
					.style("background-color",null);

					var _header = d3.select(this).attr("class");
					_header = _header.split(" ")[0];
					_header = _header.split("-");
					_header = _header[1];

					d3.select(this).append("i")
					.attr("class",function(){
						return "icon-ok-sign";
					})
					.style("display","block")
					.style("cursor","pointer")
					.style("margin-bottom","5px")
					.style("float","right")
					.style("clear","both")
					.on("mouseup",function(){
						saveContent(this.parentNode);
					});


					if(_header!="Image"){
						d3.select(this).append("i")
						.attr("class",function(){
							return "icon-share-alt";
						})
						.style("float","left")
						.style("display","block")
						.style("cursor","pointer")
						.style("margin-bottom","5px")
						.style("margin-right","5px")
						.style("margin-top",function(d,i){
							return null;	
						})
						.on("mouseup",function(){
							//saveContent(this.parentNode);
						});


						d3.select(this).append("i")
						.attr("class",function(){
							return "icon-bold";

						})
						.style("float","left")
						.style("display","block")
						.style("cursor","pointer")
						.style("margin-bottom","5px")
						.style("margin-right","5px")
						.style("margin-top",function(){
							return null;
						})
						.on("mouseup",function(){
							goBold(this.parentNode)
						});


						d3.select(this).append("i")
						.attr("class",function(){
							return "icon-italic";
						})
						.style("float","left")
						.style("display","block")
						.style("cursor","pointer")
						.style("margin-bottom","5px")
						.style("margin-right","5px")
						.style("margin-top",function(d,i){
							return null;	
						})
						.on("mouseup",function(){
							goItal(this.parentNode)
						});

						
						d3.select(this).append("i")
						.attr("class",function(){
							return "icon-zoom-in";
						})
						.style("float","left")
						.style("display","block")
						.style("cursor","pointer")
						.style("margin-bottom","5px")
						.style("margin-right","5px")
						.style("margin-top",function(d,i){
							return null;
						})
						.on("mouseup",function(){
							addLense(this.parentNode)
						});

						d3.select(this).append("br");

						d3.select(this).append("textarea")
						.style("width",_width)
						.style("float","none")
						.style("clear","both")
						.style("background-color",function(){
							return null;
						})
						.style("border-color",function(){
							return null;
						})
						.style("color",function(){
							return null;
						})
						.html(_text)

					}else{

						/*d3.select(this).append("input")
						.attr("type","file")
						.attr("name","file")
						.attr("id","file")
						.style("float","left")
						.style("display","block")
						.style("cursor","pointer")
						.style("margin-bottom","5px")
						.style("margin-right","5px")
						.on("mouseup",function(){
							//addLense(this.parentNode)
							$.post("upload.image.php",{ file: file })
						});*/
						var _el = this;

						d3.select(_el).append("span")
						.html(_text);

						d3.selectAll("img")
						.on("mouseover",function(){
							if(d3.select(this.parentNode.parentNode).classed("editing")==true){
								d3.select(this).style("cursor","no-drop")
								.attr("title","Retirer cette image")
							}
						})
						.on("mouseup",function(){
							if(d3.select(this.parentNode.parentNode).classed("editing")==true){
								d3.select(this).remove();
							}
						})

						var _form = d3.select(this).append("form")
						.attr("id","img-form")
						.attr("action","ajax/upload.image.php")
						.attr("method","POST")
						.attr("enctype","multipart/form-data");

						_form.append("input")
						.attr("type","file")
						.attr("name","fileToUpload")
						.attr("id","fileToUpload")
						/*.on("change",function(){
							savepic(_el);
						})*/

						_form.append("br")

						/*_form.append("input")
						.attr("class","btn")
						.attr("type","submit")
						.attr("name","submit")
						.attr("value","Téléverser");*/

						d3.select(this).append("button")
						.attr("class","btn")
						.attr("value","Save")
						.attr("id","upload-img")
						.append("i")
						.attr("class","icon-upload")
						//.html("Téléverser")
						.on("mouseup",function(){
							/*var _file = $("#file").val();
							$.post("upload.image.php",{ "file": _file },function(data){
								console.log(data)
							});*/
							savepic(_el);
						})

						/*$("#photoimg").on('change', function(){ 
							$("#temp-upload").html('');
							//_el.html('<img src="loader.gif" alt="Uploading...."/>');
							$("#temp-upload").html("loading")
							$("#img-form").ajaxForm({
								target: '#temp-upload',
								success: function(data){
									console.log(data)
								}
							}).submit();
						});*/

					}
				})
				.style("text-align",function(){
					var _classname = _order_col.replace(/ /g,'');
					_classname = _classname.toLowerCase();
					_classname = removeDiacritics(_classname);
					_classname = removeSpecialChars(_classname);

					if(d3.select(this).classed("c-"+_classname)){
						return "center";
					}else{
						return null;
					}
				});

				/*_tr.append("td")
				.datum(_path[_n][_headers[2]])
				//.attr("rowspan",_max)
				.style("text-align","center")
				.style("font-size","650%")
				.style("font-weight",700)
				.style("line-height",_max*56+"px")
				.attr("class",function(){
					return "c-"+_headers[_m]
				})
				.html(function(){
					var _text = "<p>"+_path[_n][_headers[_m]]+"</p>";
					return _text;
				});

				_tr.append("td")
				//.attr("rowspan",_max)
				.attr("class",function(){
					return "c-"+_headers[_m]
				})
				.html(function(){
					var _text = "<p>"+_path[_n][_headers[_m]]+"</p>";
					return _text;
				});*/
			};

		};


			/*var _c = _order_col.replace(/ /g,'');
			_c = _c.toLowerCase();
			_c = removeDiacritics(_c);
			_c = removeSpecialChars(_c);

			d3.selectAll("td.c-"+_c)
			.each(function(){
				d3.select(this)
				.style("line-height",function(){
					var _h = $(this.parentNode).height();
					console.log(_h)
					return _h+"px";
				});
				return null;
			});*/

			/*_tr.append("td")
			//.attr("rowspan",_max)
			.attr("class",_temp_data.Year+i+"-cell c-topic")
			.on("mouseover",function(){



				if(d3.select(this).select("svg")==""){
					d3.select(this)
					.style("cursor","pointer")
					.style("padding-bottom","20px");

					d3.select(this)
					.style("background-color","#b94a48")
					.append("small")
					.attr("class",_temp_data.topic+i+"-cell")
					.style("color","white")
					.style("font-weight",100)
					.style("margin-top",0)
					.append("p")
					.attr("class",_temp_data.topic+i+"-cell")
					.append("em")
					.attr("class",_temp_data.topic+i+"-cell")
					.html("Click to filter");

					d3.select(this)
					.append("p")
					.attr("class","article-title "+_temp_data.topic+i+"-cell")
					.html("How does <em class='"+_temp_data.topic+i+"-cell'>"+_temp_data.topic+"</em> compare to other topics?<br/>")

					drawBarchart(this,_temp_data.topic,i);

					return false;
				}else{
					return false;
				}
			})
			.on("mouseout",function(){
			
				if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-cell")==false){	

					d3.select(this)
					.style("background-color",null)
					.style("padding-bottom",null)
					.html("<p style='margin-bottom:0px;' class='"+_temp_data.topic+i+"-cell'>"+_temp_data.topic+"</p>");
					return false;
				}else{
					return false;
				}
				
			})
			.on("mousedown",function(){ 
				return filterTopic(_temp_data.topic); 
			})
			.html("<p style='margin-bottom:0px;' class='"+_temp_data.topic+i+"-cell'>"+_temp_data.topic+"</p>");

			_tr.append("td")
			.attr("rowspan",_max)
			.attr("class","c-title")
			.html("<p class='article-title'>"+_path[_n].title+"</p>")
			.on("mouseover",function(){
				d3.select(this)
				.style("cursor","pointer");

				d3.select(this)
				.style("background-color","#3a87ad")
				.append("small")
				.style("color","white")
				.style("font-weight",100)
				.style("margin-top",0)
				.append("em")
				.html("Click to follow the link to the article");
				return null;
			})
			.on("mouseout",function(){
				d3.select(this)
				.style("background-color",null)
				.html("<p class='article-title'>"+_path[_n-1].title+"</p>")
				return null;
			})
			.on("mousedown",function(){ 
				return window.open(_path[_n-1].link,"_blank"); 
			});*/

			
			/*_tr.append("td")
			//.attr("rowspan",_max)
			.attr("class","c-nVis")
			.style("text-align","center")
			.style("font-size","650%")
			.style("font-weight",700)
			.style("line-height",_max*56+"px")
			.html(_path[_n].nChart);*/
			

			/*if(_path[_n].charts[0].dm.length>0 && _path[_n].charts[0].dm[0].l != undefined){

				_tr.append("td")
				.attr("class","c-num")
				.style("text-align","center")
				.html("");	

				_tr.append("td")
				.attr("class","c-chart")
				.style("text-align","center")
				.html("");	

				var _cell = _tr.append("td")
				.attr("class",_temp_data.topic+i+"-dmIMGcell c-interaction")
				.style("position","relative")
				.style("text-align","center")
				.html("<img src='"+_path[_n].charts[0].dm[0].l+".png' width='100' class='"+_temp_data.topic+i+"-dmIMGcell' />")//<br/><small>"+_path[_n].charts[0].dm[0]+"</small>")
				.on("mouseover",function(){
					var _el = d3.select(this),
					_src = _el
					.select("img")
					.attr("src");

					var _class = _el.attr("class");

					_src = _src.split(".");

					_el.style("background-color","#b94a48")

					clearTimeout(window[_class+"-d"]);

					//if(window["s-up"]==false){				
						window[_class+"-u"] = setTimeout(function(){

							_el
							.select("img")
							.attr("src",_src[0]+".gif")
							.attr("width",4500);

						//clearTimeout(window["scale-t"]);

							//window["s-up"] = true;
							//scrollIntoView(this)


						},500);

				})
				.on("mouseout",function(){

					var _src = d3.select(this)
					.style("background-color",null)
					.select("img")
					.attr("src"),
					_el = d3.select(this);

					var _class = _el.attr("class");

					_src = _src.split(".");

					clearTimeout(window[_class+"-u"]);
					
					//alert(d3.select(d3.event.relatedTarget).attr("class"))
					if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

						window[_class+"-d"] = setTimeout(function(){
							_el
							.select("img")
							.attr("src",_src[0]+".png")
							.attr("width",100);

							//clearTimeout(window["scale-d-t"]);

						},600);
					
				
					}



						//window["s-up"] = false;

					//},500);

				});

				_cell.append("small")
				.attr("class",_temp_data.topic+i+"-dmIMGcell")
				.style("dispay","inline-block")
				.style("position","absolute")
				.style("left",0)
				.style("bottom",0)
				.style("background-color","rgba(0,0,0,0.75)")
				.style("color","#FFF")
				.style("font-weight",100)
				.style("line-height","16px")
				.style("text-align","left")
				.style("padding","0 5px 2px 5px")
				.html("<span style='text-decoration:underline' class='"+_temp_data.topic+i+"-dmIMGcell'>"+_path[_n].charts[0].dm[0].a+"</span>: <em>"+_path[_n].charts[0].dm[0].e)


				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html(_path[_n].charts[0].dm[0].o);	


				_tr.append("td")
				.style("text-align","center")
				.attr("class","c-interaction")
				.html(function(){
					if(_path[_n].charts[0].dm[0].p != "null"){
						return "<img src='"+_path[_n].charts[0].dm[0].p+".png' width='71'/>"//<br/><small>"+_path[_n].charts[0].dm[0]+"</small>")
					}else{
						return "<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>";
					}
				})
		


			}else{
				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			
			}



			if(_path[_n].charts[0].dq.length>0 && _path[_n].charts[0].dq[0].l != undefined){
	
				var _cell = _tr.append("td")
				.attr("class",_temp_data.topic+i+"-dqIMGcell c-interaction")
				.style("position","relative")
				.style("text-align","center")
				.html("<img src='"+_path[_n].charts[0].dq[0].l+".png' width='100' class='"+_temp_data.topic+i+"-dqIMGcell' />")//<br/><small>"+_path[_n].charts[0].dq[0]+"</small>")
				.on("mouseover",function(){
					var _el = d3.select(this),
					_src = _el
					.select("img")
					.attr("src");

					var _class = _el.attr("class");

					_src = _src.split(".");

					_el.style("background-color","#b94a48")

					clearTimeout(window[_class+"-d"]);

						window[_class+"-u"] = setTimeout(function(){

							_el
							.select("img")
							.attr("src",_src[0]+".gif")
							.attr("width",4500);


						},500);
				})
				.on("mouseout",function(){

					var _src = d3.select(this)
					.style("background-color",null)
					.select("img")
					.attr("src"),
					_el = d3.select(this);

					var _class = _el.attr("class");

					_src = _src.split(".");

					clearTimeout(window[_class+"-u"]);
					
					if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

						window[_class+"-d"] = setTimeout(function(){
							_el
							.select("img")
							.attr("src",_src[0]+".png")
							.attr("width",100);


						},600);
					}
				});

				_cell.append("small")
				.attr("class",_temp_data.topic+i+"-dqIMGcell")
				.style("position","absolute")
				.style("left",0)
				.style("bottom",0)
				.style("background-color","rgba(0,0,0,0.75)")
				.style("color","#FFF")
				.style("font-weight",100)
				.style("line-height","16px")
				.style("text-align","left")
				.style("padding","0 5px 2px 5px")
				.html("<span style='text-decoration:underline' class='"+_temp_data.topic+i+"-dqIMGcell'>"+_path[_n].charts[0].dq[0].a+"</span>: <em>"+_path[_n].charts[0].dq[0].e)

				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html(_path[_n].charts[0].dq[0].o);	

			_tr.append("td")
			.attr("class","c-interaction")
			.style("text-align","center")
				.html(function(){
					if(_path[_n].charts[0].dq[0].p != "null"){
						return "<img src='"+_path[_n].charts[0].dq[0].p+".png' width='71'/>"//<br/><small>"+_path[_n].charts[0].dm[0]+"</small>")
					}else{
						return "<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>";
					}
				})

			}else{
				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				_tr.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

			}*/

			/*for(var _i=1;_i<_max;_i++){

				var _trn = _table.append("tr")
				.attr("class",_temp_data.topic+i+" "+_temp_data.topic);

				if(_path[_n].charts[0].dm.length>_i && _path[_n].charts[0].dm[_i].l != undefined){

					_trn.append("td")
					.attr("class","c-num")
					.style("text-align","center")
					.html("");	

					_trn.append("td")
					.attr("class","c-chart")
					.style("text-align","center")
					.html("");	

					var _cell = _trn.append("td")
					.attr("class",_temp_data.topic+i+_i+"-dmIMGcell c-interaction")
					.style("position","relative")
					.style("text-align","center")
					.html("<img src='"+_path[_n].charts[0].dm[_i].l+".png' width='100' class='"+_temp_data.topic+i+_i+"-dmIMGcell' />")//<br/><small>"+_path[_n].charts[0].dm[_i]+"</small>")
					.on("mouseover",function(){
						var _el = d3.select(this),
						_src = _el
						.select("img")
						.attr("src");

						var _class = _el.attr("class");

						_src = _src.split(".");

						_el.style("background-color","#b94a48")

						clearTimeout(window[_class+"-d"]);
						window[_class+"-u"] = setTimeout(function(){

							_el
							.select("img")
							.attr("src",_src[0]+".gif")
							.attr("width",4500);



						},500);

					})
					.on("mouseout",function(){

						var _src = d3.select(this)
						.style("background-color",null)
						.select("img")
						.attr("src"),
						_el = d3.select(this);

						var _class = _el.attr("class");

						_src = _src.split(".");

						clearTimeout(window[_class+"-u"]);

						if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+_i+"-dmIMGcell")==false){	

							window[_class+"-d"] = setTimeout(function(){
								_el
								.select("img")
								.attr("src",_src[0]+".png")
								.attr("width",100);


							},600);
						}
					});

					_cell.append("small")
					.attr("class",_temp_data.topic+i+_i+"-dmIMGcell")
					.style("position","absolute")
					.style("left",0)
					.style("bottom",0)
					.style("background-color","rgba(0,0,0,0.75)")
					.style("color","#FFF")
					.style("font-weight",100)
					.style("line-height","16px")
					.style("text-align","left")
					.style("padding","0 5px 2px 5px")
					.html("<span style='text-decoration:underline' class='"+_temp_data.topic+i+_i+"-dmIMGcell'>"+_path[_n].charts[0].dm[_i].a+"</span>: <em>"+_path[_n].charts[0].dm[_i].e)

				_trn.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html(_path[_n].charts[0].dm[_i].o);	

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
				.html(function(){
					if(_path[_n].charts[0].dm[_i].p != "null"){
						return "<img src='"+_path[_n].charts[0].dm[_i].p+".png' width='71'/>"//<br/><small>"+_path[_n].charts[0].dm[0]+"</small>")
					}else{
						return "<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>";
					}
				})



				}else{
					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				}


				if(_path[_n].charts[0].dq.length>_i && _path[_n].charts[0].dq[_i].l != undefined){



					var _link = _path[_n].charts[0].dq[_i].l+".png";
					var _cell = _trn.append("td")
					.attr("class",_temp_data.topic+i+_i+"-dqIMGcell c-interaction")
					.style("position","relative")
					.style("text-align","center")
					.html("<img src='"+_link+"' width='100' class='"+_temp_data.topic+i+_i+"-dqIMGcell' />")//<br/><small>"+_path[_n].charts[0].dq[_i]+"</small>")
						.on("mouseover",function(){
							var _el = d3.select(this),
							_src = _el
							.select("img")
							.attr("src");

						var _class = _el.attr("class");

						_src = _src.split(".");

						_el.style("background-color","#b94a48")

						clearTimeout(window[_class+"-d"]);

							window[_class+"-u"] = setTimeout(function(){

								_el
								.select("img")
								.attr("src",_src[0]+".gif")
								.attr("width",4500);


							},500);
						})
					.on("mouseout",function(){

						var _src = d3.select(this)
						.style("background-color",null)
						.select("img")
						.attr("src"),
						_el = d3.select(this);

						var _class = _el.attr("class");

						_src = _src.split(".");

						clearTimeout(window[_class+"-u"]);
						
						if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

							window[_class+"-d"] = setTimeout(function(){
								_el
								.select("img")
								.attr("src",_src[0]+".png")
								.attr("width",100);


							},600);
						}
					});

					_cell.append("small")
					.attr("class",_temp_data.topic+i+_i+"-dqIMGcell")
					.style("position","absolute")
					.style("left",0)
					.style("bottom",0)
					.style("background-color","rgba(0,0,0,0.75)")
					.style("color","#FFF")
					.style("font-weight",100)
					.style("line-height","16px")
					.style("text-align","left")
					.style("padding","0 5px 2px 5px")
					.html("<span style='text-decoration:underline' class='"+_temp_data.topic+i+_i+"-dqIMGcell'>"+_path[_n].charts[0].dq[_i].a+"</span>: <em>"+_path[_n].charts[0].dq[_i].e)
		

				_trn.append("td")
				.attr("class","c-interaction")
				.style("text-align","center")
				.html(_path[_n].charts[0].dq[_i].o);	

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
				.html(function(){
					if(_path[_n].charts[0].dq[_i].p != "null"){
						return "<img src='"+_path[_n].charts[0].dq[_i].p+".png' width='71'/>"//<br/><small>"+_path[_n].charts[0].dm[0]+"</small>")
					}else{
						return "<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>";
					}
				})


				}else{
					_trn.append("td")
					.attr("class","c-interaction")					
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

					_trn.append("td")
					.attr("class","c-interaction")
					.style("text-align","center")
					.html("<p class='lead' style='line-height:56px; padding:0; margin: 0;'>&#x2613;</p>");			

				}

			}	*/	

		//}

		/*d3.selectAll("."+_temp_data.topic+i)
		.on("mouseover",function(){
			d3.selectAll("."+_temp_data.topic+i)
			.style("background-color","#F3F3F3");
		})
		.on("mouseout",function(){
			d3.selectAll("."+_temp_data.topic+i)
			.style("background-color","#FFF")
		});*/



		//d3.selectAll(".c-Year")
		/*.on("mouseover",function(){
				if(d3.select(this).select("svg")==""){
					d3.select(this)
					.style("cursor","pointer")
					.style("padding-bottom","20px");

					d3.select(this)
					.style("background-color","#b94a48")
					.append("small")
					.attr("class",_temp_data.topic+i+"-cell")
					.style("color","white")
					.style("font-weight",100)
					.style("margin-top",0)
					.append("p")
					.attr("class",_temp_data.topic+i+"-cell")
					.append("em")
					.attr("class",_temp_data.topic+i+"-cell")
					.html("Click to filter");

					d3.select(this)
					.append("p")
					.attr("class","article-title "+_temp_data.topic+i+"-cell")
					.html("How does <em class='"+_temp_data.topic+i+"-cell'>"+_temp_data.topic+"</em> compare to other topics?<br/>")

					drawBarchart(this,_temp_data.topic,i);

					return false;
				}else{
					return false;
				}
			})
			.on("mouseout",function(){
			
				if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-cell")==false){	

					d3.select(this)
					.style("background-color",null)
					.style("padding-bottom",null)
					.html("<p style='margin-bottom:0px;' class='"+_temp_data.topic+i+"-cell'>"+_temp_data.topic+"</p>");
					return false;
				}else{
					return false;
				}
				
			})*/
			/*.on("mousedown",function(d){ 
				//console.log(d)
				return filterTopic("y-"+d); 
			})*/



	});

	d3.selectAll("td.c-"+window["_simple_tag_column"])
	.each(function(d,i){
		d3.select(this)
		.style("background-color",_tag_color(i));

	})


	setLenses();
	//$("tbody tr").addClass("noshow");
	reveal();

	/*d3.select("table")
	.select("tbody")
	.selectAll("tr")
	.selectAll("td.c-"+_strip_main_col)
	.style("background-color","royalblue")
	.selectAll("p")
	.style("text-align","center")
	.style("font-size","650%")
	.style("font-weight",700)
	.style("line-height","1em")
	.style("color","#F9F9F9");*/

	return null;

};

function setLenses(){
	// THE LENSE FUNCTION > FOR TEXT
	d3.select("tbody").selectAll("lense")
	.each(function(){	
		d3.select(this.parentNode.parentNode)	
		.on("mouseover",function(){
			if(d3.select(this).classed("editing")==false){
				var _el = d3.select(this).select("lense"),
					_parent = d3.select(this),
					_grandParent = d3.select(this.parentNode);

				var _grandClass = _grandParent.attr("class");
				_grandClass = _grandClass.split("-");
				_grandClass = _grandClass[1];

				var _textsize = _el.style("font-size");

				var _class = _parent.attr("class");

				//_parent.style("background-color","#b94a48");
				_parent.style("background-color","cornflowerblue");

				clearTimeout(window[_class+"-"+_grandClass+"-d"]);

				//console.log(_textsize)

				if(_textsize=="14px"){
					window[_class+"-"+_grandClass+"-u"] = setTimeout(function(){
						_el//.html("<important>"+_text+"</important>");
						.style("font-size","400%")
						.style("line-height","1.2em");
					},500);
				}else{
					return null;
				};
			}

		})
		.on("mouseout",function(){
			if(d3.select(this).classed("editing")==false){
				var _parent = d3.select(this)
					.style("background-color",null),
					_el = d3.select(this).select("lense");
					_parent = d3.select(this)
					_grandParent = d3.select(this.parentNode);

				var _grandClass = _grandParent.attr("class");
				_grandClass = _grandClass.split("-");
				_grandClass = _grandClass[1];

				var _class = _parent.attr("class");

				clearTimeout(window[_class+"-"+_grandClass+"-u"]);
				
				//alert(d3.select(d3.event.relatedTarget).attr("class"))
				//if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

					window[_class+"-"+_grandClass+"-d"] = setTimeout(function(){
						_el.style("font-size",null)
						.style("line-height",null);
						//clearTimeout(window["scale-d-t"]);


					},600);
			}

		});
	});


	// THE LENSE FUNCTION > FOR VIDEOS
	// FIRST WE SET THEM ALL TO 200px WIDE

	d3.select("tbody").selectAll("iframe")
	.each(function(d,i){	
		//if(d3.select(this).classed("video-player")==false){
			//alert("hello")
			d3.select(this).attr("class","video-player");
			d3.select(this).classed("iframe-"+i,true);

			var _originWidth = d3.select(this).attr("width");
			var _originHeight = d3.select(this).attr("height");
			/*var _factor = 200/_originWidth;

			if(d3.select(this).datum()==undefined){
				d3.select(this).datum({ width: _originWidth, height: _originHeight, factor: _factor });
			}

			var _datum = d3.select(this).datum();*/

			var _ratio = +_originHeight/+_originWidth;
			//console.log([_originWidth,_originHeight])

			d3.select(this)
			.attr("width",_video_min)
			.attr("height",_video_min*_ratio);

			d3.select(this.parentNode.parentNode)	
			.on("mouseover",function(){
				if(d3.select(this).classed("editing")==false){

					var _el = d3.select(this).select("iframe"),
						_parent = d3.select(this);

					var _frameSize = _el.attr("width");

					var _class = _el.attr("class");

					//_parent.style("background-color","#b94a48");
					_parent.style("background-color","cornflowerblue");

					clearTimeout(window[_class+"-d"]);
					if(_frameSize==_video_min){
						window[_class+"-u"] = setTimeout(function(){
							_el.attr("width",_video_max)
							.attr("height",_video_max*_ratio)

							_parent.attr("width","50%");


						},500);
					}else{
						return null;
					};
				}

			})
			.on("mouseout",function(){
				if(d3.select(this).classed("editing")==false){
					var _parent = d3.select(this)
						.style("background-color",null),
						_el = d3.select(this).select("iframe");

					var _class = _el.attr("class");

					clearTimeout(window[_class+"-u"]);
					
					//alert(d3.select(d3.event.relatedTarget).attr("class"))
					//if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

						window[_class+"-d"] = setTimeout(function(){
							_el.attr("width",_video_min)
							.attr("height",_video_min*_ratio);
							//clearTimeout(window["scale-d-t"]);
							_parent.attr("width",function(){
								_w = 100/window["th-headers"].length;
								return _w+"%";
								//return "10px";
							})
								


						},600);
				}

			});
		/*}else{
			return null;
		}*/
	});



	// THE LENSE FUNCTION > FOR IMAGES
	// FIRST WE SET THEM ALL TO 200px WIDE

	d3.select("tbody").selectAll("img")
	.each(function(d,i){	
		//if(d3.select(this).classed("video-player")==false){
			//alert("hello")
			/*d3.select(this).attr("class","video-player");*/
			d3.select(this).classed("image-"+i,true);

			/*var _originWidth = d3.select(this).attr("width");
			var _originHeight = d3.select(this).attr("height");

			var _ratio = +_originHeight/+_originWidth;*/

			d3.select(this)
			.attr("width",_video_min)
			.style("width",_video_min+"px");
			//.attr("height",_video_min*_ratio);

			d3.select(this.parentNode.parentNode)	
			.on("mouseover",function(){
				if(d3.select(this).classed("editing")==false){

					var _el = d3.select(this).selectAll("img"),
						_parent = d3.select(this);

					var _frameSize = _el.attr("width");

					var _class = _el.attr("class");

					_parent.style("background-color","cornflowerblue");



					clearTimeout(window[_class+"-d"]);
					if(_frameSize==_video_min){
						window[_class+"-u"] = setTimeout(function(){

							_el.attr("width",_video_max*2)
							.style("width",(_video_max*2)+"px");

							_parent.attr("width","50%");
							//.attr("height",_video_max*_ratio);
							
							/*var top = $(this).position().top;

							$("body,html").animate({
								scrollTop: top+"px"
							},100);*/

						},500);
					}else{
						return null;
					};
				}



			})
			.on("mouseout",function(){
				if(d3.select(this).classed("editing")==false){
					var _parent = d3.select(this)
						.style("background-color",null),
						_el = d3.select(this).selectAll("img");

					var _class = _el.attr("class");

					clearTimeout(window[_class+"-u"]);
					
					//var top = $(this).position().top;

					//alert(d3.select(d3.event.relatedTarget).attr("class"))
					//if(d3.select(d3.event.relatedTarget).classed(_temp_data.topic+i+"-dmIMGcell")==false){	

						window[_class+"-d"] = setTimeout(function(){
							_el.attr("width",_video_min)
							.style("width",_video_min+"px");
							//clearTimeout(window["scale-d-t"]);
							_parent.attr("width",function(){
								_w = 100/window["th-headers"].length;
								return _w+"%";
								//return "10px";
							})
										/*$("body,html").animate({
								scrollTop: top+"px"
							},100);	*/
						},600);
				}


			});
		/*}else{
			return null;
		}*/


		d3.selectAll("img")
		.on("mouseover",function(){
			if(d3.select(this.parentNode.parentNode).classed("editing")==false){
				d3.select(this).style("cursor","default")
				.attr("title",null)
			}
		})
		.on("mouseup",function(){
			if(d3.select(this.parentNode.parentNode).classed("editing")==false){
				return null;
			}
		})
		


	});

}

function filterTopic(c){

	//d3.select(".op"+c).attr("selected","selected")
	console.log(c)
	var _table = d3.select("tbody");
	_table.selectAll("tr:not(."+c+")")
	.style("opacity",0);

	setTimeout(function(){
		_table.selectAll("tr:not(."+c+")").style("display","none");
	},500)

	return null;

};

function filterTopicSelect(el){
	var h = d3.select(el).datum()
	var e = d3.select(el).node();
	var c = e.options[e.selectedIndex].value;

	var _filter_key = h.replace(/ /g,'');
	_filter_key = _filter_key.toLowerCase();
	_filter_key = removeDiacritics(_filter_key);
	_filter_key = removeSpecialChars(_filter_key);

	_filters[_filter_key] = c;
	//console.log(_filters)

	var _table = d3.select("tbody");

	_table.selectAll("tr")
	.each(function(d){

		var _todisplay = new Array();

		for(var _j=0; _j<_main_col.length; _j++){
			var _filter_key = _main_col[_j].replace(/ /g,'');
			_filter_key = _filter_key.toLowerCase();
			_filter_key = removeDiacritics(_filter_key);
			_filter_key = removeSpecialChars(_filter_key);

			var _val = d[_main_col[_j]].replace(/ /g,'');
			_val = _val.toLowerCase();
			_val = removeDiacritics(_val);
			_val = removeSpecialChars(_val);

			if(_filters[_filter_key]==_val || _filters[_filter_key]=="tout"){
				_todisplay.push(true);
			}else{
				_todisplay.push(false);
			};
		};

		if(_todisplay.indexOf(false)!=-1){
			d3.select(this)
			.style("opacity",0)
			.transition()
			.duration(500)
			.each("end",function(){
				d3.select(this).style("display","none");
				return null;
			});

		}else{
			d3.select(this)
			.style("display",null)
			.classed("noshow",false)
			.transition()
			.duration(1)
			.each("end",function(){
				d3.select(this)
				.style("opacity",1);
				return null;
			});
		}

		return null;
	});


};



function scrollIntoView(eleID) {
   var e = eleID;
   if (!!e && e.scrollIntoView) {
       e.scrollIntoView();
   }
}

function toggleSidebar(){
	var _sb = d3.select("#side-bar");
	var _sbL = _sb.style("left");
	_sbL = parseInt(_sbL);

	if(_sbL < 0){
		_sb.style("left",0);
		_sb.select("#expand-side-bar").select("i").attr("class","icon-chevron-right")
	}
	if(_sbL == 0){
		_sb.style("left","-312px");
		_sb.select("#expand-side-bar").select("i").attr("class","icon-chevron-left")
	}

	return false;
}

function mouseOverSidebar(){

	var _sb = d3.select("#side-bar");
	var _sbL = _sb.style("left");
	_sbL = parseInt(_sbL);

	if(_sbL < 0){
		_sb.select("#expand-side-bar").select("i").attr("class","icon-chevron-right")
	}
	if(_sbL == 0){
		_sb.select("#expand-side-bar").select("i").attr("class","icon-chevron-left")
	}

	return false;

}

function mouseOutSidebar(){

	var _sb = d3.select("#side-bar");
	_sb.select("#expand-side-bar").select("i").attr("class","icon-edit");
	return false;

}

/*var _cols = [
	{ n: "Index", v: "c-idx"},
	{ n: "News Site", v: "c-site"},
	{ n: "Topic", v: "c-topic"},
	{ n: "Article Title", v: "c-title"},
	{ n: "Number of Vis", v: "c-nVis"},
	{ n: "#", v: "c-num"},
	{ n: "Vis type", v: "c-chart"},
	{ n: "Interaction", v: "c-interaction"}
];*/

function populateSidebar(data){

	//var _cols = ["id"];
	var _cols = new Array();
	var _keys = d3.keys(data[0]);
	_keys.forEach(function(d,i){
		_cols.push(d);
	});

	var _sb = d3.select("#main-side-bar");
	var _ul = _sb.append("table")
		.attr("class","no-bg table")
		.style("width","260px");
	var _lis = _ul.selectAll("tr").data(_cols);

	_lis.enter()
	.append("tr")
	.attr("class","no-bg");

	_lis.append("td")
	.attr("width","240")
	.attr("class","no-bg c-type")
	.style("padding-left",0)
	.style("padding-right",0)
	.style("font-weight",700)
	.html(function(d){ return d });

	_lis.append("td")
	.attr("class","no-bg c-eye")
	//.style("float","right")
	.style("padding-left",0)
	.style("padding-right",0)
	.html("<i class='icon-eye-open'></i>");

	_lis.on("mouseover",function(d,i){

		var _el = d3.select(this);
		_el.style("background-color","#b94a48")
		.style("cursor","pointer")
		.style("opacity",1);

		if(_el.classed("grise")==true){
			_el.select(".c-type")
			.html("&nbsp;&nbsp;<em style='color:#FFF;font-weight:100;'>display</em>&nbsp;&nbsp;"+d)
		}else{
			_el.select(".c-type")
			.html("&nbsp;&nbsp;<em style='color:#FFF;font-weight:100;'>masquer</em>&nbsp;&nbsp;"+d)			
		}

	})
	.on("mouseout",function(d,i){

		var _el = d3.select(this);
		_el.style("background-color",null);
		_el.select(".c-type")
		.html(d);

		if(_el.classed("grise")==true){
			_el.style("opacity",0.25);
		}else{
			_el.style("opacity",1);			
		}


	})
	.on("mouseup",function(d,i){

		var _el = d3.select(this);
		
		var _filter_key = 	d.replace(/ /g,'');
		_filter_key = _filter_key.toLowerCase();
		_filter_key = removeDiacritics(_filter_key);
		_filter_key = removeSpecialChars(_filter_key);

		if(_el.classed("grise")==true){
			_el.classed("grise",false);
			d3.selectAll(".c-"+_filter_key)
			.classed("hide",false);
			
			_el.style("opacity",null);
			_el.select(".c-eye").select("i")
			.attr("class","icon-eye-open");
		}else{
			_el.classed("grise",true);			

			d3.selectAll(".c-"+_filter_key)
			.classed("hide",true);

			_el.style("opacity",0.25);
			_el.select(".c-eye").select("i")
			.attr("class","icon-eye-close");
		}


	})

	return false;


}



function savepic(_el)
{
//can perform client side field required checking for "fileToUpload" field
$.ajaxFileUpload({
	url:'ajax/doajaxfileupload.php',
	secureuri:false,
	fileElementId:'fileToUpload',
	dataType: 'json',
	success: function (data, status){
		if(typeof(data.error) != 'undefined'){
			if(data.error != ''){
				//console.log(data.error)
				alert(data.error);
			}else{
				//console.log(data.msg)
				d3.select(_el)
				.insert("img","form")
				.attr("src",data.msg)
				.attr("width",_video_min)
				.style("width",_video_min+"px");
			
				//alert(msg); // returns location of uploaded file
			}
		}
	},
	error: function (data, status, e){
		//console.log(data)
		console.log(e);
	}
})
return false;
};


var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
];
var changes;
function removeDiacritics(str) {
    if(!changes) {
        changes = defaultDiacriticsRemovalMap;
    }
    for(var i=0; i<changes.length; i++) {
        str = str.replace(changes[i].letters, changes[i].base);
    }
    return str;
};

function removeSpecialChars(stringToReplace){
	var specialChars = "!@#$^&%*()+=-—–\'[]\/{}|:<>?,.";
	for (var i = 0; i < specialChars.length; i++) {
	    stringToReplace = stringToReplace.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	};
	return stringToReplace;
};
