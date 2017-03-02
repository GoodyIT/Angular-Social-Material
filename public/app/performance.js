app.controller('performanceCtrl', function ($scope, $http, $timeout, $rootScope, CampaignService) {
  $scope.user = $rootScope.user;
  $scope.selectedCampaign = {};
  $scope.completedCampaigns = [];
  $scope.appliedCampaigns = [];
  $scope.completedApplicationsWithoutCampaign = [];
  $scope.loading = true;
  $scope.getMyCampaigns = function () {
    CampaignService.getCampaigns({
      userId: $rootScope.user.id,
      status: 'completed'
    }).then(function (campaigns) {
      $scope.completedCampaigns = campaigns.data.data;
      $scope.loading = false;
      $scope.$apply();
    }).catch(function () {
      console.log('error of getting campaigns information.');
      $scope.loading = false;
      $scope.$apply();
    });
  };
  $scope.$on('$viewContentLoaded', function () {
    if ($rootScope.user) {
      $scope.getMyCampaigns();
    } else
      $timeout(function () {
        $scope.getMyCampaigns();
      }, 5000);
  });
  $scope.chartOptions = {
    chart: {
      type: 'pieChart',
      height: 180,
      width: 180,
      donut: true,
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.y;
      },
      showLabels: false,
      duration: 500,
      showLegend: false,
      pie: { donutRatio: 0.67 },
      color: function (d) {
        return d.color;
      },
      margin: {
        top: 0,
        left: 0,
        // includes bar labels
        right: 0,
        // to avoid rightmost label getting clipped
        bottom: 0  // includes axis labels
      },
      valueFormat: d3.format('d')
    }
  };
  $scope.getMyApplications = function () {
    $scope.clearSelected();
    $scope.completedApplicationsWithoutCampaign = [];
    $scope.apiClient.applicationGet({
      applicationId: '',
      ownerUserId: '',
      count: 100,
      startKey: '',
      userId: $rootScope.user.id,
      status: 'completed',
      type: 'trade'
    }, {}).then(function (res) {
      var applications = res.data;
      var cIds = [];
      var completedApplicationsWithCampaign = [];
      for (var i = 0; i < applications.length; i++) {
        if (applications[i].applicantCampaignId && applications[i].applicantCampaignId !== '') {
          completedApplicationsWithCampaign.push(applications[i]);
          if (cIds.indexOf(applications[i].applicantCampaignId) === -1) {
            cIds.push(applications[i].applicantCampaignId);
          }
        } else {
          $scope.completedApplicationsWithoutCampaign.push({ completedApplications: [applications[i]] });
        }
      }
      if (cIds.length > 0) {
        CampaignService.getCampaigns({
          campaignIds: cIds.join(),
          status: 'completed'
        }).then(function (campaigns) {
          $scope.appliedCampaigns = campaigns.data.data;
          angular.forEach($scope.appliedCampaigns, function (campaign) {
            for (var i = 0; i < completedApplicationsWithCampaign.length; i++) {
              if (campaign.campaignId == completedApplicationsWithCampaign[i].applicantCampaignId) {
                campaign.completedApplications = [completedApplicationsWithCampaign[i]];
                break;
              }
            }
          });
          $scope.$apply();
        }).catch(function () {
          console.log('error');
        });
      } else {
        $scope.$apply();
      }
    });
  };
  $scope.getPaidApplications = function () {
    $scope.clearSelected();
    $scope.paidApplications = [];
    $scope.apiClient.applicationGet({
      applicationId: '',
      ownerUserId: '',
      startKey: '',
      userId: $rootScope.user.id,
      count: 100,
      status: 'completed',
      type: 'pay'
    }, {}).then(function (res) {
      var applications = res.data;
      var cIds = [];
      if (applications.length > 0) {
        for (var i = 0; i < applications.length; i++) {
          if (cIds.indexOf(applications[i].campaignId) === -1) {
            cIds.push(applications[i].campaignId);
          }
        }
        CampaignService.getCampaigns({
          campaignIds: cIds.join(),
          status: 'completed'
        }).then(function (campaigns) {
          $scope.paidApplications = campaigns.data.data;
          angular.forEach($scope.paidApplications, function (campaign) {
            for (var i = 0; i < applications.length; i++) {
              if (campaign.campaignId == applications[i].applicantCampaignId) {
                campaign.completedApplications = [applications[i]];
                break;
              }
            }
          });
        });
      }
    });
  };
  var loadFbStats = function (res, apply) {
    var fbStats = JSON.parse(res.data.body);
    if (!fbStats.errorMessage) {
      apply.fbStats = fbStats;
      angular.forEach(fbStats.age, function (value, key) {
        apply.fbStats.totalFollowerNum += value;
      });
      angular.forEach(fbStats.location, function (value, key) {
        apply.fbStats.totalLocationNum += value;
      });
      apply.loadedFbData = true;
      console.log(fbStats);
      // Tweak --
      apply.stats = {
        'type': 'facebook',
        'hasComment': true,
        'likes': fbStats.likes,
        'comments': fbStats.comments,
        'shares': fbStats.shares,
        'followers': apply.fbStats.totalFollowerNum,
        'locations': apply.fbStats.totalLocationNum
      };
      apply.statsLoaded = true;
    } else {
      $rootScope.alerts.push({
        type: 'danger',
        msg: 'Failed to load all post performance. Post may be deleted.'
      });
      apply.loadedFbData = true;
      apply.statsLoaded = true;
    }
  };
  var loadTwitterStats = function (res, apply) {
    console.log(res);
    apply.stats = {
      'type': 'twitter',
      'likes': res.data.favorite_count,
      'hasComment': false,
      //    "comments": ???,
      'shares': res.data.retweet_count,
      'followers': res.data.user.followers_count
    };
    apply.tweetId = res.data.id;
    apply.twitterId = res.data.user.name;
    apply.statsLoaded = true;
  };
  $scope.getApplicationPostStatus = function (campaign) {
    $scope.selectedCampaign = campaign;
    if (campaign.completedApplications[0].ownerPostContent != campaign.completedApplications[0].postContent) {
      $scope.selectedCampaign.completedApplications[0].postContent = campaign.completedApplications[0].ownerPostContent;
      $scope.selectedCampaign.completedApplications[0].facebookPostId = campaign.completedApplications[0].ownerFacebookPostId;
    }
    $http.get('/userFacebookInsight/' + campaign.completedApplications[0].ownerUserId + '/' + campaign.completedApplications[0].ownerFacebookPostId).then(function (res) {
      loadFbStats(res, campaign.completedApplications[0]);
    });
  };
  $scope.getPostStats = function (campaign) {
    console.log(campaign);
    $scope.selectedCampaign = campaign;
    $scope.apiClient.campaignsApplicationGet({
      userId: '',
      campaignId: campaign.campaignId,
      status: 'completed',
      type: ''
    }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      console.log('Applications', res.data);
      angular.forEach(res.data.data, function (apply) {
        if (campaign.type == 'pay') {
          apply.totalPaying = 0;
          if (campaign.payEventType == 'click' && apply.campaignPerformance && apply.campaignPerformance.count) {
            apply.totalPaying = campaign.payRate ? apply.campaignPerformance.count * campaign.payRate * 0.7 : apply.campaignPerformance.count * 0.05;
          } else if (campaign.payEventType == 'install' && apply.installCount) {
            apply.totalPaying = campaign.payRate ? apply.installCount * campaign.payRate * 0.7 : apply.installCount * 0.05;
          }
          apply.chartData = [
            {
              key: 'Total Paying',
              y: apply.totalPaying,
              color: '#EDB403'
            },
            {
              key: 'Remained Budget',
              y: campaign.budget - apply.totalPaying,
              color: '#000'
            }
          ];
        }
        // apply.tweetId = "717977199433744384";
        if (apply.tweetId) {
          $http.get('/userTweetInsight/' + apply.tweetId).then(function (res) {
            loadTwitterStats(res, apply);
          });
        } else {
          $http.get('/userFacebookInsight/' + apply.userId + '/' + apply.facebookPostId).then(function (res) {
            loadFbStats(res, apply);
          });
        }
      });
      $scope.selectedCampaign.completedApplications = res.data;
      $scope.$apply();
    });
  };
  $scope.getPaidApplicationStats = function (campaign) {
    var apply = campaign.completedApplications[0];
    $http.get('/userFacebookInsight/' + apply.userId + '/' + apply.facebookPostId).then(function (res) {
      loadFbStats(res, apply);
    });
  };
  $scope.clearSelected = function () {
    $scope.selectedCampaign = { completedApplications: [] };
  };
});