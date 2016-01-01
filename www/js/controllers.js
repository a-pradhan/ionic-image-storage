/**
 * Created by Aditya on 30/12/2015.
 */
var controllers = angular.module("app.controllers", [])

  .controller('CameraCtrl', function ($scope, $ionicPlatform, ImageService, FileService, $cordovaSocialSharing, $cordovaDevice, $cordovaFile) {

    $ionicPlatform.ready(function () {
      $scope.images = FileService.getImages();
      $scope.$apply();
    });

    $scope.captureImage = function () {
      ImageService.takePicture();
      $scope.images = FileService.getImages();
    }

    $scope.urlForImage = function (imageName) {
      var filePath = cordova.file.dataDirectory + imageName;
      return filePath;
    };

    $scope.sendMail = function () {
      console.log("Mail composition started");
      console.log($scope.images[0]);

      if ($scope.images != null && $scope.images.length > 0) {
        // image attachments
        var mailImages = [];
        var savedImages = $scope.images;
        // If device is Android
        if ($cordovaDevice.getPlatform() == 'Android') {
          var imageUrl = $scope.urlForImage(savedImages[0]);
          var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
          var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);

          //copy file from dataDirectory to externalRootDirectory so email app can access
          $cordovaFile.copyFile(namePath, name, cordova.file.externalRootDirectory, name)
            .then(function (info) {
              mailImages.push('' + cordova.file.externalRootDirectory + name);
              console.log("Image copied to external root: " + cordova.file.externalRootDirectory + name);
              console.log(mailImages[0]);
              $cordovaSocialSharing.shareViaEmail("Test Email",
                "Test Results",
                ["apradhan.general@gmail.com"],
                [],
                [],
                mailImages
              ).then(function (result) {
                console.log("Opening email app");
              }, function (err) {
                console.log("An error occurred");
              })
            }, function(error) {
              console.log("Error uploading file")
            });


        } else {
          // if not Android

          for (var i = 0; i < savedImages.length; i++) {
            mailImages.push('' + $scope.urlForImage(savedImages[i]));
          }

          $cordovaSocialSharing.shareViaEmail("Test Email",
            "Test Results",
            ["apradhan.general@gmail.com"],
            [],
            [],
            mailImages
          ).then(function (result) {
            console.log("Opening email app");
          }, function (err) {
            console.log("An error occurred");
          })

        }
      };

    };

    $scope.urlForImage = function (imageName) {
      var trueOrigin = cordova.file.dataDirectory + imageName;
      return trueOrigin;
    };


  });


