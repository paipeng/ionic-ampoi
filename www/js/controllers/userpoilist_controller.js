/**
 * Created by paipeng on 05.02.15.
 */


angular.module('UserPOIListController', [])
    .controller('UserPOIListCtrl', function($scope, $rootScope, $ionicPlatform, Location, Poi, $stateParams, AmPOIState) {
        $scope.userPOIs = [];


        console.log("UserPOIListCtrl route poiId: " + $stateParams.userId);
        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("UserPOIListCtrl document ready");
            AmPOIState.setSelectedMenu('userpoilist');

            Poi.find({filter:{where: {amUserId: $stateParams.userId}}}, function(res) {
                console.log("get pois for this user succ " + angular.toJson(res, true));
                $scope.userPOIs = res;
            }, function(err) {
                console.error("get pois for this user error " + err);
            });

        });
    })