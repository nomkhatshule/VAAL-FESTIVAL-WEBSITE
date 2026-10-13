// Vaal Festival: Crossing Bridges
// Headliner stories (auto-advancing slideshow) and the "Good to know" FAQ sheet.
(function () {
  'use strict';

  // ---------- Settings ----------
  var STORY_SECONDS = 4.5; // how long each headliner shows
  var AUTOPLAY = true;

  // Must match the order of the slides in index.html
  var SLIDES = [
    'MDU aka TRP',
    'Tycoon',
    'Juss Gigi',
    'Skelm',
    null, // to be announced
    null  // to be announced
  ];

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ---------- Headliner stories ----------
  var stage = document.getElementById('vf-stage');
  if (stage) {
    var n = SLIDES.length;
    var names = stage.querySelectorAll('.vf-sname');
    var people = stage.querySelectorAll('.vf-sperson');
    var bars = stage.querySelectorAll('.vf-bar');
    var caption = document.getElementById('vf-caption');
    var count = document.getElementById('vf-count');
    var activeName = document.getElementById('vf-active');
    var playBtn = document.getElementById('vf-play');
    var iconPause = document.getElementById('vf-icon-pause');
    var iconPlay = document.getElementById('vf-icon-play');

    var state = { i: 0, playing: !reduceMotion, held: false };
    var swiped = false;
    var touchX = null;
    var holdTimer = null;

    var render = function () {
      var active = state.i;

      var place = function (el, far) {
        var k = Number(el.getAttribute('data-i'));
        var off = ((k - active) % n + n) % n;
        var x = off === 0 ? 0 : (off === n - 1 ? -far : far);
        el.style.opacity = off === 0 ? 1 : 0;
        el.style.transform = 'translateX(' + x + '%)';
      };
      names.forEach(function (el) { place(el, 70); });
      people.forEach(function (el) { place(el, 45); });

      var running = state.playing && !state.held && AUTOPLAY && !reduceMotion;
      bars.forEach(function (bar, k) {
        if (k < active) { bar.style.animation = 'none'; bar.style.width = '100%'; return; }
        if (k > active) { bar.style.animation = 'none'; bar.style.width = '0%'; return; }
        if (!AUTOPLAY || reduceMotion) { bar.style.animation = 'none'; bar.style.width = '100%'; return; }
        // Alternate keyframe names so the fill restarts on every new slide
        var name = active % 2 === 0 ? 'vfFillA' : 'vfFillB';
        bar.style.width = '0%';
        bar.style.animation = name + ' ' + STORY_SECONDS + 's linear forwards ' + (running ? 'running' : 'paused');
      });

      var cur = SLIDES[active];
      caption.textContent = cur ? 'Headliner · ' + cur : 'Headliner · To be announced';
      count.textContent = (active + 1) + ' / ' + n;
      activeName.textContent = cur || 'a headliner still to be announced';

      playBtn.setAttribute('aria-label', state.playing ? 'Pause headliner stories' : 'Play headliner stories');
      iconPause.hidden = !state.playing;
      iconPlay.hidden = state.playing;
    };

    var go = function (k) { swiped = false; state.i = ((k % n) + n) % n; render(); };
    var next = function () { go(state.i + 1); };
    var prev = function () { go(state.i - 1); };

    bars.forEach(function (bar, k) {
      bar.addEventListener('animationend', function () { if (k === state.i) next(); });
    });

    document.getElementById('vf-next').addEventListener('click', function () {
      if (swiped) { swiped = false; return; }
      next();
    });
    document.getElementById('vf-prev').addEventListener('click', function () {
      if (swiped) { swiped = false; return; }
      prev();
    });

    // Press and hold a tap zone to pause, like Instagram stories
    var holdPause = function () {
      clearTimeout(holdTimer);
      holdTimer = setTimeout(function () { state.held = true; render(); }, 250);
    };
    var holdResume = function () {
      clearTimeout(holdTimer);
      if (state.held) { state.held = false; render(); }
    };
    ['vf-prev', 'vf-next'].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('pointerdown', holdPause);
      el.addEventListener('pointerup', holdResume);
      el.addEventListener('pointerleave', holdResume);
    });

    // Swipe left / right on phones
    stage.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0];
      touchX = t ? t.clientX : null;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      var t = e.changedTouches && e.changedTouches[0];
      if (touchX == null || !t) return;
      var dx = t.clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) {
        if (dx < 0) next(); else prev();
        swiped = true; // swallow the click that follows the swipe
      }
    });

    playBtn.addEventListener('click', function () { state.playing = !state.playing; render(); });

    render();
  }

  // ---------- "Good to know" FAQ sheet ----------
  var sheet = document.getElementById('vf-faq');
  var fab = document.getElementById('vf-faqfab-wrap');
  if (sheet) {
    var lastFocus = null;

    var openFaq = function () {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      if (fab) fab.hidden = true;
      document.body.classList.add('vf-noscroll');
      var closeBtn = sheet.querySelector('.vf-arrow[data-faq-close]');
      if (closeBtn) closeBtn.focus();
    };
    var closeFaq = function (restoreFocus) {
      if (sheet.hidden) return;
      sheet.hidden = true;
      if (fab) fab.hidden = false;
      document.body.classList.remove('vf-noscroll');
      if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus();
    };

    document.querySelectorAll('[data-faq-open]').forEach(function (el) {
      el.addEventListener('click', openFaq);
    });
    document.querySelectorAll('[data-faq-close]').forEach(function (el) {
      // Links inside the sheet (e.g. "See the full lineup") close it and then follow the link
      var isLink = el.tagName === 'A';
      el.addEventListener('click', function () { closeFaq(!isLink); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) closeFaq(true);
    });
  }
})();
