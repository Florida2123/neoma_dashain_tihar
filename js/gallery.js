/**
 * ====================================================================
 * PHOTO GALLERY & LIGHTBOX MODULE
 * ====================================================================
 * High-performance, accessible image gallery with full-screen lightbox,
 * keyboard navigation, touch swipe support, and masonry/grid layouts.
 */

class DiaryGallery {
  constructor() {
    this.container = document.getElementById('diary-photo-gallery');
    this.lightbox = document.getElementById('gallery-lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxCounter = document.getElementById('lightbox-counter');
    this.lightboxCategory = document.getElementById('lightbox-category');
    this.closeBtn = document.getElementById('lightbox-close-btn');
    this.prevBtn = document.getElementById('lightbox-prev-btn');
    this.nextBtn = document.getElementById('lightbox-next-btn');

    this.items = (typeof DIARY_CONTENT !== 'undefined' && DIARY_CONTENT.gallery) 
      ? DIARY_CONTENT.gallery 
      : [];

    this.currentIndex = 0;
    this.isOpen = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.renderGallery();
    this.bindEvents();
  }

  renderGallery() {
    if (!this.container) return;

    this.container.innerHTML = '';
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-card card-aspect-${item.aspect || 'square'} scroll-reveal`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View photo: ${item.title}`);
      card.dataset.index = index;

      card.innerHTML = `
        <div class="gallery-card-inner">
          <div class="washi-tape-accent" aria-hidden="true"></div>
          <div class="image-wrapper">
            <img src="${item.src}" alt="${item.title}" loading="lazy" class="gallery-thumb" onerror="this.src='assets/images/hero.svg'">
          </div>
          <div class="gallery-card-footer">
            <div class="gallery-card-header">
              <span class="gallery-card-tag">${item.category}</span>
              <button class="gallery-heart-btn" type="button" aria-label="Like ${item.title}">
                <span class="card-heart" aria-hidden="true">♡</span>
              </button>
            </div>
            <h3 class="card-caption-snippet">${item.title}</h3>
            <p class="gallery-card-story">${item.caption}</p>
            <div class="gallery-card-hint">
              <span>🔍 Click / tap to enlarge</span>
            </div>
          </div>
        </div>
      `;

      // Heart button interaction with sparkle sound
      const heartBtn = card.querySelector('.gallery-heart-btn');
      if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const heart = heartBtn.querySelector('.card-heart');
          const isLiked = heartBtn.classList.toggle('liked');
          if (heart) {
            heart.textContent = isLiked ? '♥' : '♡';
            heart.style.color = isLiked ? 'var(--rose-deep)' : '';
          }
          if (isLiked && window.diaryAudio && typeof window.diaryAudio.playSparkle === 'function') {
            window.diaryAudio.playSparkle();
          }
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-heart-btn')) return;
        this.open(index);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });

      this.container.appendChild(card);
    });
  }

  bindEvents() {
    if (!this.lightbox) return;

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Click outside image to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) {
        this.close();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch swipe gestures for mobile
    this.lightbox.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.prev(); // swipe right -> show previous
      } else {
        this.next(); // swipe left -> show next
      }
    }
  }

  open(index) {
    if (!this.items.length) return;
    this.currentIndex = (index + this.items.length) % this.items.length;
    this.isOpen = true;
    this.updateLightboxContent();

    this.lightbox.classList.add('active');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }

  close() {
    this.isOpen = false;
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to triggered card
    const lastCard = this.container.querySelector(`[data-index="${this.currentIndex}"]`);
    if (lastCard) lastCard.focus();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateLightboxContent();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const item = this.items[this.currentIndex];
    if (!item) return;

    if (this.lightboxImg) {
      this.lightboxImg.classList.add('loading');
      this.lightboxImg.src = item.src;
      this.lightboxImg.alt = item.title;
      this.lightboxImg.onerror = () => {
        this.lightboxImg.classList.remove('loading');
        this.lightboxImg.src = 'assets/images/hero.svg';
      };
      this.lightboxImg.onload = () => {
        this.lightboxImg.classList.remove('loading');
      };
      if (this.lightboxImg.complete) {
        this.lightboxImg.classList.remove('loading');
      }
    }

    if (this.lightboxCaption) {
      this.lightboxCaption.innerHTML = `
        <h4 class="lightbox-title">${item.title}</h4>
        <p class="lightbox-text">${item.caption}</p>
      `;
    }

    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }

    if (this.lightboxCategory) {
      this.lightboxCategory.textContent = item.category;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.diaryGallery = new DiaryGallery();
});

