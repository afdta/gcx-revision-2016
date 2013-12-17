angular.module('directives',[]).directive('usMap', ['d3Service','$window',function(d3,$window){
  return {
    template:'<div style="width:100%;min-width:300px;min-height:260px;height:100%"></div>',
    replace:false,
    scope:false,
    link:function(s,i,a){
      //console.log(i);
      if(d3){
        var svg = d3.select(i.find('div')[0]).append("svg").style({"height":"100%","width":"100%"});

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

        var proj = d3.geo.albersUsa();  
        var path = d3.geo.path(); 

        i.css("overflow","visible");
        s.rescale = function(){
          var w = i[0].offsetWidth <= 710 ? i[0].offsetWidth : 710;
          //console.log(w);
          var h = w*(.64);
          var dots = [4,6,9];
          var fs = ["9px","9px","11px"];
          s.mapDim = {scale:w*1.32, translate:[(w/2)-8,(h/2)-8]};
          var sml = s.mapDim.scale < 600 ? 0 : (s.mapDim.scale < 800 ? 1 : 2); //small, medium, or large: 1,2, or 3
          s.mapDim.r = dots[sml];
          s.mapDim.fs = fs[sml];
          s.mapDim.level = sml; 
          i.css("height",h+"px");
          //i.css("width",w+"px");
          //svg.style({"height":h,"width":w});
          proj.scale(s.mapDim.scale).translate(s.mapDim.translate);
          path.projection(proj);
        }
        s.rescale();

        s.redraw = function(){
          s.rescale();
          borders.selectAll("path").attr("d",path(stjson));
          dots.selectAll("circle")
            .attr("cx",function(d,i){
              var ll = latlon.metros[d];
              ll.lonlat = proj([ll.Lon,ll.Lat]); //mutate original data
              return ll.lonlat[0];
            })
            .attr("cy",function(d,i){
              return latlon.metros[d].lonlat[1];
            })
            .attr("r",function(d,i){
              if(d in s.gcxmetros){return s.mapDim.r;}
              return 0;
            });
          dots.selectAll("path").attr("d",function(d,i){
            var ll = latlon.metros[d];
            var M = (Math.round(ll.lonlat[0])-1) + "," + Math.round(ll.lonlat[1])
            return "M"+M+' l'+1+","+0;         
          })
          anno.selectAll("text")
            .attr("x",function(d,i){return latlon.metros[d].lonlat[0];})
            .attr("y",function(d,i){return latlon.metros[d].lonlat[1];})
            .style("font-size",s.mapDim.fs);
        }

        //var u = Math.sqrt(0.5);
        borders.append("path").attr("d",path(stjson)).style({"fill":"#B8C0CC","stroke":"rgba(255,255,255,0)","stroke-width":"0.5px"});
        dots.selectAll("path").data(latlon.metroUniverse).enter().append("path").attr("d",function(d,i){
          var ll = latlon.metros[d];
          ll.lonlat = proj([ll.Lon,ll.Lat]); //mutate original data
          var M = (Math.round(ll.lonlat[0])-1) + "," + Math.round(ll.lonlat[1])
          return "M"+M+' l'+1+","+0;         
        })
        .style({"fill":"none","stroke":"#ffffff","stroke-width":"1px","shape-rendering":"crispEdges"});
        
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
              if(d in s.gcxmetros){return s.mapDim.r;}
              return 0;
            })
            .style("fill",function(d,i){
              //return "url(#gradient2)";
              if(d in s.gcxmetros){
                var col = [null,"#FFB33C","#fee090","#abd9e9","#4575b4"];
                var ll = latlon.metros[d];
                return col[ll.Cohort];
              }
              return "rgba(255,250,178,1)";
            })
            ;
        var gcxDots = dots.selectAll("circle").select(function(d,i){
          if(d in s.gcxmetros){return this}
          else{return null}
        })
        gcxDots.style({"stroke":"#ffffff","stroke-width":"1px"})
        //.attr("filter","url(#smallShadow)")

        anno.selectAll("text").data(latlon.metroUniverse).enter().append("text")
            .attr("x",function(d,i){return latlon.metros[d].lonlat[0];})
            .attr("y",function(d,i){return latlon.metros[d].lonlat[1];})
            .text(function(d,i){
              return (d in s.gcxmetros) ? latlon.metros[d].firstcity : "";
            })
            .attr({"dx":"-4px","dy":"4px"})
            .style("font-size",s.mapDim.fs);

        //setTimeout(function(){gcxDots.attr("r",25);},1500);
        gcxDots.on("mouseover",function(d,i){
          var m = latlon.metros[d];
          var thiz = d3.select(this);
          var cx = parseFloat(thiz.attr("cx"));
          var cy = parseFloat(thiz.attr("cy"));
          var r = parseInt(thiz.attr("r"));
          var attr = {r:r+8,cx:cx,cy:cy}

          thiz.transition().duration(250).attr({"r":r+5})
          
          //var c = anno.selectAll("circle.hoverDot").data([attr]);
          //var g = anno.selectAll("g.hoverDot").data([0]);

          //g.enter().append("g"); g.exit().remove(); g.attr("class","hoverDot").style("opacity",0).attr("transform","translate("+(cx+13)+","+(cy-8)+")");
          //var rct = g.append("rect").attr({height:"16px",width:"100px","rx":"3px","ry":"3px"}).style({"fill":"#FFB33C","opacity":"0"});
          //var txt = g.append("text").attr({dx:"5px",dy:"12px"}).text(m.firstcity).style({"fill":"#303030","stroke":"none","stroke-width":"0.25px","font-size":"15px","font-weight":"normal","line-height":"15px"});

          //var w = txt.node().getBoundingClientRect();
          //w.w = w.right-w.left;
          //rct.attr("width",w.w+10);

          //g.transition().delay(0).duration(50).style("opacity",1);
        });

        gcxDots.on("mouseout",function(d,i){
          d3.select(this).style({"stroke":"#ffffff","stroke-width":"1px"}).transition().duration(50).attr({"r":s.mapDim.r})
          anno.selectAll(".hoverDot").remove();
        });

        var searchBox = document.getElementById("metroSelectBox")
        gcxDots.on("mousedown",function(d,i){
          s.$apply(s.metro=d);
          d3.select(searchBox).transition().duration(20).style("background-color","#FFB33C").each("end",function(){
            d3.select(this).transition().delay(200).duration(500).style("background-color","#ffffff");
          })
        });

        //RESIZING
        window.onresize = function() {
          s.$apply(function(s){
            s.redraw();
          });
        };

      }//end d3 code
      else{
        var jq = i.find('div')
        jq.append('<img src="' + s.assetRepo + '/gcxmap.png"/>')
        //("background-image","url(" + s.assetRepo + "/gcxmap.png" + ")");
        //jq.css("background-repeat","url(no-repeat)");
        //jq.css("background-repeat","left top");
        //jq.css("width","395px");
      }
    }
  }  
}]);