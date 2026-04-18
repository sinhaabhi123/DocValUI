/**
 * RegisterController
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('RegisterController', ['$location', '$timeout', 'AuthService', 'ToastService', RegisterController]);

  function RegisterController($location, $timeout, AuthService, ToastService) {
    var vm = this;

    if (AuthService.isLoggedIn()) {
      $location.path('/dashboard');
      return;
    }

    vm.name = '';
    vm.email = '';
    vm.password = '';
    vm.confirmPassword = '';
    vm.loading = false;

    vm.register = function () {
      if (!vm.name || !vm.email || !vm.password) {
        ToastService.error('Please fill in all fields.');
        return;
      }
      if (vm.password !== vm.confirmPassword) {
        ToastService.error('Passwords do not match.');
        return;
      }
      if (vm.password.length < 4) {
        ToastService.error('Password must be at least 4 characters.');
        return;
      }

      vm.loading = true;

      AuthService.register(vm.name, vm.email, vm.password).then(function (result) {
        vm.loading = false;

        if (result.success) {
          ToastService.success(result.message);
          $location.path('/login');
        } else {
          ToastService.error(result.message);
        }
      });
    };
  }
})();
