angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicPlatform, $state, $ionicModal, $timeout, $translate, $ionicPopup, $ionicSideMenuDelegate, AmUser, LoopBackAuth, AmPOIState, $cordovaDialogs, $cordovaPush, $cordovaMedia, $cordovaToast, $http, $localstorage) {
      // Form data for the login modal
        $scope.loginData = {};
        $scope.registration = {};

        $scope.rightButton = false;

        $rootScope.loginUser = LoopBackAuth.accessTokenId;

        $scope.notifications = [];

        /*
        $scope.$watch(function () { return AmPOIState.getSelectedMenu(); }, function (newValue) {
            console.log("watch menu " + newValue);
            if (newValue) {
                //alert("selectedMenu watched " + newValue);
                $scope.rightButton = newValue;
            }
        });
        */


        $ionicPlatform.ready(function() {
            // ready for cordova plugin
            console.log("AppCtrl document ready");
            AmPOIState.setSelectedMenu('app');

            var userToken = $localstorage.getObject("token");
            if (!angular.equals({}, userToken)) {
                console.log("already registered push token " + angular.toJson(userToken, true));
                //doRegisterPush();
            } else {
                doRegisterPush();
            }

        });

        $scope.changeMenu = function(url) {
            console.log("changeMenu " + url);
            $scope.rightButton = url;

        }

        console.log("LoopBackAuth.accessTokenId  " + LoopBackAuth.accessTokenId);
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal_register = modal;
        });


      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login ' + $scope.loginData);
          userLogin($scope.loginData.email, $scope.loginData.password);

      };

        function userLogin(username, password) {
          var userToken = $localstorage.getObject("token");
          var loginUser = {
                  username: username,
                  password: password,
                  ttl: 1209600000,
                  token: userToken.token
              };

            console.log("userLogin " + angular.toJson(loginUser, true));
            $scope.loginResult = AmUser.login(loginUser,
                function (res) {
                    console.log("login succ " + angular.toJson(res, true));
                    $rootScope.loginUser = LoopBackAuth.accessTokenId;
                },
                function (err) {
                    console.error("login user error " + angular.toJson(err, true));
                }
            );
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        }

      $scope.register = function() {
          console.log("do signup");
          $scope.modal.hide();
          $scope.modal_register.show();
      }
        $scope.closeRegistration = function() {
            $scope.modal_register.hide();
        };


        $scope.doRegister = function() {
            console.log("doRegister " + angular.toJson($scope.registration, true));
            $scope.modal_register.hide();

            //$scope.registration.created = $scope.registration.lastUpdated =  Date.now();

            $scope.user = AmUser.create($scope.registration, function (res) {
                    console.log("create user succ " + angular.toJson(res, true));
                    userLogin(res.username, $scope.registration.password);
                }, function (err) {
                    console.error("create user error " + angular.toJson(err, true));
                });
        };

        $scope.logout = function() {
            console.log("logout " + angular.toJson($scope.registration, true));
            // A confirm dialog
            confirmLogout();
        };

        function confirmLogout() {
            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('menu_title_logout'),
                template: $translate.instant('confirm_logout_message')
            });
            confirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $rootScope.loginUser = null;
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.takePhoto = function() {
            AmPOIState.updateCamera();
        };

        $scope.createPoi = function() {
            console.log("createPoi");
            AmPOIState.updatePOI();
        };



        // Register
        $scope.registerPush = function () {
            doRegisterPush();
        };

        function doRegisterPush() {
            var config = null;

            if (ionic.Platform.isAndroid()) {
                config = {
                    "senderID": "1041007483900" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
                };
            }
            else if (ionic.Platform.isIOS()) {
                config = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true"
                }
            }

            $cordovaPush.register(config).then(function (result) {
                console.log("Register success " + result);

                $cordovaToast.showShortCenter('Registered for push notifications');
                $scope.registerDisabled=true;
                // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                if (ionic.Platform.isIOS()) {
                    $scope.regId = result;
                    storeDeviceToken("ios");
                }
            }, function (err) {
                console.log("Register error " + err)
            });
        }

        // Notification Received
        $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            console.log("push notification received " + JSON.stringify([notification]));
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.alert));
                })
            }
        });

        // Android Notification Received Handler
        function handleAndroid(notification) {
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
            console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);


            if (notification.event == "registered") {
                $scope.regId = notification.regid;
                storeDeviceToken("android");
            }
            else if (notification.event == "message") {
                if (isOwnEvent(notification.payload.push.amUserId)) {
                    return;
                }

                if (notification.payload.sound) {
                    playAlertSound(notification.payload.sound);
                }
                $cordovaDialogs.alert(notification.message, "Push Notification Received");
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.message));
                })
            }
            else if (notification.event == "error")
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
        }

        function isOwnEvent(userId) {
            console.log("userId " + userId + " currentUserId " + LoopBackAuth.currentUserId);

            if (userId.toString() === LoopBackAuth.currentUserId) {
                console.log("event from current user, not handle push notification");
                return true;
            } else {
                return false;
            }
        }

        // IOS Notification Received Handler
        function handleIOS(notification) {
            // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
            // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
            // the notification when this code runs (weird).
            console.log("AppCtrl document ready handleIOS");
            if (isOwnEvent(notification.amUserId)) {
                return;
            }
            if (notification.foreground == "1") {
                // Play custom audio if a sound specified.
                if (notification.sound) {

            /*
                    var p = notification.sound; // cordova.file.applicationDirectory +
                    console.err("path " + p);
                    var mediaSrc = $cordovaMedia.newMedia(p);
                    if (mediaSrc) {
                        mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
                    } else {
                        console.err("mediaSrc invalid");
                    }
             */
                    playAlertSound(notification.sound);
                }

                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

                if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                        console.log("Set badge success " + result)
                    }, function (err) {
                        console.log("Set badge error " + err)
                    });
                }
            }
            // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
            // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
            // the data in this situation.
            else {
                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
            }
        }

        // Stores the device token in a db using node-pushserver (running locally in this case)
        //
        // type:  Platform type (ios, android etc)
        function storeDeviceToken(type) {
            // Create a random userid to store with it
            var randomUserId = 'user' + Math.floor((Math.random() * 10000000) + 1);
            var userId = LoopBackAuth.currentUserId?LoopBackAuth.currentUserId:randomUserId;
            var user = { user: $scope.regId, type: type, token: $scope.regId };
            //var user = { user: $scope.regId, type: type, token: $scope.regId };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post('http://shared.canobus.com:8000/subscribe', JSON.stringify(user))
                .success(function (data, status) {
                    console.log("Token stored, device is successfully subscribed to receive push notifications.");
                    $localstorage.setObject('token', user);

                })
                .error(function (data, status) {
                    console.log("Error storing device token." + data + " " + status)
                }
            );
        }

        // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
        // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
        // time the app opens which this currently does. However in many cases you will always receive the same device token as
        // previously so multiple userids will be created with the same token unless you add code to check).
        function removeDeviceToken() {
            var tkn = {"token": $scope.regId};
            $http.post('http://shared.canobus.com:8000/unsubscribe', JSON.stringify(tkn))
                .success(function (data, status) {
                    console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
                    $localstorage.setObject('token', null);
                })
                .error(function (data, status) {
                    console.log("Error removing device token." + data + " " + status)
                }
            );
        }

        // Unregister - Unregister your device token from APNS or GCM
        // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
        //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
        //
        // ** Instead, just remove the device token from your db and stop sending notifications **
        $scope.unregisterPush = function () {
            console.log("Unregister called");
            removeDeviceToken();
            $scope.registerDisabled=false;
            //need to define options here, not sure what that needs to be but this is not recommended anyway
//        $cordovaPush.unregister(options).then(function(result) {
//            console.log("Unregister success " + result);//
//        }, function(err) {
//            console.log("Unregister error " + err)
//        });
        };


        function playAlertSound(notification_sound) {
            console.log("playAlertSound");
            var url = 'audio/';

            if(ionic.Platform.isAndroid()){
                url = "/android_asset/www/audio/";
            }

            url = url + notification_sound;
            console.log("play audio url " + url);

            var media = new Media(url, null, null, mediaStatusCallback);

            media.play();
        }


        var mediaStatusCallback = function(status) {
            if(status == 1) {
                $ionicLoading.show({template: 'Loading...'});
            } else {
                $ionicLoading.hide();
            }
        };

    })
