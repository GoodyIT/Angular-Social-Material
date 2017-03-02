app.controller('pricingCtrl', function ($scope, $rootScope, $http, $routeParams, $location, UtilsService) {
    var PLAN_DETAILS = {Basic: {planId: null}, "Startup": {planId: "testPlan"}, "Small Business": {planId: "testGoldPlan"},  "Enterprise": {planId: "testEnterprisePlan"}};
    $scope.currentView = 0;
    $scope.PLAN = [{name: "Basic", price: 0}, {name: "Startup", price: 499},{name: "Small Business", price: 899}, {name: "Enterprise", price: 1399}];
    $scope.expiryYears = UtilsService.getYearsArray();
    $scope.expiryMonths = UtilsService.monthsArray;
    $scope.card = {};
    $rootScope.$watch('ready', function () {
      if($rootScope.ready) {
        console.log('Initiating');
        $scope.user = $rootScope.user;
      }
    });

    $scope.isCheckoutAudience = $routeParams.isCheckoutAudience || false;
    $scope.switchPage = function(pageNum, planNum){
        $scope.selectedPlan = planNum;
        $scope.currentView = pageNum;
    };

    $scope.submitPayment = function(){
        $rootScope.showLoading = true;
        var updateProfile = function(newProfile){
            $http.patch('/account/profile', newProfile).then(function () {
              if($scope.isCheckoutAudience && $rootScope.currentCelebPage && $rootScope.audience.audienceAttrs){
                  createAudienceSetInCrm().then(function(crmRes){
                      $rootScope.showLoading = false;
                      $rootScope.alertSuccess("Successfully updated your plan, and submitted custom audience set.");
                      $rootScope.refreshUser();
                      $location.path("/myCampaigns");
                  }, function(error){
                      $rootScope.showLoading = false;
                      $rootScope.alertError("Failed to updated your plan.");
                      $rootScope.refreshUser();
                  });
              } else {
                $rootScope.showLoading = false;
                $rootScope.alertSuccess("Successfully updated your plan.");
                $rootScope.refreshUser();
              }

            },
            function (error) {
              $rootScope.showLoading = false;
              $rootScope.alertError("Error updating your plan.");
              $rootScope.$apply();
            });
        };
        //    This function is making 4 nested calls
        authorizeCreditCard().then(function (data) {
          if (data.data.status == 'success') {
            subscribeToPlan().then(function(res){
              if (res.data.status === 'active') {
                  var newProfile = {
                    membership: $scope.selectedPlan,
                    subscriptionId: res.data.subscriptionId,
                    'user': {
                      'id': $rootScope.user.id
                    }
                  };
                  if($rootScope.user.profile.subscriptionId){
                      cancelUserCurrentSubscription().then(function(){
                          updateProfile(newProfile);
                      });
                  }else {
                      updateProfile(newProfile);
                  }


              } else {
                $rootScope.showLoading = false;
                $rootScope.alertError('Failed to subscribe to the plan: ' + res.data.errorMessage);
                $rootScope.$apply();
              }
            });
            $scope.$apply();
          } else {
            $rootScope.showLoading = false;
            $rootScope.alertError('Unable to authorize your credit card: ' + data.data.errorMessage);
            $rootScope.$apply();
          }
        }).catch(function (e) {
          $rootScope.showLoading = false;
          $rootScope.alertError('Unable to authorize your credit card');
          $rootScope.$apply();
        });
    };

    $scope.submitAudience = function(){
        $rootScope.showLoading = true;
        createAudienceSetInCrm().then(function(crmResponse){
             $rootScope.showLoading = false;
             $rootScope.alertSuccess("Successfully submitted custom audience set. Please wait for our team to contact you within 48 hours.");
             $rootScope.refreshUser();
             $location.path("/myCampaigns");
        });
    };

     var authorizeCreditCard = function () {
         var data = {
           'action': 'authorize',
           'card': $scope.card,
           'email': $rootScope.user.email
         };
         return $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } });
       };

     var subscribeToPlan = function(){
        var data = {
            'action': 'createSubscription',
            'plan': PLAN_DETAILS[$scope.PLAN[$scope.selectedPlan].name].planId,
            'email': $rootScope.user.email
        };
        return $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } });

     };

     var cancelUserCurrentSubscription = function(){
        var data = {
            'action': 'cancelSubscription',
            'id': $rootScope.user.profile.subscriptionId,
            'email': $rootScope.user.email
        };
        return $scope.apiClient.paymentStripePost({}, data, { headers: { 'Content-type': 'application/json' } });

     };

     var createAudienceSetInCrm = function(){
        var data = {
            celebritiesWanted: $rootScope.currentCelebPage.name,
            userAttributes: ""
        };
        var customFieldsMap = {};
        angular.forEach($rootScope.audience.audienceAttrs, function (attr, key) {
          data.userAttributes += attr.category + " : " + (attr.cat? (attr.cat + " - " + attr.label) : attr.label) + "\n";
        });
        angular.forEach(data, function (value, key) {
          customFieldsMap[PIPEDRIVE_FIELDS[key]] = value;
        });
        customFieldsMap[PIPEDRIVE_FIELDS.email] = $rootScope.user.email;
        return $http.post('/crm/createDeal', {
          title: $rootScope.audience.name,
          personName: $rootScope.user.profile.name,
          currency: 'USD',
          customFields: customFieldsMap,
          initStageEnum: 'DEAL_PROPOSED'
        });
     };



});