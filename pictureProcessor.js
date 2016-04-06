importScripts("tools.js");

self.onmessage = function (e) {
    var canvasData = e.data.data;
    var binaryData = canvasData.data;

    var index = e.data.index;

    var result = processImage(binaryData, e.data.colour);

    self.postMessage({ result: result, index: index });
};
