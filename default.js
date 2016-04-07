"use strict";

var $preview = document.querySelector("#preview");
var $result = document.querySelector("#result");
var $resultContainer = document.querySelector("#result-container");
var $previewLoader = document.querySelector("#preview-loader");
var $resultLoader = document.querySelector("#result-loader");
var image = new Image();
$preview.onload = function(){
    $result.width = $preview.width;
    $result.height = $preview.height;
};

var $fileSelect = document.querySelector("#fileSelect");
var $chooseBtn = document.querySelector("#choose-btn");
$chooseBtn.addEventListener("click", function(e){
    $fileSelect.click();
});


$fileSelect.addEventListener("change", function(e){
    $previewLoader.className = "loader";
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        image.onload = function() {
            $preview.src = reader.result;
            $previewLoader.className = "loader hidden";
        };
        image.src = reader.result;
    };
    reader.readAsDataURL(file);
});


var process = function (workers) {

    if (image.src.length === 0) {
        return;
    }
    $resultLoader.className = "loader";

    var start = new Date();


    var $canvas = document.createElement("canvas");
    $canvas.width = image.width;
    $canvas.height = image.height;
    var context = $canvas.getContext("2d");
    context.drawImage(image, 0, 0, $canvas.width, $canvas.height);

    var segments = 3;
    var finished = 0;
    var blockSize = $canvas.height / segments;

    var onWorkEnded = function (e) {
        var index = e.data.index;
        context.putImageData(e.data.result, 0, blockSize * index);
        finished++;
        if (finished == segments) {
            console.info("Process done with in " + (new Date() - start) + " ms");
            var resultContext = $result.getContext("2d");
            resultContext.drawImage($canvas, 0, 0, $preview.width, $preview.height);
            $resultLoader.className = "loader hidden";
        }
    };

    var colours = {
        0: "red",
        1: "green",
        2: "blue"
    };

    for (var index = 0; index <= segments; index++) {

        var imageData = context.getImageData(0, blockSize * index, $canvas.width, blockSize);
        var colour = colours[index];

        if (workers === true) {
            var worker = new Worker("pictureProcessor.js");
            worker.onmessage = onWorkEnded;
            worker.postMessage({data: imageData, index: index, colour: colour});
        } else {
            var data = processImage(imageData, colour);
            context.putImageData(data, 0, blockSize * index);
            var resultContext = $result.getContext("2d");
            resultContext.drawImage($canvas, 0, 0, $preview.width, $preview.height);
            if (index === segments) {
                console.info("Process done without in " + (new Date() - start) + " ms");
                $resultLoader.className = "loader hidden";
            }
        }
    }


};

document.querySelector("#process-with").addEventListener("click", function(){
    process(true);
});

document.querySelector("#process-without").addEventListener("click", function(){
    process();
});
