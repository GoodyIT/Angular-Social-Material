app.controller('campaignDetailsCtrl', function ($scope, $uibModal, $rootScope, $routeParams, $http, CampaignService, UtilsService) {
  var id = $routeParams.id;
  $scope.submittedForm = false;
  CampaignService.getCampaigns({
    campaignIds: id,
    'count': 1
  }).then(function (campaigns) {
    $scope.campaign = campaigns.data[0];
    if ($scope.campaign.categories) {
      $scope.campaign.categories = $scope.campaign.categories.split(',');
    }
    $scope.$apply();
    // console.log("campaign userId: " + campaigns.data[0].userId);
    $http.get('/userDetails/' + campaigns.data[0].userId).then(function (res) {
      if (res.data) {
        var user = res.data;
        $scope.ownerPic = user.profile.picture;
        $scope.ownerName = user.profile.name;
      }
    });
  }).catch(function () {
    console.log('error');
  });
  //    $scope.submitAppForm = function(){
  //        $scope.appForm.userId =$rootScope.user._id;
  //        $scope.appForm.ownerUserId = $scope.campaign.userId;
  //        var actionTime = new Date();
  //        actionTime.setDate($scope.date.getDate());
  //        if($scope.time === ''){
  //            $scope.time = new Date();
  //        }
  //        actionTime.setHours($scope.time.getHours());
  //        actionTime.setMinutes($scope.time.getMinutes());
  //        $scope.appForm.actionTime = actionTime.getTime()+"";
  //        if($scope.campaign.type == 'pay'){
  //            $scope.appForm.campaignLongLink = $scope.campaign.trackingUrl;
  //        }
  //        if ($scope.appForm.postContent !=''){
  //            if($scope.imageType === 'file' && $scope.file){
  //                var error = UtilsService.uploadImage($scope.file, applicationId, function(applicationImageUrl){
  //                    if(applicationImageUrl){
  //                        $scope.appForm.imgUrl = applicationImageUrl;
  //                        applyForCampaign();
  //
  //                    }
  //                }, function(errorMessage){
  //                    $rootScope.alerts.push({type:"danger", msg:errorMessage});
  //
  //                });
  //                if(error && error.message){
  //                    $rootScope.alerts.push({type:"danger", msg:error.message});
  //                }
  //            } else {
  //                applyForCampaign();
  //            }
  //        }
  //    }
  $scope.openApplyCampaign = function () {
    var uibModalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      scope: $scope,
      templateUrl: '/app/applyCampaignPopUp.html?' + new Date(),
      controller: function ($uibModalInstance, $scope, $rootScope, DirectMessageService, FacebookBusinessService) {
        $scope.myCampaigns = [];
        $scope.isCalendarOpened = false;
        $scope.imageType = 'url';
        $scope.user = $rootScope.user;
        $scope.requirementType = 'text';
        var applicationId = generateUUID();
        $scope.appForm = {
          applicationId: applicationId,
          postContent: '',
          requirements: '',
          applicantCampaignId: '',
          facebookPageId: '',
          reasons: '',
          campaignId: id,
          ownerUserId: '',
          actionTime: '',
          imgUrl: '',
          ownerImgUrl: '',
          platform: 'facebook'
        };
        $scope.appForm.type = $scope.campaign.type;
        $scope.getMyCampaigns = function () {
          if ($scope.user) {
            CampaignService.getCampaigns({
              userId: $scope.user.id,
              status: 'pending'
            }).then(function (campaigns) {
              $scope.myCampaigns = campaigns.data;
              $scope.$apply();
            }).catch(function () {
              console.log('error');
            });
          }
        };
        if ($scope.user) {
          $scope.getMyCampaigns();
        }
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.pageList = [];
        if ($rootScope.fbToken) {
          $scope.apiClient.pagesGet({ 'accessToken': $rootScope.fbToken }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
            $scope.pageList = res.data.data;
            $scope.pageList.push({
              name: 'My Wall',
              id: 'me'
            });
            $scope.appForm.facebookPageId = $scope.pageList[0].id;
            $scope.$apply();
          }).catch(function () {
            console.log('Cannot get pages ');
          });
        }
        $scope.switchFileType = function (type) {
          $scope.imageType = type;
        };
        var applyForCampaign = function () {
          FacebookBusinessService.checkPagePermission(id, $rootScope.user.id, $scope.appForm.facebookPageId).then(function (res) {
            if (res.data.errorMessage) {
              $rootScope.alerts.push({
                type: 'danger',
                msg: 'Failed to claim Page to Facebook Business Account:' + res.data.errorMessage
              });
            } else if (res.data.claimed === false) {
              console.log('Page not claimed');
              $rootScope.showLoading = false;
              if (res.data.pendingRequest && res.data.pendingRequest === true) {
                $rootScope.alerts.push({
                  type: 'danger',
                  msg: 'Please approve FamePick request to selected page'
                });
              } else {
                // Not claimed
                FacebookBusinessService.claimPage(id, $rootScope.user.id, $scope.appForm.facebookPageId).then(function (res) {
                  if (res.data.errorMessage) {
                    $rootScope.alerts.push({
                      type: 'danger',
                      msg: 'Failed to claim Page to Facebook Business Account:' + res.data.errorMessage
                    });
                  } else {
                    $rootScope.alerts.push({
                      type: 'info',
                      msg: 'Please open your page settings & approve FamePick access request.'
                    });
                  }
                  $scope.$apply();
                });
              }
            } else if (res.data.claimed) {
              console.log('Page claimed');
              // TODO: Can we put submit logic here??
              $scope.apiClient.applicationPost({}, $scope.appForm, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
                $scope.firebaseToken = $rootScope.user.firebaseToken;
                if (!res.data.errorMessage) {
                  var timestamp = new Date().getTime();
                  DirectMessageService.createNewApplicationThread($scope.firebaseToken, $scope.appForm.applicationId, $scope.user.id, timestamp, 'Applied campaign');
                  DirectMessageService.addApplicationToUserThreadList($scope.firebaseToken, $scope.appForm.applicationId, $scope.user.id, timestamp, $scope.campaign.topic);
                  DirectMessageService.addApplicationToUserThreadList($scope.firebaseToken, $scope.appForm.applicationId, $scope.campaign.userId, timestamp, $scope.campaign.topic);
                  $rootScope.showLoading = false;
                  $scope.alertSuccess('Successfully applied to campaign. Please go to Status to track your application.');
                  $scope.submittedForm = true;
                  $scope.close();
                } else {
                  $scope.alertError('Failed to apply to campaign.');
                  $rootScope.showLoading = false;
                }
                $scope.$apply();
              }).catch(function (res) {
                $rootScope.showLoading = false;
                $scope.alertError('Failed to apply to campaign.');
                $scope.$apply();
              });
            }
            $scope.$apply();
          });
        };
        $scope.submitAppForm = function () {
          $rootScope.showLoading = true;
          $scope.appForm.userId = $rootScope.user.id;
          $scope.appForm.ownerUserId = $scope.campaign.userId;
          $scope.appForm.facebookPageId = $scope.appForm.platform === 'facebook' ? $scope.facebookPageId : '';
          var actionTime = new Date();
          actionTime.setDate($scope.date.getDate());
          if ($scope.time === '') {
            $scope.time = new Date();
          }
          actionTime.setHours($scope.time.getHours());
          actionTime.setMinutes($scope.time.getMinutes());
          $scope.appForm.actionTime = actionTime.getTime() + '';
          if ($scope.campaign.type == 'pay') {
            $scope.appForm.campaignLongLink = $scope.campaign.trackingUrl;
          }
          if ($scope.campaign.payEventType == 'install') {
            if ($scope.campaign.androidTracking) {
              $scope.appForm.androidTracking = $scope.campaign.androidTracking;
            }
            if ($scope.campaign.iosTracking) {
              $scope.appForm.iosTracking = $scope.campaign.iosTracking;
            }
            $scope.appForm.installCount = 0;
          }
          if ($scope.campaign.androidTracking) {
            $scope.appForm.androidTracking = $scope.campaign.androidTracking;
          }
          if ($scope.campaign.iosTracking) {
            $scope.appForm.iosTracking = $scope.campaign.iosTracking;
          }
          if ($scope.appForm.postContent !== '') {
            if ($scope.imageType === 'file' && $scope.file) {
              var error = UtilsService.uploadImage($scope.file, applicationId, function (applicationImageUrl) {
                if (applicationImageUrl) {
                  $scope.appForm.imgUrl = applicationImageUrl;
                  applyForCampaign();
                }
              }, function (errorMessage) {
                $rootScope.alerts.push({
                  type: 'danger',
                  msg: errorMessage
                });
              });
              if (error && error.message) {
                $rootScope.alerts.push({
                  type: 'danger',
                  msg: error.message
                });
              }
            } else {
              applyForCampaign();
            }
          } else {
            $rootScope.showLoading = false;
            $rootScope.alerts.push({
              type: 'danger',
              msg: 'Please insert post content'
            });
          }
        };
        $scope.redirect = function () {
          $uibModalInstance.close();
          $location.path(redirection);
        };
      }
    });
  };
});