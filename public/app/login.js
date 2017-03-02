app.controller('loginCtrl', function ($scope, $rootScope, $routeParams, $http, $uibModal,
  $location) {
  if($rootScope.user) {
    $location.path('/campaign');
  }
  $scope.$on('$viewContentLoaded', function () {
    if(!$rootScope.isLoginNeeded($location.path())) {
    FP.analytics.track('View login page', null, {
      category: 'Signup',
      action: 'view',
      label: 'Login page',
      value: null
    });
    var uibModalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      windowClass: 'center-modal',
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      templateUrl: 'login-modal.htm',
      controller: function ($uibModalInstance, $scope, $rootScope, $routeParams, $location) {
        $scope.currentStep = 0;
        $scope.account = {email: "", password : ""};
        $scope.type = $routeParams.type ? $routeParams.type : '';
        $scope.allowFacebookOnly = $routeParams.facebookSignup ? true : false;
        $scope.fixType = ($scope.type !== '');
        $scope.close = function () {
          $uibModalInstance.close();
        };
        $scope.submit = function () {
          $uibModalInstance.close();
        };
        $scope.setUserType = function (type) {
          //console.log("set user type: " + type);
          FP.analytics.track('Set user type to ' + type, null, {
            category: 'Signup',
            action: 'input',
            label: 'User type to',
            value: null
          });
          $scope.type = type;
        };
        $scope.emailLogin = function(){
            $http.post('/login', $scope.account, { header: { 'Content-type': 'application/json' } }).then(function(res){
                if(res){
                    $scope.close();
                    // need to redirect to different page base on the user role.
                    // console.log("after /login response...");
                    // console.log(res);
                    $rootScope.user = res.data;
                    if (res.data.profile.type === "brand") {
                      $location.path('/');
                    } else {
                      $location.path('/statistics');
                    }

                    $rootScope.refreshUser();
                }
            }, function(err){
                $scope.alert = {msg: "Cannot login account. Please check your input.", type: "danger"};
            });
        };
        $http.get('/sessionUserType').then(function (res) {
          if(USER_TYPES.indexOf(res.data.userType) > -1) {
            $scope.currentStep = 1;
            $scope.userType = res.data.userType;
          }
        });
        $scope.loginToFacebook = function () {
          FP.analytics.track('Login with facebook', null, {
            category: 'Signup',
            action: 'login',
            label: 'Login with facebook',
            value: null
          });
          $http.post('/sessionUserType', {
            type: $scope.type
          }).then(function (res) {
            window.location = '/auth/facebook';
          });
        };
        $scope.gotoPageAndClose = function(page){
          window.location = page;
          $scope.close();
        };
        $scope.switchPage = function (pageNum) {
          $scope.currentStep = pageNum;
        };
        $scope.openSignUpModal = function () {
          var signUpModalInstance = $uibModal.open({
            windowClass: 'center-modal',
            size: 'md',
            backdrop: 'static',
            animation: $scope.animationsEnabled,
            templateUrl: '/app/signup.html',
            controller: function ($uibModalInstance, $scope,
              $rootScope) {
              $scope.account = {
                profile: {}
              };
              $scope.close = function () {
                $uibModalInstance.close();
              };
              $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
              };
              $scope.submit = function () {
                var ac = $scope.account;
                $scope.alerts = [];
                var valid = true;
                if(ac.firstName === '' || typeof ac.firstName ===
                  'undefined') {
                  $scope.alerts.push({
                    type: 'danger',
                    msg: 'First name cannot be blank'
                  });
                  valid = false;
                }
                if(ac.lastName === '' || typeof ac.lastName ===
                  'undefined') {
                  $scope.alerts.push({
                    type: 'danger',
                    msg: 'Last name cannot be blank'
                  });
                  valid = false;
                }
                if(ac.password !== ac.confirmPassword) {
                  $scope.alerts.push({
                    type: 'danger',
                    msg: 'Passwords don\'t match.'
                  });
                  valid = false;
                }
                if(valid) {
                  ac.profile = {
                    'name': ac.firstName + ' ' + ac.lastName,
                    'firstName': ac.firstName,
                    'lastName': ac.lastName
                  };
                  $rootScope.showLoading = true;
                  $http.post('/signup', ac, {
                    header: {
                      'Content-type': 'application/json'
                    }
                  }).then(function (data) {
                    console.log('Signup result',
                      data);
                    //success
                    $rootScope.user = data.data;
                    $http.patch('/account/profile', {
                      'doneOnBoarding': 'false',
                      'user': {
                        'id': $rootScope.user.id
                      }
                    }).then(function () {
                      $rootScope.showLoading =
                        false;
                      $uibModalInstance.close();
                      window.location =
                        '/app.html';
                    }, function () {
                      $rootScope.showLoading =
                        false;
                    });
                  }, function (response) {
                    angular.forEach(response.data.errors,
                      function (error) {
                        $scope.alerts.push({
                          type: 'danger',
                          msg: error.msg
                        });
                      }); //failed
                  });
                }
              };
            }
          });
        };
      }
    });
    }
  });

  $scope.login = function () {
    $http({
      method: 'POST',
      url: '/login',
      data: {
        email: $scope.email,
        password: $scope.password,
        csrf: $scope.csrf
      }
    }).then(function (response) {
      $rootScope.user = response.data;
      if ($rootScope.user.profile.role === "brand") {
        $location.path('/search');
      } else {
        $location.path('/statistics');
      }

    }, function (err) {
      $scope.alertError('Invalid credentials.');
    });
  };
});
