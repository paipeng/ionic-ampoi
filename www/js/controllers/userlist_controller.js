/**
 * Created by paipeng on 04.02.15.
 */
angular.module('UserListController', [])
    .controller('UserListCtrl', function($scope, $rootScope, $ionicPlatform, AmUser, AmPOIState) {
        $scope.Users = null;
        if ($rootScope.Users) {
        } else {
            $rootScope.Users =  $scope.Users = AmUser.find();
        }
        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("UserListCtrl document ready");
            AmPOIState.setSelectedMenu('userlist');
            if(!ionic.Platform.isAndroid()){

            }

        });

        function loadUsers() {
            $rootScope.Users =  $scope.Users = AmUser.find(function(res) {
                console.log("loadUsers success " + angular.toJson(res, true));
                $rootScope.Users =  $scope.Users = res;
            });
        }

        $scope.$watch('loginUser', function(newVal, oldVal){
            console.log('UserListCtrl loginUser watching: changed');
            loadUsers();
        }, true);
    })