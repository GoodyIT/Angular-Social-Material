app.controller('dealsCtrl', function ($scope, $uibModal, $http, $rootScope, $location, UtilsService, $timeout) {
  $scope.deals = [];
  $scope.campaignsLoaded = false;
  // Login completed event
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
      $scope.refreshCurrentPageData();
    }
  });
  $scope.refreshCurrentPageData = function () {
    $rootScope.showLoading = true;
    $http.get('/crm/deals/0').then(function (deals) {
      $scope.deals = deals.data;
      $rootScope.showLoading = false;
      $scope.campaignsLoaded = true;
    });
  };
  $scope.showCampaignDetailsPopup = function (campaign) {
    var selectedCeleb = $scope.selectedCeleb;
    var uibModalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/app/requestCampaignPopup.html',
      controller: function ($uibModalInstance, $scope, $rootScope) {
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.submittedRequest = false;
        $scope.readOnly = true;
        $scope.form = {
          budget: '',
          productLink: '',
          website: '',
          productName: '',
          startDate: '',
          notes: ''
        };
        angular.forEach($scope.form, function (value, key) {
          $scope.form[key] = campaign[PIPEDRIVE_FIELDS[key]];
        });
        $scope.title = campaign.title;
        $scope.selectedCeleb = campaign[PIPEDRIVE_FIELDS.celebritiesWanted];
      },
      resolve: {
        campaign: function () {
          return campaign;
        }
      }
    });
  };
});