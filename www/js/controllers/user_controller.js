/**
 * Created by paipeng on 04.02.15.
 */
angular.module('UserController', [])
    .controller('UserCtrl', function($scope, $rootScope, $ionicPlatform, $stateParams, AmUser, $filter, Poi, AmPOIState) {
        //$scope.Users = null;
        if ($rootScope.Users) {
            console.log("user valid");
            getUser();
        } else {
            console.log("find users");
            $rootScope.Users =  $scope.Users = AmUser.find(function(res) {
                console.log("get users succ " + angular.toJson(res, true));
                $rootScope.Users =  $scope.Users = res;
                getUser()
            });
        }

        function getUser() {
            $scope.user = $filter('filter')($scope.Users, function (d) {
                return d.id === parseInt($stateParams.userId);
            })[0];
            console.log("selected user " + angular.toJson($scope.user, true));

            if ($scope.user) {
                console.log("is user logged: " +$scope.user.isAuthenticated);
                /*
                $scope.userPOIs = Poi.amUser({id: 3}, function(res) {
                    console.log("get pois for this user succ " + angular.toJson(res, true));
                }, function(err) {
                    console.error("get pois for this user error " + err);
                });
                */
                Poi.count({where: {amUserId: $scope.user.id}}, function(res) {
                   console.log("get pois for this user count succ " + angular.toJson(res, true));
                    $scope.userHasPOI = res.count >0 ;

                }, function(err) {
                    console.log("get pois for this user count err " + err);

                });
                /*

                */
            }
        }


        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("UserCtrl document ready");
            AmPOIState.setSelectedMenu('user');

        });
    })