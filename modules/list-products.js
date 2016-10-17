//split vector into matrix with col columns
var v2m = function(arr, col){
    var i=0;
    var mat = [];
    var len = arr.length;
    while(i<len){
        var j=0;
        var row = [];
        while(j<col && (i+j)<len){
        	row.push(arr[(i+j)])
            j=j+1;
        }
        mat.push(row);
    	i=i+col;
    }
    return mat;
}

export default function list_products(dat){
	var gti = [];
	var exp = [];
	var inp = [];

	for(var i=0; i<dat.length; i++){
		if(dat[i].plans.length > 0){
			if(dat[i].plans[0].title=="Global Trade and Investment plan"){
				gti.push(dat[i]);
			}
			else{
				exp.push(dat[i]);
			}
		}
	}

	//manually compile in-progress data array
	inp.push("Baltimore (exports and FDI)");
	inp.push("Charleston (FDI)");              
	inp.push("Chicago (FDI)");    
	inp.push("Fresno (FDI)");
	inp.push("Houston (FDI)");
	inp.push("Indianapolis (FDI)");
	inp.push("Louisville-Lexington (FDI)");
	inp.push("Phoenix (FDI)");
	inp.push("Salt Lake (FDI)");
	inp.push("St. Louis (FDI)");
	inp.push("Tampa Bay (FDI)");
	inp.push("Wichita (FDI)");

	var pdata = [
		{
			title:"Global trade and investment plans",
			subtitle: "These supplant existing export plans",
			data: gti
		},
		{
			title:"Export plans",
			subtitle: null,
			data: exp
		},
		{
			title:"Planning in progress",
			subtitle: "Phase is noted in parentheses",
			data: inp
		}
	];

	var product_groups = d3.select("#gcx-product-tables")
						   .selectAll("div")
						   .data(pdata);

	product_groups.enter().append("div").append("div").classed("title-wrap",true).style({"margin":"0em 0em 0.5em 0em", "border-bottom":"0px solid #dddddd"});
	product_groups.exit().remove();
	product_groups.style("margin", function(d,i){return i==0 ? "2em 0em" : "2em 0em"});

	var product_group_titles = product_groups.select("div.title-wrap").selectAll("p")
											.data(function(d,i){
												var t = !!d.subtitle ? [d.title, d.subtitle] : [d.title];
												return t;
											});
	product_group_titles.enter().append("p");
	product_group_titles.exit().remove();

	product_group_titles.text(function(d,i){return d})
						.style("font-weight",function(d,i){return i===0 ? "bold" : "normal"})
						.style("font-style",function(d,i){return i===1 ? "italic" : "normal"})
						.style("margin","0px");


	var tables = product_groups.selectAll("table").data(function(d,i){return [d.data]});
	tables.enter().append("table").append("tbody");
	tables.exit().remove();
	tables.style({"width":"100%"});


	var rows = tables.select("tbody").selectAll("tr").data(function(d,i){
		return v2m(d, 3);
	});
	rows.enter().append("tr");
	rows.exit().remove();

	var cols = rows.selectAll("td").data(function(d,i){return d});
	cols.enter().append("td");
	cols.exit().remove();
	cols.style({"width":"33%"});

	cols.each(function(d,i){
		var thiz = d3.select(this);
		try{
			if(!d.plans[0].url){
				throw "no_url";
			}
			else{
				thiz.selectAll("a").remove();
				thiz.append("a")
					.attr("href", d.plans[0].url)
					.attr("target","_blank")
					.text(d.name + " »");				
			}
		}
		catch(e){
			thiz.text(d);
		}
	});

}
