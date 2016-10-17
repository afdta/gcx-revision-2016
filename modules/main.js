import build_map from "./build-map.js"
import list_products from "./list-products.js"

var asset_repo = "./assets/";

var parser = function(d){
	var ep = d.Export_Plan !== "" ? {title:"Export plan", url: d.Export_Plan} : null;
	var gti = d.Global_Trade_and_Investment_Plan;
	var fp = gti !== "" ? {title:"Global Trade and Investment plan", url:gti} : null;
	var plans = [];

	if(fp){plans.push(fp)}
	else if(ep){plans.push(ep)}

	//need an entry for no plans completed
	return {id:d.CBSA_Code, name:d.firstcity, plans:plans};
}

var addCoverArt = function(){
	var imgs = [
		"los_angeles.png",
		"minneapolis.png",
		"portland.png",
		"syracuse.png",
		"columbus.png",
		"san_diego.png"
	]
	var covers = d3.selectAll("div.report-cover").select("a").append("img");
	covers.attr("src", function(d,i){return asset_repo + imgs[i]});
}


function main(){
	d3.csv((asset_repo + "gcx_data.csv"), parser, function(E,D){
		if(E){
			console.log(E);
			//Feed error
		}
		else{
			D.sort(function(a,b){
				if(a.plans.length==0 && b.plans.length==0){
					var idx = a.name <= b.name ? -1 : 1;
				}
				else if(a.plans.length==0){ var idx = 1}
				else if(b.plans.length==0){ var idx = -1}
				else{ var idx = a.name <= b.name ? -1 : 1;}
				return idx;
			})
			
			addCoverArt();
			list_products(D);
			build_map(document.getElementById("us-map"), D);
		}
	});
}

document.addEventListener("DOMContentLoaded", function(){
	main();
});