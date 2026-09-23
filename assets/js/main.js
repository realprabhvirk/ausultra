(function () {
  'use strict';

  if (window.lucide) window.lucide.createIcons();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navbar = document.querySelector('.navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      navbar.classList.toggle('nav-open');
    });
  }

  /* ---------- Testimonials slider ---------- */
  var testimonials = [
    { quote: 'AusUltra did an amazing job on our backyard. Professional, reliable and the quality is top notch. Highly recommend!', author: '— Brisbane Client', rating: 4 },
    { quote: 'From the quote to the finished driveway, everything was on time and exactly as promised. Couldn’t be happier.', author: '— Brisbane Client', rating: 5 },
    { quote: 'Our retaining wall looks incredible and the whole crew was easy to deal with from start to finish.', author: '— Brisbane Client', rating: 5 }
  ];
  var tIndex = 0;
  var quoteEl = document.getElementById('testimonialQuote');
  var authorEl = document.getElementById('testimonialAuthor');
  var starsEl = document.getElementById('testimonialStars');
  var prevBtn = document.getElementById('testimonialPrev');
  var nextBtn = document.getElementById('testimonialNext');

  function renderTestimonial() {
    var t = testimonials[tIndex];
    if (!t) return;
    if (quoteEl) quoteEl.textContent = t.quote;
    if (authorEl) authorEl.textContent = t.author;
    if (starsEl) {
      var stars = starsEl.querySelectorAll('.icon-star');
      stars.forEach(function (star, i) {
        star.classList.toggle('is-filled', i < t.rating);
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    tIndex = (tIndex + 1) % testimonials.length;
    renderTestimonial();
  });

  document.addEventListener('DOMContentLoaded', renderTestimonial);
  if (document.readyState !== 'loading') renderTestimonial();

  /* ---------- Cinematic scroll-scrubbed hero video ---------- */
  var heroScroll = document.getElementById('heroScroll');
  var video = document.getElementById('heroVideo');
  var videoScale = document.getElementById('heroVideoScale');
  var scrollCue = document.getElementById('heroScrollCue');

  if (heroScroll && video) {
    // The video finishes at VIDEO_FRACTION of the pinned scroll range; the remaining
    // tail just holds on the final frame (still pinned) so the finished shot is
    // actually visible for a beat before the section releases into the page below.
    var VIDEO_FRACTION = 0.7;
    var duration = 0;
    var ready = false;
    var heroTop = 0;
    var scrollRange = 1;
    var targetProgress = 0;
    var currentProgress = 0;
    var rafId = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function measure() {
      heroTop = heroScroll.offsetTop;
      scrollRange = Math.max(heroScroll.offsetHeight - window.innerHeight, 1);
    }

    function primeVideo() {
      var p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(function () { video.pause(); }).catch(function () {});
      } else {
        video.pause();
      }
    }

    function updateTarget() {
      var scrollY = window.scrollY || window.pageYOffset;
      var pinProgress = Math.min(Math.max((scrollY - heroTop) / scrollRange, 0), 1);
      targetProgress = Math.min(Math.max(pinProgress / VIDEO_FRACTION, 0), 1);
      if (scrollCue) scrollCue.classList.toggle('is-hidden', pinProgress > 0.03);
      startLoop();
    }

    function startLoop() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function tick() {
      rafId = null;
      var delta = targetProgress - currentProgress;
      if (Math.abs(delta) < 0.0008) {
        currentProgress = targetProgress;
        renderFrame();
        return;
      }
      // Track real scroll position closely (light smoothing only, not a lag-behind
      // animation) so a fast scroll never leaves the video visibly behind where
      // the page actually is.
      currentProgress += delta * 0.35;
      renderFrame();
      rafId = requestAnimationFrame(tick);
    }

    function renderFrame() {
      if (!ready) return;
      var time = currentProgress * duration;
      if (Math.abs(video.currentTime - time) > 0.008) {
        try { video.currentTime = time; } catch (e) {}
      }
      if (!reduceMotion) {
        var scale = 1.08 - currentProgress * 0.08;
        videoScale.style.transform = 'scale(' + scale.toFixed(4) + ')';
      }
    }

    function onMetadata() {
      duration = video.duration;
      ready = !!duration && isFinite(duration);
      video.pause();
      primeVideo();
      measure();
      updateTarget();
      currentProgress = targetProgress;
      renderFrame();
    }

    if (video.readyState >= 1) {
      onMetadata();
    } else {
      video.addEventListener('loadedmetadata', onMetadata, { once: true });
    }

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', function () {
      measure();
      updateTarget();
    });

    measure();
  }
})();
