(function () {
  'use strict';

  // Header background on scroll
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .reel-item, .about-content, .contact-email, .contact-social').forEach((el) => {
    observer.observe(el);
  });

  // Footer year
  const yearEl = document.querySelector('.footer .year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', document.body.classList.contains('menu-open'));
      menuBtn.setAttribute('aria-label', document.body.classList.contains('menu-open') ? 'Close menu' : 'Menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Menu');
      });
    });
  }

  // Reels player
  const overlay = document.getElementById('player-overlay');
  const backdrop = overlay && overlay.querySelector('.player-backdrop');
  const closeBtn = overlay && overlay.querySelector('.player-close');
  const playerVideo = overlay && overlay.querySelector('.player-video');
  const playerTitle = overlay && overlay.querySelector('.player-title');

  function openPlayer(src, title) {
    if (!overlay || !playerVideo) return;
    playerVideo.src = src;
    playerVideo.currentTime = 0;
    if (playerTitle) playerTitle.textContent = title || '';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playerVideo.play().catch(function () {});
  }

  function closePlayer() {
    if (!overlay || !playerVideo) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playerVideo.pause();
    playerVideo.removeAttribute('src');
  }

  if (closeBtn) closeBtn.addEventListener('click', closePlayer);
  if (backdrop) backdrop.addEventListener('click', closePlayer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) closePlayer();
  });

  // Reel items: load preview + open player on tap/click
  document.querySelectorAll('.reel-item').forEach((item) => {
    const thumb = item.querySelector('.reel-thumb');
    const preview = item.querySelector('.reel-preview');
    const src = item.getAttribute('data-video-src');
    const poster = item.getAttribute('data-poster');
    const title = item.querySelector('h3') && item.querySelector('h3').textContent;

    if (preview && src) {
      preview.src = src;
      if (poster) preview.poster = poster;
      preview.load();
      thumb.classList.add('loaded');
    }

    if (thumb && src) {
      thumb.addEventListener('click', function (e) {
        e.preventDefault();
        openPlayer(src, title);
      });
    }
  });
})();
