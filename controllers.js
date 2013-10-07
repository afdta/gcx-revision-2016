angular.module('METRODAT', ['directives','services','ngAnimate'])


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
    $scope.reports = data.slice(0); //for the filterable list of links to profiles
    $scope.report = $scope.reports[0];
    $scope.reportID = $scope.report.PID;
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
            //console.log(newval);
            $scope.reports.sort(function(a,b){
              if(a.Product=="All reports"){return -1}
              else if(b.Product=="All reports"){return 1}
              else if(newval.name){return a.Product < b.Product ? -1 : 1;}
              else {return b.PID - a.PID}  
            });

            console.log($scope.reports);
            //$scope.report = $scope.reports[0];
            //$scope.reportID = $scope.report.PID;
          }
        },true)


  //KEYWORD SEARCHES
  $scope.$watch('keyword',function(n,o){
    console.log(n);
  })

  console.log($scope);

  $scope.$watch('metkeyword',function(newval,oldval){
    if(typeof $scope.metkeyword=='undefined'){$scope.metsel = false}
    else if($scope.metkeyword===""){$scope.metsel = false}
    else $scope.metsel = true;
  });
}]);