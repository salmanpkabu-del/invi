/* ==========================================================================
   CELEBRATI — THREE.JS WEBGL 3D CINEMATIC ENVELOPE OPENING ENGINE
   Awwwards-grade real-time 3D PBR materials, dynamic lighting, 3D flap hinge,
   rigid-body wax seal physics fragment explosion & camera zoom reveal.
   ========================================================================== */

export class PremiumEnvelopeEngine {
  constructor(overlay, eventTitle, eventHosts, themeObj = {}) {
    this.overlay       = overlay;
    this.eventTitle    = eventTitle || 'An Exclusive Invitation';
    this.eventHosts    = eventHosts || '';
    this.themeObj      = themeObj;
    this.openingType   = themeObj.openingType || 'envelope';
    this.primaryColor  = themeObj.primaryColor || '#E5A965';
    this.bgPreview     = themeObj.bgPreview || '#2B0910';
    this.opened        = false;
    this.rafId         = null;

    this.configs = {
      'envelope': {
        eyebrow: 'A personal message for you',
        prompt: 'Tap to open your invitation',
        sealSymbol: '⚜',
        cardMonogram: '⚜'
      },
      'petal-scroll': {
        eyebrow: 'An Auspicious Celebration',
        prompt: 'Tap to open your invitation',
        sealSymbol: '✿',
        cardMonogram: '❀'
      },
      'crescent-reveal': {
        eyebrow: 'A Royal Celebration',
        prompt: 'Tap to open your invitation',
        sealSymbol: '✦',
        cardMonogram: '✧'
      },
      'confetti-burst': {
        eyebrow: "It's Time to Celebrate!",
        prompt: 'Tap to reveal your invite',
        sealSymbol: '🥂',
        cardMonogram: '🎊'
      },
      'chapel-veil': {
        eyebrow: 'A Beautiful Union',
        prompt: 'Tap to reveal your invitation',
        sealSymbol: '◇',
        cardMonogram: '♡'
      },
      'editorial-reveal': {
        eyebrow: 'By Exclusive Invitation Only',
        prompt: 'Tap anywhere to enter',
        sealSymbol: '✦',
        cardMonogram: '✦'
      }
    };

    this.cfg = this.configs[this.openingType] || this.configs['envelope'];

    if (typeof THREE !== 'undefined') {
      this._initWebGL3D();
    } else {
      this._buildHTMLFallback();
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     1. THREE.JS 3D WEBGL ENGINE IMPLEMENTATION
     ────────────────────────────────────────────────────────────────────────── */
  _initWebGL3D() {
    this.overlay.innerHTML = `
      <div id="env-glow-flash" class="env-glow-flash"></div>
      <div id="reveal-sweep"></div>
      <canvas id="env-webgl-canvas" style="position:absolute; inset:0; width:100%; height:100%; z-index:2; cursor:pointer;"></canvas>

      <div class="env-title-group-3d" style="position:absolute; top: clamp(4%, 6vh, 10%); left:0; right:0; width:100%; text-align:center; display:flex; flex-direction:column; align-items:center; z-index:10; pointer-events:none; padding:0 1rem; box-sizing:border-box;">
        <div class="env-title-eyebrow">${this.cfg.eyebrow}</div>
        <div class="env-title-main" style="color: ${this.primaryColor};">${this.eventTitle}</div>
      </div>

      <div class="env-prompt-row" style="position:absolute; bottom: clamp(16px, 4vh, 36px); left:0; right:0; width:100%; display:flex; align-items:center; justify-content:center; gap:0.5rem; z-index:10; pointer-events:none; padding:0 1rem; box-sizing:border-box;">
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
        <div class="env-prompt-text">${this.cfg.prompt}</div>
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
        <div class="env-prompt-dot" style="background: ${this.primaryColor};"></div>
      </div>
    `;

    const canvas = this.overlay.querySelector('#env-webgl-canvas');
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    let camZ = 8.5;
    if (aspect < 0.6) {
      camZ = 11.5;
    } else if (aspect < 0.85) {
      camZ = 10.0;
    }

    // ── Scene & Camera ─────────────────────────────────────────────────────
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this.camera.position.set(0, 0, camZ);

    // ── Renderer ───────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // ── Resize Listener ─────────────────────────────────────────────────────
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    this._onResize = () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const asp = w / h;
      this.camera.aspect = asp;
      if (asp < 0.6) {
        this.camera.position.z = 11.5;
      } else if (asp < 0.85) {
        this.camera.position.z = 10.0;
      } else {
        this.camera.position.z = 8.5;
      }
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._onResize);

    // ── Lighting — luxury cinematic studio setup ─────────────────────────────
    // Key light from top-left — strong warm cream for highlights
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.8);
    keyLight.position.set(-4, 5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill light from right — cool silver to catch opposite edges
    const fillLight = new THREE.DirectionalLight(0xdde8f0, 1.2);
    fillLight.position.set(6, 2, 4);
    this.scene.add(fillLight);

    // Rim light from behind — intense gold tint to separate from background
    const rimLight = new THREE.DirectionalLight(0xf5dea0, 1.8);
    rimLight.position.set(0, -4, -6);
    this.scene.add(rimLight);

    // Ambient — warm soft light to ensure folds are visible
    const ambientLight = new THREE.AmbientLight(0x4a3f45, 1.5);
    this.scene.add(ambientLight);

    // Mouse cursor accent light — lifts specular highlights slightly
    const primaryHex = parseInt(this.primaryColor.replace('#', ''), 16) || 0xe5a965;
    this.mouseLight = new THREE.PointLight(primaryHex, 0.5, 15);
    this.mouseLight.position.set(0, 0, 5);
    this.scene.add(this.mouseLight);

    // ── Color conversion ───────────────────────────────────────────────────
    const bgHex  = parseInt(this.bgPreview.replace('#', ''), 16) || 0x2b0910;
    // Keep the color rich but not pitch black. 
    const r = Math.max(30, ((bgHex >> 16) & 0xff) * 0.95);
    const g = Math.max(30, ((bgHex >> 8)  & 0xff) * 0.95);
    const b = Math.max(30, ( bgHex        & 0xff) * 0.95);
    const darkBgHex = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);

    // ── 3D Master Group ────────────────────────────────────────────────────
    this.envGroup = new THREE.Group();
    this.scene.add(this.envGroup);

    // ── Materials ──────────────────────────────────────────────────────────
    // Envelope body — Physical material with clearcoat for expensive paper sheen
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color:      darkBgHex,
      roughness:  0.65,
      metalness:  0.1,
      clearcoat:  0.25,
      clearcoatRoughness: 0.4
    });

    // Deep dark velvet inner lining matching theme
    const innerMat = new THREE.MeshPhysicalMaterial({
      color:     new THREE.Color(darkBgHex).multiplyScalar(0.75),
      roughness: 0.85,
      metalness: 0.05,
      clearcoat: 0.1,
      clearcoatRoughness: 0.6
    });

    // Gold trim — PBR metallic, NOT emissive
    const goldMat = new THREE.MeshStandardMaterial({
      color:     primaryHex,
      roughness: 0.18,
      metalness: 0.92
    });

    // Wax seal — rich wax, physical material with clearcoat for glossy expensive look
    const sealMat = new THREE.MeshPhysicalMaterial({
      color:     primaryHex,
      roughness: 0.35,
      metalness: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive:  primaryHex,
      emissiveIntensity: 0.15
    });

    // Dynamic 2D canvas texture for the 3D inner invitation card (Dark Luxury Foil)
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1024;
    cardCanvas.height = 640;
    const cCtx = cardCanvas.getContext('2d');

    // Rich dark theme background gradient
    const darkHexStr = '#' + darkBgHex.toString(16).padStart(6, '0');
    const cardBgGrad = cCtx.createLinearGradient(0, 0, 1024, 640);
    cardBgGrad.addColorStop(0, darkHexStr);
    cardBgGrad.addColorStop(1, '#060208');
    cCtx.fillStyle = cardBgGrad;
    cCtx.fillRect(0, 0, 1024, 640);

    // Gold corner ornaments
    const orn = (x, y, rx, ry) => {
      cCtx.save();
      cCtx.translate(x, y);
      cCtx.rotate((rx * Math.PI) / 180);
      cCtx.strokeStyle = this.primaryColor;
      cCtx.globalAlpha = 0.55;
      cCtx.lineWidth = 2;
      cCtx.beginPath();
      cCtx.moveTo(0, 0); cCtx.lineTo(40, 0); cCtx.moveTo(0, 0); cCtx.lineTo(0, 40);
      cCtx.stroke();
      cCtx.restore();
    };
    orn(55, 55, 0, 0); orn(969, 55, 90, 0); orn(55, 585, -90, 0); orn(969, 585, 180, 0);

    // Monogram crest — Cormorant Garamond for excellent legibility
    cCtx.fillStyle = this.primaryColor;
    cCtx.globalAlpha = 1;
    cCtx.font = '400 64px "Cormorant Garamond", Georgia, serif';
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.fillText(this.cfg.cardMonogram || '⚜', 512, 160);

    // Thin separator rule
    cCtx.strokeStyle = this.primaryColor;
    cCtx.globalAlpha = 0.35;
    cCtx.lineWidth = 1;
    cCtx.beginPath();
    cCtx.moveTo(200, 215); cCtx.lineTo(824, 215);
    cCtx.stroke();
    cCtx.globalAlpha = 1;

    // Main Event Title — italic Cormorant Garamond; elegant & fully readable
    cCtx.font = 'italic 400 52px "Cormorant Garamond", Georgia, serif';
    cCtx.fillStyle = this.primaryColor;
    // Word-wrap title to fit card width
    const words = this.eventTitle.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (cCtx.measureText(test).width > 860) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    const lineH = 62;
    const startY = 310 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((ln, i) => cCtx.fillText(ln, 512, startY + i * lineH));

    // Thin separator below title
    cCtx.strokeStyle = this.primaryColor;
    cCtx.globalAlpha = 0.35;
    cCtx.lineWidth = 1;
    cCtx.beginPath();
    cCtx.moveTo(200, startY + lines.length * lineH - 10); cCtx.lineTo(824, startY + lines.length * lineH - 10);
    cCtx.stroke();
    cCtx.globalAlpha = 1;

    // Eyebrow — Cinzel for premium spaced capitals
    cCtx.font = '400 17px "Cinzel", serif';
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    cCtx.letterSpacing = '4px';
    cCtx.fillText((this.cfg.eyebrow || 'OFFICIAL INVITATION').toUpperCase(), 512, startY + lines.length * lineH + 42);

    const cardTex = new THREE.CanvasTexture(cardCanvas);
    cardTex.anisotropy = 16;

    const cardMat = new THREE.MeshStandardMaterial({
      map: cardTex,
      roughness: 0.35,
      metalness: 0.15
    });

    // ── 1. Envelope back face ──────────────────────────────────────────────
    const bodyGeo = new THREE.BoxGeometry(4.8, 3.0, 0.05);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.z = -0.025;
    bodyMesh.receiveShadow = true;
    this.envGroup.add(bodyMesh);

    // ── 2. Gold border trim (slightly larger, set behind body) ─────────────
    const trimEdgeGeo = new THREE.BoxGeometry(4.9, 3.1, 0.03);
    const trimEdge = new THREE.Mesh(trimEdgeGeo, goldMat);
    trimEdge.position.z = -0.04;
    this.envGroup.add(trimEdge);

    const extrudeSettings = { 
      depth: 0.008, 
      bevelEnabled: true, 
      bevelThickness: 0.004, 
      bevelSize: 0.004, 
      bevelSegments: 3 
    };

    // ── 3. Bottom V fold (triangle polygon) ───────────────────────────────
    const bottomFoldShape = new THREE.Shape();
    bottomFoldShape.moveTo(-2.4, -1.5);
    bottomFoldShape.lineTo( 2.4, -1.5);
    bottomFoldShape.lineTo( 0,    0.2);
    bottomFoldShape.closePath();
    const foldGeo = new THREE.ExtrudeGeometry(bottomFoldShape, extrudeSettings);
    const bottomFold = new THREE.Mesh(foldGeo, innerMat);
    bottomFold.position.z = 0.015;
    bottomFold.receiveShadow = true;
    bottomFold.castShadow = true;
    this.envGroup.add(bottomFold);

    // ── 4. Left side triangle fold ─────────────────────────────────────────
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-2.4, -1.5);
    leftShape.lineTo(-2.4,  1.5);
    leftShape.lineTo( 0,    0.2);
    leftShape.closePath();
    const leftGeo = new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
    const leftFold = new THREE.Mesh(leftGeo, innerMat);
    leftFold.position.z = 0.005;
    leftFold.receiveShadow = true;
    leftFold.castShadow = true;
    this.envGroup.add(leftFold);

    // ── 5. Right side triangle fold ───────────────────────────────────────
    const rightShape = new THREE.Shape();
    rightShape.moveTo( 2.4, -1.5);
    rightShape.lineTo( 2.4,  1.5);
    rightShape.lineTo( 0,    0.2);
    rightShape.closePath();
    const rightGeo = new THREE.ExtrudeGeometry(rightShape, extrudeSettings);
    const rightFold = new THREE.Mesh(rightGeo, innerMat);
    rightFold.position.z = 0.005;
    rightFold.receiveShadow = true;
    rightFold.castShadow = true;
    this.envGroup.add(rightFold);

    // ── 6. TOP FLAP — hinge group pivots from top edge ─────────────────────
    this.flapGroup = new THREE.Group();
    this.flapGroup.position.set(0, 1.5, 0.025);
    this.envGroup.add(this.flapGroup);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-2.4,  0);
    flapShape.lineTo( 2.4,  0);
    flapShape.lineTo( 0,   -2.1); // Deeper V-shape matching premium envelopes
    flapShape.closePath();

    const flapGeo = new THREE.ExtrudeGeometry(flapShape, extrudeSettings);
    const flapMesh = new THREE.Mesh(flapGeo, bodyMat);
    flapMesh.castShadow = true;
    flapMesh.receiveShadow = true;
    this.flapGroup.add(flapMesh);

    // Flap thin gold border line
    const flapGoldShape = new THREE.Shape();
    flapGoldShape.moveTo(-2.41,  0.01);
    flapGoldShape.lineTo( 2.41,  0.01);
    flapGoldShape.lineTo( 0,    -2.12);
    flapGoldShape.closePath();
    const flapBorderGeo = new THREE.ShapeGeometry(flapGoldShape);
    const flapBorder = new THREE.Mesh(flapBorderGeo, goldMat);
    flapBorder.position.z = 0.01;
    this.flapGroup.add(flapBorder);

    // ── 7. WAX SEAL (Organic Melted Shape) ─────────────────────────────────
    const sealShape = new THREE.Shape();
    const radius = 0.45;
    const segments = 45;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      // Procedural noise using stacked sine waves for an organic melted edge
      const r = radius + 
                Math.sin(theta * 4) * 0.025 + 
                Math.sin(theta * 7) * 0.015 + 
                Math.sin(theta * 11) * 0.01;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      if (i === 0) sealShape.moveTo(x, y);
      else sealShape.lineTo(x, y);
    }
    
    const sealExtrude = { 
      depth: 0.035, 
      bevelEnabled: true, 
      bevelSegments: 4, 
      steps: 1, 
      bevelSize: 0.035, 
      bevelThickness: 0.035 
    };
    
    const sealGeo = new THREE.ExtrudeGeometry(sealShape, sealExtrude);
    this.sealMesh = new THREE.Mesh(sealGeo, sealMat);
    this.sealMesh.position.set(0, -0.6, 0.034); // Positioned down to match the new flap tip
    this.sealMesh.castShadow = true;
    this.sealMesh.receiveShadow = true;
    this.envGroup.add(this.sealMesh);

    // Seal inner metallic stamp depression
    const sealInnerGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 32);
    sealInnerGeo.rotateX(Math.PI / 2);
    this.sealInner = new THREE.Mesh(sealInnerGeo, goldMat);
    this.sealInner.position.set(0, -0.6, 0.105);
    this.envGroup.add(this.sealInner);

    // Dynamic Symbol stamped onto the seal (using CanvasTexture)
    const stampCanvas = document.createElement('canvas');
    stampCanvas.width = 256;
    stampCanvas.height = 256;
    const sCtx = stampCanvas.getContext('2d');
    sCtx.fillStyle = '#000000'; // Actually we will use a bump map or alpha map approach, or just draw it dark gold
    sCtx.fillRect(0, 0, 256, 256);
    sCtx.fillStyle = this.primaryColor;
    sCtx.font = 'bold 160px serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(this.cfg.sealSymbol || '⚜', 128, 140);
    
    const stampTex = new THREE.CanvasTexture(stampCanvas);
    const stampMat = new THREE.MeshStandardMaterial({
      map: stampTex,
      transparent: true,
      roughness: 0.1,
      metalness: 0.9,
      blending: THREE.AdditiveBlending // Makes the black background transparent and the symbol pop
    });
    this.stampMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), stampMat);
    this.stampMesh.position.set(0, -0.6, 0.116);
    this.envGroup.add(this.stampMesh);

    // ── 8. INNER CARD — hidden until opened ───────────────────────────────
    const cardGeo = new THREE.BoxGeometry(4.2, 2.65, 0.03);
    this.cardMesh = new THREE.Mesh(cardGeo, cardMat);
    this.cardMesh.position.set(0, 0, -0.01);  // BEHIND body — not visible at start
    this.cardMesh.visible = false;            // Hidden until opening
    this.cardMesh.castShadow = true;
    this.envGroup.add(this.cardMesh);

    // Card thin gold border line (edge only — LineSegments not a BoxGeometry)
    const cardBorderEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.9, 2.4, 0.001));
    const cardBorderLine = new THREE.LineSegments(
      cardBorderEdges,
      new THREE.LineBasicMaterial({ color: primaryHex, transparent: true, opacity: 0.6 })
    );
    cardBorderLine.position.z = 0.016;
    this.cardMesh.add(cardBorderLine);

    // ── Shard container ────────────────────────────────────────────────────
    this.shards = [];

    // ── Interaction state ──────────────────────────────────────────────────
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.flapAngle    = 0;
    this.targetFlapAngle = 0;
    this.cardY   = 0;
    this.targetCardY = 0;
    this.cardZOut = false;

    // ── Events ─────────────────────────────────────────────────────────────
    this._mouseMoveHandler = (e) => this._onMouseMove(e);
    window.addEventListener('mousemove', this._mouseMoveHandler);
    canvas.addEventListener('click', () => this.triggerOpen());

    // Start render loop
    this._startWebGLRenderLoop();
  }

  _onMouseMove(e) {
    if (this.opened) return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = nx * 0.25; // max 3D rotation in radians
    this.mouse.targetY = ny * 0.25;

    if (this.mouseLight) {
      this.mouseLight.position.x = nx * 3;
      this.mouseLight.position.y = ny * 3;
    }
  }

  _startWebGLRenderLoop() {
    const startTime = Date.now();
    const render = () => {
      const t = (Date.now() - startTime) * 0.001;

      // Smooth 3D tilt lerp
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      if (this.envGroup) {
        if (!this.opened) {
          // Premium subtle floating animation while closed
          this.envGroup.position.y = Math.sin(t * 1.5) * 0.08;
          this.envGroup.rotation.y = this.mouse.x;
          this.envGroup.rotation.x = -this.mouse.y + Math.sin(t * 0.8) * 0.03;
        } else {
          // Gently settle down and tilt slightly back when opened
          this.envGroup.position.y += (0 - this.envGroup.position.y) * 0.05;
          this.envGroup.rotation.x += (-0.15 - this.envGroup.rotation.x) * 0.05;
          this.envGroup.rotation.y += (0 - this.envGroup.rotation.y) * 0.05;
        }
      }

      // Smooth flap opening hinge lerp
      if (this.flapGroup) {
        this.flapAngle += (this.targetFlapAngle - this.flapAngle) * 0.06;
        this.flapGroup.rotation.x = -this.flapAngle;
      }

      // Smooth card slide-out lerp
      if (this.cardMesh) {
        this.cardY += (this.targetCardY - this.cardY) * 0.04;
        this.cardMesh.position.y = this.cardY;
        
        // Slowly move the card forward as it slides up so it passes OVER the top hinge cleanly
        if (this.targetCardY > 1 && this.cardMesh.position.z < 0.06) {
          this.cardMesh.position.z += 0.0015;
        }
      }

      // Physics update for exploding 3D wax seal shards
      if (this.shards.length > 0) {
        this.shards.forEach(s => {
          s.mesh.position.x += s.vx;
          s.mesh.position.y += s.vy;
          s.mesh.position.z += s.vz;
          s.vy -= 0.008; // gravity
          s.mesh.rotation.x += s.rx;
          s.mesh.rotation.y += s.ry;
          s.mesh.scale.multiplyScalar(0.95);
        });
      }

      // Smooth Camera Zoom during reveal
      if (this.opened && this.camera.position.z > 3.0) {
        this.camera.position.z -= 0.04;
      }

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(render);
    };
    render();
  }

  _trigger3DWaxShatter() {
    if (!this.sealMesh) return;
    this.sealMesh.visible = false;
    if (this.sealInner) this.sealInner.visible = false;
    if (this.stampMesh) this.stampMesh.visible = false;

    const goldMat = new THREE.MeshStandardMaterial({
      color: parseInt(this.primaryColor.replace('#', ''), 16) || 0xe5a965,
      roughness: 0.25,
      metalness: 0.85
    });

    // Spawn 24 3D Tetrahedron shards
    for (let i = 0; i < 24; i++) {
      const size = 0.04 + Math.random() * 0.05;
      const shardGeo = new THREE.TetrahedronGeometry(size);
      const shardMesh = new THREE.Mesh(shardGeo, goldMat);
      shardMesh.position.set(0, -0.6, 0.12);

      const theta = Math.random() * Math.PI * 2;
      const phi   = (Math.random() - 0.5) * Math.PI;
      const speed = Math.random() * 0.15 + 0.05;

      this.envGroup.add(shardMesh);
      this.shards.push({
        mesh: shardMesh,
        vx: Math.cos(theta) * Math.cos(phi) * speed,
        vy: Math.sin(phi) * speed,
        vz: Math.sin(theta) * Math.cos(phi) * speed + 0.05,
        rx: (Math.random() - 0.5) * 0.3,
        ry: (Math.random() - 0.5) * 0.3
      });
    }
  }

  triggerOpen() {
    if (this.opened) return;
    this.opened = true;

    const flashEl = this.overlay.querySelector('#env-glow-flash');

    if (typeof THREE !== 'undefined' && this.renderer) {
      // 1. Shatter 3D Wax Seal into Physics Fragments
      this._trigger3DWaxShatter();

      // 2. Unfold 3D Hinge Flap backward (-170 degrees)
      setTimeout(() => {
        this.targetFlapAngle = Math.PI * 0.95;
      }, 150);

      // 3. Elevate 3D Card out of envelope pocket & zoom camera forward
      setTimeout(() => {
        if (this.cardMesh) {
          this.cardMesh.position.z = 0.002;
          this.cardMesh.visible = true;
        }
        this.targetCardY = 1.9;
      }, 450);

      // 4. Radiant White & Gold Glow Flash blooms onto the screen
      setTimeout(() => {
        if (flashEl) {
          flashEl.classList.remove('flash-fade-out');
          flashEl.classList.add('flash-active');
        }
      }, 950);

      // 5. Clean instant swap: hide dark 3D overlay behind pure white bloom (zero dirty cross-fade!)
      setTimeout(() => {
        this.overlay.style.display = 'none';
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        this.overlay.style.pointerEvents = 'none';

        // 6. Smoothly dissolve white glow curtain to reveal underlying wedding invitation
        setTimeout(() => {
          if (flashEl) {
            flashEl.classList.remove('flash-active');
            flashEl.classList.add('flash-fade-out');
          }
          setTimeout(() => {
            if (this.rafId) cancelAnimationFrame(this.rafId);
          }, 800);
        }, 150);
      }, 1450);
    } else {
      // Fallback execution with white flash bloom
      if (flashEl) flashEl.classList.add('flash-active');
      setTimeout(() => {
        this.overlay.style.display = 'none';
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        this.overlay.style.pointerEvents = 'none';
        if (flashEl) {
          flashEl.classList.remove('flash-active');
          flashEl.classList.add('flash-fade-out');
        }
      }, 500);
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. FALLBACK HTML BUILDER (IF THREE.JS IS UNDEFINED)
     ────────────────────────────────────────────────────────────────────────── */
  _buildHTMLFallback() {
    this.overlay.innerHTML = `
      <div id="env-glow-flash" class="env-glow-flash"></div>
      <div id="reveal-sweep"></div>
      <div class="env-title-group">
        <div class="env-title-eyebrow">${this.cfg.eyebrow}</div>
        <div class="env-title-main" style="color: ${this.primaryColor};">${this.eventTitle}</div>
      </div>
      <div class="premium-envelope-wrap" id="premium-env-wrap">
        <div class="env-svg-container">
          <svg viewBox="0 0 520 340" width="520" height="340" style="display:block; max-width:92vw;">
            <rect x="10" y="20" width="500" height="300" rx="6" fill="${this.bgPreview}" stroke="${this.primaryColor}" stroke-width="1.5"/>
            <text x="260" y="170" text-anchor="middle" font-size="32" fill="${this.primaryColor}">${this.cfg.sealSymbol}</text>
          </svg>
        </div>
      </div>
      <div class="env-prompt-row">
        <div class="env-prompt-text">${this.cfg.prompt}</div>
      </div>
    `;
    const envWrap = this.overlay.querySelector('#premium-env-wrap');
    if (envWrap) envWrap.addEventListener('click', () => this.triggerOpen());
  }

  reset() {
    this.opened = false;
    this.overlay.style.display = 'block';
    this.overlay.style.opacity = '1';
    this.overlay.style.visibility = 'visible';
    this.overlay.style.pointerEvents = 'auto';
    this.overlay.classList.remove('opened-fade');
    if (typeof THREE !== 'undefined' && this.renderer) {
      this._initWebGL3D();
    } else {
      this._buildHTMLFallback();
    }
  }
}
