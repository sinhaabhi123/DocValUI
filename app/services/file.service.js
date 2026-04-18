/**
 * FileService — manages document uploads, conversions, and retrieval via Spring Boot backend API.
 *
 * API Endpoints:
 *   POST   /api/documents/upload?userId=...   → upload file, returns ResponsePdf
 *   GET    /api/documents                     → all documents
 *   GET    /api/documents/my?userId=...       → user's documents
 *   GET    /api/documents/{id}/download       → download PDF
 *   GET    /api/documents/stats?userId=...    → dashboard stats
 *   GET    /api/documents/search?q=...        → search
 *   DELETE /api/documents/{id}                → delete
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .factory('FileService', ['$http', '$q', 'AuthService', FileService]);

  function FileService($http, $q, AuthService) {
    var API_BASE = 'http://localhost:9090/api/documents';

    var service = {
      uploadFile: uploadFile,
      getAllDocuments: getAllDocuments,
      getMyDocuments: getMyDocuments,
      getDocumentById: getDocumentById,
      deleteDocument: deleteDocument,
      downloadUrl: downloadUrl,
      getRecentActivity: getRecentActivity,
      getStats: getStats
    };

    return service;

    // ---- Public API ----

    /**
     * Upload a file (PDF, Excel, or Word).
     * Returns a promise that resolves with a ResponsePdf object from the backend.
     */
    function uploadFile(file) {
      var deferred = $q.defer();
      var user = AuthService.currentUser();

      var formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      $http.post(API_BASE + '/upload', formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function (response) {
        // Log activity locally
        _addActivity({
          type: response.data.converted ? 'convert' : 'upload',
          icon: response.data.converted ? 'convert' : 'upload',
          text: user.name + ' ' +
                (response.data.converted ? 'converted & uploaded' : 'uploaded') +
                ' ' + file.name,
          userId: user.id
        });
        deferred.resolve(response.data);
      }, function (error) {
        var msg = (error.data && error.data.message) ? error.data.message : 'Upload failed';
        deferred.reject(msg);
      });

      return deferred.promise;
    }

    /**
     * Get all documents from all users.
     */
    function getAllDocuments() {
      var deferred = $q.defer();
      $http.get(API_BASE).then(function (response) {
        deferred.resolve(response.data);
      }, function () {
        deferred.resolve([]);
      });
      return deferred.promise;
    }

    /**
     * Get current user's documents.
     */
    function getMyDocuments() {
      var deferred = $q.defer();
      var user = AuthService.currentUser();
      $http.get(API_BASE + '/my', { params: { userId: user.id } }).then(function (response) {
        deferred.resolve(response.data);
      }, function () {
        deferred.resolve([]);
      });
      return deferred.promise;
    }

    /**
     * Get document by ID.
     */
    function getDocumentById(id) {
      var deferred = $q.defer();
      $http.get(API_BASE + '/' + id).then(function (response) {
        deferred.resolve(response.data);
      }, function () {
        deferred.resolve(null);
      });
      return deferred.promise;
    }

    /**
     * Delete a document.
     */
    function deleteDocument(id) {
      return $http.delete(API_BASE + '/' + id);
    }

    /**
     * Get the download URL for a document.
     */
    function downloadUrl(docId) {
      return API_BASE + '/' + docId + '/download';
    }

    /**
     * Get recent activity (stored locally for now).
     */
    function getRecentActivity() {
      return JSON.parse(localStorage.getItem('docvault_activity') || '[]').slice(0, 15);
    }

    /**
     * Get dashboard stats from the backend.
     */
    function getStats() {
      var deferred = $q.defer();
      var user = AuthService.currentUser();
      $http.get(API_BASE + '/stats', { params: { userId: user.id } }).then(function (response) {
        deferred.resolve(response.data);
      }, function () {
        deferred.resolve({
          totalDocuments: 0,
          myDocuments: 0,
          totalSize: 0,
          converted: 0,
          uniqueUsers: 0
        });
      });
      return deferred.promise;
    }

    // ---- Local helpers ----

    function _addActivity(activity) {
      var list = JSON.parse(localStorage.getItem('docvault_activity') || '[]');
      activity.timestamp = new Date().toISOString();
      list.unshift(activity);
      if (list.length > 50) list = list.slice(0, 50);
      localStorage.setItem('docvault_activity', JSON.stringify(list));
    }
  }
})();
