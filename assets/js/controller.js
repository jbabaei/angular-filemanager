FileManagerApp.controller('FileManagerCtrl', ['$scope', 'item', 'fileNavigator', 'fileUploader', '$config', function($scope, Item, FileNavigator, FileUploader, $config) {

    $scope.appName = $config.appName;
    $scope.orderProp = ['model.type', 'model.name'];
    $scope.temp = new Item();
    $scope.fileNavigator = new FileNavigator();
    $scope.fileUploader = FileUploader;
    $scope.uploadFileList = [];

    $scope.touch = function(item) {
        item.revert && item.revert();
        item.error = '';
        $scope.temp = item;
    };

    $scope.copy = function(item) {
        var newItem = angular.copy(item);
        if ($scope.fileNavigator.fileNameExists(newItem.tempModel.name)) {
            item.error = $config.msg.invalidFilename;
            return false;
        }
        newItem.update();
        $scope.fileNavigator.fileList.push(newItem);
        $('#copy').modal('hide');
    };

    $scope.delete = function(item) {
        item.delete(function() {
            $scope.fileNavigator.refresh();
            $('#delete').modal('hide');
        });
    };

    $scope.rename = function(item) {
        if ($scope.fileNavigator.fileNameExists(item.tempModel.name)) {
            item.error = $config.msg.invalidFilename;
            return false;
        }
        item.rename(function() {
            $scope.fileNavigator.refresh();
            $('#delete').modal('hide');
        });
    };

    $scope.createFolder = function(name) {
        name = name && name.trim();
        if (name && !$scope.fileNavigator.fileNameExists(name)) {
            $scope.fileNavigator.fileList.push(new Item({name: name, type: 'dir'}, $scope.fileNavigator.currentPath));
        } else {
            $scope.temp.error = $config.msg.invalidFilename;
            return false;
        }
        $('#newfolder').modal('hide');
    };

    $scope.createFile = function(name, content) {
        name = name && name.trim();
        if (name && !$scope.fileNavigator.fileNameExists(name)) {
            $scope.fileNavigator.fileList.push(new Item({name: name, type: 'file', content: content}, $scope.fileNavigator.currentPath));
        } else {
            $scope.temp.error = $config.msg.invalidFilename;
            return false;
        }
        $('#newfile').modal('hide');
    };

    $scope.uploadFiles = function() {
        $scope.fileUploader.upload($scope.uploadFileList, $scope.fileNavigator.currentPath, function() {
            $scope.fileNavigator.refresh();
            $('#uploadfile').modal('hide');
        });
    };

    $scope.fileNavigator.refresh();
}]);