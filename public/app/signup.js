app.controller('signUpCtrl', function ($scope, $rootScope, $http, $location, $routeParams) {
  FP.analytics.track(
    'Load signup page', null, {
      category: 'Sign Up page',
      action: 'Loaded Sign up page',
      label: 'Loaded Sign up page',
      value: null
  });
  $http.post('/sessionUserType', {
      type: $routeParams.type ? $routeParams.type : 'brand',
  });
  $scope.account = {profile:{doneOnBoarding: true, role:'brand'}};
  $scope.loginToFacebook = function () {
    FP.analytics.track('Login with facebook', null, {
      category: 'Signup',
      action: 'login',
      label: 'Login with facebook',
      value: null
    });

    // getting the ?type={value} from the url
    if($routeParams.type && ($routeParams.type === 'brand' || $routeParams.type === 'influencer')) {
      $scope.type = $routeParams.type;
    }

    $http.post('/sessionUserType', {
      type: $routeParams.type,
    }).then(function (res) {
      window.location = '/auth/facebook';
    });
  };
  $scope.redirection = $routeParams.redirection || "";
  $scope.submit = function () {
      var ac = $scope.account;
      $rootScope.showLoading = true;
      $http.post('/signup', ac, { header: { 'Content-type': 'application/json' } }).then(function (data) {
        //success
        $scope.account.id = data.id;
        $rootScope.createUserInCrm($scope.account).then(function () {
              $rootScope.showLoading = false;
              $rootScope.alertSuccess("Successfully Signed Up.");
              $location.url($scope.redirection || $scope.type === "brand" ? '/' : "/statistics");
              $rootScope.refreshUser();
            }, function (error) {
              $rootScope.processError(
                error, $scope.alerts,
                'Failed to save profile'
              );
              $rootScope.showLoading = false;
            });

      }, function (response) {
          $rootScope.showLoading = false;
          $scope.alertError("Cannot create account. Please check your input");
      });
  };
});
