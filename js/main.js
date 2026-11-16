/**
 * ====================================================================
 * MAIN APPLICATION LOGIC
 * ====================================================================
 * - Hydrates semantic DOM elements from DIARY_CONTENT
 * - Sticky navigation with backdrop blur & scroll-spy
 * - Mobile hamburger drawer
 * - Smooth scroll & IntersectionObserver reveals
 * - HTML5 video interaction & graceful fallback
 * - Back to top & interactive memory love counter
 * - Dynamic copyright year
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hydrate Content from DIARY_CONTENT (if available)
  hydrateContent();

  // 2. Navigation & Scroll Spy
  setupNavigation();

  // 3. Scroll Reveal Animations via IntersectionObserver
  setupScrollReveals();

  // 4. Video Player Handlers
  setupVideoPlayers();

  // 5. Back to Top Button
  setupBackToTop();

  // 6. Interactive Diary Heart Counter
  setupHeartCounter();

  // 7. Dynamic Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 8. Mobile touch hover effects
  setupMobileCardTouchEffects();
});

/**
 * Hydrates dynamic content fields from content.js
 */
function hydrateContent() {
  if (typeof DIARY_CONTENT === 'undefined') return;

  const { studentInfo, hero, vacationOverview, dashain, tihar, videoMemories, favoriteMemories, learnings, closing } = DIARY_CONTENT;

  // Student Info
  safeSetText('.student-name', studentInfo.studentName);
  safeSetText('.student-grade', studentInfo.classGrade);
  safeSetText('.student-school', studentInfo.schoolName);
  safeSetText('.hero-welcome-badge', studentInfo.welcomeBadge);

  // Hero Section
  safeSetText('#hero-title', hero.title);
  safeSetText('#hero-subtitle', hero.subtitle);
  safeSetText('#hero-intro', hero.introText);
  const heroImg = document.getElementById('hero-main-img');
  if (heroImg && hero.heroImage) {
    heroImg.src = hero.heroImage;
  }
  safeSetText('#hero-img-caption', hero.heroCaption);

  // Vacation Overview
  safeSetText('#overview-heading', vacationOverview.heading);
  safeSetText('#overview-subheading', vacationOverview.subheading);
  safeSetText('#overview-note', vacationOverview.personalNote);
  safeSetText('#overview-quote', vacationOverview.handwrittenQuote);

  // Render Stats
  const statsContainer = document.getElementById('overview-stats-grid');
  if (statsContainer && vacationOverview.stats) {
    statsContainer.innerHTML = vacationOverview.stats.map(s => `
      <div class="stat-card">
        <span class="stat-number">${s.number}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  // Dashain Section
  safeSetText('#dashain-heading', dashain.heading);
  safeSetText('#dashain-subtitle', dashain.subtitle);
  safeSetText('#dashain-desc', dashain.description);
  safeSetText('#dashain-quote', dashain.personalQuote);

  const dashainCollage = document.getElementById('dashain-collage-grid');
  if (dashainCollage && dashain.highlights) {
    dashainCollage.innerHTML = dashain.highlights.map((h, i) => `
      <div class="collage-item collage-item-${i + 1} scroll-reveal">
        <div class="washi-tape-accent" aria-hidden="true"></div>
        <div class="polaroid-frame">
          <img src="${h.image}" alt="${h.title}" loading="lazy" class="collage-photo" onerror="this.src='assets/images/hero.svg'">
          <div class="polaroid-caption">
            <span class="polaroid-tag">${h.label}</span>
            <h4 class="polaroid-title">${h.title}</h4>
            <p class="polaroid-text">${h.caption}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Tihar Section
  safeSetText('#tihar-heading', tihar.heading);
  safeSetText('#tihar-subtitle', tihar.subtitle);
  safeSetText('#tihar-desc', tihar.description);

  const tiharCollage = document.getElementById('tihar-collage-grid');
  if (tiharCollage && tihar.highlights) {
    tiharCollage.innerHTML = tihar.highlights.map((h, i) => `
      <div class="tihar-item tihar-item-${i + 1} scroll-reveal">
        <div class="tihar-card-glow"></div>
        <div class="tihar-card-content">
          <div class="tihar-img-wrapper">
            <img src="${h.image}" alt="${h.title}" loading="lazy" class="tihar-photo" onerror="this.src='assets/images/hero.svg'">
            <span class="tihar-diyo-icon" aria-hidden="true">🪔</span>
          </div>
          <div class="tihar-info">
            <span class="tihar-tag">${h.label}</span>
            <h4 class="tihar-title">${h.title}</h4>
            <p class="tihar-text">${h.caption}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Favorite Memories
  const favGrid = document.getElementById('favorites-scrapbook-grid');
  if (favGrid && favoriteMemories) {
    favGrid.innerHTML = favoriteMemories.map((fav, idx) => `
      <div class="scrapbook-card scrapbook-card-${idx % 2 === 0 ? 'left' : 'right'} scroll-reveal">
        <div class="scrapbook-tape" aria-hidden="true"></div>
        <div class="scrapbook-inner">
          <div class="scrapbook-media">
            <img src="${fav.image}" alt="${fav.title}" loading="lazy" onerror="this.src='assets/images/hero.svg'">
          </div>
          <div class="scrapbook-content">
            <div class="scrapbook-badge"><span class="badge-icon">${fav.icon}</span> ${fav.title}</div>
            <h4 class="scrapbook-title">${fav.highlight}</h4>
            <p class="scrapbook-desc">${fav.description}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Learnings Section
  safeSetText('#learnings-heading', learnings.heading);
  safeSetText('#learnings-subheading', learnings.subheading);
  const learningsList = document.getElementById('learnings-list');
  if (learningsList && learnings.points) {
    learningsList.innerHTML = learnings.points.map((p, i) => `
      <div class="learning-card scroll-reveal">
        <div class="learning-num">0${i + 1}</div>
        <div class="learning-body">
          <h4 class="learning-title">${p.title}</h4>
          <p class="learning-text">${p.text}</p>
        </div>
      </div>
    `).join('');
  }

  // Closing Section
  safeSetText('#closing-heading', closing.heading);
  safeSetText('#closing-quote', closing.quote);
  safeSetText('#closing-signoff', closing.signoff);
  const closingImg = document.getElementById('closing-image');
  if (closingImg && closing.image) {
    closingImg.src = closing.image;
  }

  // Video Section
  renderVideos(videoMemories);
}

function safeSetText(selector, text) {
  if (!text) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.textContent = text;
  });
}

/**
 * Renders HTML5 Video Cards with local source fallback notice
 */
function renderVideos(videos) {
  const container = document.getElementById('video-memories-grid');
  if (!container || !videos) return;

  container.innerHTML = videos.map((v, i) => `
    <div class="video-card scroll-reveal">
      <div class="video-player-box">
        <video 
          id="video-player-${i}" 
          class="html5-video" 
          poster="${v.poster}" 
          controls 
          preload="metadata"
          playsinline>
          <source src="${v.videoSrc}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
        <div class="video-placeholder-hint">
          <span class="hint-icon">📹</span>
          <p class="hint-text">To display your personal video, place an MP4 file in <code>assets/videos/</code> and update <code>content.js</code>.</p>
        </div>
      </div>
      <div class="video-info">
        <h4 class="video-title">${v.title}</h4>
        <p class="video-caption">${v.caption}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Sticky Navigation, Mobile Menu & Scroll Spy
 */
function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle-btn');
  const navLinks = document.getElementById('nav-links');
  const allNavAnchors = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Ensure Mobile Backdrop Overlay exists
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  function updateScrollSpy() {
    if (!sections.length) return;
    const scrollPos = window.scrollY + 180;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        allNavAnchors.forEach(a => {
          const href = a.getAttribute('href');
          if (href && href.startsWith('#')) {
            if (href === `#${id}`) {
              a.classList.add('active');
            } else {
              a.classList.remove('active');
            }
          }
        });
      }
    });
  }

  // Sticky blur on scroll
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    updateScrollSpy();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Helper functions to open and close mobile menu
  function openMobileMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('active');
    navLinks.classList.add('nav-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('nav-menu-open');
  }

  function closeMobileMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    navLinks.classList.remove('nav-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('nav-menu-open');
  }

  // Mobile menu toggle click
  if (navToggle && navLinks) {
    navToggle.setAttribute('aria-controls', 'nav-links');
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('nav-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking link
    allNavAnchors.forEach(a => {
      a.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('nav-open')) {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close menu on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    // Automatically close mobile menu if viewport resized to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('nav-open')) {
        closeMobileMenu();
      }
    }, { passive: true });
  }
}

