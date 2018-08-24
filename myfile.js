'use strict';

const request = require('request');
var Jimp = require('jimp');
 
// open a file called "lenna.png"
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '7bd0f6be939f422bb7259e7173ae05f1';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

function imageProcess(imageUrl){
    
}
// const imageUrl =
    // 'https://img.huffingtonpost.com/asset/5ab1b7562000007d06eb27f0.jpeg?ops=scalefit_630_noupscale';

// Request parameters.

const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

request.post(options, (error, response, body) => {
    if (error) {
    console.log('Error: ', error);
    return;
    }
    var jsonResponse = JSON.parse(body);

    for (var i=0 ; i<jsonResponse.length ; i++) {
        var top = jsonResponse[i].faceRectangle.top;
        var left = jsonResponse[i].faceRectangle.left;
        var width = jsonResponse[i].faceRectangle.width;
        var height = jsonResponse[i].faceRectangle.height;

        Jimp.read(imageUrl, ((i, top, left, width, height) => (err, lenna) => {
            if (err) throw err;
            lenna
                .crop(left, top, width, height)
                .writeAsync(i.toString() + '.jpg'); // save
        })(i, top, left, width, height));
    }
});