app.controller('statisticsCtrl', function ($scope, $uibModal, $http, $rootScope,
  $location, $routeParams, $timeout, $window) {
  $scope.Math = Math;
  $scope.totalLocationNum = 0;
  $scope.isCollapsed = true;
  $scope.selectedFanOnlineDay = null;
  $scope.suggestedCeleb = [];
  $scope.showAdminStats = false;
  $scope.pageMap = {};
  $scope.loadedSocialData = true;
  $scope.sendingPermissionRequest = false;
  // Use caching instead of direct download
  $rootScope.$watch('ready', function () {
    $scope.allFbPageApproved = true;
    $scope.sentPermissionRequest = true;
    $scope.notApprovedList = [];
    if($rootScope.ready) {
      $scope.user = $rootScope.user;
      angular.forEach($rootScope.user.profile.fbPageList, function (
        page) {
        $scope.pageMap[page.id] = page;
        if(page.requestStatus !== 'approved') {
          $scope.allFbPageApproved = false;
          $scope.notApprovedList.push(page);
          $scope.sentPermissionRequest = page.requestStatus !==
            'sent' ? false : $scope.sentPermissionRequest;
        }
      });

      if($scope.user.profile.isAdmin && $routeParams.pageId &&
        $routeParams.ownerId) {
        $scope.showAdminStats = true;
      }
      if(!$rootScope.user.profile || $rootScope.user.profile.doneOnBoarding !==
        'true') {} else {
        $scope.apiClient.matchingGet({
          userId: $rootScope.user.id,
          dealId: $rootScope.user.profile.pipedriveDealId
        }, {}, {
          headers: {
            'Content-type': 'application/json'
          }
        }).then(function (matchings) {
          angular.forEach(matchings.data.suggested, function (celeb) {
            celeb.categories = celeb.categories.join(', ');
          });
          $scope.suggestedCeleb = matchings.data.suggested;
          $scope.$apply();
        });
      }
    }
  });
  $scope.switchTab = function (index) {
    if(index === 1 && !$scope.instagramData && $rootScope.instagramTokens) {
      $scope.loadedSocialData = false;
      $scope.apiClient.instagramGet({
        instagramId: $scope.user.instagram,
        accessToken: $rootScope.instagramTokens.accessToken
      }, {}, {
        headers: {
          'Content-type': 'application/json'
        }
      }).then(function (res) {
        $scope.instagramData = res.data;
        $scope.loadedSocialData = true;
        $scope.$apply();
      });
    }
    if(index === 2 && !$scope.twitterData && $rootScope.twitterTokens) {
      $scope.loadedSocialData = false;
      $scope.apiClient.twitterGet({
        userId: $scope.user.twitter,
        accessToken: $rootScope.twitterTokens.accessToken
      }, {}, {
        headers: {
          'Content-type': 'application/json'
        }
      }).then(function (res) {
        $scope.twitterData = res.data;
        $scope.loadedSocialData = true;
        $scope.$apply();
      });
    }
  };

  $scope.completeProfile = function () {
    var uibModalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/app/influencerBudgetPopUp.html?'+ new Date().getTime(),
      controller: function ($uibModalInstance, $scope, $rootScope) {
        $scope.categoriesModel = [];
        $scope.categories = [];

        $rootScope.categoriesList.forEach(function(category){
          $scope.categories.push({
            "label" : category,
            "value" : category
          });
        });

        angular.forEach($scope.categories, function (category) {
          $scope.categoriesModel.push(false) ;
        });

        $scope.data = {
          "dailyBudget" : 25,
          "preferredDays" : 3,
          "preferredStartDate": ""
        };
        $scope.preferredDaysList = [];
        for (var i = 3; i <= 30; i++) {
          $scope.preferredDaysList.push(i);     
        }
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.initFacebook = function () {
          document.querySelector('#postPreview').setAttribute('href', $scope.url);
          FB.XFBML.parse();
        };
        $scope.submitForm = function () {


          $scope.data.categories = [];
          for(var i=0;i<$scope.categoriesModel.length;i++)
          {
            if ($scope.categoriesModel[i]===true)
            {
              $scope.data.categories.push($scope.categories[i].value);
            }
          }

          console.log("Selected categories", $scope.data.categories);

          $http.patch('/account/profile', {
            'email': $rootScope.user.email,
            'user': {
              'id': $rootScope.user.id
            },
            'pageRent' : $scope.data
          })
          .then(
              function () {
                $uibModalInstance.close();
              },
              function (error) {
                console.error('Update page rent price failed');
                $uibModalInstance.close();
              });

        };
      }
    });
  };

  $scope.requestPermission = function () {
    $scope.sendingPermissionRequest = true;
    $scope.apiClient.socialFacebookPagerequestPost({}, {
      userId: $scope.user.id,
      email: $scope.user.email,
      fbPageList: angular.copy($scope.user.profile.fbPageList)
    }, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(function (res) {
      $scope.sendingPermissionRequest = false;
      $rootScope.refreshUser();
      $scope.$apply();
    });
  };

  $scope.showPostPreview = function ($url) {
    var uibModalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/app/fbPostPreview.html?' + new Date().getTime(),
      controller: function ($uibModalInstance, $scope, $rootScope) {
        $scope.url = $url;
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.initFacebook = function () {
          document.querySelector('#postPreview').setAttribute(
            'href', $scope.url);
          FB.XFBML.parse();
        };
      }
    });
  };
  $rootScope.$watch('fbStats', function () {
    var calculateData = function (fbStats) {
      var added = null;
      var removed = null;
      $rootScope.fbStats = fbStats;

      var reduceGroup = function (a, b) {
        return data[a] > data[b] ? a : b;
      };

      for(var i = 0; i < fbStats.details.length; i++) {
        if(fbStats.details[i].name === 'page_fan_adds_unique') {
          added = fbStats.details[i].values[0].value + fbStats.details[
            i].values[1].value + fbStats.details[i].values[2].value;
        } else if(fbStats.details[i].name ===
          'page_fan_removes_unique') {
          removed = fbStats.details[i].values[0].value + fbStats.details[
            i].values[1].value + fbStats.details[i].values[2].value;
        } else if(fbStats.details[i].name ===
          'page_impressions_by_age_gender_unique') {
          var data = fbStats.details[i].values[2]?fbStats.details[i].values[2].value:fbStats.details[i].values[1].value;
          $rootScope.fbStats.mainGroup = Object.keys(data).reduce(
            reduceGroup);
          $rootScope.fbStats.mainGroup = $rootScope.fbStats.mainGroup
            .split('.');
        }
        if(removed && added && $rootScope.fbStats.mainGroup) {
          break;
        }
      }
      $rootScope.fbStats.diff = added - removed;
      var ageRatioAry = [];
      angular.forEach($rootScope.fbStats.ageRatio, function (value,
        key) {
        if(key === '65') {
          key = '65+  ';
        }
        ageRatioAry.push({
          key: key,
          value: value
        });
      });

      ageRatioAry.sort(function (a, b) {
        if(a.key > b.key) {
          return 1;
        }
        if(a.key < b.key) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      angular.forEach(ageRatioAry, function (obj) {
        $scope.chartData[0].values.push({
          label: obj.key,
          value: obj.value * 100
        });
        $scope.chartData[1].values.push({
          label: obj.key,
          value: (1 - obj.value) * 100,
          color: '#fff'
        });
      });
      angular.forEach($rootScope.fbStats.location, function (value,
        key) {
        $scope.totalLocationNum += value;
      });
      $rootScope.fbStats.location = _.pairs($rootScope.fbStats.location);
      $scope.selectedFanOnlineDay = $rootScope.fbStats.fansOnlineStat
        .details[0];
      $scope.switchFanOnlineDay($scope.selectedFanOnlineDay);
    };
    if($rootScope.fbStats) {
      if($rootScope.fbStats.age) {
        $scope.totalFollowerNum = 0;
        angular.forEach($rootScope.fbStats.age, function (value, key) {
          $scope.totalFollowerNum += value;
        });
      }
      calculateData($rootScope.fbStats);
      $rootScope.loadedFbData = true;
    }
  });
  $scope.switchStatsPage = function (page) {
    $rootScope.user.profile.facebookDefaultPageId = page.id;
    $rootScope.loadedFbData = false;
    FP.analytics.track('Switch to see another FB page Statistics',
      $rootScope.user &&
      $rootScope.user.email ? $rootScope.user.email : null, {
        category: 'Dashboard',
        action: 'view',
        label: 'Dashboard Title',
        value: null
      });
    if(page) {
      $http.patch('/account/profile', {
        'facebookDefaultPageId': page.id,
        'email': $rootScope.user.email,
        'user': {
          'id': $rootScope.user.id
        }
      }).then(function () {
        $rootScope.refreshUser();
        //        $window.location.reload();
      });
    }
  };
  $scope.toggleSeeMore = function () {
    if($scope.isCollapsed) {
      FP.analytics.track('Clicked See More', $rootScope.user &&
        $rootScope.user.email ? $rootScope.user.email : null, {
          category: 'Dashboard',
          action: 'view',
          label: 'Dashboard Stats',
          value: null
        });
    }
    $scope.isCollapsed = !$scope.isCollapsed;
  };
  $scope.switchFanOnlineDay = function (day) {
    FP.analytics.track('Clicked on a day to see breakdown chart',
      $rootScope.user &&
      $rootScope.user.email ? $rootScope.user.email : null, {
        category: 'Dashboard',
        action: 'view',
        label: 'Fans Online Chart',
        value: null
      });
    $scope.selectedFanOnlineDay = day;
    $scope.fansOnlineChartData[0].values = [];
    angular.forEach(day.value, function (value, key) {
      $scope.fansOnlineChartData[0].values.push([
        Number(key),
        value
      ]);
    });
  };
  $scope.chartData = [
    {
      'key': 'Occupied',
      'values': []
    },
    {
      'key': 'Others',
      'values': []
    }
  ];
  $scope.chartOptions = {
    chart: {
      type: 'multiBarHorizontalChart',
      height: 250,
      x: function (d) {
        return d.label;
      },
      y: function (d) {
        return d.value;
      },
      showControls: false,
      showValues: true,
      showLegend: false,
      duration: 500,
      stacked: true,
      width: 400,
      groupSpacing: 0.1,
      noData: 'Data Not Available',
      margin: {
        top: 0,
        left: 50,
        // includes bar labels
        right: 20,
        // to avoid rightmost label getting clipped
        bottom: 20 // includes axis labels
      },
      barColor: function (d, i) {
        var colors = [
          '#ffe680',
          '#ffd633',
          '#ffcc00',
          '#e6b800',
          '#b38f00',
          '#806600',
          '#4d3d00'
        ];
        return d.color ? d.color : colors[i];
      },
      xAxis: {
        showMaxMin: false
      },
      yAxis: {
        tickFormat: function (d) {
          return d3.format('d')(d) + '%';
        }
      }
    }
  };
  $scope.dayOfWeekMap = {
    'mon': 'Monday',
    'tue': 'Tuesday',
    'wed': 'Wednesday',
    'thu': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };
  $scope.hourMap = {
    0: 'Midnight',
    1: '1am',
    2: '2am',
    3: '3am',
    4: '4am',
    5: '5am',
    6: '6am',
    7: '7am',
    8: '8am',
    9: '9am',
    10: '10am',
    11: '11am',
    12: 'Noon',
    13: '1pm',
    14: '2pm',
    15: '3pm',
    16: '4pm',
    17: '5pm',
    18: '6pm',
    19: '7pm',
    20: '8pm',
    21: '9pm',
    22: '10pm',
    23: '11pm',
    24: 'Midnight'
  };
  $scope.fansOnlineChartOptions = {
    chart: {
      type: 'stackedAreaChart',
      height: 350,
      margin: {
        top: 20,
        right: 40,
        bottom: 30,
        left: 60
      },
      x: function (d) {
        return d[0];
      },
      y: function (d) {
        return d[1];
      },
      showLegend: false,
      showControls: false,
      useInteractiveGuideline: true,
      color: function () {
        return '#EDB403';
      },
      xAxis: {
        tickFormat: function (d) {
          return $scope.hourMap[d];
        }
      },
      yAxis: {
        tickFormat: function (d) {
          return d3.format(',.0f')(d);
        }
      }
    }
  };
  $scope.fansOnlineChartData = [{
    'key': 'Online Fans',
    'values': []
    }];
});
