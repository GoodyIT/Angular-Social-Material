app.directive('searchResultCard',  ['$rootScope', '$location', function($rootScope, $location) {
  return {
    restrict: 'AE',
    scope: {
          page: '=',
          keyword: '@',
          displayedPages: '=',
          listView: '='

        },
    templateUrl: '/app/directives/searchResultCardTemplate.html?'+new Date().getTime() ,
    link: function (scope, el, attrs) {

    },
    controller: function($scope){
        $scope.goToDetailsPage = function(page){
            FP.analytics.track('User see details of celebrity', page.name, {
                              category: 'Search',
                              action: 'click details',
                              label: 'Celebrity Details',
                              value: null
                            });
            var allPagesIds = [];
            $scope.displayedPages.map(function(page){
                allPagesIds.push(page.id);
            });
            $rootScope.apiClientV2.facebookHistoryPost({},
                {"id": $rootScope.user? $rootScope.user.id : "",
                   "pageSelected": [page.id],
                   "pageShow": allPagesIds,
                   "query": [$scope.keyword],
                   "sessionId": new Date().getTime()+""}, {
                  headers: {
                    'Content-type': 'application/json'
                  }
                }).then(function (res) {
                  if(res){
                   $rootScope.currentCelebPage = page;
                   $rootScope.currentSearchKeyword = $scope.keyword;
                   $location.path('/celebDetails').search({pageId: page.id, keyword: $scope.keyword});
                   $rootScope.$apply();
                  }
                });
         };
    }
  };
}]);