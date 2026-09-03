document.addEventListener('DOMContentLoaded', function() {
    var video = document.querySelector('.w-100.mb-100.show-on-scroll');
    var playPauseBtn = document.getElementById('playPauseBtn');

    playPauseBtn.addEventListener('click', function() {
        // Check if video is already in the process of playing
        if (video.paused && !video.playPromise) {
            video.playPromise = video.play();
            video.playPromise.then(function() {
                video.playPromise = null;
            }).catch(function(error) {
                console.error("Error trying to play the video: ", error);
                video.playPromise = null;
            });
        } else if (!video.paused && video.playPromise) {
            video.playPromise.then(function() {
                video.pause();
            }).catch(function(error) {
                console.error("Error occurred after play was called: ", error);
            });
        }
    });
});
