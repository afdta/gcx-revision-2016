angular.module('services',[]).factory('dataXchange',['$rootScope',function($rootScope){
  var scope = $rootScope.$new();
  function set(key,val){
    scope[key] = val;
  }
  function get(key){
    return scope[key];
  }
  return {get:get,set:set};  
}])

angular.module('services').factory('filterie8',[function(){
  function filter(arr,func){
    var newA = [];
    for(var i=0;i<arr.length;i++){
      if(func(arr[i])){newA.push(arr[i])}
    }
    return newA;
  }
  return filter;
}]);

angular.module('services').filter('linkBuilder',[function(){
  function linkit(report,met){
    //console.log(report);
    //console.log(met);
    var linkstyle = report.Naming;
    var link;
    //start filtering with report specific tests
    if(report.PID===20130917){
      //Export nation doesn't use underscores
      link = met.FirstCity!=="St. Louis" ? met.FirstCity : "St Louis";
    }
    else if(report.PID===20121130 || report.PID===20130201){
      link = ""; //global metromonitor and patenting prosperity don't have linkable profiles
    }
    else if(report.PID===20120627){
      //MetroMonitor has an odd style
      link = met.MCode + "-recovery-overall-mv"
    }
    else if(report.PID===20110512){
      //Missed Opportunity
      link = met.FirstCity!=="St. Louis" ? met.MetNS + met.ST1 : "SaintLouisMO";
    }
    else if(report.PID===20110709){
      //Geography of immigrant skills (old report -- e.g. Bradenton and no profile for Lancaster)
      link = met.FirstCity!=="North Port" ? met.MetNS + met.ST1 : "BradentonFL";
    }
    else if(linkstyle=="MetState"){
      link = met.Met + met.ST1;
    }
    else if(linkstyle=="MetroState"){
      link = met.Metro + "_" + met.ST;
    }
    else if(linkstyle=="Metro"){
      link = met.Metro;
    }
    else if(linkstyle=="Met"){
      link = met.Met;
    }
    else if(linkstyle=="Code"){
      link = met.Code;
    }
    else if(linkstyle=="Mcode"){
      link = met.MCode;
    }
    return report.Dir + link;
  }
  return linkit;
}]);