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
})();
