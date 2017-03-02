var app = angular.module('app', [
  'fpDirectives',
  'ngStorage',
  'ngRoute',
  'ui.bootstrap',
  'ngTagsInput',
  'ngAnimate',
  'ngDragDrop',
  'nvd3',
  'ngCookies',
  'ngSanitize',
  'ngMessages',
  'ngMaterial',
  'triangular',
  'ngNumeraljs',
  'googlechart', 'chart.js', 'linkify', 'ui.calendar', 'angularMoment', 'textAngular', 'uiGmapgoogle-maps', 'hljs', 'md.data.table', angularDragula(angular), 'ngFileUpload'
]);
var AWS_API_KEY = 'G84MftERYj7VP0ACf3uQh3w9ewFbgdi06C1GtA1B';
var ALL_STATUS = 'pending,accepted,completed,scheduled';
var STATUS_MAP = {
  'pending': 'Pending',
  'matching': 'Waved',
  'scheduled': 'Scheduled',
  'completed': 'Completed'
};
var USER_TYPES = [
  'brand',
  'influencer'
];
var PIPEDRIVE_FIELDS = {
  'website': 'de789f2545565506fa6479c9383d9ada43aa188d',
  'productName': '3a5ba6fe6576110718ddfe6ac1ed4788d6a562ed',
  'productLink': 'a02913b124c4965ccbb76688d174832a735ce61d',
  'budget': '3302a8c531696bb2a047fdc6a0491b063cbfbe2b',
  'iosLink': '13d7c99c6280cf2bddd860505bb9a53fdccc583c',
  'androidLink': 'b66a38a1001d4b2cae946aa991ea7d59db7cd49c',
  'userAttributes': 'c58f4a12b953ecb841dbbe2973c836921d5caca3',
  'startDate': '17b92eb75cf8f71b8af4bb8a9d31db999cb953fd',
  'notes': '31bb84f797ba6bd9c1fc3996663015ce136d63ab',
  'appTrackEvent': 'eb246ce73d968b6de145b813ae0886826cacbbe8',
  'celebritiesWanted': 'f78f8d0aafd7933f8169d40190ccb59feb14d555',
  'email': 'b71245c36a6a4825f1c976da9b393004415ad646',
  'adminPageUrl': '614229c9f734bf5785125133a202d6bba74d2590',
  'fpUserId': '09fdaaab6cd9019fa3b7cd9adac088f9d9ccfb7d',
  'campaignType': '22ccf5fd5a195d0061b93f97eb3ab8f6b4fae835'
};
var PUBLIC_PAGES = ['/search', "/celebDetails", "/signup"];

