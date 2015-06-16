/**
 * Created by paipeng on 04.02.15.
 */





angular.module('POIController', [])
    .controller('POICtrl', function($scope, $rootScope, $ionicPlatform, Location, Poi, $stateParams, $filter, AmPOIState) {

        if ($rootScope.POIs) {
            //$scope.POIs = $rootScope.POIs
        } else {
            $rootScope.POIs =   Poi.find();
        }

        console.log("POICtrl route poiId: " + $stateParams.poiId);
        //console.log("pois " + angular.toJson($scope.POIs, true));
        $scope.poi = $filter('filter')($scope.POIs, function (d) {
            return d.id === parseInt($stateParams.poiId);
        })[0];

        console.log("selected poi " + angular.toJson($scope.poi, true));

        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("POICtrl document ready");

            console.log($scope.POIs);

            AmPOIState.setSelectedMenu('poi');

        });
    })