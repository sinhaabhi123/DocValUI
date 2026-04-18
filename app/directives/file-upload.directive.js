/**
 * fileUpload directive — bridges the native <input type="file"> with AngularJS
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .directive('fileUpload', function () {
      return {
        restrict: 'A',
        scope: {
          fileUpload: '&'
        },
        link: function (scope, element) {
          element.on('change', function (event) {
            var files = event.target.files;
            if (files && files.length) {
              scope.$apply(function () {
                scope.fileUpload({ files: files });
              });
            }
            // Reset so the same file can be selected again
            element.val('');
          });
        }
      };
    });
})();
