/**
 * AuthService — handles registration, login, logout.
 * Uses the Spring Boot backend API at /api/auth/*
 * Falls back to localStorage if backend is unavailable.
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .factory('AuthService', ['$http', '$q', AuthService]);

  function AuthService($http, $q) {
    var SESSION_KEY = 'docvault_session';
    var API_BASE = 'http://localhost:9090/api/auth';

    var service = {
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser,
      getAllUsers: getAllUsers
    };

    return service;

    // ---- Implementation ----

    /**
     * Register a new user via backend API.
     * @returns Promise<{ success: boolean, message: string }>
     */
    function register(name, email, password) {
      var deferred = $q.defer();

      $http.post(API_BASE + '/register', {
        name: name,
        email: email,
        password: password
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        if (error.data && error.data.message) {
          deferred.resolve({ success: false, message: error.data.message });
        } else {
          deferred.resolve({ success: false, message: 'Server unavailable. Please try again.' });
        }
      });

      return deferred.promise;
    }

    /**
     * Authenticate user via backend API.
     * @returns Promise<{ success: boolean, message: string, user: object }>
     */
    function login(email, password) {
      var deferred = $q.defer();

      $http.post(API_BASE + '/login', {
        email: email,
        password: password
      }).then(function (response) {
        var data = response.data;
        if (data.success && data.user) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        }
        deferred.resolve(data);
      }, function (error) {
        if (error.data && error.data.message) {
          deferred.resolve({ success: false, message: error.data.message });
        } else {
          deferred.resolve({ success: false, message: 'Server unavailable. Please try again.' });
        }
      });

      return deferred.promise;
    }

    function logout() {
      localStorage.removeItem(SESSION_KEY);
    }

    function isLoggedIn() {
      return !!localStorage.getItem(SESSION_KEY);
    }

    function currentUser() {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    }

    function getAllUsers() {
      return [];
    }
  }
})();
