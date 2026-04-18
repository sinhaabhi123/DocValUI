/**
 * ToastService — simple notification toasts
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .factory('ToastService', ['$rootScope', '$timeout', ToastService]);

  function ToastService($rootScope, $timeout) {
    $rootScope._toasts = [];

    var service = {
      success: function (msg) { _add('success', msg); },
      error: function (msg) { _add('error', msg); },
      info: function (msg) { _add('info', msg); },
      getToasts: function () { return $rootScope._toasts; }
    };

    return service;

    function _add(type, message) {
      var toast = { id: Date.now(), type: type, message: message };
      $rootScope._toasts.push(toast);

      $timeout(function () {
        var idx = $rootScope._toasts.indexOf(toast);
        if (idx > -1) $rootScope._toasts.splice(idx, 1);
      }, 4000);
    }
  }
})();
