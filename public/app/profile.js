app.controller('profileCtrl', function ($rootScope, $scope, $uibModal, $http, UtilsService) {
  $scope.fbStats = {
    age: {},
    gender: {
      male: 1,
      female: 1
    }
  };
  $scope.loadedFbData = false;
  $scope.selectedTab = 'platforms';
  $scope.isUpdatingAccount = false;
  $scope.isUpdatingBilling = false;
  $scope.isWithdrawing = false;
  $scope.updateBillingStatus = 'Submit Authorization';
  $scope.withdrawalStatus = 'Confirm Withdrawal';
  $scope.updateAccountStatus = 'Submit Update';
  $scope.confirmPassword = '';
  $scope.password = {};
  $scope.chartOption = {
    chart: {
      type: 'pieChart',
      height: 500,
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.y;
      },
      showLabels: true,
      duration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: true,
      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  };
  $scope.cardInfo = {};
  $scope.balance = {
    'available': 0,
    'pending': 0
  };
  $scope.withdrawal = { 'amount': $scope.balance.available };
  $scope.transactionList = [];
  $scope.accountInfo = {};
  $scope.expiryMonths = UtilsService.monthsArray;
  $scope.expiryYears = UtilsService.getYearsArray();
  //$scope.account = {
  //    "account_number": "000123456789",
  //    "account_holder_name": "John Doe",
  //    "routing_number": "110000000",
  //    "account_holder_type": "individual",
  //    "country": "US",
  //    "currency": "USD"
  //};
  //
  //$scope.card = {
  //    "number": "4000 0000 0000 0077",
  //    "cvc": "123",
  //    "exp_year": "2017",
  //    "exp_month": "12"
  //};
  $scope.account = {
    'account_number': '',
    'account_holder_name': '',
    'routing_number': '',
    'account_holder_type': '',
    'country': '',
    'currency': 'USD'
  };
  $scope.card = {
    'number': '',
    'cvc': '',
    'exp_year': '',
    'exp_month': ''
  };
  $scope.reloadUserInfo = function () {
    console.log("Refreshing user info");
    $http.get('/login?t=' + new Date().getTime()).then(function (res) {
      if (res.data.id) {
        $rootScope.user = res.data;
        $scope.user = $rootScope.user;
        $scope.cardInfo = $rootScope.user.creditCard;
        $scope.accountInfo = $rootScope.user.bankAccount;
      }
    });
  };

  $scope.updatePageRentPrice = function()
  {
    var uibModalInstance = $uibModal.open({
      animation: true,
      scope: $scope,
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

        // $scope.categories = [
        //   {
        //     "label" : "Actor/Director",
        //     "value" : "Actor/Director"
        //   },
        //   {
        //     "label" : "Athlete",
        //     "value" : "Athlete"
        //   },
        //   {
        //     "label" : "Artist",
        //     "value" : "Artist"
        //   },
        //   {
        //     "label" : "Author",
        //     "value" : "Author"
        //   },
        //   {
        //     "label" : "Entertainer",
        //     "value" : "Entertainer"
        //   }
        // ];

        angular.forEach($scope.categories, function (category) {
          if ($rootScope.user.profile.pageRent.categories.indexOf(category.value)>-1)
              $scope.categoriesModel.push(true); else
              $scope.categoriesModel.push(false) ;
        });

        $scope.data = {
          "dailyBudget" : $rootScope.user.profile.pageRent.dailyBudget,
          "preferredDays" : $rootScope.user.profile.pageRent.preferredDays,
          "preferredStartDate": moment($rootScope.user.profile.pageRent.preferredStartDate).toDate()
        };
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
            } else
            {

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
                    $scope.reloadUserInfo();
                    $uibModalInstance.close();
                  },
                  function (error) {
                    console.error('Update page rent price failed');
                    $rootScope.alertError('Unable to update your page rent information');
                    $rootScope.$apply();
                    $uibModalInstance.close();
                  });

        };
      }
    });
  };

  // Delay until ready
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      $scope.user = $rootScope.user;
      console.log("Page Rent",$scope.user.profile.pageRent);
      $scope.cardInfo = $rootScope.user.creditCard;
      $scope.accountInfo = $rootScope.user.bankAccount;
      if ($rootScope.user.wallet) {
        $scope.balance = {
          'available': parseFloat($rootScope.user.wallet.balance),
          'pending': $rootScope.user.wallet.pending ? parseFloat($rootScope.user.wallet.pending) : 0
        };
        $scope.withdrawal = { 'amount': $scope.balance.available };
      }
      $scope.refreshTransactionList();
      $scope.categories = {};
      angular.forEach($rootScope.categoriesList, function (cat) {
        if (typeof $scope.user.profile.categories !== 'undefined')
          $scope.categories[cat] = $scope.user.profile.categories.indexOf(cat) > -1;
      });
      $scope.defaultFacebookPageId = $scope.user.profile.facebookDefaultPageId;
      if ($scope.user.profile.facebookDefaultPageId && $scope.user.profile.facebookDefaultPageId !== '') {
        var fbToken = '';
        var index;
        for (var i = 0; i < $scope.user.tokens.length; i++) {
          if ($scope.user.tokens[i].kind == 'facebook') {
            fbToken = $scope.user.tokens[i].accessToken;
            index = i;
            break;
          }
        }
        $scope.apiClient.facebookGet({
          accessToken: fbToken,
          postId: '',
          pageId: $scope.user.profile.facebookDefaultPageId,
          insightsName: '',
          ownerId: $rootScope.user.id
        }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
          if (!res.data.errorMessage) {
            if (res.data.age) {
              $scope.totalFollowerNum = 0;
              angular.forEach(res.data.age, function (value, key) {
                $scope.totalFollowerNum += value;
              });
            }
            $scope.loadedFbData = true;
            $scope.fbStats = res.data;
            $scope.$apply();
          } else {
            $http.get('/extendFbToken/' + fbToken, {}).then(function (res) {
              if (!res.data.message) {
                $scope.user.tokens[index].accessToken = res.data.newToken;
                $http.post('/account/profile', $scope.user, { headers: { 'Content-type': 'application/json' } });
                $scope.apiClient.facebookGet({
                  accessToken: $scope.user.tokens[index].accessToken,
                  postId: '',
                  ownerId: $rootScope.user.id,
                  pageId: $scope.user.profile.facebookDefaultPageId,
                  insightsName: ''
                }, {}, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
                  $scope.fbStats = res.data;
                  $scope.loadedFbData = true;
                  $scope.$apply();
                });
              }
            });
          }
        });
      }
    }
  });
  $scope.refreshTransactionList = function () {
    var data = {
      'action': 'transactions',
      'actionFilter': 'withdraw',
      'email': $rootScope.user.email
    };
    $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } }).then(function (data) {
      console.log(data);
      if (data.data.status == 'success') {
        // Trx list retrieved
        $scope.transactionList = data.data.list;
        $scope.$apply();
      } else {
      }
    }).catch(function (e) {
      console.error(e);
    });
  };
  $scope.processWithdrawal = function () {
    console.log($scope.withdrawal.amount);
    if (typeof $scope.withdrawal.amount === 'undefined') {
    } else {
      $scope.withdrawalStatus = 'Processing';
      var data = {
        'action': 'withdraw',
        'description': 'Manual withdrawal',
        'amount': $scope.withdrawal.amount,
        'currency': 'usd',
        // TODO: Don't hardcode currency
        'email': $rootScope.user.email
      };
      $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } }).then(function (data) {
        console.log(data);
        if (data.data.status == 'success') {
          $scope.isWithdrawing = false;
          $scope.withdrawalStatus = 'Confirm Withdrawal';
          // TODO: refresh from the server
          $scope.balance.available = $scope.balance.available - $scope.withdrawal.amount;
          $scope.withdrawal.amount = $scope.balance.available;
          $scope.$apply();
          $rootScope.alertSuccess('Your withdrawal request has been successfully processed.');
          $rootScope.$apply();
          $scope.refreshTransactionList();
        } else {
          $scope.withdrawalStatus = 'Confirm Withdrawal';
          $rootScope.$apply();
          $rootScope.alertError('Unable to execute your withdrawal request: ' + data.data.errorMessage);
          $rootScope.$apply();
        }
      }).catch(function (e) {
        console.error(e);
        $scope.isWithdrawing = false;
        $scope.withdrawalStatus = 'Confirm Withdrawal';
        $scope.$apply();
      });
    }
  };
  $scope.registerAccount = function () {
    $scope.updateAccountStatus = 'Processing';
    var data = {
      'action': 'register',
      'account': $scope.account,
      'email': $rootScope.user.email
    };
    $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } }).then(function (data) {
      console.log(data);
      if (data.data.status == 'success') {
        $scope.isUpdatingAccount = false;
        $scope.updateAccountStatus = 'Submit Update';
        $scope.reloadUserInfo();
        $scope.$apply();
        $rootScope.alertSuccess('Your bank account has been successfully updated.');
        $rootScope.$apply();
      } else {
        $scope.updateAccountStatus = 'Submit Update';
        $scope.$apply();
        $rootScope.alertError('Unable to update your bank account: ' + data.data.errorMessage);
        $rootScope.$apply();
      }
    }).catch(function (e) {
      console.error(e);
      $scope.isUpdatingAccount = false;
      $scope.updateAccountStatus = 'Submit Update';
      $scope.$apply();
    });
  };
  $scope.authorizeCreditCard = function () {
    $scope.updateBillingStatus = 'Processing';
    var data = {
      'action': 'authorize',
      'card': $scope.card,
      'email': $rootScope.user.email
    };
    $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } }).then(function (data) {
      console.log(data.data.status);
      if (data.data.status == 'success') {
        $scope.isUpdatingBilling = false;
        $scope.updateBillingStatus = 'Submit Authorization';
        $scope.reloadUserInfo();
        $scope.$apply();
        $rootScope.alertSuccess('Your credit card has been successfully updated.');
        $rootScope.$apply();
      } else {
        $scope.updateBillingStatus = 'Submit Authorization';
        $scope.$apply();
        $rootScope.alertError('Unable to update your credit card: ' + data.data.errorMessage);
        $rootScope.$apply();
      }
    }).catch(function (e) {
      console.error(e);
      $scope.isUpdatingBilling = false;
      $scope.updateBillingStatus = 'Submit Authorization';
      $scope.$apply();
      $rootScope.alertError('Unable to update your credit card.');
      $rootScope.$apply();
    });
  };
  $scope.saveDefaultPageId = function () {
    if ($scope.defaultFacebookPageId) {
      $http.patch('/account/profile', {
        'facebookDefaultPageId': $scope.defaultFacebookPageId,
        'user': { 'id': $rootScope.user.id }
      }).then(function () {
        $rootScope.user.profile.facebookDefaultPageId = $scope.defaultFacebookPageId;
        $scope.alertSuccess('Updated profile.');
      });
    }
  };
  $scope.updatePassword = function () {
    $rootScope.showLoading = true;
    $scope.password.email = $scope.user.email;
    $scope.apiClient.passwordChangePost({}, $scope.password, { headers: { 'Content-type': 'application/json' } }).then(function (res) {
      $rootScope.showLoading = false;
      if (res.data.status === 'success') {
        $scope.alertSuccess('Password changed.');
        // reset form value
        $scope.password = {};
        $scope.confirmPassword = '';
      } else {
        $scope.alertError('Failed to change password. Please check your input');
      }
      $scope.$apply();
    });
  };
});
