app.controller('buildAudienceCtrl', function ($scope, $rootScope, facebookService, $q, $http, $routeParams, $location) {
  var PRODUCT_TYPE_CAT_STRING = 'Product Type',
      CAMPAIGN_TYPE_CAT_STRING = "Campaign Type",
      AGE_CAT_STRING = "Age",
      GENDER_CAT_STRING = "Gender",
      LOCATION_CAT_STRING = 'Location',
      USER_CHAR_CAT_STRING = 'User Characteristics';
  $scope.pageId = $routeParams.pageId || "";
  $scope.loadedCelebDetails = false;
  $scope.currentView = 0;
  $scope.nextView = 1;
  $scope.selectedTabIndex = 0;
  $scope.transitionClass = "to-left";
  $rootScope.$watch('ready', function () {
      if ($rootScope.ready) {
          $scope.totalPrice = $rootScope.user.profile.membership > 0 ? 0 : 499;
      }
    });
  $scope.audience = $rootScope.audience || {name: "", pageId:$scope.pageId};
  $scope.options = {};
  $scope.options[AGE_CAT_STRING] = [
    {'category':AGE_CAT_STRING, 'label': '13-17', 'value': "13-17"},
    {'category':AGE_CAT_STRING, 'label': '18-24', 'value': "18-24"},
    {'category':AGE_CAT_STRING, 'label': '25-34', 'value': "25-34"},
    {'category':AGE_CAT_STRING, 'label': '35-44', 'value': "35-44", 'price': 49},
    {'category':AGE_CAT_STRING, 'label': '45-54', 'value': "45-54"},
    {'category':AGE_CAT_STRING, 'label': '55-64', 'value': "55-64"},
    {'category':AGE_CAT_STRING, 'label': '65+', 'value': "65"}
  ];
  $scope.options[GENDER_CAT_STRING] = [
    {'category':GENDER_CAT_STRING, 'label': 'Male', 'value': "male"},
    {'category':GENDER_CAT_STRING, 'label': 'Female', 'value': "female"}
  ];
  $scope.options[LOCATION_CAT_STRING] = [
    {'category':LOCATION_CAT_STRING, 'label': 'United States', 'value': "United States", 'price': 49},
    {'category':LOCATION_CAT_STRING, 'label': 'Canada', 'value': "Canada"},
    {'category':LOCATION_CAT_STRING, 'label': 'Mexico', 'value': "Mexico"},
    {'category':LOCATION_CAT_STRING, 'label': 'United Kingdom', 'value': "United Kingdom"},
    {'category':LOCATION_CAT_STRING, 'label': 'Europe', 'value': "Europe"},
    {'category':LOCATION_CAT_STRING, 'label': 'Australia', 'value': "Australia"}
  ];
  $scope.options[PRODUCT_TYPE_CAT_STRING] = [
    {'name':'Mobile Games', 'subCats' : [
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Action'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Adventure'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Arcade'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Board'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Casino'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Family'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Music'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Puzzle'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Racing'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Role Playing'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Sports'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Strategy'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Trivia'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Word'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Other'}
     ]},
    {'name':'Mobile App', 'subCats' : [
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Books'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Business'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Education'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Entertainment/TV'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Finance'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Food/Drink'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Health/Fitness'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Kids'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Lifestyle'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Music'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'News'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Photo/Video'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Productivity'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Shopping'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Sports'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Travel'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Utilities'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Other'}
    ]},
    {'name':'E-Commerce', 'subCats' : [
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Books'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Business'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Education'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Entertainment/TV'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Finance'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Food/Drink'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Games'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Health/Fitness'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Fashion'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Lifestyle'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Music'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'News'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Photo/Video'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Productivity'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Sports'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Travel'},
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Other'}
    ]},
    {'name':'Other', 'subCats' : [
        {'category':PRODUCT_TYPE_CAT_STRING, 'label': 'Other'}
    ]}
  ];
  $scope.options[CAMPAIGN_TYPE_CAT_STRING] = [
      {'category':CAMPAIGN_TYPE_CAT_STRING, 'label': 'CPM', 'value': "CPM"},
      {'category':CAMPAIGN_TYPE_CAT_STRING, 'label': 'CPC', 'value': "CPC"},
      {'category':CAMPAIGN_TYPE_CAT_STRING, 'label': 'CPA', 'value': "CPA"},
      {'category':CAMPAIGN_TYPE_CAT_STRING, 'label': 'CPI', 'value': "CPI"}
  ];
  $scope.options[USER_CHAR_CAT_STRING] = [
        {'category':USER_CHAR_CAT_STRING, 'label': 'More Likely to Engage w/ Ad', 'value': "More Likely to Engage w/ Ad", 'price': 49},
        {'category':USER_CHAR_CAT_STRING, 'label': 'More Likely to Click on Ad', 'value': "More Likely to Click on Ad", 'price': 49},
        {'category':USER_CHAR_CAT_STRING, 'label': 'More Likely to Purchase', 'value': "More Likely to Purchase", 'price': 149},
        {'category':USER_CHAR_CAT_STRING, 'label': 'More Likely to Share', 'value': "More Likely to Share", 'price': 49},
        {'category':USER_CHAR_CAT_STRING, 'label': 'Active Fans', 'value': "Active Fans", 'price': 49},
        {'category':USER_CHAR_CAT_STRING, 'label': 'Receptive to Incentivized Ad', 'value': "Receptive to Incentivized Ad", 'price': 49}
  ];
  $scope.items2 = ($rootScope.audience && $rootScope.audience.pageId === $scope.pageId )? $rootScope.audience.audienceAttrs : [];
  if($rootScope.audience){
    $rootScope.audience.pageId = $scope.pageId;
  }

  // Login completed event
  $rootScope.$watch('ready', function () {
    if ($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
    }
  });

  if($scope.pageId){
    $rootScope.apiClientV2.facebookPageGet({id:$scope.pageId},
        {}, {
          headers: {
            'Content-type': 'application/json'
          }
        }).then(function (res) {
           $rootScope.currentCelebPage = res.data;
           $scope.loadedCelebDetails = true;
           $rootScope.$apply();
           $scope.$apply();
    });
  }
  $scope.nextStep = function(){
    $scope.currentView++;
    $scope.transitionClass = "to-left";
  };
  $scope.prevStep = function(){
    $scope.currentView--;
    $scope.transitionClass = "to-right";
  };
  $scope.removeAttribute = function(index, attr){
    $scope.totalPrice -= attr.price || 0;
    $scope.items2.splice($scope.items2.indexOf(attr));
    $scope.options[attr.category].push(attr);
  };
  $scope.onDrop = function(event, ui, arg3, arg4){
    var item = ui.draggable.scope().dndDragItem;
    $scope.totalPrice += item.price || 0;
  };
  $scope.goToCelebDetails = function(){
    $location.path('/celebDetails').search({pageId: page.id});
  };
  $scope.checkoutAudience = function(){
    $scope.audience.totalPrice = $scope.totalPrice;
    $scope.audience.audienceAttrs = $scope.items2;
    $rootScope.audience = $scope.audience;
    $location.path('/pricing').search({isCheckoutAudience: true});
  };


});