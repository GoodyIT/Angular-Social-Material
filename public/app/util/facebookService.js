angular.module('app').factory('facebookService', function($q) {
     return {
         searchPages: function(q) {
             var deferred = $q.defer();
             var fields = [
                    "id",
                    "name",
                    "page",
                    "picture.type(large)",
                    "fan_count",
                    "posts{id,name,full_picture,shares,created_time,reactions.summary(total_count).limit(0).as(reactions)}",
                    "about",
                    "new_like_count",
                    "talking_about_count",
                    "rating_count",
                    "category",
                    "link",
                    "is_verified",
                    // "category_list",
                    // "current_location",
                    // "description",
                    // "is_community_page",
                    "engagement"
                ];
             FB.api('/v2.8/search', {
                 type: 'page',
                 q: q,
                 fields: fields.join(", "),
                 access_token: "180432115648514%7Cr5caVLXqgzE-kj0mKCW1sVuwczE"
             }, function(response) {
                 if (!response || response.error) {
                     deferred.reject('Error occured');
                 } else {
                     deferred.resolve(response);
                 }
             });
             return deferred.promise;
         },
         getPagePicture : function(pageId){
            var deferred = $q.defer();
            FB.api('/'+pageId+"/", {
                fields: 'picture.type(large), likes, category, posts',
                access_token: "180432115648514%7Cr5caVLXqgzE-kj0mKCW1sVuwczE"
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                   deferred.resolve(response);
                }
            });
            return deferred.promise;
         }
     }
 });