/**
 * IntersectionObserver for scroll-reveal effects
 */
function setupScrollReveals() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Graceful video handling: detect if local video fails to load and show helpful guide
 */
function setupVideoPlayers() {
  const videos = document.querySelectorAll('.html5-video');
  videos.forEach(video => {
    video.addEventListener('error', () => {
      const parent = video.closest('.video-player-box');
      if (parent) {
        parent.classList.add('video-missing');
      }
    });
  });
}

/**
 * Back to top floating button
 */
function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Interactive "Love this diary" heart counter in the overview
 */
function setupHeartCounter() {
  const heartBtn = document.getElementById('like-diary-btn');
  const countSpan = document.getElementById('like-diary-count');
  if (!heartBtn || !countSpan) return;

  // Clear previously persisted localStorage count so it resets on reopen
  try {
    localStorage.removeItem('supriya_diary_hearts');
  } catch (e) {}

  const parsed = parseInt(countSpan.textContent.trim(), 10);
  let count = Number.isNaN(parsed) ? 0 : parsed;
  countSpan.textContent = count;

  heartBtn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;

    // Gentle heart burst animation
    heartBtn.classList.add('heart-burst');
    setTimeout(() => heartBtn.classList.remove('heart-burst'), 600);

    // Play sparkling crystal heart chime if sound is enabled
    if (window.settingsManager?.audioPlayer?.playHeartSparkle) {
      window.settingsManager.audioPlayer.playHeartSparkle();
    }

    // Spawn floating hearty particles
    spawnFloatingHearts(heartBtn);
  });
}

