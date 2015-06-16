angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
    .controller('PetIndexCtrl', function($scope, PetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.pets = PetService.all();
    })


// A simple controller that shows a tapped item's data
    .controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.pet = PetService.get($stateParams.petId);
    });


angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('PetService', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var pets = [
            { id: 0, title: 'Cats', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
            { id: 1, title: 'Dogs', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
            { id: 2, title: 'Turtles', description: 'Everyone likes turtles.' },
            { id: 3, title: 'Sharks', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }
        ];

        return {
            all: function() {
                return pets;
            },
            get: function(petId) {
                // Simple index lookup
                return pets[petId];
            }
        }
    });

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers'])


    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "tabs.html"
            })

            // the pet tab has its own child nav-view and history
            .state('tab.pet-index', {
                url: '/pets',
                views: {
                    'pets-tab': {
                        templateUrl: 'pet-index.html',
                        controller: 'PetIndexCtrl'
                    }
                }
            })

            .state('tab.pet-detail', {
                url: '/pet/:petId',
                views: {
                    'pets-tab': {
                        templateUrl: 'pet-detail.html',
                        controller: 'PetDetailCtrl'
                    }
                }
            })

            .state('tab.adopt', {
                url: '/adopt',
                views: {
                    'adopt-tab': {
                        templateUrl: 'adopt.html'
                    }
                }
            })

            .state('tab.about', {
                url: '/about',
                views: {
                    'about-tab': {
                        templateUrl: 'about.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/pets');

    });
