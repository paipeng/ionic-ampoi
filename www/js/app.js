// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', [
    'ionic',
    'pascalprecht.translate',
    'AboutController',
    'starter.controllers',
    'starter.services',
    'MapController',
    'POIListController',
    'POIController',
    'UserListController',
    'UserController',
    'UserPOIListController',
    'CameraController',
    'camera.service',
    'state.service',
    'lbServices',
    'ngCordova',
    'ionic.utils'
]);

var appVersion = "0.0.0";

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
        console.log("window.cordova valid");
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider, $translateProvider, $provide) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.poilist', {
            url: "/poilist",
            views: {
                'menuContent': {
                    templateUrl: "templates/poilist.html",
                    controller: 'POIListCtrl'
                }
            }
        })
      .state('app.poi', {
          url: "/poilist/:poiId",
          views: {
              'menuContent': {
                  templateUrl: "templates/poi.html",
                  controller: 'POICtrl'
              }
          }
      })

      .state('app.userlist', {
          url: "/userlist",
          views: {
              'menuContent': {
                  templateUrl: "templates/userlist.html",
                  controller: 'UserListCtrl'
              }
          }
      })
      .state('app.user', {
          url: "/userlist/:userId",
          views: {
              'menuContent': {
                  templateUrl: "templates/user.html",
                  controller: 'UserCtrl'
              }
          }
      })
        .state('app.userpoilist', {
            url: "/userpoilist/:userId",
            views: {
                'menuContent': {
                    templateUrl: "templates/userpoilist.html",
                    controller: 'UserPOIListCtrl'
                }
            }
        })
  .state('app.map', {
    url: "/map",
    views: {
      'menuContent': {
        templateUrl: "templates/map.html",
        controller: 'MapController'
      }
    }
  })

        .state('app.camera', {
            url: "/camera",
            views: {
                'menuContent': {
                    templateUrl: "templates/camera.html",
                    controller: 'CameraController'
                }
            }
        })

        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/setting.html",
                    controller: 'AppCtrl'
                }
            }
        })

      .state('app.about', {
          url: "/about",
          views: {
              'menuContent': {
                  templateUrl: "templates/about.html",
                  controller: 'AboutCtrl'
              }
          }
      });


  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/app/poilist');

    /*
    $provide.decorator("$exceptionHandler", function($delegate, $injector) {
        return function(exception, cause) {

            if (false) { //(appState !== "...") { // We want to only send the error in this case

                $delegate(exception, cause);

            } else {
                //appState == null;

                var MyCordovaService = $injector.get("MyCordovaService");

                console.debug({reason: exception, message: exception.message, stack: exception.stack});

                var data = {
                    message: "Exception: " + exception.message,
                    stack: exception.stack
                };

                // here we send report to native side
                MyCordovaService.reportClientError(data).then(function(data) {
                    console.debug('reportClientError success', data);
                }, function(error) {
                    console.debug('reportClientError fail!', error);
                });

                // Call The original Angular Exception Handler
                $delegate(exception, cause);
            }
        };
    });
    */



    // catch exceptions in angular
    $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
        return function(exception, cause){
            $delegate(exception, cause);

            var data = {
                type: 'angular',
                url: window.location.hash,
                localtime: Date.now()
            };
            if(cause)               { data.cause    = cause;              }
            if(exception){
                if(exception.message) { data.message  = exception.message;  }
                if(exception.name)    { data.name     = exception.name;     }
                if(exception.stack)   { data.stack    = exception.stack;    }
            }

            console.log('exception', data);
            window.alert('Error: '+data.message);
            /*
            if(debug){

            } else {
                track('exception', data);
            }
            */
        };
    }]);
// catch exceptions out of angular
    window.onerror = function(message, url, line, col, error){
        var stopPropagation = false;//debug ? false : true;
        var data = {
            type: 'javascript',
            url: window.location.hash,
            localtime: Date.now()
        };
        if(message)       { data.message      = message;      }
        if(url)           { data.fileName     = url;          }
        if(line)          { data.lineNumber   = line;         }
        if(col)           { data.columnNumber = col;          }
        if(error){
            if(error.name)  { data.name         = error.name;   }
            if(error.stack) { data.stack        = error.stack;  }
        }

        console.log('exception', data);
        window.alert('Error: '+data.message);
        /*
        if(debug){

        } else {
            //track('exception', data);
        }
        */
        return stopPropagation;
    };

    $translateProvider.translations('en', {
        title: "Berlin Map",
        about: "About",
        about_content: "test",
        username: "Username",
        email: "Email",
        password: "Password",
        login: "Log in",
        register: "Sign up",
        menu: "Menu",
        menu_title_login: "Login",
        menu_title_logout: "Logout",
        menu_title_register: "Register",
        menu_title_list: "POI list",
        menu_title_map: "Map",
        menu_title_camera: "Camera",
        menu_title_settings: "Settings",
        menu_title_about: "About",
        menu_title_user_list: "User list",
        confirm_logout_message: "Are you sure you want to eat this ice cream?",
        title_add_new_poi: "Add new POI",
        subtitle_add_new_poi: "Please input a name to new POI",
        button_cancel: "Cancel",
        title_permission_denied: "Function not allowed",
        subtitle_permission_denied: "Please login at first",
        user_without_poi: "This user doesn't have any POIs",
        model_filter_user_title: "Filter POIs for user",
        model_filter_user_reset: "Reset"
    });
    $translateProvider.translations('de', {
        title: "Karte",
        about: "Über",
        about_content: "test",
        username: "Benutzername",
        email: "Email",
        password: "Passwort",
        login: "Anmelden",
        register: "Registration",
        menu: "Menü",
        menu_title_login: "Anmelden",
        menu_title_logout: "Abmelden",
        menu_title_register: "Registration",
        menu_title_list: "POI list",
        menu_title_map: "Karte",
        menu_title_camera: "Kamera",
        menu_title_settings: "Einstellungen",
        menu_title_about: "Über",
        menu_title_user_list: "Benutzer List",
        confirm_logout_message: "Sind Sie sicher, abmelden?",
        title_add_new_poi: "Neu POI",
        subtitle_add_new_poi: "Bitte einen Name für POI eingeben",
        button_cancel: "Abbrechen",
        title_permission_denied: "Funktion nicht erlaubt",
        subtitle_permission_denied: "Bitte anmelden zurerst",
        user_without_poi: "Dieser Benutzer hat keine POIs",
        model_filter_user_title: "Filter POIs für Benutzer",
        model_filter_user_reset: "Reset"
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
