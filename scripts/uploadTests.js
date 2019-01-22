#!/usr/bin/env node

const fs = require('fs'); // from node.js
const path = require('path'); // from node.js

/* eslint-disable */
const AWS = require('aws-sdk'); // from AWS SDK

// configuration
const config = {
  s3BucketName: 'carpe-assets',
  folderPath: '../reports', // path relative script's location
};

// initialize S3 client
const s3 = new AWS.S3({ signatureVersion: 'v4', profile: 'carpedev' });

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);
console.error('distFolderPath', distFolderPath);


// // get of list of files from 'dist' directory
// fs.readdir(distFolderPath, (err, files) => {
//   if (!files || files.length === 0) {
//     console.log(
//       `provided folder '${distFolderPath}' is empty or does not exist.`,
//     );
//     console.log('Make sure your project was compiled!');
//     return;
//   }
//   console.error('files', files);
  
//   // for each file in the directory
//   for (const fileName of files) {
//     // get the full path of the file
//     const filePath = path.join(distFolderPath, fileName);

//     // ignore if directory
//     if (fs.lstatSync(filePath).isDirectory()) {
//       continue;
//     }

//     // read file contents
//     fs.readFile(filePath, (error, fileContent) => {
//       // if unable to read file contents, throw exception
//       if (error) {
//         throw error;
//       }

//       // upload file to S3
//       s3.putObject(
//         {
//           Bucket: config.s3BucketName,
//           Key: fileName,
//           Body: fileContent,
//           ACL: 'public-read',

//         },
//         res => {
//           console.log(`Successfully uploaded '${fileName}'!`);
//         },
//       );
//     });
//   }
// });



const uploadDir = function(s3Path, bucketName, dir) {


    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length+1);
        let ContentType = 'text/html';
        const extensions = filePath.split('.');
        if (extensions[extensions.length - 1] === 'js') ContentType = 'application/javascript';
        if (extensions[extensions.length - 1] === 'css') ContentType = 'text/css';
        let params = {Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath), ACL: 'public-read', ContentType };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
              console.error('filePath', filePath);
              
                console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
            }
        });

    });
};

uploadDir(distFolderPath, 'carpe-assets')