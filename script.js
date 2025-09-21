document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const video = document.querySelector('.gdm-video-embed__player');
        if (video) {
            video.muted = true;
            video.autoplay = true;
            video.playsInline = true;
            video.loop = true;
            video.play().catch(() => {});
        }
    }, 300);
});