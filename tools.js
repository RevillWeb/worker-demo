//Process image function to be use with and without a worker
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
