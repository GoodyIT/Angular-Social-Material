app.service('DirectMessageService', function () {
  var BASE_URL = 'https://blazing-heat-5583.firebaseio.com';
  var CHAT_BASE_URL = BASE_URL + '/chats/';
  var USER_BASE_URL = BASE_URL + '/users/';
  this.createNewMessageThread = function (token, threadId, userId, timestamp, messageText) {
    var msgObj = {
      type: 'message',
      timestamp: timestamp,
      userId: userId,
      text: messageText
    };
    var notifRef = new Firebase(CHAT_BASE_URL + threadId);
    notifRef.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.log('Firebase Authentication Failed!', error);
      } else {
        notifRef.push(msgObj);
      }
    });
  };
  this.createNewApplicationThread = function (token, threadId, userId, timestamp, messageText) {
    var msgObj = {
      type: 'application',
      timestamp: timestamp,
      userId: userId,
      text: messageText
    };
    var notifRef = new Firebase(CHAT_BASE_URL + threadId);
    notifRef.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.log('Firebase Authentication Failed!', error);
      } else {
        notifRef.push(msgObj);
      }
    });
  };
  this.addToUserThreadList = function (token, threadId, userId, timestamp, title) {
    var msgObj = {
      threadId: threadId,
      timestamp: timestamp,
      userId: userId,
      title: title
    };
    var notifRef = new Firebase(USER_BASE_URL + userId + '/messages');
    notifRef.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.log('Firebase Authentication Failed!', error);
      } else {
        notifRef.push(msgObj);
        if (typeof callback == 'function') {
          callback(notiRef);
        }
      }
    });
  };
  this.addApplicationToUserThreadList = function (token, threadId, userId, timestamp, title) {
    var msgObj = {
      threadId: threadId,
      timestamp: timestamp,
      userId: userId,
      title: title
    };
    var notifRef = new Firebase(USER_BASE_URL + userId + '/applications');
    notifRef.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.log('Firebase Authentication Failed!', error);
      } else {
        notifRef.push(msgObj);
        if (typeof callback == 'function') {
          callback(notiRef);
        }
      }
    });
  };
  this.getThreadsOfUser = function (token, userId, type, callback) {
    var threadRegistry = USER_BASE_URL + userId + '/' + type;
    console.log('ChatURL ' + threadRegistry);
    var chatBase = new Firebase(threadRegistry);
    chatBase.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.error('Firebase Authentication Failed!', error);
      } else {
        // console.log("Firebase Authenticated successfully with payload:", authData);
        if (callback) {
          callback(chatBase);
        }
      }
    });
  };
  this.getMessagesOfThread = function (token, threadId, callback) {
    var threadRegistry = CHAT_BASE_URL + threadId;
    var chatBase = new Firebase(threadRegistry);
    chatBase.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.error('Firebase Authentication Failed!', error);
      } else {
        // console.log("Firebase Authenticated successfully with payload:", authData);
        if (typeof callback === 'function') {
          callback(chatBase);
        }
      }
    });
  };
  this.sendApplicationMessageInThread = function (token, threadId, userId, messageText, callback) {
    var threadRegistry = CHAT_BASE_URL + threadId;
    var chatBase = new Firebase(threadRegistry);
    chatBase.authWithCustomToken(token, function (error, authData) {
      if (error) {
        console.error('Firebase Authentication Failed!', error);
      } else {
        // console.log("Firebase Authenticated successfully with payload:", authData);
        chatBase.push({
          timestamp: new Date().getTime(),
          userId: userId,
          text: messageText,
          type: 'application'
        });
        if (typeof callback == 'function') {
          callback();
        }
      }
    });
  };
});
app.service('UtilsService', function () {
  var awsS3Creds = {
    bucket: 'famepick-web-dev',
    access_key: 'AKIAJPPOAQZ4GRXYE6QQ',
    secret_key: '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'
  };
  this.uploadImage = function (file, applicationId, successCallback, errorCallback) {
    var imageId = generateUUID();
    AWS.config.update({
      accessKeyId: awsS3Creds.access_key,
      secretAccessKey: awsS3Creds.secret_key
    });
    AWS.config.region = 'us-east-1';
    var bucket = new AWS.S3({ params: { Bucket: awsS3Creds.bucket } });
    if (file.size < 5292880) {
      //limit to 5MB
      var params = {
        Key: applicationId + '/' + imageId,
        ContentType: file.type,
        Body: file,
        ServerSideEncryption: 'AES256'
      };
      bucket.putObject(params, function (err, data) {
        if (err) {
          // There Was An Error With Your S3 Config
          errorCallback(err.message);
        } else {
          // Success!
          var applicationImageUrl = 'https://s3.amazonaws.com/' + awsS3Creds.bucket + '/' + applicationId + '/' + imageId;
          successCallback(applicationImageUrl);
        }
      }).on('httpUploadProgress', function (progress) {
        // Log Progress Information
        console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
      });
    } else {
      // No File Selected
      return { message: 'File has to be under 5MB.' };
    }
  };
});