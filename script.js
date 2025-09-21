document.addEventListener('DOMContentLoaded', function () {
    const heroRight = document.querySelector('.hero-right');
    const body = document.body;

    function lockBodyScroll(lock) {
        body.style.overflow = lock ? 'hidden' : '';
    }

    // Initially lock body scroll if hero-right is overflowing
    if (heroRight.scrollHeight > heroRight.clientHeight) {
        lockBodyScroll(true);
    }

    heroRight.addEventListener('scroll', function () {
        // If hero-right is scrolled to the bottom, unlock body scroll
        if (heroRight.scrollTop + heroRight.clientHeight >= heroRight.scrollHeight - 1) {
            lockBodyScroll(false);
        } else {
            lockBodyScroll(true);
        }
    });
});