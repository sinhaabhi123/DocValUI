/**
 * NavbarController
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('NavbarController', ['$scope', '$location', 'AuthService', NavbarController]);

  function NavbarController($scope, $location, AuthService) {
    $scope.isActive = function (path) {
      return $location.path() === path;
    };

    $scope.currentUser = AuthService.currentUser;

    $scope.logout = function () {
      AuthService.logout();
      $location.path('/login');
    };
  }
})();
