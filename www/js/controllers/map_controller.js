/**
 * Created by paipeng on 04.02.15.
 */


angular.module('MapController', [])
    .controller('MapController', function($scope, $rootScope, $ionicPopup, $ionicModal, $translate, $stateParams, $ionicLoading, $ionicPlatform, Poi, LoopBackAuth, AmUser, AmPOIState, $localstorage) {
        $scope.POIs = [];
        $scope.map = null;
        $scope.markers = [];
        $scope.filterUserId = null;

        $scope.myLocationMarker = null;
        $rootScope.loginUser = LoopBackAuth.accessTokenId;

        console.log("userid in map " + parseInt($stateParams.userId));

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_filter_user.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_filter_user = modal;
        });


    $ionicPlatform.ready(function() {
        // ready for cordova plugin
        console.log("document ready");
        AmPOIState.setSelectedMenu('map');

        if(!ionic.Platform.isAndroid()){
            /*
             navigator.splashscreen.show();

             setTimeout(function() {
             navigator.splashscreen.hide();
             }, 2000);
             */

        }

        initialize();

        if ($rootScope.POIs) {
            $scope.POIs = $rootScope.POIs
        } else {
            $rootScope.POIs =  Poi.find(function(res) {
                $rootScope.POIs = $scope.POIs = res;

                if ($scope.POIs && $scope.map) {
                    for (var i = 0; i < $scope.POIs.length; i++) {
                        $scope.markers.push(createMarker($scope.POIs[i], $scope.map, i));
                    }
                }
            });


        }

        if ($scope.POIs && $scope.map) {
            for (var i = 0; i < $scope.POIs.length; i++) {
                $scope.markers.push(createMarker($scope.POIs[i], $scope.map, i));
            }
        } else {
            console.log("POIs " + angular.toJson($scope.POIs, true));
        }


    });

    //google.maps.event.addDomListener(window, 'load', initialize);

    $scope.googleMapReady = function() {
        console.log("googleMapReady callback");
    }
    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function(error) {
            //alert('Unable to get location: ' + error.message);
        });
    };

        $scope.filterUser = function() {

            $rootScope.Users =  $scope.Users = AmUser.find(function(res) {
                console.log("loadUsers success " + angular.toJson(res, true));
                $rootScope.Users =  $scope.Users = res;
                $scope.modal_filter_user.show();

            });
        }

        $scope.doFilterUser = function(userId) {
            console.log("doFilterUser " + userId);
            $scope.filterUserId = userId;

            $scope.modal_filter_user.hide();

            addAllMarker();
        }
        $scope.doFilterUserReset = function() {
            $scope.filterUserId = null;
            $scope.modal_filter_user.hide();

            addAllMarker();
        }

        function addAllMarker() {

            if ($scope.POIs && $scope.map) {
                // Removes the markers from the map, but keeps them in the array.
                for (var i = 0; i < $scope.markers.length; i++) {
                    $scope.markers[i].setMap(null);
                }

                for (var i = 0; i < $scope.POIs.length; i++) {
                    if ($scope.filterUserId && $scope.filterUserId == $scope.POIs[i].amUserId) {
                        $scope.markers.push(createMarker($scope.POIs[i], $scope.map, i));
                    } else if ($scope.filterUserId == null) {
                        $scope.markers.push(createMarker($scope.POIs[i], $scope.map, i));
                    }

                }
            }
        }

    function initialize() {
        console.log("initialize google map");
        var myLatlng = new google.maps.LatLng(52.506192, 13.332400);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeControl: false,
            //clickable:false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var longpress = false;


        /*
         google.maps.event.addListener(map, 'dblclick', function(evt) {
         console.log("dblclick " + evt.latLng.lat() + " " + evt.latLng.lng());
         //map.setCenter(marker.getPosition());
         });


         google.maps.event.addListener(map, 'mousedown', function(event){
         console.log("mousedown");
         start = new Date().getTime();
         });

         google.maps.event.addListener(map, 'mouseup', function(event){

         end = new Date().getTime();
         console.log("time diff " + (end - start));
         longpress = (end - start < 50) ? false : true;

         (longpress) ? console.log("Long Press") : console.log("Short Press");

         });

        */
        google.maps.event.addListener(map,'click', function (event) {
            console.log("click");
            if ($rootScope.loginUser) {
                addMarker(event);
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('title_permission_denied'),
                    template: $translate.instant('subtitle_permission_denied')
                });
                alertPopup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            }
        });




        // html5
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("getCurrentPosition " + position.coords.latitude + "," + position.coords.longitude)
            var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            map.setCenter(currentLocation);


            if ($scope.myLocationMarker)  {
                $scope.myLocationMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            } else {
                $scope.myLocationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    map: map,
                    title: "My Location"
                });
            }

        });

        function geo_success(position) {
            console.log("getCurrentPosition " + position.coords.latitude + "," + position.coords.longitude)

            if ($scope.myLocationMarker)  {
                $scope.myLocationMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            } else {
                $scope.myLocationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    map: map,
                    title: "My Location"
                });
            }
            var distance = -1;

            if ($scope.POIs) {
                for (var i = 0; i < $scope.POIs.length; i++) {
                    var d = calculateDistance(position.coords.latitude,
                        position.coords.longitude,
                        $scope.POIs[i].geopoint.lat,
                        $scope.POIs[i].geopoint.lng
                    )
                    if (distance == -1) {
                        distance = d;
                    } else {
                        if (distance > d) {
                            distance = d;
                        }

                    }
                }
                console.log("min distance to poi " + distance);
                if (distance < 5.5) {
                    playAlertSound();
                }
            }
        }

        function geo_error(err) {
            console.log("get gps position error " + angular.toJson(err, true));
            //alert("Sorry, no position available.");
        }

        var geo_options = {
            enableHighAccuracy: true,
            maximumAge        : 30000,
            timeout           : 27000
        };
        var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);


        $scope.map = map;
    }

        function addMarker(evt) {
            showAddMarkerDialog(evt);
        }

        function showAddMarkerDialog(evt) {
            $scope.newPoi = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="newPoi.name">',
                title: $translate.instant('title_add_new_poi'),
                subTitle: $translate.instant('subtitle_add_new_poi'),
                scope: $scope,
                buttons: [
                    { text:  $translate.instant('button_cancel') },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.newPoi.name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.newPoi.name;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
                if (res) {
                    createPOI(evt.latLng.lat(), evt.latLng.lng(), res);
                } else {
                    console.log("input invalid");
                }
            });
            /*
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
            */
        }

        function createPOI(lat, lng, name) {
            // , created: Date.now()
            var newPoi = {name: name,
                geopoint: {lat: lat, lng: lng},
                type: 0,
                amUserId: LoopBackAuth.currentUserId};
            var userToken = $localstorage.getObject("token");
            if (!angular.equals({}, userToken)) {
              newPoi.token = userToken.token;
            }
            Poi.create(newPoi, function(res) {
                console.log("create Poi succ  " + angular.toJson(res, true));
                if ($rootScope.POIs) {
                    $rootScope.POIs.push(res);
                } else {
                    $rootScope.POIs = [];
                    $rootScope.POIs.push(res);
                }
                createMarker(res, $scope.map, $rootScope.POIs.length-1);
                $scope.POIs = $rootScope.POIs
            }, function(err) {
                console.error("create Poi error " + angular.toJson(err, true));
            })
        }

    function createMarker(poi, map, index) {
        console.log("createMarker " + angular.toJson(poi, true));
        console.log("poi " + poi.geopoint.lat + " " + poi.geopoint.lng);
        console.log("poi userid  " + poi.amUserId);

        var myLatlng = new google.maps.LatLng(poi.geopoint.lat, poi.geopoint.lng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: poi.name,
            icon: (index==0)?'http://maps.google.com/mapfiles/ms/icons/green-dot.png':'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        if (index == 0) {
            map.setCenter(myLatlng);
        }
        google.maps.event.addListener(marker, 'click', function() {
            if ($scope.infowindow) {
                $scope.infowindow.close();
            }

            $scope.infowindow = new google.maps.InfoWindow({
                content: poi.name
            });

            $scope.infowindow.open(map, marker);
        });

        return marker;
    }

    function playAlertSound() {
        console.log("playAlertSound");
        var url = '';

        if(ionic.Platform.isAndroid()){
            url = "/android_asset/www/";
        }

        url = url + 'audio/airhorn.mp3';
        console.log("play audio url " + url);
        //$scope.play(url);
    }


    $scope.play = function(src) {
        var media = new Media(src, null, null, mediaStatusCallback);

        media.play();
    }

    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }

    $scope.showAbout = function() {
        var alertPopup = $ionicPopup.alert({
            title: $translate.instant('about'),
            template: $translate.instant('about_content')
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    }

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

        $scope.takePhoto = function() {


        }

        $scope.$watch(function () { return AmPOIState.getPOI(); }, function (newValue) {
            console.log("watch menu " + newValue);
            if (newValue) {
                if ($rootScope.loginUser) {
                    $scope.showPopup();
                } else {
                    alert("Please login at first");
                }
                //generatePOIs(10);
            }
        });


        // Triggered on a button click, or some other target
        $scope.showPopup = function() {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.wifi">',
                title: 'Generate dummy POIs',
                subTitle: 'Please set number of POIs',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
                if (res) {
                    console.log("number " + parseInt(res));
                    generatePOIs(parseInt(res));
                }
            });
        };

        function randomBetween(min, max) {
            var factor = 100000;
            var random = null;
            min = min * factor;
            max = max * factor;

            if (min < 0) {
                random = min + Math.random() * (Math.abs(min)+max);
            }else {
                random = min + Math.floor(Math.random() * Math.abs(max-min));//Math.random() * max;
            }
            return random/factor;
        }

        function generatePOIs(count) {
            if ($scope.map) {
                console.log("map bound: " + $scope.map.getBounds());

                var mapBound = $scope.map.getBounds();

                console.log("lat min " + mapBound.getSouthWest().lat());
                console.log("lat max " + mapBound.getNorthEast().lat());
                //mapBound.getNorthEast().lat()
                //mapBound.getSouthWest().lat()

                for (var i = 0; i < count; i++) {
                    var lat = randomBetween(mapBound.getSouthWest().lat(), mapBound.getNorthEast().lat());
                    var lng = randomBetween(mapBound.getSouthWest().lng(), mapBound.getNorthEast().lng());
                    console.log("random " + lat + ", " + lng);

                    createPOI(lat, lng, "random POI");
                    /*
                    var p = [];
                    p.geopoint = [];
                    p.geopoint.lat = lat;
                    p.geopoint.lng = lng;
                    p.name = "random POI";
                    createMarker(p, $scope.map, -1);
                    */
                }
            }
        }

})
