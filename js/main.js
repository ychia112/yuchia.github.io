/* ============================================================
   THEO CHENG PORTFOLIO — main.js v3
   Features: typewriter, scroll counters, project filter,
             reveal-on-scroll, theme toggle, nav scroll, mobile nav
   ============================================================ */

// ── THEME TOGGLE ──────────────────────────────────────────────
// Theme state (in-memory, dark default)
var _currentTheme = 'dark';
document.documentElement.setAttribute('data-theme', _currentTheme);

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE BUTTON ─────────────────────────────────────
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const sunIcon  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

    function updateThemeIcon() {
      const current = document.documentElement.getAttribute('data-theme');
      themeBtn.innerHTML = current === 'dark' ? sunIcon : moonIcon;
      themeBtn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    updateThemeIcon();

    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      _currentTheme = next;
      document.documentElement.setAttribute('data-theme', next);
      updateThemeIcon();
    });
  }

  // ── SCROLL-AWARE NAV ────────────────────────────────────────
  const nav = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    // Hide nav on fast scroll down, show on scroll up
    if (y > lastY + 8 && y > 200) {
      nav.classList.add('nav--hidden');
    } else if (y < lastY - 4) {
      nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }, { passive: true });

  // ── MOBILE NAV ──────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function closeMobileNav() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.classList.toggle('is-open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ── TYPEWRITER EFFECT ───────────────────────────────────────
  const roles = ['ML Engineer', 'Data Scientist'];
  const el    = document.getElementById('typewriter-text');
  const cursor = document.querySelector('.typewriter-cursor');
  if (el) {
    let roleIdx   = 0;
    let charIdx   = 0;
    let deleting  = false;
    let pauseFor  = 0;

    function type() {
      const role = roles[roleIdx];

      if (pauseFor > 0) {
        pauseFor--;
        setTimeout(type, 80);
        return;
      }

      if (!deleting) {
        el.textContent = role.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === role.length) {
          deleting = true;
          pauseFor = 20; // hold full word
        }
        setTimeout(type, 90);
      } else {
        el.textContent = role.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting  = false;
          roleIdx   = (roleIdx + 1) % roles.length;
          pauseFor  = 5;
        }
        setTimeout(type, 45);
      }
    }

    // Cursor blink
    if (cursor) {
      setInterval(() => cursor.classList.toggle('blink-off'), 530);
    }

    // Start typewriter after a brief delay
    setTimeout(type, 600);
  }

  // ── REVEAL ON SCROLL ────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── ANIMATED COUNTERS ───────────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  let countersTriggered = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      const mode   = counter.dataset.mode || 'int';
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * ease);

        if (mode === 'decimal') {
          counter.textContent = '0.' + String(current).padStart(2, '0');
        } else {
          counter.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (mode === 'decimal') {
            counter.textContent = '0.' + target;
          } else {
            counter.textContent = target + suffix;
          }
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counters when hero stats scroll into view
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersTriggered) {
        countersTriggered = true;
        animateCounters();
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(heroStats);
  }

  // ── PROJECT FILTER ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.style.display = '';
          // Re-trigger reveal animation
          card.classList.remove('is-visible');
          setTimeout(() => card.classList.add('is-visible'), 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── SKILL BAR ANIMATION ─────────────────────────────────────
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillBarSection = document.querySelector('.skill-bars');

  if (skillBarSection && skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillBars.forEach((bar, i) => {
          const width = bar.dataset.width + '%';
          setTimeout(() => {
            bar.style.width = width;
          }, i * 120);
        });
        barObserver.disconnect();
      }
    }, { threshold: 0.2 });
    barObserver.observe(skillBarSection);
  }

  // ── ACTIVE NAV LINKS ────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ── SMOOTH SCROLL POLISH ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
