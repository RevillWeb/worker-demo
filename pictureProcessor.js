importScripts("tools.js");

self.onmessage = function (e) {

    var result = processImage(e.data.data, e.data.colour);

    self.postMessage({ result: result, index: e.data.index });
};
