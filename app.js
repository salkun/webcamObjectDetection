let video = document.getElementById('webcam');
let frontButton = document.getElementById('front-camera');
let backButton = document.getElementById('back-camera');
let predictButton = document.getElementById('predict-button');
let objectName = document.getElementById('object-name');
let objectScore = document.getElementById('object-score');
let model;
let currentStream;

async function setupWebcam(facingMode = 'user') {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: {
            facingMode: facingMode
        }
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
    return new Promise((resolve) => {
        video.onloadeddata = () => resolve();
    });
}

async function loadModel() {
    model = await cocoSsd.load();
    console.log("Model loaded.");
}

async function predict() {
    const predictions = await model.detect(video);
    if (predictions.length > 0) {
        objectName.innerText = predictions[0].class;
        objectScore.innerText = predictions[0].score.toFixed(2);
    } else {
        objectName.innerText = "No objects detected";
        objectScore.innerText = "";
    }
}

frontButton.addEventListener('click', () => setupWebcam('user'));
backButton.addEventListener('click', () => setupWebcam('environment'));

setupWebcam().then(() => {
    predictButton.addEventListener('click', predict);
});

loadModel();
