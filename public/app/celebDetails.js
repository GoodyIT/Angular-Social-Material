app.controller('celebDetailsCtrl', function ($scope, $rootScope, facebookService, $q, $http, $routeParams, $location) {
  var promiseAry = [];
  var searchId = new Date().getTime()+"";
  var DEFAULT_PAGE_SIZE = 5;

  $scope.currentSearchKeyword = $rootScope.currentSearchKeyword || $routeParams.keyword || "";
  $scope.pageId = $routeParams.pageId || "";
  $scope.loadedCelebDetails = false;
  $scope.currentGraphIndex = 1;
  $scope.currentCelebPage = $rootScope.currentCelebPage ;
  // Login completed event
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
    }
  });

  if($scope.pageId){
    $rootScope.apiClientV2.facebookPageGet({id:$scope.pageId},
        {}, {
          headers: {
            'Content-type': 'application/json'
          }
        }).then(function (res) {
           $scope.currentCelebPage = $rootScope.currentCelebPage = res.data;
           getSuggestedPages($scope.currentCelebPage.keywords[0] + " " + $scope.currentCelebPage.keywords[1]);
           angular.forEach(res.data.history, function(dateEntry, index){
                $scope.likeGrowthChartData[0].values.push([dateEntry.date, dateEntry.likes]);
                $scope.talkAboutGrowthChartData[0].values.push([dateEntry.date, dateEntry.talking_about_count]);
           });
           $scope.loadedCelebDetails = true;
           $rootScope.$apply();
           $scope.$apply();
    });
  }

  $scope.likeGrowthChartOptions = {
      chart: {
        type: 'lineChart',
        height: 300,
        margin: {
          top: 10,
          right: 60,
          bottom: 20,
          left: 85
        },
        xScale : d3.time.scale(),
        x: function (d) {
          return d3.time.format('%Y-%m-%d').parse(d[0]);
        },
        y: function (d) {
          return d[1];
        },
        showLegend: false,
        showControls: false,
//        useInteractiveGuideline: false,
        color: function () {
          return '#EDB403';
        },
        useInteractiveGuideline: false,
        interactive: true,
        tooltips: true,
        tooltip: {contentGenerator: function (d) {
         return "<p>" + d3.format(',.0f')(d.point.y) + " likes on "+ d3.time.format("%m/%d")(new Date(d.point.x)) + "</p>"; }
         },
        xAxis: {
          tickFormat: function (d) {
            return d3.time.format('%d/%m')(new Date(d));
          }
        },
        yAxis: {
          tickFormat: function (d) {
            var prefix = d3.formatPrefix(d);
            return prefix.symbol === '' ? d3.format(',.0f')(prefix.scale(d)) : d3.format(',.2f')(prefix.scale(d)) + prefix.symbol;
//            return d3.format(',.0f')(d);
          }
        }
      }
  };
  $scope.likeGrowthChartData = [{
    'key': 'Likes',
    'values': []
  }];
  $scope.talkAboutGrowthChartOptions = {
      chart: {
        type: 'lineChart',
        height: 300,
        margin: {
          top: 10,
          right: 60,
          bottom: 20,
          left: 85
        },
        xScale : d3.time.scale(),
        x: function (d) {
          return d3.time.format('%Y-%m-%d').parse(d[0]);
        },
        y: function (d) {
          return d[1];
        },
        showLegend: false,
        showControls: false,
        useInteractiveGuideline: false,
        interactive: true,
        tooltips: true,
        tooltip: {contentGenerator: function (d) {
         return "<p>" + d3.format(',.0f')(d.point.y) + " people talked about on "+ d3.time.format("%m/%d")(new Date(d)) + "</p>"; }
         },
        color: function () {
          return '#EDB403';
        },
        xAxis: {
          tickFormat: function (d) {
            return d3.time.format('%d/%m')(new Date(d));
          }
        },
        yAxis: {
          tickFormat: function (d) {
             var prefix = d3.formatPrefix(d);
             return prefix.symbol === '' ? d3.format(',.0f')(prefix.scale(d)) : d3.format(',.2f')(prefix.scale(d)) + prefix.symbol;
          }
        }
      }
  };
  $scope.talkAboutGrowthChartData = [{
    'key': 'Talk About',
    'values': []
  }];
  $scope.goToSignUpPage = function(){
    var redirection = $location.url();
    $location.path('/signup').search({redirection: redirection});
  };
  $scope.startBuildAudience = function(){
    $rootScope.audience = {name: ""};
    $location.path('/buildAudience').search({pageId: $rootScope.currentCelebPage.id});
  };
  var getSuggestedPages = function(keyword){
    $rootScope.apiClientV2.facebookSearchGet({
          q:keyword,
          from: 0,
          size:DEFAULT_PAGE_SIZE,
          category: $scope.filterCategory || "",
          talkAbout: "",
          verified: "",
          followers: "",
          sortBy: "",
          featured: ""
      },
    {}, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(function (res) {
      $scope.suggestedPages = [];
       angular.forEach(res.data, function(page){
          if(!$rootScope.currentCelebPage || page.id !== $rootScope.currentCelebPage.id){
              $scope.suggestedPages.push(page);
          }
       });
       $scope.$apply();
    });
  };
});