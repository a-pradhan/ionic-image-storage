var services = angular.module("app.services", []);

services.factory("ImageService", function ($cordovaCamera, $cordovaFile, FileService) {

  // return
  self = {};


  makeID = function () {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    ;
    return text;
  };

  self.takePicture = function () {
    // camera options
    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    // Opens camera application and gets image URL
    $cordovaCamera.getPicture(options).then(function (imageUrl) {
      console.log("Path of image taken from camera: " + imageUrl);

      var d = new Date();
      // timestamp to be appended to filename
      var timeStamp = d.getDate() + '-' + d.getMonth() + '-' + d.getYear() + '-' + d.getHours() + '-' + d.getMinutes()
      // gets the full path to the image stored on the device
      var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);

      // gets name of the file stored on the device by getting the last part of the file path
      var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);

      //http://forums.devarticles.com/javascript-development-22/help-adding-current-date-and-time-stamp-to-file-name-113670.html
      // appends timeStamp to image name to be saved inside app
      var newName = timeStamp + name;
      $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
        .then(function () {
          FileService.addImage(newName);

          // debugging output
          console.log("image file copied from: " + namePath);
          console.log("name of file copied is: " + name);
          console.log("Image copied to: " + cordova.file.dataDirectory);
          console.log("Copy saved as: " + newName);
          console.log(window.localStorage)
        }, function (e) {
          console.log(e);
        });
    }, function (error) {

    });
  };

  return self;

});

services.factory("FileService", function ($cordovaFile) {
  var self = {};
  var images;
  var IMAGE_STORAGE_KEY = 'images';

  self.getImages = function () {
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);

    if (img) {
      images = JSON.parse(img);
    } else {
      images = [];
    }
    return images
  };

  self.addImage = function (img) {
    images.push(img);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  }

  return self;

});
