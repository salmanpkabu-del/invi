/* ==========================================================================
   CELEBRATI — PREMIUM CINEMATIC ENVELOPE OPENING ENGINE
   Canvas-based gold particle sparks, ambient dust, and reveal orchestration
   ========================================================================== */

export class PremiumEnvelopeEngine {
  constructor(overlay, eventTitle, eventHosts) {
    this.overlay   = overlay;
    this.eventTitle  = eventTitle;
    this.eventHosts  = eventHosts;
    this.opened    = false;
    this.dustCanvas  = null;
    this.dustCtx   = null;
    this.dustParticles = [];
    this.sparkCanvas = null;
    this.sparkCtx  = null;
    this.sparkParticles = [];
    this.rafId     = null;

    this._buildHTML();
    this._initDustCanvas();
    this._startDustLoop();
  }

  _buildHTML() {
    this.overlay.innerHTML = `
      <div id="reveal-sweep"></div>
      <canvas class="env-dust-canvas" id="env-dust-canvas"></canvas>
      <canvas id="seal-spark-canvas"></canvas>

      <div class="env-title-group">
        <div class="env-title-eyebrow">A personal message for you</div>
        <div class="env-title-main">An Exclusive Invitation</div>
      </div>

      <div class="premium-envelope-wrap" id="premium-env-wrap">
        <!-- SVG Envelope — properly layered with depth -->
        <div class="env-svg-container">
          <svg
            id="env-svg"
            viewBox="0 0 520 340"
            width="520"
            height="340"
            xmlns="http://www.w3.org/2000/svg"
            style="display:block; max-width:92vw;"
          >
            <defs>
              <!-- Envelope body gradient -->
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="#2A0F18"/>
                <stop offset="100%" stop-color="#110509"/>
              </linearGradient>
              <!-- Side triangle gradients -->
              <linearGradient id="sideLeftGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%"   stop-color="#0F0307"/>
                <stop offset="100%" stop-color="#1E0B13"/>
              </linearGradient>
              <linearGradient id="sideRightGrad" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%"   stop-color="#0F0307"/>
                <stop offset="100%" stop-color="#1E0B13"/>
              </linearGradient>
              <!-- Flap front gradient -->
              <linearGradient id="flapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%"   stop-color="#2E1019"/>
                <stop offset="100%" stop-color="#1A0910"/>
              </linearGradient>
              <!-- Flap back gradient -->
              <linearGradient id="flapBackGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%"   stop-color="#120508"/>
                <stop offset="100%" stop-color="#0C0306"/>
              </linearGradient>
              <!-- Gold glow filter -->
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                  values="1 0.8 0 0 0.1  0 0.6 0 0 0  0 0 0 0 0  0 0 0 1.5 0" result="colored"/>
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <!-- Inner shadow filter for depth -->
              <filter id="innerShadow">
                <feFlood flood-color="rgba(0,0,0,0.6)" result="flood"/>
                <feComposite in="flood" in2="SourceGraphic" operator="in" result="shadow"/>
                <feGaussianBlur in="shadow" stdDeviation="4" result="blurred"/>
                <feMerge><feMergeNode in="blurred"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <!-- Wax seal gradient -->
              <radialGradient id="waxGrad" cx="38%" cy="30%" r="65%">
                <stop offset="0%"   stop-color="#F8E27A"/>
                <stop offset="35%"  stop-color="#D4AF37"/>
                <stop offset="70%"  stop-color="#A07818"/>
                <stop offset="100%" stop-color="#6B4E10"/>
              </radialGradient>
              <!-- Wax seal rim gradient -->
              <radialGradient id="waxRimGrad" cx="38%" cy="30%" r="65%">
                <stop offset="0%"   stop-color="rgba(255,232,120,0.9)"/>
                <stop offset="100%" stop-color="rgba(180,130,20,0.4)"/>
              </radialGradient>
              <!-- Shine highlight on seal -->
              <radialGradient id="sealShine" cx="32%" cy="25%" r="45%">
                <stop offset="0%"   stop-color="rgba(255,255,220,0.7)"/>
                <stop offset="100%" stop-color="rgba(255,255,220,0)"/>
              </radialGradient>
              <!-- Inner card gradient -->
              <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="#FDF8EE"/>
                <stop offset="100%" stop-color="#F0DCA8"/>
              </linearGradient>
            </defs>

            <!-- ── LAYER 1: Envelope body back ── -->
            <rect x="10" y="20" width="500" height="300" rx="6" ry="6"
              fill="url(#bodyGrad)"
              stroke="rgba(212,175,55,0.18)"
              stroke-width="1.2"
            />

            <!-- ── LAYER 2: Bottom triangle (fold) ── -->
            <polygon
              points="10,320 260,185 510,320"
              fill="#120608"
            />

            <!-- ── LAYER 3: Left flap triangle ── -->
            <polygon
              points="10,20 10,320 230,185"
              fill="url(#sideLeftGrad)"
            />

            <!-- ── LAYER 4: Right flap triangle ── -->
            <polygon
              points="510,20 510,320 290,185"
              fill="url(#sideRightGrad)"
            />

            <!-- ── LAYER 5: Flap back (behind front flap) ── -->
            <polygon
              id="env-flap-back-poly"
              points="10,20 510,20 260,170"
              fill="url(#flapBackGrad)"
            />

            <!-- ── LAYER 6: Gold border accent lines ── -->
            <!-- Outer border -->
            <rect x="10" y="20" width="500" height="300" rx="6" ry="6"
              fill="none"
              stroke="rgba(212,175,55,0.3)"
              stroke-width="0.8"
              class="env-gold-line"
            />
            <!-- Inner crease line (fold V) -->
            <polyline
              points="10,20 260,175 510,20"
              fill="none"
              stroke="rgba(212,175,55,0.22)"
              stroke-width="0.7"
              class="env-gold-line"
            />
            <!-- Side fold lines -->
            <line x1="10" y1="20" x2="230" y2="185" stroke="rgba(212,175,55,0.1)" stroke-width="0.6"/>
            <line x1="510" y1="20" x2="290" y2="185" stroke="rgba(212,175,55,0.1)" stroke-width="0.6"/>
            <!-- Thin gold inner border -->
            <rect x="18" y="28" width="484" height="284" rx="4" ry="4"
              fill="none"
              stroke="rgba(212,175,55,0.10)"
              stroke-width="0.5"
            />

            <!-- ── LAYER 7: Front flap (animates open) ── -->
            <polygon
              id="env-flap-front-poly"
              points="10,20 510,20 260,170"
              fill="url(#flapGrad)"
            />
            <!-- Subtle sheen line on front flap crease -->
            <line x1="10" y1="20" x2="260" y2="168" stroke="rgba(212,175,55,0.08)" stroke-width="0.6"/>
            <line x1="510" y1="20" x2="260" y2="168" stroke="rgba(212,175,55,0.08)" stroke-width="0.6"/>

            <!-- ── INNER CARD (hidden, rises when opened) ── -->
            <g id="inner-card-svg-group" style="opacity:0; pointer-events:none;">
              <rect x="110" y="60" width="300" height="200" rx="6"
                fill="url(#cardGrad)"
                stroke="#D4AF37"
                stroke-width="1.5"
                filter="url(#innerShadow)"
              />
              <!-- Card inner border -->
              <rect x="118" y="68" width="284" height="184" rx="4"
                fill="none" stroke="rgba(200,165,40,0.4)" stroke-width="0.8"
              />
              <!-- Card fleur-de-lis icon placeholder text -->
              <text x="260" y="135" text-anchor="middle" font-size="26"
                fill="rgba(180,130,20,0.85)">⚜</text>
              <text x="260" y="175" text-anchor="middle" font-family="Georgia, serif"
                font-size="13" font-weight="700" fill="#2D0F18" letter-spacing="0.5"
                id="card-title-text">${this.eventTitle}</text>
              <text x="260" y="198" text-anchor="middle" font-family="Georgia, serif"
                font-size="9.5" fill="#7A5812" letter-spacing="0.8"
                id="card-hosts-text">${this.eventHosts}</text>
            </g>

            <!-- ── WAX SEAL GROUP ── -->
            <g id="wax-seal-svg-group" style="cursor:pointer;" filter="url(#goldGlow)">
              <!-- Outer glow ring -->
              <circle cx="260" cy="170" r="46" fill="rgba(212,175,55,0.08)"/>
              <circle cx="260" cy="170" r="41" fill="rgba(212,175,55,0.06)"/>
              <!-- Wax body -->
              <circle cx="260" cy="170" r="36" fill="url(#waxGrad)"/>
              <!-- Rim -->
              <circle cx="260" cy="170" r="36" fill="none"
                stroke="url(#waxRimGrad)" stroke-width="2.5"/>
              <!-- Inner serrated edge (decorative notches) -->
              <circle cx="260" cy="170" r="31" fill="none"
                stroke="rgba(180,130,20,0.5)" stroke-width="1"
                stroke-dasharray="4.5 2.5"/>
              <!-- Fleur-de-lis symbol -->
              <text x="260" y="179" text-anchor="middle" dominant-baseline="middle"
                font-size="26" fill="rgba(60,20,10,0.85)">⚜</text>
              <!-- Shine highlight -->
              <ellipse cx="250" cy="158" rx="12" ry="8"
                fill="url(#sealShine)" transform="rotate(-20,250,158)"/>
            </g>
          </svg>
        </div>

        <!-- Inner card overlay (for when card rises above envelope) -->
        <div class="env-inner-card-wrap" id="env-card-overlay">
          <div class="env-inner-card">
            <span class="env-card-monogram">⚜️</span>
            <div class="env-card-title">${this.eventTitle}</div>
            <div class="env-card-hosts">Hosted By ${this.eventHosts}</div>
          </div>
        </div>
      </div>

      <div class="env-prompt-row">
        <div class="env-prompt-dot"></div>
        <div class="env-prompt-dot"></div>
        <div class="env-prompt-dot"></div>
        <div class="env-prompt-text">Tap to open your invitation</div>
        <div class="env-prompt-dot"></div>
        <div class="env-prompt-dot"></div>
        <div class="env-prompt-dot"></div>
      </div>
    `;

    // Bind click
    const envWrap = this.overlay.querySelector('#premium-env-wrap');
    const sealGroup = this.overlay.querySelector('#wax-seal-svg-group');
    if (envWrap) envWrap.addEventListener('click', () => this.triggerOpen());
    if (sealGroup) sealGroup.addEventListener('click', (e) => { e.stopPropagation(); this.triggerOpen(); });
  }

