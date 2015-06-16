/**
 * Created by paipeng on 04.02.15.
 */

angular.module('POIListController', [])
.controller('POIListCtrl', function($scope, $rootScope, $ionicPlatform, Location, Poi, AmPOIState) {
        $scope.POIs = [];
        $scope.offset = 0;
        $scope.limit = -1;


        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("POIListCtrl document ready");
            AmPOIState.setSelectedMenu('poilist');

            //$scope.limit = 10;
            loadPOIs($scope.offset, $scope.limit);
            /*
            if ($rootScope.POIs) {
                console.log("pois " + angular.toJson($rootScope.POIs, true));
                $scope.POIs = $rootScope.POIs;
            } else {
                $rootScope.POIs =  $scope.POIs = Poi.find(function(res) {
                    $rootScope.POIs =  $scope.POIs = res;
                });
            }
            */
        });

        $scope.loadMore = function() {
            //console.log("loadMore");
            if ($scope.limit > 0) {
                loadPOIs($scope.offset, $scope.limit);
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }

        $scope.moreDataCanBeLoaded = function() {
            console.log("moreDataCanBeLoaded");
            //loadPOIs($scope.offset, $scope.limit);
        }

        function loadPOIs(offset, limit) {
            console.log("loadPOIs!! " + offset + " " + limit);

            var filter = {};
            if (limit < 0) {
                filter = {filter: {offset: offset}};
            } else {
                filter = {filter: {offset: offset, limit: limit}};
            }

            Poi.find(filter, function(res) {
                //console.log("Poi find done " + res);
                if (res) {
                    if (res.length > 0) {
                        $scope.offset = offset + res.length;
                    } else {
                        $scope.limit = -1;
                    }

                    if ($rootScope.POIs) {
                        //$rootScope.POIs.concat(res);
                        $rootScope.POIs.push.apply($rootScope.POIs, res);
                        $scope.POIs = $rootScope.POIs;

                    } else {
                        $rootScope.POIs =  $scope.POIs = res;
                    }
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.resize');
            }, function(err) {
                console.log("loadPOIs!!!! err " + angular.toJson(err, true));
            });
        }

        $scope.getItemHeight = function(item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            return (index % 2) === 0 ? 50 : 50;
        };
});
