/* ==========================================================================
   CELEBRATI — Boomerang Canvas Video Background
   Vanilla JS port of BoomerangVideoBg (React concept → pure browser APIs)
   ========================================================================== */

export class BoomerangBg {
  /**
   * @param {string}          src          – video URL
   * @param {HTMLElement}     container    – element that gets the canvas/video
   * @param {{ maxWidth?: number, fps?: number }} [opts]
   */
  constructor(src, container, opts = {}) {
    this.src       = src;
    this.container = container;
    this.maxWidth  = opts.maxWidth ?? 960;
    this.fps       = opts.fps     ?? 30;

    this._frames   = [];
    this._index    = 0;
    this._dir      = 1;
    this._rafId    = 0;
    this._lastTs   = 0;
    this._interval = 1000 / this.fps;
    this._ready    = false;

    this._build();
  }

  /* ── DOM setup ─────────────────────────────────────────────────────────── */
  _build() {
    // Wrapper fills parent
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    // Hidden video element for capture
    this._video = document.createElement('video');
    Object.assign(this._video, {
      src:          this.src,
      muted:        true,
      loop:         true,
      autoplay:     true,
      playsInline:  true,
      preload:      'auto',
      crossOrigin:  'anonymous',
    });
    Object.assign(this._video.style, {
      position:   'absolute',
      inset:      '0',
      width:      '100%',
      height:     '100%',
      objectFit:  'cover',
      display:    'block',
      zIndex:     '0',
    });
    this.container.appendChild(this._video);

    // Display canvas (shown after capture)
    this._canvas = document.createElement('canvas');
    Object.assign(this._canvas.style, {
      position:   'absolute',
      inset:      '0',
      width:      '100%',
      height:     '100%',
      objectFit:  'cover',
      display:    'none',
      zIndex:     '0',
    });
    this.container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');

    this._attachListeners();
  }

  /* ── Capture phase ─────────────────────────────────────────────────────── */
  _attachListeners() {
    const video    = this._video;
    let capturing  = true;
    let lastTime   = -1;
    const frames   = this._frames;

    const captureFrame = () => {
      if (!capturing || video.readyState < 2) return;
      if (video.currentTime === lastTime)      return;
      lastTime = video.currentTime;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const scale  = Math.min(1, this.maxWidth / vw);
      const w      = Math.round(vw * scale);
      const h      = Math.round(vh * scale);
      const c      = document.createElement('canvas');
      c.width  = w;
      c.height = h;
      c.getContext('2d').drawImage(video, 0, 0, w, h);
      frames.push(c);
    };

    // Prefer requestVideoFrameCallback for frame-accurate capture
    const hasVFC = typeof video.requestVideoFrameCallback === 'function';
    let capRafId = 0;

    const rafLoop = () => {
      captureFrame();
      if (capturing) capRafId = requestAnimationFrame(rafLoop);
    };

    const vfcLoop = () => {
      captureFrame();
      if (capturing) video.requestVideoFrameCallback(vfcLoop);
    };

    const onLoaded = () => {
      video.play().catch(() => {});
      hasVFC ? video.requestVideoFrameCallback(vfcLoop) : (capRafId = requestAnimationFrame(rafLoop));
    };

    const onEnded = () => {
      capturing = false;
      cancelAnimationFrame(capRafId);
      if (frames.length > 2) this._startPlayback();
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded);
    if (video.readyState >= 1) onLoaded();
  }

  /* ── Playback phase ────────────────────────────────────────────────────── */
  _startPlayback() {
    const frames = this._frames;
    const first  = frames[0];

    this._canvas.width  = first.width;
    this._canvas.height = first.height;

    // Hide video, show canvas
    this._video.style.display  = 'none';
    this._canvas.style.display = 'block';

    const render = (now) => {
      if (now - this._lastTs >= this._interval) {
        this._lastTs = now;
        this._ctx.drawImage(frames[this._index], 0, 0);

        this._index += this._dir;
        if (this._index >= frames.length - 1) {
          this._index = frames.length - 1;
          this._dir   = -1;
        } else if (this._index <= 0) {
          this._index = 0;
          this._dir   = 1;
        }
      }
      this._rafId = requestAnimationFrame(render);
    };

    this._rafId = requestAnimationFrame(render);
    this._ready = true;
  }

  /* ── Public API ────────────────────────────────────────────────────────── */
  destroy() {
    cancelAnimationFrame(this._rafId);
    this._video.pause();
    this._video.remove();
    this._canvas.remove();
  }

  /** True once boomerang playback has started */
  get isReady() { return this._ready; }
}
