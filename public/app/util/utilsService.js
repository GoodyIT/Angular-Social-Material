app.service('UtilsService', function () {
    var awsS3Creds = {
        bucket: 'famepick-web-dev',
        access_key: 'AKIAJPPOAQZ4GRXYE6QQ',
        secret_key: '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'
    };
    var yearsArray = [];

    this.uploadImage = function(file, applicationId, successCallback, errorCallback){
        var imageId = generateUUID();
        AWS.config.update({ accessKeyId: awsS3Creds.access_key, secretAccessKey: awsS3Creds.secret_key });
        AWS.config.region = 'us-east-1';
        var bucket = new AWS.S3({ params: { Bucket: awsS3Creds.bucket } });

        if(file.size < 5292880) {  //limit to 5MB
            var params = { Key: applicationId + "/" + imageId, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };

            bucket.putObject(params, function(err, data) {
                if(err) {
                    // There Was An Error With Your S3 Config
                    errorCallback(err.message);
                }
                else {
                    // Success!
                    var applicationImageUrl = "https://s3.amazonaws.com/" + awsS3Creds.bucket + '/'  + applicationId + "/" + imageId;
                    successCallback(applicationImageUrl);
                }
            })
                .on('httpUploadProgress',function(progress) {
                    // Log Progress Information
                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                });
        }
        else {
            // No File Selected
            return {message:"File has to be under 5MB."};
        }
    };
    this.getYearsArray = function(){
        if(yearsArray.length === 0){
            var today = new Date();
            var yyyy = today.getFullYear();
            for (var ix = 0; ix < 10; ix++){
                yearsArray.push(yyyy + ix);
            }
        }
        return yearsArray;
    };

    this.monthsArray = [
       {
         label: 'January',
         value: '01'
       },
       {
         label: 'February',
         value: '02'
       },
       {
         label: 'March',
         value: '03'
       },
       {
         label: 'April',
         value: '04'
       },
       {
         label: 'May',
         value: '05'
       },
       {
         label: 'June',
         value: '06'
       },
       {
         label: 'July',
         value: '07'
       },
       {
         label: 'August',
         value: '08'
       },
       {
         label: 'September',
         value: '09'
       },
       {
         label: 'October',
         value: '10'
       },
       {
         label: 'November',
         value: '11'
       },
       {
         label: 'December',
         value: '12'
       }
    ];


});
