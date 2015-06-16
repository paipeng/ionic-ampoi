/**
 * Created by paipeng on 02.02.15.
 */
angular.module('starter.services', [])
    .factory('POI', ['$http', function($http) {
        var url = '';

        if(ionic.Platform.isAndroid()){
            url = "/android_asset/www/";
        }

        var json = url + 'pois.json';
        var data = null;

        return {
            all: function() {
               return $http.get(json).success(function(response){
                    //do something with response
                    console.log("json " + angular.toJson(response, true));
                    return response;
                });
            },
            get: function(poiId) {
                // Simple index lookup
                return null;//pois[poiId];
            }
        }
    }]);