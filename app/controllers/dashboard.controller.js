/**
 * DashboardController
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('DashboardController', ['AuthService', 'FileService', DashboardController]);

  function DashboardController(AuthService, FileService) {
    var vm = this;

    vm.user = AuthService.currentUser();
    vm.stats = { totalDocuments: 0, myDocuments: 0, converted: 0, uniqueUsers: 0, totalSize: 0 };
    vm.recentActivity = FileService.getRecentActivity();
    vm.recentDocs = [];

    // Load stats from backend
    FileService.getStats().then(function (stats) {
      vm.stats = stats;
    });

    // Load recent docs from backend
    FileService.getAllDocuments().then(function (docs) {
      vm.recentDocs = docs.slice(0, 5);
    });

    vm.formatSize = formatSize;
    vm.timeAgo = timeAgo;

    function formatSize(bytes) {
      if (!bytes) return '0 B';
      var sizes = ['B', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }

    function timeAgo(dateStr) {
      if (!dateStr) return '';
      var diff = Date.now() - new Date(dateStr).getTime();
      var mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return mins + 'm ago';
      var hours = Math.floor(mins / 60);
      if (hours < 24) return hours + 'h ago';
      var days = Math.floor(hours / 24);
      return days + 'd ago';
    }
  }
})();
