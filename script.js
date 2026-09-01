// Juyeong Hwang — Kraken-inspired skin
// Mobile nav disclosure + horizontal video scrollers (drag + arrows).

(function () {
    'use strict';

    // Mobile nav
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
        menu.addEventListener('click', function (e) {
            if (e.target.classList.contains('nav-link')) {
                menu.classList.remove('open');
            }
        });
    }

    // Video scrollers (one per row)
    document.querySelectorAll('.video-scroller-wrap').forEach(function (wrap) {
        var scroller = wrap.querySelector('.video-scroller');
        if (!scroller) return;

        // YouTube iframes can nudge the scroller while loading — pin it back to the start
        window.addEventListener('load', function () {
            scroller.scrollTo({ left: 0 });
        });

        // Drag to scroll (starts on gaps/captions; iframes and links keep their own clicks)
        var isDown = false;
        var startX = 0;
        var startScroll = 0;

        scroller.addEventListener('pointerdown', function (e) {
            if (e.target.closest('iframe, a')) return;
            isDown = true;
            startX = e.clientX;
            startScroll = scroller.scrollLeft;
            scroller.classList.add('dragging');
            scroller.setPointerCapture(e.pointerId);
        });
        scroller.addEventListener('pointermove', function (e) {
            if (!isDown) return;
            scroller.scrollLeft = startScroll - (e.clientX - startX);
        });
        function endDrag() {
            isDown = false;
            scroller.classList.remove('dragging');
        }
        scroller.addEventListener('pointerup', endDrag);
        scroller.addEventListener('pointercancel', endDrag);

        // Arrow buttons
        var STEP = 336; // card width + gap
        var left = wrap.querySelector('.scroll-arrow.left');
        var right = wrap.querySelector('.scroll-arrow.right');
        if (left) {
            left.addEventListener('click', function () {
                scroller.scrollBy({ left: -STEP, behavior: 'smooth' });
            });
        }
        if (right) {
            right.addEventListener('click', function () {
                scroller.scrollBy({ left: STEP, behavior: 'smooth' });
            });
        }
    });
})();
