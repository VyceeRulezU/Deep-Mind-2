// document.addEventListener("DOMContentLoaded", function() {
//     setTimeout(function() {
//         const video = document.querySelector('.gdm-video-embed__player');
//         if (video) {
//             video.muted = true;
//             video.autoplay = true;
//             video.playsInline = true;
//             video.loop = true;
//             video.play().catch(() => {});
//         }
//     }, 300);
// });

// document.addEventListener("DOMContentLoaded", function() {
//     // ...existing code...
//     const toggle = document.getElementById('mobileNavToggle');
//     const menu = document.getElementById('mobileNavMenu');
//     if (toggle && menu) {
//         toggle.addEventListener('click', function() {
//             menu.classList.toggle('hide');
//         });
//     }
// });

(function () {
  const heroSection = document.querySelector('.hero-section');
  const heroRight = document.querySelector('.hero-right');
  if (!heroSection || !heroRight) return;

  // Helper: can the element scroll further in the given direction?
  // directionDown: true => down, false => up
  function canScroll(el, directionDown) {
    if (!el) return false;
    if (directionDown) {
      return el.scrollTop + el.clientHeight < el.scrollHeight - 1; // allow small tolerance
    } else {
      return el.scrollTop > 1;
    }
  }

  // Whether the heroSection currently occupies the viewport (so we intercept)
  function heroSectionInView() {
    const rect = heroSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= 0;
  }

  // WHEEL handler (mouse wheel / touchpad)
  function onWheel(e) {
    // only intercept when hero-section is the active viewport block
    if (!heroSectionInView()) return;

    const deltaY = e.deltaY;
    const down = deltaY > 0;

    if (canScroll(heroRight, down)) {
      // move the right column instead of the page
      heroRight.scrollTop += deltaY;
      e.preventDefault();
    } else {
      // at boundary — allow default (page scroll) to happen
      // no preventDefault()
    }
  }

  // TOUCH handlers (mobile)
  let lastTouchY = null;
  function onTouchStart(e) {
    lastTouchY = e.touches ? e.touches[0].clientY : null;
  }
  function onTouchMove(e) {
    if (lastTouchY === null) return;
    if (!heroSectionInView()) return;

    const currentY = e.touches[0].clientY;
    const delta = lastTouchY - currentY; // positive => swipe up (scroll down)
    const down = delta > 0;

    if (Math.abs(delta) < 2) {
      // ignore tiny moves
      lastTouchY = currentY;
      return;
    }

    if (canScroll(heroRight, down)) {
      heroRight.scrollTop += delta;
      e.preventDefault(); // stop the page from scrolling
    } else {
      // at boundary — allow page to handle the swipe
    }
    lastTouchY = currentY; // update for continuous gesture
  }
  function onTouchEnd() { lastTouchY = null; }

  // KEYBOARD handler for arrows / space / pageup/pagedown
  function onKeyDown(e) {
    // ignore typing in inputs
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }

    const key = e.key;
    let dir = 0; // +1 down, -1 up
    let amount = 0;

    if (key === 'ArrowDown') { dir = 1; amount = 40; }
    else if (key === 'ArrowUp') { dir = -1; amount = 40; }
    else if (key === 'PageDown') { dir = 1; amount = window.innerHeight * 0.9; }
    else if (key === 'PageUp') { dir = -1; amount = window.innerHeight * 0.9; }
    else if (key === ' ' || e.code === 'Space') { dir = 1; amount = window.innerHeight * 0.9; }
    else return;

    if (!heroSectionInView()) return;

    if (canScroll(heroRight, dir > 0)) {
      heroRight.scrollTop += dir * amount;
      e.preventDefault();
    } else {
      // let page handle it
    }
  }

  // Attach listeners:
  // use passive:false where we call preventDefault
  heroSection.addEventListener('wheel', onWheel, { passive: false });
  heroSection.addEventListener('touchstart', onTouchStart, { passive: true });
  heroSection.addEventListener('touchmove', onTouchMove, { passive: false });
  heroSection.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('keydown', onKeyDown, { passive: false });

  // Also attach wheel/touch listeners to heroRight for better hit area (optional, but helpful)
  heroRight.addEventListener('wheel', onWheel, { passive: false });
  heroRight.addEventListener('touchstart', onTouchStart, { passive: true });
  heroRight.addEventListener('touchmove', onTouchMove, { passive: false });

  // Cleanup function (if you want to remove later)
  // return () => { ...removeEventListener... }
})();
