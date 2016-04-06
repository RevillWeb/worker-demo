"use strict";

(function () {

    var source = document.getElementById("source");

    var process = function () {
        var start = new Date();

        var canvas = document.getElementById("target");
        canvas.width = source.clientWidth;
        canvas.height = source.clientHeight;

        var tempContext = canvas.getContext("2d");

        var segments = 3;

        console.log("WIDTH:", canvas.width);
        console.log("HEIGHT:", canvas.height);

        tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);

        //var workersCount = segments;
        var finished = 0;
        //var segmentLength = len / workersCount;
        var blockSize = canvas.height / segments;

        var onWorkEnded = function (e) {
            console.log("E:", e);
            var canvasData = e.data.result;
            var index = e.data.index;

            tempContext.putImageData(canvasData, 0, blockSize * index);

            finished++;

            if (finished == segments) {
                var diff = new Date() - start;
                console.info("Process done in " + diff + " ms");
                //log.innerHTML = "Process done in " + diff + " ms";
            }
        };

        var colours = {
            0: "red",
            1: "green",
            2: "blue"
        };

        for (var index = 0; index <= segments; index++) {
            var worker = new Worker("pictureProcessor.js");
            worker.onmessage = onWorkEnded;

            var imageData = tempContext.getImageData(0, blockSize * index, canvas.width, blockSize);
            //var data = processImage(imageData, colours[index]);

            //console.log("DONE!");
            //tempContext.putImageData(data, 0, blockSize * index);
            worker.postMessage({ data: imageData, index: index, colour: colours[index] });
        }

        //var diff = new Date() - start;
        //console.info("Process done in " + diff + " ms");
    };

    document.querySelector("#go").addEventListener("click", function(){
        process();
    });

    source.src = "car.jpg";
})();
