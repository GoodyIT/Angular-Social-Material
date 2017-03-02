//app.controller('statusCampaignCtrl', function ($scope, $rootScope, $http, CampaignService, UtilsService, $uibModal) {
//    $scope.maxDate = new Date();
//    $scope.maxDate.setDate($scope.maxDate.getDate()+60);          //limit schedule to within 60 days
//    $scope.minDate = new Date();
//    $scope.image = {type: 'url'};
//    $scope.selectedTab = "mycampaign";
//    My Campaigns Tab
//    var openMatchingModal = function(matches, users){
//        var campaign = $scope.selectedCampaign;
//        var uibModalInstance = $uibModal.open({
//            animation: true,
//            size: "lg",
//            templateUrl: '/app/matchingResultsModal.html',
//            controller: function($uibModalInstance ,$scope, $rootScope){
//                $scope.matches = matches;
//                $scope.users = users;
//                $scope.close = function () {
//                    $uibModalInstance.close();
//                };
//                $scope.alerts = [];
//                $scope.Math = Math;
//                $scope.selectMatch = function(match){
//                    match.loading = true;
//                    var application = {
//                        userId: match.userId,
//                        status: 'matching',
//                        campaignId: campaign.campaignId,
//                        facebookPageId: match.pageId
//                    };
//                    $scope.apiClient.campaignsApplicationPost({campaignId: campaign.campaignId}, application, {
//                            headers:{"Content-type": "application/json"}
//                        }
//                    ).then(function(res){
//                            if(!res.data.errorMessage){
//                                $scope.alerts.push({type:"success", msg:"Successfully waved to the user. Please go to Status to track the process."});
//                                match.loading = false;
//                                match.hasWaved = true;
//                            } else {
//                                $scope.alerts.push({type:"danger", msg:"Failed to wave to the user"});
//                                match.loading = false;
//                            }
//                            $scope.$apply();
//                        }).catch(function(res){
//                            $scope.alerts.push({type:"danger", msg:"Failed to wave to the user"});
//                            match.loading = false;
//                            $scope.$apply();
//                        });
//                }
//            },
//            resolve: {
//                matches: function() {
//                    return matches;
//                },
//                users: function() {
//                    return users;
//                }
//            }
//        });
//    };
//    $scope.openRejectModal = function(application){
//        var uibModalInstance = $uibModal.open({
//            animation: true,
//            templateUrl: "/app/rejectMessagePopUp.html",
//            controller: function($uibModalInstance ,$scope, $rootScope){
//                $scope.close = function () {
//                    $uibModalInstance.close();
//                };
//                $scope.application = application;
//                $scope.replyWithMessage = function(){
//                    var updatedApplication = {};
//                    angular.copy($scope.application, updatedApplication);
//                    updatedApplication.status = "rejected";
//                    updatedApplication.rejectMessage = $scope.rejectMessage;
//                    delete updatedApplication.updateTime;
//                    delete updatedApplication.createTime;
//                    delete updatedApplication.$$hashKey;
//                    delete updatedApplication.applicantProfile;
//                    $scope.apiClient.applicationPatch({applicationId: application.applicationId}, updatedApplication).then(function(res){
//                        $uibModalInstance.close();
//                        $scope.application.status = "rejected";
//                        $scope.$apply();
//                    });
//                };
//            },
//            resolve: {
//                application: function() {
//                    return application;
//                }
//            }
//        });
//
//    };
//    $scope.showCampaignStatus = function(campaign){
//        $scope.selectedMatch = null;
//        $scope.selectedCampaign = campaign;
//        if(campaign.type === 'pay'){
//        }
//        $scope.apiClient.campaignsApplicationGet({userId: "", status: ALL_STATUS + ",matching", campaignId: campaign.campaignId, type: ""}, {}, {
//            headers:{"Content-type": "application/json"}
//        }).then(function(res){
//                $scope.selectedCampaign.applications = res.data;
//                var users = {};
//                angular.forEach($scope.selectedCampaign.applications, function(apply){
//                    if(apply.userId){
//                        $http.get('/userDetails/'+ apply.userId).then(function(res){
//                            if(res.data){
//                                if(users[res.data._id]){
//                                    apply.applicantProfile = users[res.data._id];
//                                } else {
//                                    apply.applicantProfile = res.data.profile;
//                                    users[res.data._id] = res.data.profile;
//                                }
//                            }
//                        });
//                    }
//                    if(!apply.ownerPostContent && !apply.ownerPageId){
//                        angular.extend(apply, {ownerPostContent: "", ownerPageId:""});
//                    }
//                });
//                $scope.$apply();
//            });
//    };
//    $scope.findMatching = function(){
//        $scope.apiClient.usersocialGet({numberOfFollowers: $scope.selectedCampaign.numberOfFollowers, likes:"", ageRange:"0"}, {}, {
//            headers:{"Content-type": "application/json"}
//        }).then(function(res){
//                var userIds = [];
//                $scope.matchedPages = res.data;
//                angular.forEach(res.data, function(page){
//                    page.totalFollowerNum = 0;
//                    page.totalLocationNum = 0;
//                    page.chartData = [];
//                    if(userIds.indexOf(page.userId) === -1){
//                        userIds.push(page.userId);
//                    }
//                    angular.forEach(page.age, function(value, key){
//                        page.chartData.push({ key: key, y: value});
//                    });
////                angular.forEach(page.location, function(value,key){
////                    page.totalLocationNum += value;
////                });
//                    page.age = _.pairs(page.age);
////                page.location = _.pairs(page.location);
//
//                    page.chartOptions = {
//                        chart: {
//                            type: 'pieChart',
//                            height: 150,
//                            width:150,
//                            donut: true,
//                            x: function(d){return 'Age ' + d.key;},
//                            y: function(d){return d.y;},
//                            showLabels: false,
//                            duration: 500,
//                            showLegend: false,
//                            pie:{
//                                donutRatio: 0.64
//                            },
//                            valueFormat: d3.format('d'),
//                            margin:{left:0,top:0,bottom:0,right:0}
//                        }
//                    };
//                });
//                $scope.apiClient.usersGet({ids:userIds.join(), all:""}, {}, {
//                    headers:{"Content-type": "application/json"}
//                }).then(function(res){
//                        var users = {};
//                        if(res.data){
//                            angular.forEach(res.data, function(user){
//                                users[user.id] = user;
//                            });
//                        }
//                        openMatchingModal($scope.matchedPages, users);
//                    });
//            })
//    }
//$scope.acceptApply = function(application){
//    application.status = 'accepted';
//    var actionTime = new Date();
//    if(application.time === ''){
//        application.time = new Date();
//    }
//    actionTime.setDate(application.date.getDate());
//    actionTime.setHours(application.time.getHours());
//    actionTime.setMinutes(application.time.getMinutes());
//    var newApply = {
//        applicationId: application.applicationId,
//        status: 'accepted',
//        ownerActionTime:actionTime.getTime()+""
//    };
//    angular.extend(newApply, application);
//
//    delete newApply.applicantProfile;
//    delete newApply.date;
//    delete newApply.isCalendarOpened;
//    delete newApply.time;
//    delete newApply.updateTime;
//    delete newApply.createTime;
//
//    if($scope.image.type === 'file' && $scope.image.file){
//        var error = UtilsService.uploadImage($scope.image.file, application.applicationId, function(applicationImageUrl){
//            if(applicationImageUrl){
//                newApply.ownerImgUrl = applicationImageUrl;
//                acceptApplication(newApply);
//
//            }
//        }, function(errorMessage){
//            $rootScope.alerts.push({type:"danger", msg:errorMessage});
//
//        });
//        if(error && error.message){
//            $rootScope.alerts.push({type:"danger", msg:error.message});
//        }
//    } else {
//        acceptApplication(newApply);
//    }
//
//};
//
//    $scope.ownerSchedulePaidPost = function(application){
//        $http.post("/api/scheduleFacebookPosts", {"application": application}, {headers:{"Content-type": "application/json"}}).then(function(res){
//            $rootScope.alerts.push({type:"success", msg:"Post has been successfully scheduled. Trade will be completed and closed when contents are posted."});
//            application.status = "scheduled";
//            var updatedApplication = {};
//            angular.copy(application, updatedApplication);
//            delete updatedApplication.updateTime;
//            delete updatedApplication.createTime;
//            delete updatedApplication.$$hashKey;
//            delete updatedApplication.applicantProfile;
//            //Update application status
//            $scope.apiClient.applicationPatch({applicationId: updatedApplication.applicationId}, updatedApplication).then(function(res){
//                $scope.$apply();
//            });
//        });
//
//    };
//
//    var acceptApplication = function(application){
//        $scope.apiClient.applicationPatch({applicationId: application.applicationId}, application).then(function(res){
//            $rootScope.alerts.push({type:"success", msg:"Successfully accepted application. Please wait for the applicant to post to Facebook."});
//            $scope.$apply();
//            $scope.selectedCampaign.applications = [];
//            $scope.getMyCampaigns();
//        });
//    };
//$scope.deleteCampaign = function(campaign){
//    var updatedCampaign = {};
//    angular.copy(campaign, updatedCampaign);
//    delete updatedCampaign.updateTime;
//    delete updatedCampaign.createTime;
//    updatedCampaign.status = "removed";
//    $scope.apiClient.campaignPatch({}, updatedCampaign).then(function(res){
//        $scope.getMyCampaigns();
//        $scope.$apply();
//    });
//};
//});
