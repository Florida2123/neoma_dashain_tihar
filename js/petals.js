/**
 * ====================================================================
 * SAKURA PETALS ENGINE (Vanilla Canvas 2D)
 * ====================================================================
 * Lightweight, high-performance falling cherry blossom simulation.
 * - Smooth 60fps requestAnimationFrame loop
 * - Natural 3D fluttering & sway dynamics
 * - Gentle mouse & touch cursor breeze interaction
 * - Zero layout thrashing, pointer-events none
 * - Pauses automatically when tab is hidden or reduced-motion is active
 */

class SakuraEngine {
  constructor(canvasId = 'sakura-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.prepend(this.canvas);
    }
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998'; // Just below modal lightboxes/settings

    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.animationId = null;
    this.isRunning = false;
    this.isEnabled = true;
    this.density = 'medium'; // 'low' | 'medium' | 'high'
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Interactive cursor state
    this.mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
      lastTime: Date.now(),
      active: false
    };
    this.mouseRadius = 115; // Breeze influence distance

    // Density counts
    this.densityCounts = {
      low: 16,
      medium: 32,
      high: 56
    };

    // Color palettes for petals
    this.petalColors = [
      { r: 255, g: 218, b: 224, a: 0.85 }, // soft blush
      { r: 245, g: 198, b: 208, a: 0.80 }, // sakura pink
      { r: 255, g: 240, b: 245, a: 0.90 }, // almost white sakura
      { r: 236, g: 168, b: 185, a: 0.75 }  // deeper rose accent
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Handle tab visibility changes to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isEnabled) {
        this.resume();
      }
    });

    // Handle reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      this.isEnabled = false;
    }
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        this.stop();
      } else if (this.isEnabled) {
        this.start();
      }
    });

    // Mouse movement interaction (wind breeze)
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = Math.max(1, now - this.mouse.lastTime);
      this.mouse.vx = (e.clientX - this.mouse.lastX) / dt * 15;
      this.mouse.vy = (e.clientY - this.mouse.lastY) / dt * 15;
      this.mouse.lastX = this.mouse.x = e.clientX;
      this.mouse.lastY = this.mouse.y = e.clientY;
      this.mouse.lastTime = now;
      this.mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.vx = 0;
      this.mouse.vy = 0;
    });

    // Touch interaction for mobile/tablets
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const now = Date.now();
        const dt = Math.max(1, now - this.mouse.lastTime);
        this.mouse.vx = (touch.clientX - this.mouse.lastX) / dt * 15;
        this.mouse.vy = (touch.clientY - this.mouse.lastY) / dt * 15;
        this.mouse.lastX = this.mouse.x = touch.clientX;
        this.mouse.lastY = this.mouse.y = touch.clientY;
        this.mouse.lastTime = now;
        this.mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.active = false;
    });

    // Gentle blossom puff on click (skip heart button so hearty animation plays instead)
    window.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('#like-diary-btn')) {
        return;
      }
      if (this.isEnabled && this.isRunning) {
        this.burstAt(e.clientX, e.clientY);
      }
    }, { passive: true });

    this.createPetals();
  }

  getDensityCount() {
    const w = window.innerWidth;
    const isSmallMobile = w <= 430;
    const isMobile = w <= 768;

    if (isSmallMobile) {
      const counts = { low: 8, medium: 14, high: 22 };
      return counts[this.density] || counts.medium;
    } else if (isMobile) {
      const counts = { low: 10, medium: 20, high: 30 };
      return counts[this.density] || counts.medium;
    } else {
      const counts = { low: 16, medium: 32, high: 56 };
      return counts[this.density] || counts.medium;
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    const targetCount = this.getDensityCount();
    if (this.petals.length > targetCount) {
      this.petals.length = targetCount;
    } else if (this.petals.length < targetCount && this.isEnabled && this.isRunning) {
      while (this.petals.length < targetCount) {
        this.petals.push(this.createPetal());
      }
    }
  }

  createPetal() {
    const color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    const flutterSpeed = 0.02 + Math.random() * 0.03;
    const spinSpeed = 0.01 + Math.random() * 0.02;

    return {
      x: Math.random() * this.width,
      y: Math.random() * -this.height, // start above screen
      vx: 0,
      vy: 0,
      size: 9 + Math.random() * 10,     // 9 to 19px
      speedY: 1.0 + Math.random() * 1.5, // gentle descent
      speedX: -0.5 + Math.random() * 1.0, // horizontal drift
      angle: Math.random() * Math.PI * 2,
      spinSpeed: spinSpeed,
      baseSpinSpeed: spinSpeed,
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: flutterSpeed,
      baseFlutterSpeed: flutterSpeed,
      swayRadius: 20 + Math.random() * 40,
      swayOffset: Math.random() * Math.PI * 2,
      color: color
    };
  }

  createPetals() {
    const targetCount = this.getDensityCount();
    this.petals = [];
    for (let i = 0; i < targetCount; i++) {
      const petal = this.createPetal();
      petal.y = Math.random() * this.height;
      this.petals.push(petal);
    }
  }

  burstAt(x, y) {
    // Spawn 4 delicate petals radiating outward from click/tap point
    const burstCount = 4;
    for (let i = 0; i < burstCount; i++) {
      const p = this.createPetal();
      p.x = x + (Math.random() - 0.5) * 15;
      p.y = y + (Math.random() - 0.5) * 15;
      const angle = (Math.PI * 2 / burstCount) * i + Math.random() * 0.5;
      const speed = 2.0 + Math.random() * 3.0;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.2;
      p.spinSpeed = 0.05;
      p.flutterSpeed = 0.07;
      this.petals.push(p);
    }
    // Cap petals count so performance stays optimal
    const maxPetals = this.densityCounts.high + 12;
    if (this.petals.length > maxPetals) {
      this.petals.splice(0, this.petals.length - maxPetals);
    }
  }

  update() {
    // Gradually decay mouse velocity
    this.mouse.vx *= 0.88;
    this.mouse.vy *= 0.88;

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];

      // Realistic 3D flutter & spin
      p.flutter += p.flutterSpeed;
      p.angle += p.spinSpeed;

      // Gradually restore base speeds after disturbance
      p.flutterSpeed += (p.baseFlutterSpeed - p.flutterSpeed) * 0.04;
      p.spinSpeed += (p.baseSpinSpeed - p.spinSpeed) * 0.04;

      // Mouse cursor breeze interaction
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.mouseRadius && dist > 1) {
          const force = (1 - dist / this.mouseRadius);
          const angle = Math.atan2(dy, dx);

          // Gentle breeze pushing petal away from cursor
          p.vx += Math.cos(angle) * force * 1.8;
          p.vy += Math.sin(angle) * force * 1.8;

          // Transfer cursor motion direction
          p.vx += this.mouse.vx * force * 0.10;
          p.vy += this.mouse.vy * force * 0.10;

          // Agitate spin and flutter
          p.spinSpeed = Math.min(0.08, p.spinSpeed + force * 0.035);
          p.flutterSpeed = Math.min(0.12, p.flutterSpeed + force * 0.045);
        }
      }

      // Smooth friction damping on disturbance velocity
      p.vx *= 0.93;
      p.vy *= 0.93;

      // Update position
      p.y += p.speedY + p.vy;
      p.x += Math.sin(p.flutter + p.swayOffset) * 0.8 + p.speedX + p.vx;

      // Reset when falling off screen
      if (p.y > this.height + 25 || p.x < -40 || p.x > this.width + 40) {
        p.x = Math.random() * this.width;
        p.y = -20;
        p.vx = 0;
        p.vy = 0;
        p.speedY = 1.0 + Math.random() * 1.5;
      }
    }
  }

  drawPetalShape(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    // 3D flip effect via cos(flutter)
    ctx.scale(Math.cos(p.flutter), 1);

    const s = p.size;
    const c = p.color;

    // Create subtle radial gradient on each petal for softness
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, s);
    grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`);
    grad.addColorStop(0.8, `rgba(${c.r - 10}, ${c.g - 15}, ${c.b - 15}, ${c.a * 0.85})`);
    grad.addColorStop(1, `rgba(${c.r - 20}, ${c.g - 25}, ${c.b - 25}, ${c.a * 0.4})`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    
    // Classic cherry blossom petal curve with subtle notch
    ctx.moveTo(0, -s * 0.8);
    ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.8, s * 0.4, 0, s);
    ctx.bezierCurveTo(-s * 0.8, s * 0.4, -s * 0.7, -s * 0.6, 0, -s * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.petals.length; i++) {
      this.drawPetalShape(this.ctx, this.petals[i]);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isEnabled) return;
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (this.isEnabled && !this.isRunning) {
      this.start();
    }
  }

  setEnabled(enabled) {
    this.isEnabled = Boolean(enabled);
    if (this.isEnabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  setDensity(density) {
    if (['low', 'medium', 'high'].includes(density)) {
      this.density = density;
      this.createPetals();
    }
  }
}

// Global instance exposed for settings module
window.sakuraEngine = null;

document.addEventListener('DOMContentLoaded', () => {
  window.sakuraEngine = new SakuraEngine('sakura-canvas');
  window.sakuraEngine.start();
});
