function noise() {
    return Math.random() * 0.5 + 0.5;
};

function clamp(component) {
    return Math.max(Math.min(255, component), 0);
}

function colorDistance(scale, dest, src) {
    return clamp(scale * dest + (1 - scale) * src);
};

var processBW = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];
        var luminance = r * 0.21 + g * 0.71 + b * 0.07;
        binaryData[i] = luminance;
        binaryData[i + 1] = luminance;
        binaryData[i + 2] = luminance;
    }
};

var processSepia = function (binaryData, l, color) {
    console.log("BIN:", color);
    for (var i = 0; i < l; i += 4) {
        //var r =
        //var g = binaryData[i + 1];
        //var b = binaryData[i + 2];
        var src = null;
        switch (color) {
            case "red":
                src = binaryData[i];
                break;
            case "green":
                src = binaryData[i + 1];
                break;
            case "blue":
                src = binaryData[i + 2];
                break;
        }
        if (src !== null) {
            //binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
            binaryData[i] = colorDistance(1, 1000, src);
        }
        //binaryData[i + 1] = colorDistance(1, 1000, g);
        //binaryData[i + 2] = colorDistance(1, 100, b);
    }
};

//var colourSegment(data, )


var processImage = function(data, colour) {
    for (var j = 0; j < data.height; j++) {
        for (var i = 0; i < data.width; i++) {
            var _index = (j * 4) * data.width + (i * 4);
            var red = data.data[_index];
            var green = data.data[_index + 1];
            var blue = data.data[_index + 2];
            switch (colour) {
                case "red":
                    data.data[_index] = (red * 2);
                    data.data[_index + 1] = (green / 2);
                    data.data[_index + 2] = (blue / 2);
                    break;
                case "green":
                    data.data[_index] = (red / 2);
                    data.data[_index + 1] = (green * 2);
                    data.data[_index + 2] = (blue / 2);
                    break;
                case "blue":
                    data.data[_index] = (red / 2);
                    data.data[_index + 1] = (green / 2);
                    data.data[_index + 2] = (blue * 2);
                    break;
            }
        }
    }
    return data;
};