  _initDustCanvas() {
    this.dustCanvas = this.overlay.querySelector('#env-dust-canvas');
    if (!this.dustCanvas) return;
    this.dustCanvas.width  = window.innerWidth;
    this.dustCanvas.height = window.innerHeight;
    this.dustCtx = this.dustCanvas.getContext('2d');

    // Seed ambient floating dust motes
    for (let i = 0; i < 55; i++) {
      this.dustParticles.push({
        x: Math.random() * this.dustCanvas.width,
        y: Math.random() * this.dustCanvas.height,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.22 - 0.05,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.008
      });
    }
  }

  _startDustLoop() {
    const tick = () => {
      this._drawDust();
      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  _drawDust() {
    if (!this.dustCtx || !this.dustCanvas) return;
    this.dustCtx.clearRect(0, 0, this.dustCanvas.width, this.dustCanvas.height);

    this.dustParticles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle));
      this.dustCtx.beginPath();
      this.dustCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.dustCtx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
      this.dustCtx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = this.dustCanvas.height + 5; p.x = Math.random() * this.dustCanvas.width; }
      if (p.x < -5) p.x = this.dustCanvas.width + 5;
      if (p.x > this.dustCanvas.width + 5) p.x = -5;
    });
  }

  triggerOpen() {
    if (this.opened) return;
    this.opened = true;

    const envWrap   = this.overlay.querySelector('#premium-env-wrap');
    const sealGroup   = this.overlay.querySelector('#wax-seal-svg-group');
    const flapFront   = this.overlay.querySelector('#env-flap-front-poly');
    const flapBack    = this.overlay.querySelector('#env-flap-back-poly');
    const innerCardSVG = this.overlay.querySelector('#inner-card-svg-group');
    const innerCardDiv = this.overlay.querySelector('#env-card-overlay');
    const sweepEl     = this.overlay.querySelector('#reveal-sweep');

    if (envWrap) envWrap.classList.add('is-opening');

    // PHASE 1 (0ms): Seal crack + sparks
    this._burstSealSparks();
    if (sealGroup) {
      sealGroup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      sealGroup.style.transformOrigin = '260px 170px';
      sealGroup.style.transform = 'scale(0)';
      sealGroup.style.opacity = '0';
    }

    // PHASE 2 (350ms): Flap folds backward in 3D
    setTimeout(() => {
      if (flapFront) {
        flapFront.style.transition = 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
        flapFront.style.transformOrigin = '260px 20px';
        flapFront.style.transformBox = 'fill-box';
        flapFront.style.transform = 'rotateX(180deg)';
        // Darken flap back to simulate underside
        if (flapBack) { flapBack.style.fill = '#08030A'; }
      }
    }, 350);

    // PHASE 3 (800ms): Inner card rises (SVG group fade in + CSS overlay rises)
    setTimeout(() => {
      if (innerCardSVG) {
        innerCardSVG.style.transition = 'opacity 0.4s ease, transform 1s cubic-bezier(0.34,1.3,0.64,1)';
        innerCardSVG.style.opacity = '1';
        innerCardSVG.style.transform = 'translateY(-80px)';
      }
      if (innerCardDiv) {
        innerCardDiv.style.transition = 'none';
        innerCardDiv.style.opacity = '1';
        // Animate separately via class
        requestAnimationFrame(() => {
          innerCardDiv.style.transition = 'opacity 0.3s ease, transform 1.0s cubic-bezier(0.34,1.3,0.64,1)';
          innerCardDiv.classList.add('card-rising');
        });
      }
    }, 800);

    // PHASE 4 (1800ms): Gold light sweep reveal
    setTimeout(() => {
      if (sweepEl) sweepEl.classList.add('sweeping');
    }, 1800);

    // PHASE 5 (2600ms): Fade out entire overlay
    setTimeout(() => {
      this.overlay.classList.add('opened-fade');
      if (this.rafId) cancelAnimationFrame(this.rafId);
    }, 2600);
  }

  _burstSealSparks() {
    // Use the dust canvas for sparks (inject spark canvas if needed)
    const sparkCanvas = this.overlay.querySelector('#seal-spark-canvas');
    if (!sparkCanvas) return;
    sparkCanvas.width  = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
    const ctx = sparkCanvas.getContext('2d');

    // Approximate seal center in screen coords
    const envWrap = this.overlay.querySelector('#premium-env-wrap');
    const svgEl  = this.overlay.querySelector('#env-svg');
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2 + 10;

    if (svgEl) {
      const rect = svgEl.getBoundingClientRect();
      // Seal is at SVG coord (260, 170) out of (520, 340)
      cx = rect.left + rect.width * (260 / 520);
      cy = rect.top  + rect.height * (170 / 340);
    }

    // Create 80 gold spark particles
    const sparks = [];
    for (let i = 0; i < 80; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 9 + 2;
      const size  = Math.random() * 3 + 0.8;
      sparks.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        life: 1,
        decay: Math.random() * 0.028 + 0.018,
        size,
        hue: 40 + Math.random() * 20, // gold range
        trail: []
      });
    }

    // Also 20 larger "ember" sparks
    for (let i = 0; i < 20; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 5 + 1;
      sparks.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        life: 1,
        decay: Math.random() * 0.018 + 0.010,
        size: Math.random() * 5 + 2,
        hue: 45 + Math.random() * 15,
        trail: []
      });
    }

    const drawSparks = () => {
      ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
      let allDead = true;

      sparks.forEach(sp => {
        if (sp.life <= 0) return;
        allDead = false;

        sp.trail.push({ x: sp.x, y: sp.y, life: sp.life });
        if (sp.trail.length > 6) sp.trail.shift();

        // Draw trail
        sp.trail.forEach((t, ti) => {
          const trailAlpha = (ti / sp.trail.length) * sp.life * 0.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, sp.size * (ti / sp.trail.length) * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${sp.hue}, 90%, 65%, ${trailAlpha})`;
          ctx.fill();
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        // Core bright
        ctx.fillStyle = `hsla(${sp.hue}, 100%, 85%, ${sp.life})`;
        ctx.fill();
        // Outer glow
        const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 3);
        grd.addColorStop(0, `hsla(${sp.hue}, 100%, 70%, ${sp.life * 0.5})`);
        grd.addColorStop(1, `hsla(${sp.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Physics
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.28; // gravity
        sp.vx *= 0.97;  // air drag
        sp.life -= sp.decay;
      });

      if (!allDead) requestAnimationFrame(drawSparks);
      else ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    };

    requestAnimationFrame(drawSparks);
  }

  reset() {
    this.opened = false;
    this.overlay.classList.remove('opened-fade');
    this._buildHTML();
    this._initDustCanvas();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this._startDustLoop();
  }
}
