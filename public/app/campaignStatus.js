app.controller('campaignStatusCtrl', function ($timeout, $uibModal, $scope, $rootScope, $http, CampaignService, UtilsService) {
  $scope.user = $rootScope.user;
  $scope.appliedCampaigns = [];
  $scope.myApplications = [];
  $scope.maxDate = new Date();
  $scope.maxDate.setDate($scope.maxDate.getDate() + 60);
  //limit schedule to within 60 days
  $scope.minDate = new Date();
  $scope.selectedApply = {};
  $scope.image = { type: 'url' };
  // -- new --
  $scope.campaignList = [];
  $scope.filters = [
    {
      label: 'Pending',
      value: 'pending'
    },
    {
      label: 'Accepted',
      value: 'accepted'
    },
    {
      label: 'Scheduled',
      value: 'scheduled'
    },
    {
      label: 'Completed',
      value: 'completed'
    }
  ];
  $scope.filter = 'pending';
  $scope.filterChanged = function () {
    console.log('Filter changed: ' + $scope.filter);
    $scope.refreshData();
  };
  // Login completed event
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      console.log('Initiating');
      $scope.refreshData();
    }
  });
  $scope.refreshData = function () {
    $scope.campaignList = [];
    $scope.refreshing = true;
    console.log('Refreshing: ' + $scope.filter);
    $scope.selectedCampaign = { applications: [] };
    $scope.myMatchings = [];
    $scope.selectedApply = {};
    CampaignService.getCampaigns({
      userId: $rootScope.user.id,
      status: ALL_STATUS
    }).then(function (campaigns) {
      console.log(campaigns);
      angular.forEach(campaigns.data.data, function (campaign) {
        if (campaign.status === $scope.filter) {
          $scope.campaignList.push(campaign);
        }
      });
      $scope.refreshing = false;
      $scope.$apply();
    }).catch(function () {
      console.error('error');
      $scope.refreshing = false;
      $scope.$apply();
    });
  };
  /**
     * Called from campaign card
      * @param campaign
     */
  $scope.deleteCampaign = function (campaign) {
    var updatedCampaign = {};
    angular.copy(campaign, updatedCampaign);
    delete updatedCampaign.updateTime;
    delete updatedCampaign.createTime;
    updatedCampaign.status = 'removed';
    $scope.apiClient.campaignPatch({}, updatedCampaign).then(function (res) {
      $scope.refreshData();
      $scope.$apply();
    });
  };
  $scope.showCampaignStatus = function (campaign) {
    var popupScope = $scope.$new();
    popupScope.campaign = campaign;
    popupScope.activeApplication = null;
    $scope.apiClient.campaignsApplicationGet({
      userId: '',
      status: ALL_STATUS + ',matching',
      campaignId: campaign.campaignId,
      type: ''
    }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      popupScope.applications = res.data;
      popupScope.activeApplication = null;
      if (popupScope.applications.length > 0) {
        console.log(popupScope.applications.length);
        popupScope.activeApplication = popupScope.applications[0];
      } else {
        console.log('No applicant for this campaign');
      }
      var uibModalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        windowClass: 'center-modal-lg',
        size: 'lg',
        //backdrop: 'static',
        //keyboard: false,
        templateUrl: '/app/applicantListPopUp.html?' + new Date(),
        scope: popupScope,
        controller: function ($uibModalInstance, $scope, $rootScope) {
          var acceptApplication = function (application) {
            $scope.apiClient.applicationPatch({ applicationId: application.applicationId }, application).then(function (res) {
              $scope.showLoading = false;
              $scope.alertSuccess('Successfully accepted application. Please wait for the applicant to post to Facebook.');
              $scope.$apply();
              $scope.selectedCampaign.applications = [];
              $scope.refreshData();
            });
          };
          $scope.selectApplication = function (application) {
            console.log('Active application', application);
            popupScope.activeApplication = application;
          };
          $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
          };
          $scope.ownerSchedulePaidPost = function (application) {
            $rootScope.showLoading = true;
            $http.post('/api/scheduleFacebookPosts', { 'application': application }, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
              $scope.alertSuccess('Post has been successfully scheduled. Trade will be completed and closed when contents are posted.');
              application.status = 'scheduled';
              var updatedApplication = {};
              angular.copy(application, updatedApplication);
              delete updatedApplication.updateTime;
              delete updatedApplication.createTime;
              delete updatedApplication.$$hashKey;
              delete updatedApplication.applicantProfile;
              //Update application status
              $rootScope.showLoading = false;
              $scope.apiClient.applicationPatch({ applicationId: updatedApplication.applicationId }, updatedApplication).then(function (res) {
                $scope.$apply();
              });
            }, function () {
              $rootScope.showLoading = false;
            });
          };
          $scope.acceptApply = function (application) {
            $rootScope.showLoading = true;
            application.status = 'accepted';
            var actionTime = new Date();
            if (application.time === '') {
              application.time = new Date();
            }
            actionTime.setDate(application.date.getDate());
            actionTime.setHours(application.time.getHours());
            actionTime.setMinutes(application.time.getMinutes());
            var newApply = {
              applicationId: application.applicationId,
              status: 'accepted',
              ownerActionTime: actionTime.getTime() + ''
            };
            angular.extend(newApply, application);
            delete newApply.applicantProfile;
            delete newApply.date;
            delete newApply.isCalendarOpened;
            delete newApply.time;
            delete newApply.updateTime;
            delete newApply.createTime;
            if ($scope.image.type === 'file' && $scope.image.file) {
              var error = UtilsService.uploadImage($scope.image.file, application.applicationId, function (applicationImageUrl) {
                if (applicationImageUrl) {
                  newApply.ownerImgUrl = applicationImageUrl;
                  acceptApplication(newApply);
                }
              }, function (errorMessage) {
                $scope.alertError.push({
                  type: 'danger',
                  msg: errorMessage
                });
              });
              if (error && error.message) {
                $scope.alertError.push({
                  type: 'danger',
                  msg: error.message
                });
              }
            } else {
              acceptApplication(newApply);
            }
          };
        }
      });
    });
  };
  $scope.deleteCampaign = function (campaign) {
    campaign.status = 'removed';
    CampaignService.patchCampaign(campaign).then(function (res) {
      $scope.refreshData();
      $scope.$apply();
    });
  };
});