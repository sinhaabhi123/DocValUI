/**
 * DocumentsController — lists all documents from all users; allows search, filter, view & download
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('DocumentsController', ['$scope', '$sce', 'AuthService', 'FileService', 'ToastService', DocumentsController]);

  function DocumentsController($scope, $sce, AuthService, FileService, ToastService) {
    var vm = this;

    vm.user = AuthService.currentUser();
    vm.allDocuments = [];
    vm.filteredDocuments = [];
    vm.searchQuery = '';
    vm.activeFilter = 'all';     // 'all' | 'my' | 'pdf' | 'converted'
    vm.previewDoc = null;        // document currently being previewed
    vm.showPreview = false;
    vm.loading = true;

    vm.loadDocuments = loadDocuments;
    vm.setFilter = setFilter;
    vm.applyFilters = applyFilters;
    vm.downloadDocument = downloadDocument;
    vm.viewDocument = viewDocument;
    vm.closePreview = closePreview;
    vm.formatSize = formatSize;
    vm.timeAgo = timeAgo;
    vm.isOwner = isOwner;

    // Init
    loadDocuments();

    // Watch search
    $scope.$watch(function () { return vm.searchQuery; }, function () {
      vm.applyFilters();
    });

    function loadDocuments() {
      vm.loading = true;
      FileService.getAllDocuments().then(function (docs) {
        vm.allDocuments = docs;
        applyFilters();
        vm.loading = false;
      });
    }

    function setFilter(filter) {
      vm.activeFilter = filter;
      applyFilters();
    }

    function applyFilters() {
      var docs = vm.allDocuments;

      // Filter by type
      switch (vm.activeFilter) {
        case 'my':
          docs = docs.filter(function (d) { return d.uploadedBy.id === vm.user.id; });
          break;
        case 'pdf':
          docs = docs.filter(function (d) { return !d.converted; });
          break;
        case 'converted':
          docs = docs.filter(function (d) { return d.converted; });
          break;
      }

      // Search
      if (vm.searchQuery) {
        var q = vm.searchQuery.toLowerCase();
        docs = docs.filter(function (d) {
          return d.originalName.toLowerCase().indexOf(q) !== -1 ||
                 d.uploadedBy.name.toLowerCase().indexOf(q) !== -1;
        });
      }

      vm.filteredDocuments = docs;
    }

    function downloadDocument(doc) {
      // Download from backend API
      var url = FileService.downloadUrl(doc.id);
      var link = document.createElement('a');
      link.href = url;
      link.download = doc.pdfName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      ToastService.success('Downloading ' + doc.pdfName);

      // Log download activity locally
      var activity = JSON.parse(localStorage.getItem('docvault_activity') || '[]');
      activity.unshift({
        type: 'download',
        icon: 'download',
        text: '<strong>' + vm.user.name + '</strong> downloaded <strong>' + doc.originalName + '</strong>',
        userId: vm.user.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('docvault_activity', JSON.stringify(activity.slice(0, 50)));
    }

    function viewDocument(doc) {
      // Trust the backend download URL for iframe embedding
      var trustedDoc = angular.copy(doc);
      trustedDoc.downloadUrl = $sce.trustAsResourceUrl(FileService.downloadUrl(doc.id));
      vm.previewDoc = trustedDoc;
      vm.showPreview = true;
    }

    function closePreview() {
      vm.showPreview = false;
      vm.previewDoc = null;
    }

    function isOwner(doc) {
      return doc.uploadedBy.id === vm.user.id;
    }

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
