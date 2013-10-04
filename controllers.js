angular.module('METRODAT', ['directives','services'])


//note the use of array notation for minification -- declares dependencies before declaring constructor function (which could just take dependencies as arguments, but this is more robust)
angular.module('METRODAT').controller("metrodat_ctrl",['$scope','$http','filterie8',function($scope,$http,filterie8){

  var assetRepo = "."
  //var assetRepo = "/~/media/multimedia/interactives/2013/MetroDataResources"
  $scope.reportSortName = true;
  $scope.reportSortDate = !$scope.reportSortName;
  $scope.updateNameSort = function($event){
    console.log($event);
    $scope.reportSortDate = !$event.target.checked;
  }
  $scope.updateDateSort = function($event){$scope.reportSortName = !$event.target.checked;}


  //LOAD UP METRO DATA
  $http.get(assetRepo + '/Metros.json').success(function(data) {
    var dataFiltered = filterie8(data,function(a){return a.Largest100==1 ? true : false});
    dataFiltered.sort(function(a,b){return a.MetroName < b.MetroName ? -1 : 1;})
    $scope.metros = dataFiltered;
    $scope.metro = $scope.metros[0];
    $scope.metroName = $scope.metro.MetroName;
    $scope.metroCode = $scope.metro.MCode;
  })

  //keep all selected metro area variables up to date
  $scope.$watch('metroCode',function(newval,oldval){
    if(typeof $scope.metros !== 'undefined'){
      var a = filterie8($scope.metros,function(e){
        return e.MCode==$scope.metroCode ? true : false;
      });
      $scope.metro = a[0];
      $scope.metroName = $scope.metro.MetroName;
    }
  });


  //LOAD UP REPORT DATA
  $http.get(assetRepo + '/Research.json').success(function(data) {
    data.sort(function(a,b){
      if(a.Product=="All reports"){return -1}
      else if(b.Product=="All reports"){return 1}
      else{
        return a.Product < b.Product ? -1 : 1
      }
    });
    data = filterie8(data,function(e){return e.Metros || e.Product=="All reports" ? true : false}); //don't include it if there aren't metros
    $scope.allReports = data; //an original, undedited copy of the data
    $scope.reports = data.slice(0); //for the list of links to profiles
    $scope.report = $scope.reports[0];
    $scope.reportID = $scope.report.PID;
  });

  //keep all report data in sync
  //allReports is never changed and is used for the menu 
  //reports is the array of reports to be used to generate links
  //report is the first entry in reports and
  //reportID is used to select reports and report; it is bound in the select ng-model directive 
  $scope.$watch('reportID',function(newval,oldval){
    if(typeof $scope.reports !== 'undefined'){
      if(newval==-1){
        var a=$scope.allReports.slice(1); //the first element should always be the "all reports" entry -- so select everything after
      }
      else{
        var a = filterie8($scope.allReports,function(e){
          return e.PID==$scope.reportID ? true : false;
        });      
      }
      $scope.report = a[0];
      $scope.reports = a;
      //console.log($scope.reports);
    }
  });

        //Watcher to check on current sort order for reports
        function reportSort(s){
          var name = s.reportSortName;
          var date = s.reportSortDate;
          var o = {"name":name,"date":date}
          return o;
        }
        $scope.$watch(reportSort,function(newval, oldval){
          if(typeof $scope.allReports !== 'undefined'){
            console.log(newval);
            $scope.allReports.sort(function(a,b){
              if(a.Product=="All reports"){return -1}
              else if(b.Product=="All reports"){return 1}
              else if(newval.name){return a.Product < b.Product ? -1 : 1;}
              else {return b.PID - a.PID}  
            });
            //$scope.report = $scope.reports[0];
            //$scope.reportID = $scope.report.PID;
          }
        },true)


}]);