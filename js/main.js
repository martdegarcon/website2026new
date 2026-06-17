var CASE_IMAGES = [
  './assets/cases/case-01.png',
  './assets/cases/case-02.png',
  './assets/cases/case-03.png',
  './assets/cases/case-04.png'
];

var SLIDER_SPEED = 100; // px per second

// Scale the fixed 1920px Figma canvas to fit the viewport width — desktop only.
(function () {
  var canvas = document.getElementById('canvas');
  var stage = document.getElementById('stage');
  var BASE_W = 1920, BASE_H = 10720, BREAKPOINT = 1024;
  var DARK_SECTION_TOP = 4470, DARK_SECTION_H = 2994;
  var bleed = document.getElementById('darkSectionBleed');

  function fit() {
    var vw = document.documentElement.clientWidth;
    if (vw <= BREAKPOINT) {
      canvas.style.transform = '';
      stage.style.height = '';
      if (bleed) bleed.style.display = 'none';
      return;
    }
    var scale = Math.min(1, vw / BASE_W);
    canvas.style.transform = 'scale(' + scale + ')';
    stage.style.height = (BASE_H * scale) + 'px';
    if (bleed) {
      bleed.style.display = 'block';
      bleed.style.top = (DARK_SECTION_TOP * scale) + 'px';
      bleed.style.height = (DARK_SECTION_H * scale) + 'px';
    }
  }
  fit();
  window.addEventListener('resize', fit);
})();

// Mobile menu toggle
(function () {
  var btn = document.getElementById('mvMenuBtn');
  var menu = document.getElementById('mvMenu');
  if (!btn) return;
  btn.addEventListener('click', function () { menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });
})();

// Infinite case sliders (hero desktop + mobile)
(function () {
  function fillTrack(track, slideWidth, slideHeight, gap, radius) {
    track.innerHTML = '';
    CASE_IMAGES.concat(CASE_IMAGES).forEach(function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.style.width = slideWidth + 'px';
      img.style.height = slideHeight + 'px';
      img.style.borderRadius = radius + 'px';
      track.appendChild(img);
    });
    track.style.gap = gap + 'px';
    return CASE_IMAGES.length * slideWidth + (CASE_IMAGES.length - 1) * gap;
  }

  function runSlider(track, getSetWidth, speed) {
    var pos = 0;
    var last = null;

    function frame(ts) {
      if (!track.isConnected) return;
      if (last == null) last = ts;
      var dt = (ts - last) / 1000;
      last = ts;
      var setWidth = getSetWidth();
      if (!setWidth) {
        requestAnimationFrame(frame);
        return;
      }
      pos += speed * dt;
      while (pos >= setWidth) pos -= setWidth;
      track.style.transform = 'translateX(' + (-pos) + 'px)';
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  var heroTrack = document.getElementById('heroCasesTrack');
  if (heroTrack) {
    var desktopSetWidth = fillTrack(heroTrack, 424, 400, 8, 24);
    runSlider(heroTrack, function () { return desktopSetWidth; }, SLIDER_SPEED);
  }

  var mvTrack = document.getElementById('mvHeroCasesTrack');
  if (mvTrack) {
    var mvContainer = mvTrack.parentElement;

    function setupMobile() {
      var slideWidth = mvContainer.clientWidth;
      if (!slideWidth) return null;
      return fillTrack(mvTrack, slideWidth, mvContainer.clientHeight, 8, 14);
    }

    var mobileSetWidth = setupMobile();
    runSlider(mvTrack, function () {
      var w = mvContainer.clientWidth;
      if (!w) return mobileSetWidth || 0;
      if (Math.abs(w - (mvTrack.dataset.slideWidth || 0)) > 1) {
        mobileSetWidth = setupMobile();
        mvTrack.dataset.slideWidth = w;
      }
      return mobileSetWidth || 0;
    }, SLIDER_SPEED);

    window.addEventListener('resize', function () {
      mobileSetWidth = setupMobile();
      mvTrack.dataset.slideWidth = mvContainer.clientWidth;
    });
  }
})();
