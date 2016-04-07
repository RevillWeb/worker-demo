"use strict";

//Select DOM elements
var $preview = document.querySelector("#preview");
var $result = document.querySelector("#result");
var $resultContainer = document.querySelector(".result");
var $previewContainer = document.querySelector(".preview");
var $previewLoader = document.querySelector("#preview-loader");
var $resultLoader = document.querySelector("#result-loader");
var $fileSelect = document.querySelector("#fileSelect");
var $chooseBtn = document.querySelector("#choose-btn");

//Create a new image object to get image dimensions
var image = new Image();
$preview.onload = function(){
    $result.width = $preview.width;
    $result.height = $preview.height;
    $previewContainer.className += " loaded";
};

//Detect when select image is pressed
$chooseBtn.addEventListener("click", function(e){
    $fileSelect.click();
});

//Detect when file input is change and load image
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

var start = null;
var segments = 5;
var completedWorkers = 0;
var finished = function($canvas, workers) {
    completedWorkers = 0;
    var resultContext = $result.getContext("2d");
    resultContext.drawImage($canvas, 0, 0, $preview.width, $preview.height);
    $resultLoader.className = "loader hidden";
    $resultContainer.className += " loaded";
    var txt = (workers) ? "with" : "without";
    console.info("Process done " + txt + " workers in " + (new Date() - start) + " ms");
};
//Generate random colour and ensure we don't use
var colours = ["red", "green", "blue"];
var lastColour = null;
var getRandomColour = function() {
    var colour = colours[Math.floor(Math.random() * ((colours.length - 1) - 0 + 1))];
    if (colour === lastColour) {
        colour = getRandomColour(colour);
    }
    lastColour = colour;
    return colour;
};
//Process the image with or without workers
var process = function (workers) {

    //If no image has been chosen yet just return
    if (image.src.length === 0) {
        return;
    }
    //Set the loader class to bring up the loader
    $resultLoader.className = "loader";
    //Mark the start time
    start = new Date();

    //Create a canvas element we can use to load the chosen image on
    var $canvas = document.createElement("canvas");
    //Make sure its the same height as the chosen image
    $canvas.width = image.width;
    $canvas.height = image.height;
    //Draw the chosen image on so we can get the pixel data
    var context = $canvas.getContext("2d");
    context.drawImage(image, 0, 0, $canvas.width, $canvas.height);

    //Work out the size of the blocks we will be processing
    var blockSize = $canvas.height / segments;

    //For each segment change its colour
    for (var index = 0; index < segments; index++) {
        //Get the pixel data for the current segment
        var imageData = context.getImageData(0, blockSize * index, $canvas.width, blockSize);
        //Get a random colour
        var colour = getRandomColour();
        //If workers is set we are going to use workers for each segment
        if (workers === true) {
            //Spawn a new worker based on the code in process-image.js
            var worker = new Worker("process-image.js");
            //Create a message handler so we know when a worker is finished
            worker.onmessage = function (e) {
                //Keep track of the number of completed workers (Remember workers might not complete in order they were called)
                completedWorkers++;
                //Grab the original index
                var idx = e.data.index;
                //Put the processed pixel data back on the canvas
                context.putImageData(e.data.result, 0, blockSize * idx);
                //If we've completed all works, finish.
                if (completedWorkers === segments) {
                    finished($canvas, true);
                }
            };
            worker.postMessage({data: imageData, index: index, colour: colour});
        } else {
            //If workers is not set then we are going to process without workers
            //Process this segment of data and write it to the canvas
            var data = processImage(imageData, colour);
            context.putImageData(data, 0, blockSize * index);
            //If we have done all segments, finish.
            if (index === (segments - 1)) {
                finished($canvas, false);
            }
        }
    }
};
//Detect click on the with button
document.querySelector("#process-with").addEventListener("click", function(){
    process(true);
});
//Detect click on the without button
document.querySelector("#process-without").addEventListener("click", function(){
    process();
});
