app.controller('influencerCtrl', function ($scope, $uibModal, $http, $rootScope,
  $location, UtilsService, $timeout) {
  $scope.campaigns = [];
  $scope.loading = true;
  $scope.users = {};
  $scope.selectedCeleb = [];
  // Create campaign
  $scope.loadingUsers = true;
  $scope.savingCampaign = false;
  $scope.isNumber = angular.isNumber;
  $scope.showSearchCriteria = false;
  $scope.totalLikesMap = {};
  $scope.search = {
    ageRange: '0-100',
    numberOfFollowers: 0,
    status: 'pending'
  };
  $scope.toggleSelect = function (page) {
    page.isSelected = !page.isSelected;
    if(page.isSelected) {
      $scope.selectedCeleb.push(page);
    } else {
      $scope.selectedCeleb.splice($scope.selectedCeleb.indexOf(page), 1);
    }
  };
  $scope.openRequestCampaignPopup = function () {
    var selectedCeleb = $scope.selectedCeleb;
    var uibModalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/app/requestCampaignPopup.html',
      controller: function ($uibModalInstance, $scope, $rootScope,
        FacebookBusinessService) {
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.alerts = [];
        $scope.submittingRequest = true;
        $scope.isCalendarOpened = false;
        $scope.selectedCeleb = selectedCeleb;
        $scope.submittedRequest = false;
        $scope.title = '';
        $scope.form = {
          budget: '',
          productLink: '',
          website: '',
          productName: '',
          startDate: '',
          notes: ''
        };
        $scope.openHowToFindID = function () {
          FP.analytics.track(
            'View how to find business id popup.', $rootScope.user &&
            $rootScope.user.email ? $rootScope.user.email :
            null, {
              category: 'Celebrities request campaign',
              action: 'view',
              label: 'Find business id popup',
              value: null
            });
          var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/app/howToFindBusinessIdPopUp.html',
            controller: function ($uibModalInstance, $scope,
              $rootScope) {
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }
          });
        };
        $scope.submitDealProposal = function () {
          $rootScope.showLoading = true;
          $scope.alerts = [];
          if(!$scope.user.facebookBusinessId || $scope.user.facebookBusinessId ===
            '') {
            $scope.alerts.push({
              type: 'danger',
              msg: 'Please enter your business id'
            });
            FP.analytics.track('User has not input business id',
              $rootScope.user &&
              $rootScope.user.email ? $rootScope.user.email :
              null, {
                category: 'Signup',
                action: 'error',
                label: 'User has not input business id',
                value: null
              });
            $rootScope.showLoading = false;
            return;
          }
          FacebookBusinessService.validateBusinessId($scope.user.facebookBusinessId,
            $rootScope.user.id).then(function (res) {
            console.log(res);
            if(res.data.errorMessage) {
              $rootScope.showLoading = false;
              $scope.alerts.push({
                type: 'danger',
                msg: 'Failed to claim Page to Facebook Business Account:' +
                  res.data.errorMessage
              });
              $scope.$apply();
              $rootScope.$apply();
              return;
            } else if(res.data.valid) {
              angular.forEach($scope.selectedCeleb, function (
                profile) {
                celebNames.push(profile.title);
              });
              $scope.form.celebritiesWanted = celebNames.join(
                ', ');
              angular.forEach($scope.form, function (value,
                key) {
                customFieldsMap[PIPEDRIVE_FIELDS[key]] =
                  value;
              });
              $http.post('/crm/createDeal', {
                title: $scope.title,
                value: $scope.form.budget,
                currency: 'USD',
                organizationName: $scope.user.brandName,
                personName: $scope.user.profile.name,
                customFields: customFieldsMap,
                initStageEnum: 'DEAL_PROPOSED'
              }).then(function (newDeal) {
                var newProfile = {
                  'facebookBusinessId': $scope.user.facebookBusinessId,
                  'user': {
                    'id': $rootScope.user.id
                  }
                };
                $http.patch('/account/profile',
                  newProfile).then(function () {
                  $rootScope.showLoading = false;
                  $rootScope.user = $scope.user;
                  $rootScope.showLoading = false;
                  $scope.submittedRequest = true;
                }, function (error) {
                  $rootScope.processError(error,
                    $scope.alerts,
                    'Failed to save profile');
                  $rootScope.showLoading = false;
                });
              });
            } else {
              $rootScope.showLoading = false;
              $scope.alerts.push({
                type: 'danger',
                msg: 'Please enter a valid business Id'
              });
              $scope.$apply();
              $rootScope.$apply();
              return;
            }
          });
          var customFieldsMap = {};
          var celebNames = [];
        };
      },
      resolve: {
        selectedCeleb: function () {
          return $scope.selectedCeleb;
        }
      }
    });
  };
  $scope.findMatching = function () {
    $scope.selectedCeleb = [];
    $scope.apiClient.matchingGet({
      userId: $scope.user.id,
      dealId: $scope.user.profile.pipedriveDealId
    }, {}, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(function (matchings) {
      angular.forEach(matchings.data.all, function (celeb) {
        celeb.categories = celeb.categories.join(', ');
      });
      angular.forEach(matchings.data.suggested, function (celeb) {
        celeb.categories = celeb.categories.join(', ');
      });
      $scope.allCeleb = matchings.data.all;
      $scope.suggestedCeleb = matchings.data.suggested;
      $scope.$apply();
    });
  };
  $rootScope.$watch('ready', function () {
    if($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
      $scope.findMatching();
    }
  });
  $scope.openWaveModal = function (match, campaignList) {
    var uibModalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/app/influencerWavePopUp.html',
      controller: function ($uibModalInstance, $scope, $rootScope) {
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.alerts = [];
        $scope.Math = Math;
        $scope.campaignList = campaignList;
        $scope.selectMatch = function () {
          match.loading = true;
          var application = {
            userId: match.userId,
            status: 'matching',
            campaignId: $scope.selectedCampaign.campaignId,
            facebookPageId: match.pageId,
            socialId: match.socialId,
            ownerUserId: $rootScope.user.id,
            campaignLongLink: $scope.selectedCampaign.trackingUrl,
            applicationId: generateUUID(),
            type: 'pay'
          };
          $scope.apiClient.applicationPost({}, application, {
            headers: {
              'Content-type': 'application/json'
            }
          }).then(function (res) {
            if(!res.data.errorMessage) {
              var timestamp = new Date().getTime();
              //marked mathcing as waved.
              var updatedCampaign = angular.copy($scope.selectedCampaign,
                updatedCampaign);
              var socialIdsAry = [];
              if(updatedCampaign.socialIds) {
                socialIdsAry = updatedCampaign.socialIds.split(
                  ',');
              }
              socialIdsAry.push(match.socialId);
              updatedCampaign.socialIds = socialIdsAry.join();
              delete updatedCampaign.updateTime;
              delete updatedCampaign.createTime;
              $scope.apiClient.campaignPatch({},
                updatedCampaign).then(function (res) {});
              $scope.alerts.push({
                type: 'success',
                msg: 'Successfully waved to the user. Please go to Status to track the process.'
              });
              match.loading = false;
              match.hasWaved = true;
            } else {
              $scope.alerts.push({
                type: 'danger',
                msg: 'Failed to wave to the user'
              });
              match.loading = false;
            }
            $scope.$apply();
          }).catch(function (res) {
            $scope.alerts.push({
              type: 'danger',
              msg: 'Failed to wave to the user'
            });
            match.loading = false;
            $scope.$apply();
          });
        };
      },
      resolve: {
        campaignList: function () {
          return campaignList;
        }
      }
    });
  };
});
