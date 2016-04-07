//Import the tools file to get at the process image function
importScripts("tools.js");

self.onmessage = function (e) {
    //process the image with the provided data and colour
    var result = processImage(e.data.data, e.data.colour);
    //reply back to the main app with the result and index
    self.postMessage({ result: result, index: e.data.index });
};
