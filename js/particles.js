/* ==========================================================================
   CELEBRATI — CANVAS 2D PARTICLE SYSTEM ENGINE
   ========================================================================== */

export class ParticleEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrame = null;
    this.type = 'petals';
    this.isRunning = false;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    this.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setType(type) {
    this.type = type;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = this.type === 'stars' ? 80 : (this.type === 'petals' ? 35 : 60);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * (this.type === 'petals' ? 12 : 3) + 2,
        speedX: (Math.random() - 0.5) * (this.type === 'petals' ? 1.5 : 0.8),
        speedY: Math.random() * (this.type === 'petals' ? 1.2 : 0.6) + 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: this.getParticleColor()
      });
    }
  }

  getParticleColor() {
    if (this.type === 'petals') {
      const colors = ['#E5A965', '#D4954F', '#E8988A', '#F2B6A8'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else if (this.type === 'stars') {
      const colors = ['#FAF5FF', '#E2C0EE', '#FFFFFF', '#C084FC'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // Gold dust
      const colors = ['#D4AF37', '#FFD700', '#F59E0B', '#FFF5EA'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.initParticles();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  loop() {
    if (!this.isRunning || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      // Wrap around bounds
      if (p.y > this.height) {
        p.y = -10;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width) p.x = 0;
      if (p.x < 0) p.x = this.width;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (this.type === 'petals') {
        // Draw petal shape
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.type === 'stars') {
        // Draw star shape
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Draw sparkle particle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  // Trigger celebration confetti blast
  static triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#E5A965', '#D4AF37', '#10B981', '#EF4444', '#7C3AED', '#FFF'];

    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let c of confetti) {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotation += c.rotSpeed;
        c.opacity -= 0.012;

        if (c.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);
          ctx.globalAlpha = c.opacity;
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
          ctx.restore();
        }
      }

      frame++;
      if (alive && frame < 150) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }

    render();
  }
}
