/**
 * Created by paipeng on 12.02.15.
 */
angular.module('state.service', [])

    .factory('AmPOIState', function() {
        var menu = null;
        var camera = 0;
        var poi = 0;

        return {
            getSelectedMenu: function() {
                return menu;
            },
            setSelectedMenu: function(selectedMenu) {
                menu = selectedMenu;
            },
            getCamera: function() {
                return camera;
            },
            setCamera: function(setCamera) {
                camera = setCamera;
            },
            updateCamera: function() {
                camera += 1;
            },
            getPOI: function() {
                return poi;
            },
            updatePOI: function() {
                poi += 1;
            }

        }
    });