/**
 * ====================================================================
 * SETTINGS PANEL CONTROLLER
 * ====================================================================
 * Manages all 9 customizable preferences:
 * 1. Theme (Sakura Pink, Soft Rose, Lavender Dream, Cream, Dark Rose)
 * 2. Petals (Enable / Disable)
 * 3. Petal Density (Low, Medium, High)
 * 4. Font Size (Small, Medium, Large)
 * 5. Music (Enable / Disable, Volume / Mute)
 * 6. Animation Effects (Enable / Disable)
 * 7. Gallery Layout (Masonry, Grid)
 * 8. Reading Mode (Distraction-free toggle)
 * 9. Reset Settings
 * 
 * Persisted in localStorage and synchronized live.
 */

const DEFAULT_SETTINGS = {
  theme: 'sakura',
  petalsEnabled: true,
  petalDensity: 'medium',
  fontSize: 'medium',
  musicEnabled: true,
  musicVolume: 0.6,
  animationsEnabled: true,
  galleryLayout: 'masonry',
  readingMode: false
};

class DiaryAudioPlayer {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = DEFAULT_SETTINGS.musicVolume;
    this.isPlaying = false;
    this.customFileSource = 'assets/music/bgm.mp3';
    this.synthContext = null;
    this.synthInterval = null;
    this.synthGain = null;
    this.activeTimeouts = [];
  }

  getOrCreateContext() {
    if (!this.synthContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.synthContext = new AudioCtx();
      this.synthGain = this.synthContext.createGain();
      const vol = this.audioElement.volume !== undefined ? this.audioElement.volume : 0.6;
      this.synthGain.gain.setValueAtTime(vol * 0.45, this.synthContext.currentTime);
      this.synthGain.connect(this.synthContext.destination);
    }
    if (this.synthContext.state === 'suspended') {
      this.synthContext.resume();
    }
    return this.synthContext;
  }

  setVolume(val) {
    const vol = Math.max(0, Math.min(1, parseFloat(val)));
    this.audioElement.volume = vol;
    if (this.synthGain && this.synthContext) {
      this.synthGain.gain.setTargetAtTime(vol * 0.45, this.synthContext.currentTime, 0.05);
    }
  }

  play() {
    this.isPlaying = true;
    if (this.customFileSource) {
      this.audioElement.src = this.customFileSource;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.startAmbientChimes();
        });
      } else {
        this.startAmbientChimes();
      }
    } else {
      this.startAmbientChimes();
    }
  }

  stop() {
    this.isPlaying = false;
    try {
      this.audioElement.pause();
    } catch (e) {}
    this.stopAmbientChimes();
  }

  playChimeTone(freq, gainMult = 1.0, duration = 2.2) {
    if (!this.isPlaying) return;
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Fundamental warm body tone (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // 2. Crisp harmonic sparkle overtone (Triangle at 2.756x for clear music box ping)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.756, now);

    // Envelope gains
    const noteGain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    // Fast 5ms attack for sparkling clarity, then smooth bell decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.7 * gainMult, now + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Overtone strike decay (0.35s ping)
    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.26 * gainMult, now + 0.004);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);
    noteGain.connect(this.synthGain);
    overtoneGain.connect(this.synthGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + 0.4);
  }

  startAmbientChimes() {
    if (this.synthInterval) return;
    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    // Soothing Ghibli-inspired pentatonic music box melody
    const melody = [
      { freq: 523.25, gain: 0.9, dur: 2.2, delay: 0 },    // C5
      { freq: 659.25, gain: 0.85, dur: 1.8, delay: 650 }, // E5
      { freq: 783.99, gain: 0.95, dur: 2.2, delay: 1300 },// G5
      { freq: 659.25, gain: 0.75, dur: 1.6, delay: 2000 },// E5

      { freq: 587.33, gain: 0.85, dur: 2.0, delay: 2700 },// D5
      { freq: 523.25, gain: 0.8, dur: 1.6, delay: 3350 }, // C5
      { freq: 440.00, gain: 0.9, dur: 2.2, delay: 4000 }, // A4
      { freq: 493.88, gain: 0.75, dur: 1.8, delay: 4700 },// B4

      { freq: 523.25, gain: 0.9, dur: 2.5, delay: 5450 }, // C5
      { freq: 659.25, gain: 0.85, dur: 1.8, delay: 6200 },// E5
      { freq: 880.00, gain: 0.95, dur: 2.6, delay: 6900 },// A5
      { freq: 783.99, gain: 0.85, dur: 2.8, delay: 7800 },// G5
    ];

    const phraseDuration = 9000;

    const playPhrase = () => {
      if (!this.isPlaying) return;
      melody.forEach(item => {
        const tid = setTimeout(() => {
          if (this.isPlaying) {
            this.playChimeTone(item.freq, item.gain, item.dur);
          }
        }, item.delay);
        this.activeTimeouts.push(tid);
      });
    };

    playPhrase();
    this.synthInterval = setInterval(playPhrase, phraseDuration);
  }

  stopAmbientChimes() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.activeTimeouts.forEach(id => clearTimeout(id));
    this.activeTimeouts = [];
  }

  playHeartSparkle() {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const sparkleNotes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    sparkleNotes.forEach((freq, idx) => {
      const t = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const oscOver = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      oscOver.type = 'triangle';
      oscOver.frequency.setValueAtTime(freq * 2.756, t);

      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.45, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);

      osc.connect(g);
      oscOver.connect(g);
      g.connect(this.synthGain || ctx.destination);

      osc.start(t);
      oscOver.start(t);
      osc.stop(t + 0.7);
      oscOver.stop(t + 0.4);
    });
  }
}