String.prototype.plural = function (revert) {

  var plural = {
    '(quiz)$': "$1zes",
    '^(ox)$': "$1en",
    '([m|l])ouse$': "$1ice",
    '(matr|vert|ind)ix|ex$': "$1ices",
    '(x|ch|ss|sh)$': "$1es",
    '([^aeiouy]|qu)y$': "$1ies",
    '(hive)$': "$1s",
    '(?:([^f])fe|([lr])f)$': "$1$2ves",
    '(shea|lea|loa|thie)f$': "$1ves",
    'sis$': "ses",
    '([ti])um$': "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$': "$1ses",
    '(alias)$': "$1es",
    '(octop)us$': "$1i",
    '(ax|test)is$': "$1es",
    '(us)$': "$1es",
    '([^s]+)$': "$1s"
  };

  var singular = {
    '(quiz)zes$': "$1",
    '(matr)ices$': "$1ix",
    '(vert|ind)ices$': "$1ex",
    '^(ox)en$': "$1",
    '(alias)es$': "$1",
    '(octop|vir)i$': "$1us",
    '(cris|ax|test)es$': "$1is",
    '(shoe)s$': "$1",
    '(o)es$': "$1",
    '(bus)es$': "$1",
    '([m|l])ice$': "$1ouse",
    '(x|ch|ss|sh)es$': "$1",
    '(m)ovies$': "$1ovie",
    '(s)eries$': "$1eries",
    '([^aeiouy]|qu)ies$': "$1y",
    '([lr])ves$': "$1f",
    '(tive)s$': "$1",
    '(hive)s$': "$1",
    '(li|wi|kni)ves$': "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$': "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
    '([ti])a$': "$1um",
    '(n)ews$': "$1ews",
    '(h|bl)ouses$': "$1ouse",
    '(corpse)s$': "$1",
    '(us)es$': "$1",
    's$': ""
  };

  var irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people'
  };

  var uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

  // save some time in the case that singular and plural are the same
  if(uncountable.indexOf(this.toLowerCase()) >= 0)
    return this;

  // check for irregular forms
  for(var word in irregular) {
    var pattern;
    var replace;
    if(revert) {
      pattern = new RegExp(irregular[word] + '$', 'i');
      replace = word;
    } else {
      pattern = new RegExp(word + '$', 'i');
      replace = irregular[word];
    }
    if(pattern.test(this))
      return this.replace(pattern, replace);
  }

  var array = revert ? singular : plural;

  // check for matches using regular expressions
  for(var reg in array) {

    var regPattern = new RegExp(reg, 'i');

    if(regPattern.test(this))
      return this.replace(regPattern, array[reg]);
  }

  return this;
};

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return(c == 'x' ? r : r & 3 | 8).toString(16);
  });
  return uuid;
}
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/myCampaigns', {
      templateUrl: '/app/myCampaigns.html',
      controller: 'myCampaignsCtrl'
    }).when('/login', {
      templateUrl: '/app/login.html',
      controller: 'loginCtrl'
    }).when('/profile', {
      templateUrl: '/app/account.html',
      controller: 'profileCtrl'
    }).when('/celebDetails', {
      templateUrl: '/app/celebDetails.html',
      controller: 'celebDetailsCtrl'
    }).when('/statistics', {
      templateUrl: '/app/statistics.html',
      controller: 'statisticsCtrl'
    }).when('/deals', {
      templateUrl: '/app/deals.html',
      controller: 'dealsCtrl'
    }).when('/search', {
      templateUrl: '/app/search.html',
      controller: 'searchCtrl'
    }).when('/signup', {
      templateUrl: '/app/signup.html',
      controller: 'signUpCtrl'
    }).when('/pricing', {
      templateUrl: '/app/pricing.html',
      controller: 'pricingCtrl'
    }).when('/buildAudience', {
      templateUrl: '/app/buildAudience.html',
      controller: 'buildAudienceCtrl'
    }).otherwise({
      redirectTo: '/search'
    });
  }
]);
app.run([
  '$rootScope',
  '$location',
  '$route',
  function ($rootScope, $location, $route) {}
]);
(function () {
  'use strict';

  angular
    .module('app')
    .config(themesConfig);

  /* @ngInject */
  function themesConfig($mdThemingProvider, triThemingProvider, triSkinsProvider) {
    /**
     *  PALETTES
     */
    $mdThemingProvider.definePalette('white', {
      '50': 'ffffff',
      '100': 'ffffff',
      '200': 'ffffff',
      '300': 'ffffff',
      '400': 'ffffff',
      '500': 'ffffff',
      '600': 'ffffff',
      '700': 'ffffff',
      '800': 'ffffff',
      '900': 'ffffff',
      'A100': 'ffffff',
      'A200': 'ffffff',
      'A400': 'ffffff',
      'A700': 'ffffff',
      'contrastDefaultColor': 'dark'
    });

    $mdThemingProvider.definePalette('black', {
      '50': 'e1e1e1',
      '100': 'b6b6b6',
      '200': '8c8c8c',
      '300': '646464',
      '400': '3a3a3a',
      '500': 'e1e1e1',
      '600': 'e1e1e1',
      '700': '232323',
      '800': '1a1a1a',
      '900': '121212',
      'A100': '3a3a3a',
      'A200': 'ffffff',
      'A400': 'ffffff',
      'A700': 'ffffff',
      'contrastDefaultColor': 'light'
    });

    var triCyanMap = $mdThemingProvider.extendPalette('cyan', {
      'contrastDefaultColor': 'light',
      'contrastLightColors': '500 700 800 900',
      'contrastStrongLightColors': '500 700 800 900'
    });

    // Register the new color palette map with the name triCyan
    $mdThemingProvider.definePalette('triCyan', triCyanMap);

    /**
     *  SKINS
     */

    // CYAN CLOUD SKIN
    triThemingProvider.theme('cyan')
      .primaryPalette('triCyan')
      .accentPalette('amber')
      .warnPalette('deep-orange');

    triThemingProvider.theme('default')
      .primaryPalette('white')
      .accentPalette('triCyan', {
        'default': '500'
      })
      .warnPalette('deep-orange');

    triSkinsProvider.skin('cyan-cloud', 'Cyan Cloud')
      .sidebarTheme('cyan')
      .toolbarTheme('default')
      .logoTheme('cyan')
      .contentTheme('cyan');

    /**
     *  SET DEFAULT SKIN
     */
    triSkinsProvider.setSkin('cyan-cloud');
  }
})();

