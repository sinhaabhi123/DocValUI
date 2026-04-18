/**
 * UploadController — handles file selection, upload, conversion, and ResponsePdf display
 */
(function () {
  'use strict';

  angular
    .module('practiceApp')
    .controller('UploadController', ['$scope', '$timeout', 'FileService', 'ToastService', UploadController]);

  function UploadController($scope, $timeout, FileService, ToastService) {
    var vm = this;

    vm.pendingFiles = [];   // files selected but not yet uploaded
    vm.uploadedFiles = [];  // files that have been uploaded with their response
    vm.uploading = false;
    vm.responsePdf = null;  // latest ResponsePdf to display

    vm.triggerFileInput = triggerFileInput;
    vm.onFilesSelected = onFilesSelected;
    vm.removeFile = removeFile;
    vm.uploadAll = uploadAll;
    vm.formatSize = formatSize;
    vm.getFileIcon = getFileIcon;
    vm.getFileClass = getFileClass;

    // ---- Implementation ----

    function triggerFileInput() {
      document.getElementById('fileInput').click();
    }

    function onFilesSelected(files) {
      if (!files || !files.length) return;
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var ext = f.name.split('.').pop().toLowerCase();
        var allowed = ['pdf', 'xls', 'xlsx', 'csv', 'doc', 'docx'];
        if (allowed.indexOf(ext) === -1) {
          ToastService.error('Unsupported file: ' + f.name);
          continue;
        }
        vm.pendingFiles.push({
          file: f,
          name: f.name,
          size: f.size,
          type: _getType(ext),
          status: 'pending',
          progress: 0
        });
      }
      $scope.$applyAsync();
    }

    function removeFile(index) {
      vm.pendingFiles.splice(index, 1);
    }

    function uploadAll() {
      if (!vm.pendingFiles.length) {
        ToastService.error('No files selected.');
        return;
      }

      vm.uploading = true;

      // Upload files one by one with simulated progress
      var chain = Promise.resolve();

      vm.pendingFiles.forEach(function (pf, idx) {
        chain = chain.then(function () {
          return _uploadSingle(pf, idx);
        });
      });

      chain.then(function () {
        vm.uploading = false;
        vm.pendingFiles = [];
        $scope.$applyAsync();
      }).catch(function () {
        vm.uploading = false;
        $scope.$applyAsync();
      });
    }

    function _uploadSingle(pf, idx) {
      pf.status = 'uploading';
      pf.progress = 0;
      $scope.$applyAsync();

      // Simulate progress
      return new Promise(function (resolve) {
        var progressInterval = setInterval(function () {
          if (pf.progress < 90) {
            pf.progress += Math.floor(Math.random() * 15) + 5;
            if (pf.progress > 90) pf.progress = 90;
            $scope.$applyAsync();
          }
        }, 200);

        var ext = pf.file.name.split('.').pop().toLowerCase();
        if (ext !== 'pdf') {
          pf.status = 'converting';
          $scope.$applyAsync();
        }

        FileService.uploadFile(pf.file).then(function (responsePdf) {
          clearInterval(progressInterval);
          pf.progress = 100;
          pf.status = 'success';
          pf.responsePdf = responsePdf;

          vm.responsePdf = responsePdf;  // show latest response
          vm.uploadedFiles.unshift({
            name: pf.name,
            type: pf.type,
            size: pf.size,
            responsePdf: responsePdf
          });

          ToastService.success(responsePdf.message);
          $scope.$applyAsync();
          resolve();
        }, function (err) {
          clearInterval(progressInterval);
          pf.status = 'error';
          pf.progress = 0;
          ToastService.error(err);
          $scope.$applyAsync();
          resolve(); // continue with next file
        });
      });
    }

    function _getType(ext) {
      if (ext === 'pdf') return 'pdf';
      if (['xls', 'xlsx', 'csv'].indexOf(ext) !== -1) return 'excel';
      if (['doc', 'docx'].indexOf(ext) !== -1) return 'word';
      return 'unknown';
    }

    function getFileIcon(type) {
      switch (type) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'excel': return 'fas fa-file-excel';
        case 'word': return 'fas fa-file-word';
        default: return 'fas fa-file';
      }
    }

    function getFileClass(type) {
      return type || 'pdf';
    }

    function formatSize(bytes) {
      if (!bytes) return '0 B';
      var sizes = ['B', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }
  }
})();
