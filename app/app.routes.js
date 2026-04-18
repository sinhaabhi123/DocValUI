/**
 * DocVault — Route Configuration
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider) {

      $routeProvider
        .when('/login', {
          templateUrl: 'app/views/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        })
        .when('/register', {
          templateUrl: 'app/views/register.html',
          controller: 'RegisterController',
          controllerAs: 'vm'
        })
        .when('/dashboard', {
          templateUrl: 'app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/upload', {
          templateUrl: 'app/views/upload.html',
          controller: 'UploadController',
          controllerAs: 'vm'
        })
        .when('/documents', {
          templateUrl: 'app/views/documents.html',
          controller: 'DocumentsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/login'
        });
    }]);
})();
