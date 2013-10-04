angular.module('directives',[]).directive('profileGen', ['$rootScope',function($scope){

  var dir = {
    //scope:{metro: '=geo'},
    transclude:true,
    scope:{rvar:'=profileGen'},
    replace:true,
    template:'<div class="resourceBox">' +
               '<div class="inner group">' +
                 '<div style="float:left;margin-top:5px;width:75%">' +
                   '<h4 class="title"></h4>' +
                   '<p></p>' +
                 '</div>' +
                 '<div style="float:right;margin-top:5px;width:23%">' +
                   '<div ng-transclude style="height:100%"></div>' + 
                 '</div>' +
                '</div>' + 
              '</div>',
    link: function lfn(scope, instance, attr){
      console.log(scope);
      var a = angular.element(instance); 
      var t = a.find('h4');
      var p = a.find('p');
      t.text(scope.rvar.Product);
      p.text(scope.rvar.Description);
      //console.log(a);

      var thiz = angular.element(instance[0]);
      console.log(thiz);
      //angular.element(thiz.querySelectorAll('p.title')).text(scope.r.Product);
    } //end link function
  } //end dir object
  return dir;
}]);