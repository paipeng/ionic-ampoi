/**
 * Created by paipeng on 11.02.15.
 */


angular.module('AboutController', [
        'ngCordova'
    ])
    .controller('AboutCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaAppVersion, AmPOIState) {
        $scope.appVersion = '';
        document.addEventListener("deviceready", function () {
            console.log("deviceready");
            $cordovaAppVersion.getAppVersion().then(function (version) {
                $scope.appVersion = version;
                console.log("appVersion " + $scope.appVersion);
                //alert("appVersion " + $scope.appVersion);
            });


            var echo = window.cordova.plugins.Echo;
            echo.coolMethod("echo", function(ret) {
                console.log("coolMethod result " + ret);
            }, function(err) {
                console.error("coolMethod error " + err);
            });


            var am_add = window.cordova.plugins.am_add;
            am_add.coolMethod(1, 2, function(ret) {
                console.log("coolMethod result " + ret);
            }, function(err) {
                console.error("coolMethod error " + err);
            });
        }, false);

        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("AboutCtrl document ready");

            AmPOIState.setSelectedMenu('about');
        });
    })
