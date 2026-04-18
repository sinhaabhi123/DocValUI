/**
 * DocVault — Main Application Module
 * Wires up all dependencies and run blocks.
 */
(function () {
  'use strict';

  angular
    .module('practiceApp', [
      'ngRoute',
      'ngAnimate',
      'ngSanitize'
    ])
    .run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
      // Redirect unauthenticated users away from protected routes
      $rootScope.$on('$routeChangeStart', function (_event, next) {
        var publicRoutes = ['/login', '/register'];
        var targetPath = next.$$route ? next.$$route.originalPath : '/login';

        if (!AuthService.isLoggedIn() && publicRoutes.indexOf(targetPath) === -1) {
          $location.path('/login');
        }
      });

      // Expose helper on $rootScope so navbar can use it
      $rootScope.isLoggedIn = AuthService.isLoggedIn;
      $rootScope.currentUser = AuthService.currentUser;
    }]);
})();
