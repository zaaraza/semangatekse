/**
 * PORTFOLIO — script.js
 * Handles: navbar, scroll reveal, skill bars, portfolio filter, contact form
 */

(function () {
  'use strict';

  /* =========================================
     1. NAVBAR — scroll + mobile toggle
     ========================================= */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll: add .scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* =========================================
     2. ACTIVE NAV LINK — highlight on scroll
     ========================================= */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  /* =========================================
     3. SCROLL REVEAL — generic .reveal elements
     ========================================= */
  // Mark elements that should animate
  const revealSelectors = [
    '.section-header',
    '.about-card',
    '.profile-detail',
    '.skill-col',
    '.penugasan-card',
    '.porto-card',
    '.contact-wrap',
    '.partners-logos',
  ];

  function addRevealClass() {
    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('about-card')) { // about-cards have own animation
          el.classList.add('reveal');
        }
      });
    });
  }
  addRevealClass();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
  initReveal();

  /* =========================================
     4. ABOUT CARDS — staggered reveal
     ========================================= */
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.about-card').forEach(card => aboutObserver.observe(card));

  /* =========================================
     5. SKILL BARS — animate width on visible
     ========================================= */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          const w = fill.getAttribute('data-width');
          fill.style.width = w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* =========================================
     6. PORTFOLIO FILTER
     ========================================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portCards = document.querySelectorAll('.porto-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* =========================================
     7. CONTACT FORM — basic validation + feedback
     ========================================= */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cname').value.trim();
      const email = document.getElementById('cemail').value.trim();
      const message = document.getElementById('cmessage').value.trim();

      // Simple validation
      if (!name || !email || !message) {
        showStatus('Mohon isi semua field.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showStatus('Format email tidak valid.', 'error');
        return;
      }

      // Simulate submission
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showStatus('Terima kasih! Pesan kamu telah diterima.', 'success');
        form.reset();
        btn.textContent = 'Send';
        btn.disabled = false;
      }, 1200);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.style.color = type === 'error' ? '#c0392b' : '#5a8a6a';
    setTimeout(() => { formStatus.textContent = ''; }, 4000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* =========================================
     8. SMOOTH SCROLL — offset for fixed nav
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
