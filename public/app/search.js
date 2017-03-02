app.controller('searchCtrl', function ($scope, $rootScope, facebookService, $q, $http, $routeParams, $location) {
  var promiseAry = [];
  var searchId = new Date().getTime() + "";
  var DEFAULT_PAGE_SIZE = 100;
  $scope.pages = null;
  $scope.keyword = $routeParams.keyword || "";
  $scope.searchedWords = [];
  $scope.selectedPages = [];
  $scope.isListView = false;
  $scope.filter = {
    filterCategory: "",
    talkAbout: "",
    minFollowers: "",
    sortBy: ""
  };
  $scope.loadingSearch = false;
  $scope.suggestedKeywords = ["Athlete", "NBA", "NFL", "Soccer", "MMA", "Model", "Wrestling", "Professional", "Actor"];
  $scope.categoryWhiteList = ["Musician/Band", "Artist", "Public Figure", "Athlete", "Actor/Director", "Entertainer", "Author"];
  // Login completed event
  $rootScope.$watch('ready', function () {
    if($rootScope.ready) {
      console.log('Initiating');
      $scope.user = $rootScope.user;
    }
  });

 $scope.refreshCurrentPageData = function (keyword) {
    var showFeaturedOnly = keyword === '' ? true : "";
    FP.analytics.track('User searched keyword', keyword, {
                  category: 'Search',
                  action: 'search',
                  label: 'Search page with keyword',
                  value: null
                });
    $scope.loadingSearch = true;
    searchId = $scope.searchedWords.length === 0 ? new Date().getTime()+"" : searchId;
    $scope.searchedWords.push(keyword);
    $scope.pages = [];
    var keywords = keyword.split(" ");
    var convertedKeywords = [];
    angular.forEach(keywords, function(word){
        convertedKeywords.push(word!==''? word.plural(true): '');
    });
    keyword = convertedKeywords.join(" ");
    var verified = $scope.filter.verified === true ? "true": "";
    $rootScope.apiClientV2.facebookSearchGet({
            q:keyword,
            from: 0,
            size:DEFAULT_PAGE_SIZE,
            category: $scope.filter.filterCategory || "",
            talkAbout: $scope.filter.talkAbout || 0,
            verified: verified,
            followers: parseInt($scope.filter.minFollowers) || 0,
            sortBy: $scope.filter.sortBy || (keyword === "" ? 'likes': ""),
            featured: showFeaturedOnly
        },
        {}, {
          headers: {
            'Content-type': 'application/json'
          }
        }).then(function (res) {
           res.data = res.data || [];
           processSearchData(res);
           $scope.$apply();
        });
};
  FP.analytics.track('User Landed on Search page', $rootScope.user &&
            $rootScope.user.email ? $rootScope.user.email : null, {
              category: 'Search',
              action: 'land',
              label: 'Load Search page',
              value: null
            });
  $scope.refreshCurrentPageData($scope.keyword);

  $scope.toggleSelectPage = function (page) {
    page.isSelected = !page.isSelected;
    if(page.isSelected) {
      $scope.selectedPages.push(page);
    } else {
      $scope.selectedPages.splice($scope.selectedPages.indexOf(page), 1);
    }
  };
  $scope.useKeyword = function (keyword) {
    $scope.keyword = keyword;
    $scope.refreshCurrentPageData(keyword);
  };


  var processSearchData = function (res) {

    promiseAry = [];
    angular.forEach(res.data, function (page) {
        page.isSelected = false;
        page.keywords = [$scope.searchedWords[$scope.searchedWords.length - 1]];
        $scope.pages.push(page);
    });
    $scope.loadingSearch = false;

  };

  var loadNextPage = function (url) {
    $http.get(url).then(function (res) {
      processSearchData(res.data);
    });
  };

});
