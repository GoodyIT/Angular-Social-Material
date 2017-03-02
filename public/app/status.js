app.controller('statusCtrl', function ($scope, $rootScope, $http, CampaignService, DirectMessageService, $uibModal) {
  $scope.selectedPage = 'campaign';
  $scope.campaignCache = {};
  $scope.messageToSend = '';
  $scope.statusMap = STATUS_MAP;
  //expend to full window width
  $('.full-width-container').width(window.innerWidth);
  $('.full-width-container').css('margin-left', Math.round((1170 - window.innerWidth) / 2));
  // Login completed event
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
      $scope.refreshCurrentPageData();
    }
  });
  $scope.refreshCurrentPageData = function () {
    $scope.messageThreads = [];
    $scope.applicationList = [];
    $scope.threadMessages = [];
    $scope.selectedCampaign = null;
    $scope.displayedApplication = null;
    $scope.displayedCampaign = null;
    if ($scope.selectedPage === 'application') {
      $scope.apiClient.applicationGet({
        applicationId: '',
        ownerUserId: '',
        status: ALL_STATUS + ',matching',
        startKey: '',
        count: 100,
        userId: $scope.user.id,
        type: 'pay',
        campaignId: ''
      }, {}).then(function (res) {
        $scope.applicationList = res.data;
        var cIds = [];
        angular.forEach($scope.applicationList, function (apply) {
          if (!$scope.campaignCache[apply.campaignId] && cIds.indexOf(apply.campaignId) < 0) {
            cIds.push(apply.campaignId);
          }
        });
        if (cIds.length > 0) {
          CampaignService.getCampaigns({ campaignIds: cIds }).then(function (res) {
            angular.forEach(res.data, function (campaign) {
              $scope.campaignCache[campaign.campaignId] = campaign;
            });
            $scope.$apply();
          }).catch(function () {
          });
        }
        $scope.$apply();
      });
    } else {
      //default to show campaign data
      CampaignService.getCampaigns({
        userId: $scope.user.id,
        status: ALL_STATUS
      }).then(function (campaigns) {
        $scope.myCampaigns = campaigns.data;
        $scope.refreshing = false;
        $scope.$apply();
      }).catch(function () {
        console.error('error');
        $scope.refreshing = false;
        $scope.$apply();
      });
      if (!$scope.selectedCampaign) {
        //load all application messages
        DirectMessageService.getThreadsOfUser($scope.user.firebaseToken, $scope.user.id, 'applications', function (chatObject) {
          chatObject.on('child_added', function (snapshot) {
            var data = snapshot.val();
            $scope.messageThreads.push(data);
            $scope.$apply();
          });
        });
      }
    }
  };
  $scope.switchPage = function (page) {
    $scope.selectedPage = page;
    $scope.refreshCurrentPageData();
  };
  $scope.selectThread = function (thread) {
    $scope.threadMessages = [];
    $scope.displayedApplication = null;
    //get the application
    $scope.apiClient.applicationGet({
      userId: '',
      status: ALL_STATUS + ',matching,rejected',
      ownerUserId: '',
      count: 100,
      startKey: '',
      applicationId: thread.threadId,
      type: 'pay',
      campaignId: ''
    }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      //get the campaign of the application
      $scope.displayedApplication = res.data;
      showDisplayedApplicationCampaign();
      getDisplayedApplicationThreadMessages();
    });
  };
  var getDisplayedApplicationThreadMessages = function () {
    $scope.threadMessages = [];
    DirectMessageService.getMessagesOfThread($scope.user.firebaseToken, $scope.displayedApplication.applicationId, function (chatObject) {
      chatObject.on('child_added', function (snapshot) {
        var data = snapshot.val();
        $scope.threadMessages.push(data);
        $scope.$apply();
      });
    });
  };
  $scope.selectApplication = function (app) {
    $scope.displayedApplication = app;
    $scope.threadMessages = [];
    if (!$scope.selectedCampaign) {
      showDisplayedApplicationCampaign();
    }
    DirectMessageService.getMessagesOfThread($scope.user.firebaseToken, app.applicationId, function (chatObject) {
      chatObject.on('child_added', function (snapshot) {
        var data = snapshot.val();
        $scope.threadMessages.push(data);
        $scope.$apply();
      });
    });
  };
  $scope.selectCampaign = function () {
    $scope.displayedApplication = null;
    var campaign = $scope.selectedCampaign;
    $scope.applicationList = [];
    $scope.displayedCampaign = campaign;
    $scope.apiClient.applicationGet({
      applicationId: '',
      userId: '',
      status: ALL_STATUS + ',matching',
      startKey: '',
      count: 100,
      ownerUserId: '',
      campaignId: campaign.campaignId,
      type: ''
    }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      $scope.applicationList = res.data;
      $scope.$apply();
    });
  };
  var showDisplayedApplicationCampaign = function () {
    $scope.displayedCampaign = null;
    if ($scope.campaignCache[$scope.displayedApplication.campaignId]) {
      //set to cache value
      $scope.displayedCampaign = $scope.campaignCache[$scope.displayedApplication.campaignId];
    } else {
      CampaignService.getCampaigns({
        campaignIds: [$scope.displayedApplication.campaignId],
        status: ALL_STATUS
      }).then(function (campaigns) {
        $scope.campaignCache[campaigns.data[0].campaignId] = campaigns.data[0];
        $scope.displayedCampaign = campaigns.data[0];
        $scope.$apply();
      }).catch(function () {
        $scope.$apply();
      });
    }
  };
  $scope.ownerSchedulePaidPost = function (application) {
    $rootScope.showLoading = true;
    $http.post('/api/scheduleFacebookPosts', { 'application': application }, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      $scope.alertSuccess('Post has been successfully scheduled. Campaign will be completed when contents are posted.');
      application.status = 'scheduled';
      var updatedApplication = {};
      angular.copy(application, updatedApplication);
      delete updatedApplication.updateTime;
      delete updatedApplication.createTime;
      delete updatedApplication.$$hashKey;
      //Update application status
      $rootScope.showLoading = false;
      $scope.apiClient.applicationPatch({ applicationId: updatedApplication.applicationId }, updatedApplication).then(function (res) {
        $scope.$apply();
      });
    }, function () {
      $scope.alertError('Failed to schedule the post. Please try again later.');
      $rootScope.showLoading = false;
    });
  };
  $scope.sendMessage = function () {
    if ($scope.displayedApplication && $scope.messageToSend !== '') {
      DirectMessageService.sendApplicationMessageInThread($scope.user.firebaseToken, $scope.displayedApplication.applicationId, $scope.user.id, $scope.messageToSend, function () {
        $scope.messageToSend = '';
        getDisplayedApplicationThreadMessages();
        $scope.$apply();
      });
    }
  };
  $scope.patchCampaign = function (campaign, isDelete) {
    if (isDelete) {
      campaign.status = 'removed';
    }
    CampaignService.patchCampaign(campaign).then(function (res) {
      if (isDelete) {
        $scope.alertSuccess('Successfully deleted campaign.');
      } else {
        $scope.alertSuccess('Successfully updated campaign.');
      }
      $scope.refreshCurrentPageData();
    });
  };
  $scope.deleteCampaign = function (campaign) {
    $scope.patchCampaign(campaign, true);
  };
  $scope.openEditApplication = function () {
    var uibModalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      scope: $scope,
      templateUrl: '/app/applyCampaignPopUp.html',
      controller: function ($uibModalInstance, $scope, $rootScope, DirectMessageService) {
        $scope.myCampaigns = [];
        $scope.isCalendarOpened = false;
        $scope.imageType = 'url';
        $scope.user = $rootScope.user;
        $scope.requirementType = 'text';
        $scope.appForm = $scope.displayedApplication;
        $scope.facebookPageId = $scope.appForm.facebookPageId;
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
        var applyForCampaign = function (messageText) {
          $scope.apiClient.applicationPatch({ applicationId: $scope.appForm.applicationId }, $scope.appForm).then(function (res) {
            $scope.firebaseToken = $rootScope.user.firebaseToken;
            if (!res.data.errorMessage) {
              var timestamp = new Date().getTime();
              DirectMessageService.sendApplicationMessageInThread($scope.user.firebaseToken, $scope.appForm.applicationId, $scope.user.id, messageText, function () {
                $scope.$apply();
              });
              $rootScope.showLoading = false;
              $scope.alertSuccess('messageText');
              $scope.close();
            } else {
              $scope.alertError('Failed to apply to campaign.');
            }
            $scope.$apply();
          }).catch(function (res) {
            $rootScope.showLoading = false;
            $scope.alertError('Failed to apply changes.');
            $scope.$apply();
          });
        };
        $scope.submitAppForm = function () {
          $rootScope.showLoading = true;
          var actionTime = new Date();
          actionTime.setDate($scope.date.getDate());
          if ($scope.time === '') {
            $scope.time = new Date();
          }
          actionTime.setHours($scope.time.getHours());
          actionTime.setMinutes($scope.time.getMinutes());
          $scope.appForm.actionTime = actionTime.getTime() + '';
          delete $scope.appForm.updateTime;
          delete $scope.appForm.createTime;
          delete $scope.appForm.$$hashKey;
          delete $scope.appForm.campaignPerformance;
          var messsageText = 'Updated proposal.';
          if ($scope.appForm.status == 'matching') {
            $scope.appForm.status = 'pending';
            messsageText = 'Applied for campaign.';
          }
          if ($scope.appForm.postContent !== '') {
            if ($scope.imageType === 'file' && $scope.file) {
              var error = UtilsService.uploadImage($scope.file, applicationId, function (applicationImageUrl) {
                if (applicationImageUrl) {
                  $scope.appForm.imgUrl = applicationImageUrl;
                  applyForCampaign(messsageText);
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
              applyForCampaign(messsageText);
            }
          }
        };
        $scope.redirect = function () {
          $uibModalInstance.close();
          $location.path(redirection);
        };
      }
    });
  };
  $scope.openEditCampaignPopup = function () {
    //  var popupScope = $scope.$new(true);
    var uibModalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      windowClass: 'center-modal-lg',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      templateUrl: '/app/createCampaignPopUp.html?' + new Date(),
      scope: $scope,
      controller: function ($uibModalInstance, $scope, $rootScope, CampaignService) {
        $scope.currentStep = 1;
        $scope.nextStep = function () {
          $scope.currentStep++;
        };
        $scope.prevStep = function () {
          $scope.currentStep--;
        };
        $scope.hasCreditCard = typeof $rootScope.user.creditCard !== 'undefined';
        $scope.imageType = 'url';
        $scope.campaign = $scope.displayedCampaign;
        $scope.categories = {};
        $scope.campaign.categories = $scope.campaign.categories ? $scope.campaign.categories.split(',') : [];
        angular.forEach($rootScope.categoriesList, function (cat) {
          $scope.categories[cat] = $scope.campaign.categories.indexOf(cat) > -1;
        });
        $scope.ageGroups = {};
        $scope.validateURL = function (textval) {
          var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
          return urlregex.test(textval);
        };
        $scope.$watch('campaign.trackingUrl', function () {
          if (typeof $scope.campaign.trackingUrl !== 'undefined') {
            if ($scope.validateURL($scope.campaign.trackingUrl)) {
              var location = document.createElement('a');
              location.href = $scope.campaign.trackingUrl;
              console.log(location, location.host);
              $scope.linkedHost = location.host;
            } else {
              $scope.linkedHost = $scope.campaign.trackingUrl;
            }
          }
        });
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.submit = function () {
          $scope.submitNewCampaign();
        };
        $scope.toggleAgeGroup = function (ageGroup) {
          console.log('toggleAgeGroup', ageGroup);
          if (typeof $scope.ageGroups[ageGroup] == 'undefined')
            $scope.ageGroups[ageGroup] = true;
          else {
            $scope.ageGroups[ageGroup] = !$scope.ageGroups[ageGroup];
          }
        };
        $scope.submitNewCampaign = function () {
          $rootScope.showLoading = true;
          $scope.savingCampaign = true;
          var campaign = $scope.campaign;
          campaign.minAge = 100;
          campaign.maxAge = 0;
          if (typeof $scope.ageGroups['13-17'] !== 'undefined') {
            campaign.minAge = 13;
            campaign.maxAge = 17;
          }
          if (typeof $scope.ageGroups['18-24'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 18 : campaign.minAge;
            campaign.maxAge = 24;
          }
          if (typeof $scope.ageGroups['25-34'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 25 : campaign.minAge;
            campaign.maxAge = 34;
          }
          if (typeof $scope.ageGroups['35-44'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 35 : campaign.minAge;
            campaign.maxAge = 44;
          }
          if (typeof $scope.ageGroups['45-54'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 45 : campaign.minAge;
            campaign.maxAge = 54;
          }
          if (typeof $scope.ageGroups['55-64'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 55 : campaign.minAge;
            campaign.maxAge = 64;
          }
          if (typeof $scope.ageGroups['65+'] !== 'undefined') {
            campaign.minAge = campaign.minAge == 100 ? 65 : campaign.minAge;
            campaign.maxAge = 100;
          }
          if (campaign.type === 'pay') {
            var catList = [];
            angular.forEach($scope.categories, function (value, key) {
              if (value) {
                catList.push(key);
              }
            });
            campaign.categories = catList.join();  //            campaign.fromDate = campaign.fromDate.getTime() + "";
                                                   //            campaign.toDate = campaign.toDate.getTime() + "";
                                                   //            if (campaign.ageRange && campaign.ageRange != "") {
                                                   //                var ages = campaign.ageRange.split('-');
                                                   //                campaign.minAge = parseInt(ages[0]);
                                                   //                campaign.maxAge = parseInt(ages[1]);
                                                   //            } else {
                                                   //                campaign.minAge = 0;
                                                   //                campaign.maxAge = 100;
                                                   //            }
          }
          var postCampaign = function () {
            CampaignService.patchCampaign(campaign).then(function (res) {
              $rootScope.showLoading = false;
              $scope.savingCampaign = false;
              $scope.alertSuccess('Successfully posted campaign. Go to Status to check for updates.');
              $uibModalInstance.close();
              $scope.$apply();
            }).catch(function (e) {
              $rootScope.showLoading = false;
              $rootScope.alerts.push({
                type: 'danger',
                msg: 'Failed to update campaign.'
              });
              $scope.savingCampaign = false;
              $scope.$apply();
            });
          };
          if ($scope.imageType === 'file' && $scope.file) {
            var error = UtilsService.uploadImage($scope.file, campaign.campaignId, function (imageUrl) {
              if (imageUrl) {
                campaign.thumbnail = imageUrl;
                postCampaign();
              }
            }, function (errorMessage) {
              $rootScope.alerts.push({
                type: 'danger',
                msg: errorMessage
              });
              $scope.savingCampaign = false;
            });
            if (error && error.message) {
              $rootScope.alerts.push({
                type: 'danger',
                msg: error.message
              });
              $scope.savingCampaign = false;
            }
          } else {
            postCampaign();
          }
        };
        $scope.togglePlatform = function (platform) {
          console.log('togglePlatform', platform);
          if (typeof $scope.campaign.socialTypes[platform] == 'undefined')
            $scope.campaign.socialTypes[platform] = true;
          else {
            $scope.campaign.socialTypes[platform] = !$scope.campaign.socialTypes[platform];
          }
        };
      }
    });
  };
});