/* ============================================================
   PORTFOLIO — script.js
   Interactions, animations & dynamic behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Mobile hamburger menu ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ─── Typed text effect ──────────────────────────────────────
  const phrases = [
    'Full Stack Developer',
    'React & Node.js Expert',
    'Cloud Architect',
    'Open Source Contributor',
    'Problem Solver'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typed-text');

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();

  // ─── Animate counter stats ──────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, 16);
    });
  }

  // Trigger counters once hero is visible
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // ─── Skill bar animations ────────────────────────────────────
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => barObserver.observe(cat));

  // ─── Scroll reveal ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.skill-category, .project-card, .timeline-item, .edu-card, .blog-card, .contact-item, .fact-item'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ─── Project filter ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!match) card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ─── Testimonials carousel ──────────────────────────────────
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentSlide = 0;
  let autoplayTimer;

  // Build dots
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot-item' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(idx) {
    testimonialCards[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot-item')[currentSlide].classList.remove('active');
    currentSlide = (idx + testimonialCards.length) % testimonialCards.length;
    testimonialCards[currentSlide].classList.add('active');
    document.querySelectorAll('.dot-item')[currentSlide].classList.add('active');
    resetAutoplay();
  }

  testimonialCards[0].classList.add('active');

  document.getElementById('carousel-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('carousel-next').addEventListener('click', () => goToSlide(currentSlide + 1));

  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // ─── Active nav link on scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle('active-nav', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // ─── Contact form ────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-contact-btn');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      // Shake animation on required fields
      [document.getElementById('contact-name'), document.getElementById('contact-email-input'), document.getElementById('contact-message')]
        .filter(el => !el.value.trim())
        .forEach(el => {
          el.style.borderColor = '#ef4444';
          el.style.animation = 'shake .4s ease';
          setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
        });
      return;
    }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'block';
      submitBtn.textContent = 'Send Message 🚀';
      submitBtn.disabled = false;
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1200);
  });

  // ─── Smooth active nav style ─────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active-nav { color: var(--primary) !important; background: rgba(79,70,229,.06); }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);

});
