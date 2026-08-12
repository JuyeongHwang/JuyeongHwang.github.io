// Juyeong Hwang — Kraken-inspired skin
// Mobile nav disclosure + video scroller (drag, arrows, tag filters).

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

    // Video scroller
    var scroller = document.getElementById('video-scroller');
    if (scroller) {
        // YouTube iframes can nudge the scroller while loading — pin it back to the start
        window.addEventListener('load', function () {
            scroller.scrollTo({ left: 0 });
        });
        // Drag to scroll (starts on gaps/tags; iframes swallow their own clicks)
        var isDown = false;
        var startX = 0;
        var startScroll = 0;

        scroller.addEventListener('pointerdown', function (e) {
            if (e.target.closest('iframe')) return;
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
        var left = document.getElementById('scroll-left');
        var right = document.getElementById('scroll-right');
        var STEP = 336; // card width + gap
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

        // Tag filters
        var filters = document.getElementById('video-filters');
        if (filters) {
            filters.addEventListener('click', function (e) {
                var chip = e.target.closest('.filter-chip');
                if (!chip) return;
                filters.querySelectorAll('.filter-chip').forEach(function (c) {
                    c.classList.toggle('active', c === chip);
                });
                var filter = chip.dataset.filter;
                scroller.querySelectorAll('.video-item').forEach(function (item) {
                    var show = filter === 'all' || item.dataset.tags.split(' ').indexOf(filter) !== -1;
                    item.classList.toggle('hidden', !show);
                });
                scroller.scrollTo({ left: 0 });
            });
        }
    }
})();
