'use strict';

const request = require('request');
var Jimp = require('jimp');

const subscriptionKey = '7bd0f6be939f422bb7259e7173ae05f1';
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
const output_path = 'output/';
var testUrl = 'https://img.huffingtonpost.com/asset/5ab1b7562000007d06eb27f0.jpeg?ops=scalefit_630_noupscale'
var testID = 'qwer';
function imageProcess(imageUrl, userID) {
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
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    // var prom = new Jimp(testUrl, function (err, image) {
    //     return new Promise(function(ret){
    //         var w = image.bitmap.width; // the width of the image
    //         var h = image.bitmap.height; // the height of the image
    //         var ret = {w,h};
    //         resolve(ret);
    //     })
    // });
    // prom.then(function(ret){
    //     console.log(ret);
    // })

    request.post(options, (error, response, body) => {

        if (error) {
            console.log('Error: ', error);
            return;
        }

        var jsonResponse = JSON.parse(body);
        var count = 0;

        for (var i = 0; i < jsonResponse.length; i++) {
            var top = jsonResponse[i].faceRectangle.top;
            var left = jsonResponse[i].faceRectangle.left;
            var width = jsonResponse[i].faceRectangle.width;
            var height = jsonResponse[i].faceRectangle.height;
            //top = Math.max(top - width * 0.3, 0);
            //left = Math.max(left - height * 0.3, 0);
            //width = min(width)
            Jimp.read(imageUrl, ((i, top, left, width, height) => (err, lenna) => {
                if (err) throw err;
                lenna
                    .crop(left, top, width, height)
                    .writeAsync(output_path + userID + '_' + i.toString() + '.jpg').then(function () {
                        count++;
                        if (count == jsonResponse.length) {
                            var pick_number = Math.floor(Math.random() * (count - 0) + 0);
                            var ret = {
                                "pick_number": pick_number,
                                "width": jsonResponse[pick_number].faceRectangle.width + 60,
                                "height": jsonResponse[pick_number].faceRectangle.height + 60,
                                "num_of_people": count
                            };
                            return ret;
                        }
                    });
            })(i, top, left, width, height));
        }
    });
};
// Test
var tmp = imageProcess(testUrl, testID);
console.log(tmp);