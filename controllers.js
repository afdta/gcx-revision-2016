angular.module('METRODAT', ['controllers','directives','services','ngAnimate'])


//note the use of array notation for minification -- declares dependencies before declaring constructor function (which could just take dependencies as arguments, but this is more robust)
angular.module('controllers',[]).controller("metrodat_ctrl",['$scope','$http','$location','filterie8',function($scope,$http,$location,filterie8){

  var assetRepo = "."
  //var assetRepo = "/~/media/multimedia/interactives/2013/MetroDataResources";
  $scope.reportSortName = true;
  $scope.reportSortDate = !$scope.reportSortName;
  $scope.updateNameSort = function($event){
    //console.log($event);
    $scope.reportSortDate = !$event.target.checked;
  }
  $scope.updateDateSort = function($event){$scope.reportSortName = !$event.target.checked;}

  //Extent of deep linking
  //On load - path is initially set to the path scope property and the selection header is initialized as if no metro is selected
  //Changes to the path are watched and if the new local path refers to a metro the new metro code is set to it, otherwise it is set to null
      //When you select a metro from the list, the location path is changed
      //Things could go wrong on init if the getPath watch is fired against an empty metrOs object, resulting in metroCode getting set to null (addressed by adding an init case in the $http request)
  //Changes to metro code are watched and current metro object, metro name, and selection title are updated accordingly 

  $scope.path = getPath(); //keep track of which geo is being viewed
  $scope.metrOs = {}; //object with all metro objects -- uses MCode as key values
  $scope.selectionHeader = "Search for and select a metro area to view its profiles";

  //set up a watch on the path
  $scope.$watch(getPath,function(newval,oldval){
                          $scope.path = newval;
                          if($scope.path in $scope.metrOs){
                            $scope.metroCode = $scope.path;
                          }
                          else{
                            $scope.metroCode = null;
                          }    
                        }); //end watch

  function getPath(){
    return $location.path().replace(/\//,"");
  }

  //LOAD UP METRO DATA
  $http.get(assetRepo + '/Metros.json').success(function(data) {
    var dataFiltered = filterie8(data,function(a){return a.Largest100==1 ? true : false});
    dataFiltered.sort(function(a,b){return a.MetroName < b.MetroName ? -1 : 1;})
    $scope.metros = dataFiltered;
    $scope.metro = null;  //default to null object
    $scope.metroName = null;
    $scope.metroCode = null;

    for(i=0;i<$scope.metros.length;i++){
      $scope.metrOs[$scope.metros[i].MCode] = $scope.metros[i];
    }
    
    //initialize metrocode after the metrOs object is available.
    if($scope.path in $scope.metrOs){
      $scope.metroCode = $scope.path;
    }
  })

  $scope.setMetro = function(m) {
      $scope.metroCode = m.MCode;
      $location.path("/"+m.MCode);
      $scope.metsel = false;
  }
  $scope.metsel = false;
  $scope.showmets = function(){$scope.metsel=true}

  //keep all selected metro area variables up to date
  $scope.$watch('metroCode',function(newval,oldval){
    if(typeof $scope.metros !== 'undefined' && $scope.metroCode !== null){
      var a = filterie8($scope.metros,function(e){
        return e.MCode==$scope.metroCode ? true : false;
      });
      $scope.metro = a[0];
      $scope.metroName = $scope.metro.MetroName;
      $scope.selectionHeader = "You've selected: " + $scope.metro.MetroName;
    }
    else if($scope.metroCode === null){
      $scope.metro = null;
      $scope.metroName = null;
      $scope.selectionHeader = "Search for and select a metro area to view its profiles";
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
    data = filterie8(data,function(e){return e.Product!=="All reports" ? true : false});
    $scope.allReports = data; //an original, undedited copy of the data
    $scope.reports = data.slice(0); //for the filterable list of links to profiles
    $scope.report = $scope.reports[0];
    $scope.reportID = $scope.report.PID;
    //console.log($scope.reports);
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

            //$scope.report = $scope.reports[0];
            //$scope.reportID = $scope.report.PID;
          }
        },true)
}]);