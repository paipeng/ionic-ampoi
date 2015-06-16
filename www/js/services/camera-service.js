/**
 * Created by paipeng on 10.02.15.
 */


angular.module('camera.service', [])

    .factory('Camera', ['$q', function($q) {

        return {
            getPhoto: function(options) {
                var q = $q.defer();
                console.log("options " + angular.toJson(options, true));

                navigator.camera.getPicture(function(result) {
                    //console.log("result " + result);
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);