app.controller('rootCtrl', function ($scope, $sessionStorage, $rootScope, $http,
  $location, $uibModal, $timeout, $window, $routeParams, $mdToast) {
  $scope.Math = window.Math;
  $scope.user = $rootScope.user;
  $rootScope.showLoading = false;
  $scope.showMenu = false;
  $scope.allFbPageApproved = true;
  $scope.notApprovedList = [];
  $scope.toggleDrawer = function () {
    $scope.showMenu = !$scope.showMenu;
  };
  $scope.createdCrm = false;
  $sessionStorage.hasSelectedForMatching = false;
  $rootScope.hasSelectedForMatching = false;
  $rootScope.categoriesList = [
    'Technology',
      'Mobile Game',
    'Mobile App',
      'Business',
      'Design',
      'Music',
      'Entertainment/TV',
      'Fashion',
      'Outdoor',
      'Food',
      'Travel',
      'Photo & Video',
      'Housing',
      'Sports',
      'Fitness/health',
      'Beauty',
      'Family/Kids',
      'Finance',
      'Lifestyle',
      'Medical',
      'News'
  ];
  $rootScope.isLoginNeeded = function (currentPath) {
    return PUBLIC_PAGES.indexOf(currentPath) > -1;
  };
  $rootScope.$on('$routeChangeStart', function (event, nextLoc, currentLoc) {
    $scope.showMenu = false;
  });
  $rootScope.processError = function (error, alertArray, prefix) {
    var err = error.data.errors;
    alertArray = alertArray || $rootScope.alerts;
    if(err.split(':')[1]) {
      alertArray.push({
        type: 'danger',
        msg: (prefix || '') + err.split(':')[1]
      });
      return;
    }
  };
  $rootScope.apiClient = apigClientFactory.newClient({
    'apiKey': AWS_API_KEY,
    'invokeUrl': $rootScope.lambdaEndpoint
  });
  $rootScope.apiClientV2 = apigClientFactoryV2.newClient({
    'apiKey': AWS_API_KEY,
    'invokeUrl': $rootScope.lambdaEndpoint
  });
  $rootScope.refreshUser = function () {
    // Add timestamp as IE AJAX caching workaround
    $http.get('/login?t=' + new Date().getTime()).then(function (res) {
      $http.get('/api/lambdaEndpoint').then(function (lambdaEndpoint) {
        $rootScope.lambdaEndpoint = lambdaEndpoint.data;

        if(res.data.id) {
          $rootScope.user = res.data;
          // This log should be shown in the console.
          //console.log("Current user", $rootScope.user);
          $rootScope.ready = new Date().getTime();
          // Login completed
          // console.log("Login completed", $rootScope.user);
          FP.analytics.track('Loaded portal', $rootScope.user.email, {
            category: 'Signup',
            action: 'logged-in',
            label: 'User loggedin',
            value: null
          });
          $rootScope.isLogged = true;

          if($rootScope.user.facebook && ($rootScope.user.profile.role === 'influencer' && (!$rootScope.user.profile || $rootScope.user.profile.doneOnBoarding !== 'true'))) {
            $scope.openOnBoarding();
          }

          if(!$rootScope.user.profile.pipedriveOrgId && !$scope.createdCrm) {
            $rootScope.createUserInCrm($rootScope.user).then(function () {
              $scope.createdCrm = true;
              $rootScope.refreshUser();
            });
          }

          // This is a hack to redirect to /statistic page
          if(($rootScope.user.isBrand || $rootScope.user.profile.role === 'brand') && $location.path() == '/campaign') {
            $location.path('/statistic');
          }

          //console.log("location.path() + " + $location.path());
          if( ($rootScope.user.isBrand === false || $rootScope.user.profile.role === 'influencer') && $location.path().indexOf('/search')) {
            $location.path('/statistics');
          }

          if($rootScope.user.tokens) {
            for(var i = 0; i < $rootScope.user.tokens.length; i++) {
              switch($rootScope.user.tokens[i].kind) {
                case "facebook":
                  $rootScope.fbToken = $rootScope.user.tokens[i].accessToken;
                  break;
                case "twitter":
                  $rootScope.twitterTokens = $rootScope.user.tokens[i];
                  break;
                case "instagram":
                  $rootScope.instagramTokens = $rootScope.user.tokens[i];
                  break;
              }
            }
            if($rootScope.fbToken || $rootScope.googleTokens ||
              $rootScope.instagramTokens) {
              console.log('Getting dashboard');
              $scope.getDashboardDemographics();
            }
          }
          // Authenticating to firebase
          $rootScope.firebaseToken = $rootScope.user.firebaseToken;
        } else if(!$rootScope.isLoginNeeded($location.path())) {
          console.log('No session found');
          $location.path('/login');
          $rootScope.$on('$routeChangeStart', function () {
            if(!$rootScope.user && !$rootScope.isLoginNeeded($location.path())) {
              $location.path('/login');
            }
          });
        } else {
          $rootScope.isVisitor = true;
        }
      }, function () {});

    });

  };
  $rootScope.refreshUser();
  $rootScope.$watch('ready', function () {
    // --- Dashboard -----------------------------
    $scope.getDashboardDemographics = function () {
      var calculateData = function (res) {
        if(res.data.gender && res.data.gender.male !== undefined) {
          var gender = {
            'male': Math.round(res.data.gender.male * 100 / (res.data
                .gender.male + res.data.gender.female) * 100) /
              100,
            'female': Math.round(res.data.gender.female * 100 / (
                res.data.gender.male + res.data.gender.female) *
              100) / 100
          };
          var age = [];
          var key;
          for(key in res.data.age) {
            age.push({
              'name': key,
              'value': parseInt(res.data.age[key])
            });
          }
          age.sort(function (a, b) {
            return b.value - a.value;
          });
          var location = [];
          for(key in res.data.location) {
            location.push({
              'name': key,
              'value': parseInt(res.data.location[key])
            });
          }
          location.sort(function (a, b) {
            return b.value - a.value;
          });
          $scope.fbDemographics = {
            'age': age,
            'gender': isFinite(gender.male) ? gender : null,
            'location': location
          };
          $rootScope.fbStats = res.data;
          $rootScope.$apply();
        } else {
          $scope.fbDemographics = null;
        }
      };
      var calculateYoutubeData = function (data) {
        $rootScope.youtubeStats = data.statistics;
      };
      var calculateInstagramData = function (data) {
        $rootScope.instagramStats = data;
      };
      var delay = $rootScope.user ? 0 : 5000;
      if($rootScope.user.profile.isAdmin && $routeParams.pageId || $rootScope.user.profile.facebookDefaultPageId) {
        $timeout(function () {
          var pageId = $rootScope.user.profile.isAdmin && $routeParams.pageId ? $routeParams.pageId : $rootScope.user.profile.facebookDefaultPageId;
          var ownerId = $rootScope.user.profile.isAdmin && $routeParams.ownerId ? $routeParams.ownerId : $rootScope.user.id;
          //Check if fb token still valid. Get new token if invalid.
          $scope.apiClient.facebookGet({
            accessToken: '',
            postId: '',
            insightsName: 'page_impressions_by_age_gender_unique, page_fan_removes_unique, page_fan_adds_unique',
            pageId: pageId,
            ownerId: ownerId
          }, {}, {
            headers: {
              'Content-type': 'application/json'
            }
          }).then(function (res) {
            if(!res.data.errorMessage) {
              calculateData(res);
              $rootScope.loadedFbData = true;
              $rootScope.$apply();
            } else {
              console.log('Requesting new token');
              var index;
              for(var i = 0; i < $rootScope.user.tokens.length; i++) {
                if($rootScope.user.tokens[i].kind ===
                  'facebook') {
                  index = i;
                  break;
                }
              }
              $http.get('/extendFbToken/' + $rootScope.fbToken, {})
                .then(function (res) {
                  if(!res.data.message && index) {
                    $rootScope.user.tokens[index].accessToken =
                      res.data.newToken;
                    $http.post('/account/profile', $scope.user, {
                      headers: {
                        'Content-type': 'application/json'
                      }
                    });
                    $scope.apiClient.facebookGet({
                      accessToken: $scope.user.tokens[
                        index].accessToken,
                      postId: '',
                      pageId: $scope.user.profile.facebookDefaultPageId,
                      insightsName: '',
                      ownerId: $rootScope.user.id
                    }, {}, {
                      headers: {
                        'Content-type': 'application/json'
                      }
                    }).then(function (res) {
                      calculateData(res);
                      $rootScope.loadedFbData = true;
                      $rootScope.$apply();
                    });
                  }
                });
            }
          });
        }, delay);
      }
    };
    // --- Dashboard -----------------------------
    $scope.alertMessage = function(msg, type){
        $mdToast.show({
            template: '<md-toast class="md-'+type+'-toast"><span flex>' + msg + '</span></md-toast>',
            position: 'top right',
            hideDelay: 10000
        });
    };
    $scope.alertError = function (msg) {
      $scope.alertMessage(msg, 'error');
    };
    $rootScope.alertError = $scope.alertError;
    $scope.alertInfo = function (msg) {
        $scope.alertMessage(msg, 'info');
    };
    $rootScope.alertInfo = $scope.alertInfo;
    $scope.alertSuccess = function (msg) {
        $scope.alertMessage(msg, 'success');
    };
    $rootScope.alertSuccess = $scope.alertSuccess;
    $scope.location = $location;
    $rootScope.alerts = [];
    $scope.closeAlert = function (index) {
      $rootScope.alerts.splice(index, 1);
    };

    $rootScope.openRequestCampaignPopup = function (selectedCeleb, originalDeal) {
      var uibModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/requestCampaignPopup.html?' + new Date().getTime(),
        controller: function ($uibModalInstance, $scope, $rootScope) {
          FP.analytics.track(
            'User clicked Start Campaign', selectedCeleb[0] ? selectedCeleb[0] :
            null, {
              category: 'Request Campaign',
              action: 'Click Start Campaign',
              label: 'Clicked Start Campaign',
              value: null
            });
          $scope.close = function () {
            $uibModalInstance.close();
          };
          $scope.alerts = [];
          $scope.submittingRequest = true;
          $scope.isCalendarOpened = false;
          $scope.selectedCeleb = selectedCeleb;
          $scope.submittedRequest = false;
          $scope.name = $rootScope.user ? $rootScope.user.profile.name : '';
          $scope.user = $rootScope.user;
          $scope.email = $rootScope.user ? $rootScope.user.email : '';
          $scope.title = '';
          $scope.form = {
            budget: '',
            productLink: '',
            website: '',
            productName: '',
            startDate: '',
            notes: ''
          };
          $scope.openHowToFindID = function () {
            FP.analytics.track(
              'View how to find business id popup.', $rootScope.user &&
              $rootScope.user.email ? $rootScope.user.email :
              null, {
                category: 'Celebrities request campaign',
                action: 'view',
                label: 'Find business id popup',
                value: null
              });
            var uibModalInstance = $uibModal.open({
              animation: true,
              templateUrl: '/app/howToFindBusinessIdPopUp.html',
              controller: function ($uibModalInstance, $scope,
                $rootScope) {
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }
            });
          };
          $scope.submitDealProposal = function () {
            $rootScope.showLoading = true;
            $scope.alerts = [];
            var customFieldsMap = {};

            if(originalDeal) {
              angular.forEach($scope.form, function (value, key) {
                originalDeal[PIPEDRIVE_FIELDS[key]] = value;
              });
              originalDeal.person_id = originalDeal.person_id.value;
              originalDeal.stage_id = originalDeal.stage_id === 22 ? 17 : originalDeal.stage_id;
              $http.put('/crm/updateDeal', originalDeal).then(function (updateRes) {
                if(updateRes) {
                  $rootScope.showLoading = false;
                  $scope.submittedRequest = true;
                }
              });
            } else {
              var celebNames = [];
              angular.forEach($scope.selectedCeleb, function (profile) {
                celebNames.push(profile.name);
              });
              $scope.form.celebritiesWanted = celebNames.join(', ');
              angular.forEach($scope.form, function (value, key) {
                customFieldsMap[PIPEDRIVE_FIELDS[key]] = value;
              });
              customFieldsMap[PIPEDRIVE_FIELDS.email] = $scope.name + " " + $scope.email;
              $http.post('/crm/createDeal', {
                title: $scope.form.productLink,
                value: $scope.form.budget,
                currency: 'USD',
                organizationName: $scope.user ? $scope.user.brandName : $scope.name,
                personName: $scope.user ? $scope.user.profile.name : $scope.name,
                customFields: customFieldsMap,
                initStageEnum: 'CAMPAIGN_PROPOSED'
              }).then(function (newDeal) {
               // Update user business ID if provided
                if($scope.user &&  $scope.user.facebookBusinessId){
                    var newProfile = {
                      'facebookBusinessId': $scope.user.facebookBusinessId,
                      'user': {
                        'id': $scope.user.id
                        }
                    };
                    $http.patch('/account/profile',
                      newProfile).then(function () {
                      $rootScope.showLoading = false;
                      $rootScope.user = $scope.user;
                      $scope.submittedRequest = true;
                    }, function (error) {
                      $rootScope.processError(error, $scope.alerts, 'Failed to save profile');
                      $rootScope.showLoading = false;
                    });
                } else {
                    $rootScope.showLoading = false;
                    $scope.submittedRequest = true;
                }
              });
            }



          };
        },
        resolve: {
          selectedCeleb: function () {
            return $scope.selectedCeleb;
          }
        }
      });
    };
    $rootScope.createUserInCrm = function (user) {
      var dealObj = {
        title: user.profile.name,
        value: 0,
        currency: 'USD',
        organizationName: user.profile.name,
        personName: user.profile.name,
        customFields: {},
        initStageEnum: user.profile.role === 'brand' ? 'SIGNEDUP_STAGE' : 'LEADS'
      };
      var newProfile = {
        'name': user.profile.name,
        'email': user.email,
        'user': {
          'id': user.id
        }
      };
      var url = user.profile.role == 'brand' ? '/crm/createDeal' : '/crm/createCelebDeal';
      return $http.post(url, dealObj).then(function (newDeal) {
        newProfile.pipedriveOrgId = newDeal.data.org_id;
        newProfile.pipedrivePersonId = newDeal.data.person_id.value;
        newProfile.pipedriveDealId = newDeal.data.id;
        newProfile.pipedriveStatus = dealObj.initStageEnum;
        return $http.post(
          '/crm/createPersonDealFilter', {
            personId: newProfile.pipedrivePersonId
          }).then(function (filter) {
          newProfile.pipedriveFilterId = filter.data.id;
          return $http.patch('/account/profile', newProfile);
        });
      });
    };
    $scope.openOnBoarding = function (isEdit) {
      if(isEdit) {
        FP.analytics.track('Clicked edit profile button', $rootScope.user &&
          $rootScope.user.email ? $rootScope.user.email : null, {
            category: 'EditProfile',
            action: 'view',
            label: 'My Profile page',
            value: null
          });
      }
      var uibModalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        scope: $scope,
        templateUrl: '/app/onBoardingPopUp.html?' + new Date(),
        controller: function ($uibModalInstance, $scope,
          $rootScope, $uibModal) {
          if($rootScope.user.profile.role) {
            $scope.role = $rootScope.user.profile.role;
          } else {
            $http.get('/sessionUserType').then(function (res) {
              console.log(res);
              $scope.role = res.data.userType;
            });
          }
          $scope.myCampaigns = [];
          $scope.pagesReady = false;
          $scope.alerts = [];
          $scope.fbPages = [];
          var enabledFullReport = false;
          if($rootScope.user.profile.fbPageList) {
            for(var i = 0; i < $rootScope.user.profile.fbPageList
              .length; i++) {
              if($rootScope.user.profile.fbPageList[i].requestStatus !==
                "none") {
                enabledFullReport = true;
                break;
              }
            }
          }
          var newUserObject = angular.copy($rootScope.user);
          $scope.user = newUserObject;
          if($rootScope.user.email.match(
              /support\+[0-9]*\@famepick.com/g)) {
            $scope.user.email = '';
          }
          $scope.user.website = $scope.user.profile.website ?
            $scope.user.profile.website : '';
          FP.analytics.track('View onboarding popup',
            $rootScope.user &&
            $rootScope.user.email ? $rootScope.user.email :
            null, {
              category: 'Signup',
              action: 'view',
              label: 'Onboarding popup',
              value: null
            });
          var savedFBList = {};
          if($rootScope.ready) {
            if($scope.user.profile.fbPageList) {
              angular.forEach($scope.user.profile.fbPageList,
                function (page) {
                  savedFBList[page.id] = page.name;
                });
            }
            if($rootScope.fbToken) {
              $scope.apiClient.pagesGet({
                'accessToken': $rootScope.fbToken
              }, {}, {
                headers: {
                  'Content-type': 'application/json'
                }
              }).then(function (res) {
                $scope.fbPages = res.data.data;
                if($scope.fbPages.length === 0) {
                  FP.analytics.track(
                    "View onboarding popup - user does not have any pages",
                    $scope.user && $scope.user
                    .email ? $scope.user.email : null, {
                      category: 'Signup',
                      action: 'view',
                      label: 'View onboarding popup - user does not have any pages',
                      value: null
                    }
                  );
                }
                $scope.pagesReady = true;
                angular.forEach($scope.fbPages, function (
                  page) {
                  if(!$scope.user.profile.fbPageList ||
                    $scope.user.profile.fbPageList.length ===
                    0) {
                    page.isSelected = false;
                  } else {
                    page.isSelected = !!savedFBList[
                      page.id];
                  }
                });
                if((!$scope.user.brandName || $scope.user.brandName ===
                    '') && $rootScope.user.profile.role ===
                  'brand' && $scope.fbPages[0]) {
                  $scope.user.brandName = $scope.fbPages[0]
                    .name;
                }
                $scope.$apply();
              }).catch(function () {
                console.log(
                  'OnBoarding page Cannot get pages ');
              });
            } else {
              $scope.pagesReady = true;
            }
          }
          $scope.close = function () {
            FP.analytics.track('Close onboarding popup',
              $rootScope.user &&
              $rootScope.user.email ? $rootScope.user.email :
              null, {
                category: 'Signup',
                action: 'close',
                label: 'Onboarding popup',
                value: null
              });
            $uibModalInstance.close();
          };
          var updateProfile = function () {
            $scope.alerts = [];
            //Process page list
            var selectedPageList = [];
            var oldDefaultPageId = $scope.user.profile.facebookDefaultPageId;
            $scope.user.profile.facebookDefaultPageId = null;
            angular.forEach($scope.fbPages, function (page) {
              if(page.isSelected) {
                selectedPageList.push({
                  id: page.id,
                  name: page.name,
                  requestStatus: page.requestStatus ?
                    page.requestStatus : "none"
                });
                if(oldDefaultPageId === page.id) {
                  $scope.user.profile.facebookDefaultPageId =
                    oldDefaultPageId;
                }
              }

            });
            if(selectedPageList.length > 0) {
              $scope.user.profile.facebookDefaultPageId =
                $scope.user.profile.facebookDefaultPageId ||
                selectedPageList[0].id;
            } else {
              $scope.alerts.push({
                type: 'danger',
                msg: 'Please select at least one Facebook page to link to Famepick.'
              });
              $rootScope.showLoading = false;
              $rootScope.$apply();
              FP.analytics.track(
                'User has not select page to link to the platform',
                $rootScope.user &&
                $rootScope.user.email ? $rootScope.user.email :
                null, {
                  category: 'Signup',
                  action: 'error',
                  label: 'User has not select page to link to the platform',
                  value: null
                }
              );
              return;
            }
            if($scope.role === 'brand') {
              if(!$scope.user.brandName || $scope.user.brandName ===
                '') {
                $scope.alerts.push({
                  type: 'danger',
                  msg: 'Please enter your brand name'
                });
                FP.analytics.track(
                  'User has not input brand name',
                  $rootScope.user &&
                  $rootScope.user.email ? $rootScope.user.email :
                  null, {
                    category: 'Signup',
                    action: 'error',
                    label: 'User has not input brand name',
                    value: null
                  });
                $rootScope.showLoading = false;
                return;
              }
              if(!$scope.user.profile.website || $scope.user.profile
                .website === '') {
                $scope.alerts.push({
                  type: 'danger',
                  msg: 'Please enter your brand website'
                });
                FP.analytics.track(
                  'User has not input brand website',
                  $rootScope.user &&
                  $rootScope.user.email ? $rootScope.user.email :
                  null, {
                    category: 'Signup',
                    action: 'close',
                    label: 'User has not input brand website',
                    value: null
                  });
                $rootScope.showLoading = false;
                return;
              }
            }
            // TODO: Modify if multiple roles allowed.
            var newProfile = {
              'name': $scope.user.profile.name,
              'fbPageList': {},
              'facebookDefaultPageId': $scope.user.profile.facebookDefaultPageId,
              'doneOnBoarding': 'true',
              'website': $scope.user.profile.website,
              'user': {
                'id': $rootScope.user.id
              }
            };
            newProfile.fbPageList = $scope.user.profile.fbPageList =
              selectedPageList;
            if($scope.role == 'influencer') {
              if(newProfile.fbPageList.length < 1 && $scope.fbPages
                .length > 0) {
                $scope.alerts.push({
                  type: 'danger',
                  msg: 'You have to link to at least 1 Facebook page.'
                });
                FP.analytics.track(
                  'User has not link facebook page',
                  $rootScope.user &&
                  $rootScope.user.email ? $rootScope.user.email :
                  null, {
                    category: 'Signup',
                    action: 'error',
                    label: 'User has not link facebook page',
                    value: null
                  });
                $rootScope.showLoading = false;
                return;
              }
            }
            if($scope.user.email && $scope.user.email !== '') {
              newProfile.email = $scope.user.email;
            }
            if($scope.user.facebookBusinessId && $scope.user.facebookBusinessId !== '') {
              newProfile.facebookBusinessId = $scope.user.facebookBusinessId;
            }
            if($scope.user.brandName && $scope.user.brandName !== '') {
              newProfile.brandName = $scope.user.brandName;
            }
            if($scope.user.website && $scope.user.website !== '') {
              newProfile.website = $scope.user.website;
            }
            var setupCrmAndUpdateProfile = function (dealObj, initStage) {
              var url = $scope.user.profile.role == 'brand' ? '/crm/createDeal' : '/crm/createCelebDeal';
              $http.post(url, dealObj).then(function (newDeal) {
                newProfile.pipedriveOrgId = newDeal.data.org_id;
                newProfile.pipedrivePersonId = newDeal.data.person_id.value;
                newProfile.pipedriveDealId = newDeal.data.id;
                newProfile.pipedriveStatus = initStage;
                $http.post(
                  '/crm/createPersonDealFilter', {
                    personId: newProfile.pipedrivePersonId
                  }).then(function (filter) {
                  newProfile.pipedriveFilterId = filter.data.id;
                  $http.patch('/account/profile',
                    newProfile).then(function () {
                    $rootScope.refreshUser();
                    $rootScope.showLoading = false;
                    if($scope.user.profile.role === 'influencer') {
                      $location.path("/statistics");
                    }
                    $uibModalInstance.close();
                  }, function (error) {
                    $rootScope.processError(
                      error, $scope.alerts,
                      'Failed to save profile'
                    );
                    $rootScope.showLoading =
                      false;
                  });
                });
              });

            };
            var createDealForUser = function () {
              $http.get('/emailExisted/' +
                encodeURIComponent($scope.user.email) +
                '/' + $scope.user.id).then(function (res) {
                if(res.data == 'true') {
                  $scope.alerts.push({
                    type: 'danger',
                    msg: 'The email you entered is already registered. Please enter another email.'
                  });
                  $rootScope.showLoading = false;
                } else {
                  if(!$scope.user.profile.pipedrivePersonId) {
                    var dealObj = {
                      title: newProfile.name,
                      value: 0,
                      currency: 'USD',
                      organizationName: newProfile.brandName || newProfile.name,
                      personName: newProfile.name,
                      customFields: {}
                    };
                    dealObj.customFields[PIPEDRIVE_FIELDS.email] = newProfile.email;
                    dealObj.customFields[PIPEDRIVE_FIELDS.adminPageUrl] = window.location.origin +
                      '/app.html#/statistics?pageId=' + selectedPageList[0].id + '&ownerId=' + $scope.user.id;
                    dealObj.customFields[PIPEDRIVE_FIELDS.fpUserId] = $scope.user.id;
                    if($scope.user.profile.role == 'brand') {
                      dealObj.customFields[PIPEDRIVE_FIELDS.website] = newProfile.website;
                      setupCrmAndUpdateProfile(dealObj, 'signedup');
                    } else if($scope.user.profile.role ==
                      'influencer') {
                      dealObj.initStageEnum = 'LEADS';
                      setupCrmAndUpdateProfile(dealObj,
                        'LEADS');
                    } else {
                      console.error(
                        'User role is not set.');
                      FP.analytics.track(
                        '[Error] - User role is not set',
                        $rootScope.user && $rootScope.user.email ? $rootScope.user.email : null, {
                          category: 'Signup',
                          action: 'view',
                          label: '[Error] - User role is not set',
                          value: null
                        }
                      );
                    }
                  } else {
                    $http.patch('/account/profile',
                      newProfile).then(function () {
                      var refreshAndClose =
                        function () {
                          $rootScope.refreshUser();
                          $rootScope.showLoading =
                            false;
                          $rootScope.user = $scope.user;
                          $uibModalInstance.close();
                        };
                      if(enabledFullReport) {
                        $scope.apiClient.socialFacebookPagerequestPost({}, {
                          fbPageList: newProfile
                            .fbPageList,
                          userId: $scope.user.id,
                          email: $scope.user.email
                        }, {
                          headers: {
                            'Content-type': 'application/json'
                          }
                        }).then(function (res) {
                          refreshAndClose();
                        });
                      } else {
                        refreshAndClose();
                      }

                    }, function (error) {
                      $rootScope.processError(error,
                        $scope.alerts,
                        'Failed to update profile:'
                      );
                      $rootScope.showLoading =
                        false;
                    });
                  }
                }
              });
            };
            FP.analytics.track(
              'Submit onboarding information', $rootScope.user &&
              $rootScope.user.email ? $rootScope.user.email :
              null, {
                category: 'Signup',
                action: 'submit',
                label: 'onboarding information',
                value: null
              });
            createDealForUser();
          };
          $scope.submitForm = function () {
            $rootScope.showLoading = true;
            updateProfile();
          };
        }
      });
    };
    $scope.openFeedbackPopup = function () {
      FP.analytics.track(
        'Click Feedback btn on page', $location.path(), {
          category: 'Feedback btn',
          action: 'Click feedback btn',
          label: 'Click Feedback btn',
          value: null
        });
      var uibModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/feedbackPopUp.html?' + new Date(),
        controller: function ($uibModalInstance, $scope, $uibModal) {
          $scope.name = $rootScope.user ? $rootScope.user.profile.name : "";
          $scope.email = $rootScope.user ? $rootScope.user.email : "";
          $scope.message = "";
          $scope.submitFeedback = function () {
            if($scope.message && $scope.message !== '') {
              var feedbackObj = {
                title: $scope.name,
                initStageEnum: 'NEW',
                customFields: {}
              };
              FP.analytics.track(
                'submitted Feedback btn on page', $location.path(), {
                  category: 'Feedback',
                  action: 'submitted feedback form',
                  label: 'submitted feedback form',
                  value: null
                });
              feedbackObj.customFields[PIPEDRIVE_FIELDS.notes] = $scope.message;
              feedbackObj.customFields[PIPEDRIVE_FIELDS.email] = $scope.email;
              $http.post('/crm/postFeedback', feedbackObj).then(function (res) {
                $rootScope.alertSuccess("Thank you for your feedback.");
                $scope.close();
              }, function (res) {
                $rootScope.processError(res);
              });
            }

          };
          $scope.close = function () {
            $uibModalInstance.close();
          };

        }
      });
    };
    $scope.openHowToGrantPermissionPopup = function () {
      FP.analytics.track('View how to find business id popup.',
        $rootScope.user &&
        $rootScope.user.email ? $rootScope.user.email : null, {
          category: 'Signup',
          action: 'view',
          label: 'Find business id popup',
          value: null
        });
      var uibModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/howToGrantPermissionPopUp.html',
        controller: function ($uibModalInstance, $scope,
          $rootScope) {
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }
      });
    };
    $rootScope.openTourSlideShowPopup = function () {
      var uibModalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        templateUrl: '/app/tourSlideShowPopup.html',
        controller: function ($uibModalInstance, $scope,
          $rootScope) {
          $scope.active = 0;
          $scope.slides = [
            {
              image: 'https://s3.amazonaws.com/famepick-web/img/tour-slide-1.png',
              text: 'After your account being approved, you will see a list of celebrities available for your campaign. Select celebrities and click Request Campaign.'
            },
            {
              image: 'https://s3.amazonaws.com/famepick-web/img/tour-slide-2.png',
              text: 'Fill out and submit the campaign details. Then our team will contact you shortly to make it live.'
            }
          ];
          $scope.close = function () {
            var newProfile = {
              doneTour: true,
              'user': {
                'id': $rootScope.user.id
              }
            };
            $http.patch('/account/profile', newProfile).then(
              function () {
                $rootScope.refreshUser();
                $uibModalInstance.close();
              },
              function (error) {
                $uibModalInstance.close();
              });
          };
        }
      });
    };

    $scope.openMatchingModal = function (matches, campaign, redirection,
      totalLikesMap) {
      var uibModalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        templateUrl: '/app/matchingResultsModal.html',
        controller: function ($uibModalInstance, $scope,
          $rootScope) {
          $scope.matches = matches;
          $scope.totalLikesMap = totalLikesMap;
          $scope.isNumber = angular.isNumber;
          //                $scope.users = users;
          $scope.redirection = redirection;
          $scope.close = function () {
            $uibModalInstance.close();
          };
          $scope.alerts = [];
          $scope.campaign = campaign;
          $scope.Math = Math;
          $scope.selectMatch = function (match) {
            match.loading = true;
            var application = {
              userId: match.userId,
              status: 'matching',
              campaignId: campaign.campaignId,
              facebookPageId: match.pageId,
              socialId: match.socialId,
              ownerUserId: $rootScope.user.id,
              campaignLongLink: campaign.trackingUrl,
              applicationId: generateUUID(),
              type: 'pay'
            };
            $scope.apiClient.applicationPost({}, application, {
              headers: {
                'Content-type': 'application/json'
              }
            }).then(function (res) {
              if(!res.data.errorMessage) {
                var timestamp = new Date().getTime();
                //marked mathcing as waved.
                var updatedCampaign = angular.copy(
                  campaign, updatedCampaign);
                var socialIdsAry = [];
                if(updatedCampaign.socialIds) {
                  socialIdsAry = updatedCampaign.socialIds
                    .split(',');
                }
                socialIdsAry.push(match.socialId);
                updatedCampaign.socialIds = socialIdsAry.join();
                delete updatedCampaign.updateTime;
                delete updatedCampaign.createTime;
                $scope.apiClient.campaignPatch({},
                  updatedCampaign).then(function (res) {});
                $scope.alerts.push({
                  type: 'success',
                  msg: 'Successfully waved to the user. Please go to Status to track the process.'
                });
                match.loading = false;
                match.hasWaved = true;
              } else {
                $scope.alerts.push({
                  type: 'danger',
                  msg: 'Failed to wave to the user'
                });
                match.loading = false;
              }
              $scope.$apply();
            }).catch(function (res) {
              $scope.alerts.push({
                type: 'danger',
                msg: 'Failed to wave to the user'
              });
              match.loading = false;
              $scope.$apply();
            });
          };
          $scope.redirect = function () {
            $uibModalInstance.close();
            $location.path(redirection);
          };
        },
        resolve: {
          matches: function () {
            return matches;
          },
          redirection: function () {
            return redirection;
          }
        }
      });
    };
  });

});
