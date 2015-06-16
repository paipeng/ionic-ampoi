/**
 * Created by paipeng on 10.02.15.
 */

angular.module('CameraController', [
        'ngCordova'
    ])
    .controller('CameraController', function($scope, $rootScope, $ionicPopup, $ionicModal, $translate, $stateParams, $ionicLoading, $ionicPlatform, Poi, LoopBackAuth, AmUser, Camera, AmPOIState) {

        document.addEventListener("deviceready", onDeviceReady, false);


        console.log("platform " + ionic.Platform.isAndroid() + " ios " + ionic.Platform.isIOS());
        if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
            $scope.cameraOptions = {
                quality: 75,
                destinationType : navigator.camera.DestinationType.DATA_URL,
                sourceType : navigator.camera.PictureSourceType.CAMERA,
                encodingType: navigator.camera.EncodingType.JPEG,
                popoverOptions: navigator.camera.CameraPopoverOptions,
                targetWidth: 320,
                targetHeight: 320,
                correctOrientation: true,
                saveToPhotoAlbum: false
            };
        }


        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("CameraController document ready");
            takePhoto();
        });

        function onDeviceReady() {
            console.log("CameraController deviceready");

        }

        function takePhoto() {
            if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
                Camera.getPhoto($scope.cameraOptions).then(function(imageURI) {
                    //console.log(imageURI);
                    $scope.lastPhoto = imageURI;

                    var image = document.getElementById('myImage');
                    image.src = "data:image/jpeg;base64," + imageURI;
                    //image.src = imageURI;
                }).catch(function(err) {
                    console.log(err);
                });
            } else {
                alert("platform doesn't support taking photo");
            }
        }

        $scope.$watch(function () { return AmPOIState.getCamera(); }, function (newValue) {
            console.log("watch menu " + newValue);
            if (newValue) {
                takePhoto()
            }
        });
    });
