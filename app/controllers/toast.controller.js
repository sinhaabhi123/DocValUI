/**
 * ToastController
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('ToastController', ['$scope', 'ToastService', ToastController]);

  function ToastController($scope, ToastService) {
    $scope.toasts = ToastService.getToasts();
  }
})();