class SettingsManager {
  constructor() {
    this.storageKey = 'supriya_diary_settings_v1';
    this.settings = this.loadSettings();
    this.audioPlayer = new DiaryAudioPlayer();

    this.drawer = document.getElementById('settings-drawer');
    this.overlay = document.getElementById('settings-overlay');
    this.openBtn = document.getElementById('open-settings-btn');
    this.closeBtn = document.getElementById('close-settings-btn');
    this.resetBtn = document.getElementById('reset-settings-btn');

    this.isOpen = false;

    this.initUIBindings();
    this.applyAllSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.musicV2Initialized) {
          parsed.musicEnabled = true;
          parsed.musicV2Initialized = true;
        }
        return Object.assign({}, DEFAULT_SETTINGS, parsed);
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage', e);
    }
    return Object.assign({}, DEFAULT_SETTINGS, { musicV2Initialized: true });
  }

  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage', e);
    }
  }

  initUIBindings() {
    // Open / Close Drawer
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openDrawer());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeDrawer());
    }

    // Keyboard support: Escape closes drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });

    // 1. Theme Selection
    const themeInputs = document.querySelectorAll('input[name="diary-theme"]');
    themeInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    });

    // 2. Petals Toggle
    const petalToggle = document.getElementById('setting-petals');
    if (petalToggle) {
      petalToggle.addEventListener('change', (e) => {
        this.setPetalsEnabled(e.target.checked);
      });
    }

    // 3. Petal Density
    const densitySelect = document.getElementById('setting-density');
    if (densitySelect) {
      densitySelect.addEventListener('change', (e) => {
        this.setPetalDensity(e.target.value);
      });
    }

    // 4. Font Size
    const fontSelect = document.getElementById('setting-fontsize');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        this.setFontSize(e.target.value);
      });
    }

    // 5. Music Toggle & Volume
    const musicToggle = document.getElementById('setting-music');
    const musicVolume = document.getElementById('setting-volume');
    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        this.setMusicEnabled(e.target.checked);
      });
    }
    if (musicVolume) {
      musicVolume.addEventListener('input', (e) => {
        this.setMusicVolume(e.target.value);
      });
    }

    // Also support quick music toggle in navbar if present
    const navMusicBtn = document.getElementById('nav-music-btn');
    if (navMusicBtn) {
      navMusicBtn.addEventListener('click', () => {
        const newState = !this.settings.musicEnabled;
        this.setMusicEnabled(newState);
        if (musicToggle) musicToggle.checked = newState;
      });
    }

    // 6. Animations Toggle
    const animToggle = document.getElementById('setting-animations');
    if (animToggle) {
      animToggle.addEventListener('change', (e) => {
        this.setAnimationsEnabled(e.target.checked);
      });
    }

    // 7. Gallery Layout
    const layoutRadios = document.querySelectorAll('input[name="gallery-layout"]');
    layoutRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.setGalleryLayout(e.target.value);
      });
    });

    // 8. Reading Mode
    const readingToggle = document.getElementById('setting-reading-mode');
    if (readingToggle) {
      readingToggle.addEventListener('change', (e) => {
        this.setReadingMode(e.target.checked);
      });
    }

    // 9. Reset Settings
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (confirm('Reset all diary appearance settings to original defaults?')) {
          this.resetToDefaults();
        }
      });
    }
  }

  openDrawer() {
    this.isOpen = true;
    if (this.drawer) {
      this.drawer.classList.add('open');
      this.drawer.setAttribute('aria-hidden', 'false');
    }
    if (this.overlay) {
      this.overlay.classList.add('active');
    }
    if (this.openBtn) {
      this.openBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden'; // prevent background scrolling while drawer open
  }

  closeDrawer() {
    this.isOpen = false;
    if (this.drawer) {
      this.drawer.classList.remove('open');
      this.drawer.setAttribute('aria-hidden', 'true');
    }
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    if (this.openBtn) {
      this.openBtn.setAttribute('aria-expanded', 'false');
      this.openBtn.focus();
    }
    document.body.style.overflow = '';
  }

  setTheme(themeName) {
    this.settings.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    this.saveSettings();
    this.syncFormControls();
  }

  setPetalsEnabled(enabled) {
    this.settings.petalsEnabled = enabled;
    if (window.sakuraEngine) {
      window.sakuraEngine.setEnabled(enabled);
    }
    this.saveSettings();
    this.syncFormControls();
  }

  setPetalDensity(density) {
    this.settings.petalDensity = density;
    if (window.sakuraEngine) {
      window.sakuraEngine.setDensity(density);
    }
    this.saveSettings();
  }

  setFontSize(size) {
    this.settings.fontSize = size;
    document.documentElement.setAttribute('data-font-size', size);
    this.saveSettings();
  }

  setMusicEnabled(enabled) {
    this.settings.musicEnabled = enabled;
    if (enabled) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.stop();
    }
    this.saveSettings();
    this.updateNavMusicIcon(enabled);
  }

  setMusicVolume(vol) {
    this.settings.musicVolume = parseFloat(vol);
    this.audioPlayer.setVolume(this.settings.musicVolume);
    this.saveSettings();
  }

  setAnimationsEnabled(enabled) {
    this.settings.animationsEnabled = enabled;
    if (enabled) {
      document.body.classList.remove('disable-animations');
    } else {
      document.body.classList.add('disable-animations');
    }
    this.saveSettings();
  }

  setGalleryLayout(layout) {
    this.settings.galleryLayout = layout;
    const galleryContainer = document.getElementById('diary-photo-gallery');
    if (galleryContainer) {
      galleryContainer.classList.remove('layout-masonry', 'layout-grid');
      galleryContainer.classList.add(`layout-${layout}`);
    }
    this.saveSettings();
  }

  setReadingMode(enabled) {
    this.settings.readingMode = enabled;
    if (enabled) {
      document.body.classList.add('reading-mode');
    } else {
      document.body.classList.remove('reading-mode');
    }
    this.saveSettings();
  }

  updateNavMusicIcon(playing) {
    const navBtn = document.getElementById('nav-music-btn');
    if (navBtn) {
      navBtn.classList.toggle('playing', playing);
      navBtn.setAttribute('aria-label', playing ? 'Mute Music' : 'Play Music');
      const iconSpan = navBtn.querySelector('.icon');
      if (iconSpan) {
        iconSpan.textContent = playing ? '🎵' : '🔇';
      }
    }
  }

  applyAllSettings() {
    this.setTheme(this.settings.theme);
    this.setPetalsEnabled(this.settings.petalsEnabled);
    this.setPetalDensity(this.settings.petalDensity);
    this.setFontSize(this.settings.fontSize);
    this.setAnimationsEnabled(this.settings.animationsEnabled);
    this.setGalleryLayout(this.settings.galleryLayout);
    this.setReadingMode(this.settings.readingMode);
    this.audioPlayer.setVolume(this.settings.musicVolume);
    this.syncFormControls();
    this.updateNavMusicIcon(this.settings.musicEnabled);

    if (this.settings.musicEnabled) {
      this.initAutoAudio();
    }
  }

  initAutoAudio() {
    this.updateNavMusicIcon(true);
    this.audioPlayer.play();

    // In browsers that restrict audio before gesture:
    // Resume sound automatically on the very first touch, scroll, click or keypress
    const unlockAudio = () => {
      if (this.settings.musicEnabled) {
        if (!this.audioPlayer.isPlaying) {
          this.audioPlayer.play();
        } else if (this.audioPlayer.synthContext && this.audioPlayer.synthContext.state === 'suspended') {
          this.audioPlayer.synthContext.resume();
        }
        this.updateNavMusicIcon(true);
      }
    };

    ['pointerdown', 'touchstart', 'click', 'scroll', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });
  }

  syncFormControls() {
    // Theme radio
    const themeInput = document.querySelector(`input[name="diary-theme"][value="${this.settings.theme}"]`);
    if (themeInput) themeInput.checked = true;

    // Petals checkbox
    const petalToggle = document.getElementById('setting-petals');
    if (petalToggle) petalToggle.checked = this.settings.petalsEnabled;

    // Petal density
    const densitySelect = document.getElementById('setting-density');
    if (densitySelect) densitySelect.value = this.settings.petalDensity;

    // Font size
    const fontSelect = document.getElementById('setting-fontsize');
    if (fontSelect) fontSelect.value = this.settings.fontSize;

    // Music
    const musicToggle = document.getElementById('setting-music');
    if (musicToggle) musicToggle.checked = this.settings.musicEnabled;
    const musicVolume = document.getElementById('setting-volume');
    if (musicVolume) musicVolume.value = this.settings.musicVolume;
    this.updateNavMusicIcon(this.settings.musicEnabled);

    // Animations
    const animToggle = document.getElementById('setting-animations');
    if (animToggle) animToggle.checked = this.settings.animationsEnabled;

    // Gallery layout
    const layoutRadio = document.querySelector(`input[name="gallery-layout"][value="${this.settings.galleryLayout}"]`);
    if (layoutRadio) layoutRadio.checked = true;

    // Reading mode
    const readingToggle = document.getElementById('setting-reading-mode');
    if (readingToggle) readingToggle.checked = this.settings.readingMode;
  }

  resetToDefaults() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    this.saveSettings();
    this.applyAllSettings();
  }
}

// Global instance exposed for app initialization
window.settingsManager = null;

document.addEventListener('DOMContentLoaded', () => {
  window.settingsManager = new SettingsManager();
});

