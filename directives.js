angular.module('directives',[]).directive('usMap', ['d3Service',function(d3){
  return {
    template:'<div style="width:100%;min-width:300px;min-height:260px"></div>',
    replace:false,
    scope:false,
    link:function(s,i,a){
      //console.log(s);
      if(d3){
        var svg = d3.select(i.find('div')[0]).append("svg").style({"height":"260px","width":"120%"});

        var defs = svg.append("svg:defs");
        var gradient2 = defs.append("svg:radialGradient").attr("id", "gradient2").attr("cx", "50%").attr("cy", "50%").attr("r", "50%").attr("fx", "45%").attr("fy", "45%");
            gradient2.append("svg:stop").attr("offset", "10%").attr("stop-color", "#FFFFFF").attr("stop-opacity", 1);
            gradient2.append("svg:stop").attr("offset", "35%").attr("stop-color", "#FFF401").attr("stop-opacity", 1);
            gradient2.append("svg:stop").attr("offset", "90%").attr("stop-color", "#FFB33C").attr("stop-opacity", .0);
            //gradient2.append("svg:stop").attr("offset", "100%").attr("stop-color", "#FFB33C").attr("stop-opacity", 0);            

        var filter = defs.append("svg:filter").attr({"id":"dropShadow"})
        filter.append("svg:feGaussianBlur").attr({"stdDeviation":"4","result":"blurOut"});
        filter.append("svg:feOffset").attr({"dx":"2","dy":"3","in":"blurOut","result":"blurOut2"});
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in","blurOut2");
        feMerge.append("feMergeNode").attr("in","SourceGraphic");

        var filter2 = defs.append("svg:filter").attr({"id":"smallShadow","width":"200%","height":"200%","x":"-25%","y":"-25%"});
        filter2.append("svg:feGaussianBlur").attr({"stdDeviation":"2","in":"SourceAlpha","result":"blurOut"});
        filter2.append("svg:feOffset").attr({"dx":"1","dy":"1","in":"blurOut","result":"blurOut2"});
        filter2.append("svg:feComposite").attr({"in2":"blurOut2","operator":"in"});

        var feMerge2 = filter2.append("feMerge");
        feMerge2.append("feMergeNode").attr("in","blurOut2");
        feMerge2.append("feMergeNode").attr("in","SourceGraphic");

        var filter3 = defs.append("svg:filter").attr({"id":"textShadow","width":"200%","height":"200%","x":"-25%","y":"-25%"});
        filter3.append("svg:feGaussianBlur").attr({"stdDeviation":"2","in":"SourceAlpha","result":"blurOut"});
        filter3.append("svg:feOffset").attr({"dx":"0","dy":"0","in":"blurOut","result":"blurOut2"});
        filter3.append("svg:feFlood").attr({"flood-color":"rgba(0,0,0,0.5)"});
        var feMerge3 = filter3.append("feMerge");
        feMerge3.append("feMergeNode").attr("in","blurOut2");
        feMerge3.append("feMergeNode").attr("in","SourceGraphic");

        var borders = svg.append("g").attr("filter","url(#dropShadow)");
        var dots = svg.append("g");
        var anno = svg.append("g");
        var stjson = s.stjson;
        var latlon = s.latlon;

        var proj = d3.geo.albersUsa().scale(500).translate([182,115]);
        var path = d3.geo.path().projection(proj);
        //var u = Math.sqrt(0.5);
        borders.append("path").attr("d",path(stjson)).style({"fill":"#163A4C","stroke":"rgba(0,0,0,0)","stroke-width":"0.5px"});
        dots.selectAll("path").data(latlon.metroUniverse).enter().append("path").attr("d",function(d,i){
          var ll = latlon.metros[d];
          ll.lonlat = proj([ll.Lon,ll.Lat]); //mutate original data
          var M = (Math.round(ll.lonlat[0])-1) + "," + Math.round(ll.lonlat[1])
          return "M"+M+' l'+1+","+0;         
        })
        .style({"fill":"none","stroke":"#B8B480","stroke-width":"1","shape-rendering":"crispEdges"});
        
        var radius = 3.5;
        dots.selectAll("circle").data(latlon.metroUniverse).enter().append("circle")
            .attr("cx",function(d,i){
              var ll = latlon.metros[d];
              //lonlat added to original data above
              return ll.lonlat[0];
            })
            .attr("cy",function(d,i){
              return latlon.metros[d].lonlat[1];
            })
            .attr("r",function(d,i){
              if(d in s.gcxmetros){return radius;}
              return 0;
            })
            .style("fill",function(d,i){
              if(d in s.gcxmetros){return "#FFB33C"}
              return "rgba(255,250,178,0.25)";
            })
            ;
        var gcxDots = dots.selectAll("circle").select(function(d,i){
          if(d in s.gcxmetros){return this}
          else{return null}
        })
        //.attr("filter","url(#smallShadow)")

        //setTimeout(function(){gcxDots.attr("r",25);},1500);
        gcxDots.on("mouseover",function(d,i){
          var m = latlon.metros[d];
          var thiz = d3.select(this);
          var cx = parseFloat(thiz.attr("cx"));
          var cy = parseFloat(thiz.attr("cy"));
          var r = parseInt(thiz.attr("r"));
          var attr = {r:r+8,cx:cx,cy:cy}

          thiz.attr({"r":"8"})
          
          var c = anno.selectAll("circle.hoverDot").data([attr]);
          var g = anno.selectAll("g.hoverDot").data([0]);

          //c.enter().append("circle"); c.exit().remove(); c.attr("class","hoverDot").style({"fill":"none","stroke":"#ffffff","stroke-width":"1px","opacity":1}).attr(attr);
          g.enter().append("g"); g.exit().remove(); g.attr("class","hoverDot").style("opacity",0).attr("transform","translate("+(cx+13)+","+(cy-8)+")");
          
          var rct = g.append("rect").attr({height:"16px",width:"100px","rx":"3px","ry":"3px"}).style({"fill":"#FFB33C","opacity":"1"});
          var txt = g.append("text").attr({dx:"5px",dy:"12px"}).text(m.firstcity).style({"fill":"#303030","stroke":"none","stroke-width":"0.25px","font-size":"11px","font-weight":"bold","line-height":"11px"});

          //marker is centered on a 22w x 40h canvas (pixels)
          //var dMarker="M 10.557959,37.523391 C 9.8940192,31.186197 7.3594442,25.218177 4.0931601,19.882557 2.3532946,16.866978 0.67218032,13.377735 1.4097777,9.7570219 2.0655135,5.8675452 4.9354251,2.3728215 8.7116145,1.5343964 12.938731,0.38924059 17.817363,2.5719707 19.689533,6.7361 c 1.76022,3.598508 1.289455,8.1014 -0.851685,11.413865 -2.345186,4.317044 -4.986967,8.561833 -6.179866,13.42106 -0.666632,2.247227 -1.137764,4.561633 -1.337774,6.905799 -0.474939,0.90641 -0.87879,-0.553575 -0.762249,-0.953433 z"
          //g.append("path").attr("d",dMarker).attr("transform","translate(-24,-35)").style({"pointer-events":"none","fill":"#CC3E14","stroke":"#ffffff","stroke-width":"0"});

          var w = txt.node().getBoundingClientRect();
          w.w = w.right-w.left;
          rct.attr("width",w.w+10);

          g.transition().delay(0).duration(100).style("opacity",1);
        });

        gcxDots.on("mouseout",function(d,i){
          d3.select(this).style({"stroke":"#ffffff","stroke-width":"0px"}).attr({"r":radius})
          anno.selectAll(".hoverDot").remove();
        });

        gcxDots.on("mousedown",function(d,i){
          s.$apply(s.metro=d);
        });

      }//end d3 code
      else{
        var jq = i.find('div')
        jq.append('<img src="' + s.assetRepo + '/gcxmap.png"' + 'height="265" width="395"/>')
        //("background-image","url(" + s.assetRepo + "/gcxmap.png" + ")");
        //jq.css("background-repeat","url(no-repeat)");
        //jq.css("background-repeat","left top");
        //jq.css("width","395px");
      }
    }
  }  
}]);