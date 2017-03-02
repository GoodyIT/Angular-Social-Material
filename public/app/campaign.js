app.controller('campaignCtrl', function ($scope, $uibModal, $http, $rootScope, CampaignService, $location, UtilsService, $timeout) {
  $scope.campaigns = [];
  $scope.loading = true;
  // Create campaign
  $scope.savingCampaign = false;
  $scope.showSearchCriteria = false;
  $scope.search = {
    ageRange: '0-100',
    numberOfFollowers: 0,
    status: 'pending'
  };
  // Use caching instead of direct download
  $rootScope.$watch('fbStats', function () {
    var calculateData = function (fbStats) {
      var added = null;
      var removed = null;
      $rootScope.fbStats = fbStats;
      for (var i = 0; i < fbStats.details.length; i++) {
        if (fbStats.details[i].name === 'page_fan_adds_unique') {
          added = fbStats.details[i].values[0].value + fbStats.details[i].values[1].value + fbStats.details[i].values[2].value;
        } else if (fbStats.details[i].name === 'page_fan_removes_unique') {
          removed = fbStats.details[i].values[0].value + fbStats.details[i].values[1].value + fbStats.details[i].values[2].value;
        }
        if (removed && added) {
          break;
        }
      }
      $rootScope.fbStats.diff = fbStats.likes + added - removed - fbStats.likes;
    };
    if ($rootScope.fbStats) {
      if ($rootScope.fbStats.age) {
        $scope.totalFollowerNum = 0;
        angular.forEach($rootScope.fbStats.age, function (value, key) {
          $scope.totalFollowerNum += value;
        });
      }
      calculateData($rootScope.fbStats);
      $rootScope.loadedFbData = true;  // $rootScope.$apply();
    }
  });
  $scope.getCampaignDetails = function (campaignId) {
    $scope.campaigns.forEach(function (campaign) {
      if (campaign.campaignId == campaignId) {
        var popupScope = $scope.$new(true);
        popupScope.title = campaign.topic;
        popupScope.description = campaign.details;
        popupScope.thumbnail = campaign.thumbnail;
        popupScope.minAge = campaign.minAge;
        popupScope.maxAge = campaign.maxAge;
        popupScope.numberOfFollowers = campaign.numberOfFollowers;
        popupScope.userId = campaign.userId;
        popupScope.campaignId = campaign.campaignId;
        // console.log(campaign);
        var uibModalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          windowClass: 'center-modal',
          size: 'px560',
          templateUrl: '/app/campaignDetailsPopUp.html?' + new Date(),
          controller: function ($uibModalInstance, $scope, $rootScope) {
            $scope.close = function () {
              $uibModalInstance.close();
            };
            $scope.submit = function () {
              $uibModalInstance.close();
            };
          },
          scope: popupScope
        });
      }
    });
  };
  $scope.toggleSearch = function () {
    $scope.showSearchCriteria = !$scope.showSearchCriteria;
  };
  $rootScope.getCampaigns = $scope.getCampaigns = function () {
    CampaignService.getCampaigns($scope.search).then(function (campaigns) {
      $scope.campaigns = campaigns.data;
      $scope.loading = false;
      $scope.$apply();
    }).catch(function () {
      console.log('error');
      $scope.loading = false;
    });
  };
  $scope.getCampaigns();
});