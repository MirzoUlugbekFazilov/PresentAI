/* ============================================================
   PresentAI — shared behaviours
   Progressive enhancement only: every page works without this file.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // No IntersectionObserver (or user prefers less motion): show everything.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);   // one-shot, keeps the main thread quiet
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Cursor spotlight on cards ---------- */
  function initSpotlight() {
    if (reduceMotion || window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.spotlight').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Navbar shadow on scroll ---------- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Marketing mobile menu ---------- */
  function initMobileMenu() {
    var burger = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close after tapping a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Character counters ---------- */
  // Wires any <textarea data-counter="elementId"> to its counter span,
  // and auto-grows the textarea up to a max height.
  function initCounters() {
    document.querySelectorAll('[data-counter]').forEach(function (ta) {
      var out = document.getElementById(ta.getAttribute('data-counter'));
      var maxH = parseInt(ta.getAttribute('data-maxheight') || '300', 10);

      function sync() {
        if (out) out.textContent = ta.value.length;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, maxH) + 'px';
      }
      ta.addEventListener('input', sync);
      sync();
    });
  }

  /* ---------- Password reveal ---------- */
  var EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  var EYE_OFF = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      var input = document.getElementById(btn.getAttribute('data-toggle-password'));
      var icon = btn.querySelector('svg');
      if (!input || !icon) return;

      btn.addEventListener('click', function () {
        var hidden = input.type === 'password';
        input.type = hidden ? 'text' : 'password';
        icon.innerHTML = hidden ? EYE_OFF : EYE;
        btn.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
      });
    });
  }

  /* ---------- App sidebar ---------- */
  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var burger = document.getElementById('hamburger');
    if (!sidebar) return;

    function setOpen(open) {
      sidebar.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('active', open);
      if (burger) {
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      document.body.style.overflow = open ? 'hidden' : '';
    }

    // Exposed globally: inline onclick="toggleSidebar()" still works.
    window.toggleSidebar = function () {
      setOpen(!sidebar.classList.contains('open'));
    };

    if (overlay) overlay.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false);
    });
  }

  /* ---------- Modals ---------- */
  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      // Click the backdrop (not the panel) to dismiss
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
        m.classList.remove('active');
      });
    });
  }

  /* ---------- Count-up stats ---------- */
  function initCountUp() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.getAttribute('data-count-to'));
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = (el.getAttribute('data-count-to').split('.')[1] || '').length;
        var started = null;

        function step(ts) {
          if (started === null) started = ts;
          var p = Math.min((ts - started) / 1400, 1);
          var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initReveal();
    initSpotlight();
    initNavScroll();
    initMobileMenu();
    initCounters();
    initPasswordToggles();
    initSidebar();
    initModals();
    initCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