/**
 * Spawns floating heart particles radiating upward from button
 */
function spawnFloatingHearts(button) {
  const heartSymbols = ['💖', '💕', '💗', '✨', 'icon'];
  const burstCount = 2;

  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart-particle';
    heart.setAttribute('aria-hidden', 'true');

    const choice = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    if (choice === 'icon') {
      const img = document.createElement('img');
      img.src = 'assets/images/heart-icon.png';
      img.alt = '';
      heart.appendChild(img);
    } else {
      heart.textContent = choice;
    }

    // Upward radial trajectory with subtle spread
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
    const distance = 50 + Math.random() * 45;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = (Math.random() - 0.5) * 30;
    const size = 15 + Math.random() * 6;

    // Spawn near the heart icon inside the button
    const startX = 18 + (Math.random() - 0.5) * 12;
    const startY = 12 + (Math.random() - 0.5) * 8;

    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);
    heart.style.setProperty('--rot', `${rot}deg`);
    heart.style.fontSize = `${size}px`;

    button.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 800);
  }
}

// Enable native :active CSS pseudo-class on WebKit / iOS touch devices
document.addEventListener('touchstart', () => {}, { passive: true });

/**
 * Mobile touch & over effect handling for all pictures and cards
 */
function setupMobileCardTouchEffects() {
  const cards = document.querySelectorAll(
    '.hero-scrapbook-frame, .collage-item, .tihar-item, .gallery-card, .scrapbook-card, .closing-card, .feature-showcase-card, .stat-card'
  );

  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;

  cards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
      card.classList.add('touch-active');
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      const diffX = Math.abs(e.touches[0].clientX - touchStartX);
      const diffY = Math.abs(e.touches[0].clientY - touchStartY);
      if (diffX > 10 || diffY > 10) {
        touchMoved = true;
        card.classList.remove('touch-active');
      }
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      if (!touchMoved) {
        // Deliberate tap: toggle is-hovered for mobile over effect
        if (!e.target.closest('.gallery-heart-btn, .like-btn')) {
          const willBeActive = !card.classList.contains('is-hovered');
          cards.forEach(c => {
            if (c !== card) c.classList.remove('is-hovered', 'touch-active');
          });
          card.classList.toggle('is-hovered', willBeActive);
          card.classList.toggle('touch-active', willBeActive);
        }
      } else {
        card.classList.remove('touch-active');
      }
    }, { passive: true });

    card.addEventListener('touchcancel', () => {
      card.classList.remove('touch-active');
    }, { passive: true });
  });

  // Tap outside dismisses over effect
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.hero-scrapbook-frame, .collage-item, .tihar-item, .gallery-card, .scrapbook-card, .closing-card, .feature-showcase-card, .stat-card')) {
      cards.forEach(c => c.classList.remove('is-hovered', 'touch-active'));
    }
  }, { passive: true });
}
