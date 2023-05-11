var socket = io({autoConnect: false}).connect(window.location.protocol + '//' + document.domain + ':' + location.port);
socket.on('connect', function () {
    console.log("Connected...!", socket.connected)
});

var video = document.getElementById('videoElement');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

video.width = 400;
video.height = 300;

function send() {
    setInterval(() => {
        width = video.width;
        height = video.height;
        context.drawImage(video, 0, 0, width, height);
        var data = canvas.toDataURL('image/jpeg', 0.5);
        context.clearRect(0, 0, width, height);
        socket.emit('image', data);
    });
};

function start_camera() {
    send();
    let devices = navigator.mediaDevices
    if (!devices || !devices.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }
    devices.getUserMedia({
        video: true
    })
        .then(function (vidstream) {
            if ("srcObject" in video) {
                video.srcObject = vidstream;

            } else {
                video.src = window.src = window.URL.createObjectURL(vidstream);

            }
            video.onloadeddata = function (e) {
                video.play();
            };
        })
        .catch(function (e) {
            console.log(e.name + ": " + e.massage);
        });
};

function stop_camera() {
    video.srcObject.getTracks()[0].stop();
    video.srcObject = null;
    clearInterval(send);

};
// const FPS = 10;
// setInterval(send, 1000 / FPS);
// // const FPS = 10;
// // socket.on('image', setInterval(() => {
// //     width = video.width;
// //     height = video.height;
// //     context.drawImage(video, 0, 0, width, height);
// //     var data = canvas.toDataURL('image/jpeg', 0.5);
// //     context.clearRect(0, 0, width, height);
// //     socket.emit('image', data);
// // }, 1000 / FPS));



