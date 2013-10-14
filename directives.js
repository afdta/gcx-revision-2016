angular.module('directives',['services']).directive('profileGen', [function(){

  var dir = {
    //scope:{metro: '=geo'},
    priority:100,
    transclude:true,
    scope:{rvar:'=profileGen'},
    replace:true,
    template:'<div class="resourceBox">' +
               '<div class="inner group">' +
                 '<div style="float:left;margin-top:5px;width:75%">' +
                   '<ul><li style="color:rgb(150,150,150)">Released {{rvar.PID | pid2date}}</li></ul>' +
                   '<h4 class="title" style="margin:0px 8px 0px 0px;float:left;"></h4>' +
                   '<p style="clear:left;"></p>' +
                 '</div>' +
                 '<div style="float:right;margin-top:5px;max-width:20%">' +
                   '<div ng-transclude style="height:100%"></div>' + 
                 '</div>' +
                '</div>' + 
              '</div>',
    link: function lfn(scope, instance, attr){
      //console.log(scope);
      var a = angular.element(instance[0]); 
      //console.log(instance);
      var t = a.find('h4');
      var p = a.find('p');
      //var newText = scope.rvar.Product;
      t.text(scope.rvar.Product);
      p.text(scope.rvar.Description);
    } //end link function
  } //end dir object
  return dir;
}]);

angular.module('directives').directive('profileLinks', ['$filter','$compile',function($filter,$compile){
  var filter = $filter('pid2date');
  //var linkfilter = $filter('linkBuilder'); //takes report object and metro object
  var dir = {
    scope:{r:'=profileLinks',metro:"="},
    replace:true,
    template:'<ul><li style="color:rgb(150,150,150);float:right;">Report resources</li></ul>',
    link: function lfn(s,i,a){
      s.linkText = "";
      var link_template = $compile('<li><a href="{{r | linkBuilder:metro}}">{{linkText}}</a></li>')(s);

      //var r = s.r;
      var aa = angular.element(i[0]);//.find('ul');
      //aa.append("<li style='color:rgb(5,55,105)'>Released: " + filter(s.r.PID) + "</li>"); //text("FOUND IT")
      if(s.r.Metros){
        //console.log("NEW LINK");
        aa.append(link_template);
      }

      //show link
      s.$watch(function(){return s.metro},function(newval,oldval){
        s.linkText = newval===null ? "" : newval.FirstCity + " profile";
      });
    }
  };
  return dir;
}]);