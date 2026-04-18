/**
 * LoginController
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('LoginController', ['$location', '$timeout', 'AuthService', 'ToastService', LoginController]);

  function LoginController($location, $timeout, AuthService, ToastService) {
    var vm = this;

    // Redirect if already logged in
    if (AuthService.isLoggedIn()) {
      $location.path('/dashboard');
      return;
    }

    vm.email = '';
    vm.password = '';
    vm.loading = false;

    vm.login = function () {
      if (!vm.email || !vm.password) {
        ToastService.error('Please fill in all fields.');
        return;
      }

      vm.loading = true;

      AuthService.login(vm.email, vm.password).then(function (result) {
        vm.loading = false;

        if (result.success) {
          ToastService.success(result.message);
          $location.path('/dashboard');
        } else {
          ToastService.error(result.message);
        }
      });
    };
  }
})();
