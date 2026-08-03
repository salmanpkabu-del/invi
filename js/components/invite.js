/* ==========================================================================
   CELEBRATI — PUBLIC ULTRA-LUXURY INVITATION VIEW COMPONENT
   ========================================================================== */

import { db } from '../storage.js';
import { applyTheme, THEMES } from '../themes.js';
import { ParticleEngine } from '../particles.js';
import { generateQRCodeSVG } from '../qr.js';
import { downloadICSFile } from '../calendar.js';
import { downloadPrintableCard, downloadDigitalGatePass } from '../print.js';
import { PremiumEnvelopeEngine } from '../envelope.js';

export function renderInviteView(container) {
  const baseEvent = db.getActiveEvent();
  
  if (!baseEvent || !baseEvent.id) {
    render404Screen(container);
    return;
  }
  
  let activeEvent = { ...baseEvent };
  
  // Non-destructive preview override from sessionStorage
  const rawPreview = sessionStorage.getItem('celebrati_preview_temp');
  if (rawPreview) {
    try {
      const pData = JSON.parse(rawPreview);
      if (pData.theme) activeEvent.theme = pData.theme;
      if (pData.customColor) activeEvent.customColor = pData.customColor;
      if (pData.customFont) activeEvent.customFont = pData.customFont;
      if (pData.visibleSections) activeEvent.visibleSections = pData.visibleSections;
    } catch (e) {}
  }

  const themeObj = THEMES[activeEvent.theme] || THEMES['theme-royal'];

  // ── Auto-Expiry Check ───────────────────────────────────────────────────
  if (db.isExpired(activeEvent)) {
    renderExpiredScreen(container, activeEvent, themeObj);
    return;
  }

  // Check URL search param for guest personalized greeting
  const urlParams = new URLSearchParams(window.location.search);
  const personalizedGuest = urlParams.get('guest');


  const currentUrl = window.location.href;
  
  let customStyles = '';
  let googleFontLink = '';
  
  if (activeEvent.customColor) {
    customStyles += `--theme-accent: ${activeEvent.customColor} !important;
`;
    customStyles += `--theme-primary: ${activeEvent.customColor} !important;
`;
    customStyles += `--color-primary: ${activeEvent.customColor} !important;
`;
  }
  
  if (activeEvent.customFont) {
    const fontName = activeEvent.customFont.split(',')[0].replace(/['"]/g, '').trim();
    if (fontName === 'Italiana') {
      googleFontLink = `<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">`;
      customStyles += `--theme-font-body: 'Montserrat', sans-serif !important;\n`;
    } else {
      googleFontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap" rel="stylesheet">`;
    }
    customStyles += `--theme-font-title: ${activeEvent.customFont} !important;\n`;
    customStyles += `--theme-font-script: ${activeEvent.customFont} !important;\n`;
    customStyles += `--font-display: ${activeEvent.customFont} !important;\n`;
  }
  
  const customStyleTag = customStyles ? `<style>.invitation-wrapper { ${customStyles} }</style>` : '';


  container.innerHTML = `
    ${googleFontLink}
    ${customStyleTag}

    <!-- Floating Admin Return Control -->
    ${db.isAdminLoggedIn() ? `
      <div style="position:fixed; top:1rem; left:1rem; z-index:99999;">
        <a href="app.html#admin" style="background:rgba(10,15,26,0.85); color:#FFF; border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(10px); padding:0.45rem 1rem; border-radius:30px; font-size:0.8rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
          ⚙️ Return to Admin Studio
        </a>
      </div>
    ` : ''}

    <!-- Premium Cinematic Envelope Opener — populated by JS engine -->
    <div id="envelope-opener-overlay"></div>

    <!-- Background Music Audio Tag -->
    ${activeEvent.audioUrl ? `
      <audio id="inv-bg-audio" loop src="${activeEvent.audioUrl}"></audio>
      <div class="audio-player-fixed" id="audio-player-control">
        <div class="audio-equalizer paused">
          <div class="equalizer-bar"></div>
          <div class="equalizer-bar"></div>
          <div class="equalizer-bar"></div>
        </div>
        <span id="audio-btn-label" style="font-size:0.8rem; font-weight:600;">🎵 Play Background Symphony</span>
      </div>
    ` : ''}

    <!-- Invitation Outer Wrapper -->
    <div class="invitation-wrapper ${activeEvent.theme} layout-${themeObj.layoutType || 'classic'}">
      <!-- Particle Canvas -->
      <canvas id="particle-canvas"></canvas>

      <!-- Floating Dots Section Navigation -->
      <div id="floating-section-nav">
        <div class="nav-dot active" data-section="section-hero" title="Hero"></div>
        ${(activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones?.length > 0) ? '<div class="nav-dot" data-section="section-story" title="Our Story"></div>' : ''}
        ${(activeEvent.visibleSections?.schedule !== false) ? '<div class="nav-dot" data-section="section-schedule" title="Itinerary & Venues"></div>' : ''}
        ${(activeEvent.visibleSections?.dressCode !== false && activeEvent.dressCode) ? '<div class="nav-dot" data-section="section-dresscode" title="Dress Code"></div>' : ''}
        <div class="nav-dot" data-section="section-faq" title="FAQ & Registry"></div>
        ${(activeEvent.visibleSections?.wishes !== false) ? '<div class="nav-dot" data-section="section-wishes" title="Guest Wishes"></div>' : ''}
      </div>

      <!-- Hero Section -->
      <section id="section-hero" class="inv-hero">
        <!-- Corner Filigree Ornaments -->
        <svg class="filigree-corner filigree-top-left" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 10 H65 M10 10 V65 M18 18 H48 M18 18 V48 M10 10 C 35 35, 35 35, 45 10 C 35 35, 35 35, 10 45 M22 22 C 40 40, 40 40, 55 22"/>
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
          <circle cx="25" cy="25" r="2" fill="currentColor"/>
        </svg>
        <svg class="filigree-corner filigree-top-right" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 10 H65 M10 10 V65 M18 18 H48 M18 18 V48 M10 10 C 35 35, 35 35, 45 10 C 35 35, 35 35, 10 45 M22 22 C 40 40, 40 40, 55 22"/>
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
          <circle cx="25" cy="25" r="2" fill="currentColor"/>
        </svg>
        <svg class="filigree-corner filigree-bottom-left" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 10 H65 M10 10 V65 M18 18 H48 M18 18 V48 M10 10 C 35 35, 35 35, 45 10 C 35 35, 35 35, 10 45 M22 22 C 40 40, 40 40, 55 22"/>
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
          <circle cx="25" cy="25" r="2" fill="currentColor"/>
        </svg>
        <svg class="filigree-corner filigree-bottom-right" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 10 H65 M10 10 V65 M18 18 H48 M18 18 V48 M10 10 C 35 35, 35 35, 45 10 C 35 35, 35 35, 10 45 M22 22 C 40 40, 40 40, 55 22"/>
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
          <circle cx="25" cy="25" r="2" fill="currentColor"/>
        </svg>

        <div class="inv-hero-overlay"></div>
        <div class="inv-hero-content">
          <!-- Royal Monogram Crest -->
          <div class="hero-monogram-crest">
            <div class="crest-initials">
              ${(() => {
                const title = activeEvent.title || '';
                if (title.includes('&')) {
                  const parts = title.split('&');
                  const first = parts[0].trim().split(' ').pop();
                  const second = parts[1].trim().split(' ')[0];
                  return `${first[0]} & ${second[0]}`;
                }
                return 'A & F';
              })()}
            </div>
          </div>

          ${personalizedGuest ? `
            <div class="hero-guest-ribbon">
              <span class="guest-ribbon-seal">⚜️</span> Handcrafted Invitation Prepared Especially For <strong>${decodeURIComponent(personalizedGuest)}</strong>
            </div>
          ` : ''}
          ${activeEvent.couplePhoto ? `
            <div class="hero-photo-wrapper">
              <div class="hero-photo-container">
                <img src="${activeEvent.couplePhoto}" alt="Couple Photo" class="hero-photo-img">
              </div>
            </div>
          ` : ''}
          <div class="inv-tagline script-font">${activeEvent.tagline || 'Two Souls, One Timeless Promise'}</div>
          <h1 class="inv-main-names">${activeEvent.title}</h1>
          <div class="inv-subtitle">Hosted By ${activeEvent.hostNames}</div>

          <!-- Countdown Timer -->
          <div class="countdown-grid" id="inv-countdown">
            <div class="countdown-box"><div class="countdown-number" id="cd-days">00</div><div class="countdown-label">Days</div></div>
            <div class="countdown-box"><div class="countdown-number" id="cd-hours">00</div><div class="countdown-label">Hours</div></div>
            <div class="countdown-box"><div class="countdown-number" id="cd-mins">00</div><div class="countdown-label">Mins</div></div>
            <div class="countdown-box"><div class="countdown-number" id="cd-secs">00</div><div class="countdown-label">Secs</div></div>
          </div>

          <!-- Action Buttons -->
          <div class="hero-cta-group" style="display: flex; gap: 1rem; align-items: center; justify-content: center;">
            <button id="hero-btn-rsvp" class="btn btn-lg" style="background: linear-gradient(135deg, #f5d061, #b58117); color: #000; border: none; box-shadow: 0 4px 20px rgba(181, 129, 23, 0.4); text-transform: uppercase; letter-spacing: 2px; font-weight: 800; border-radius: 8px; min-width: 180px;">RSVP Now</button>
            <div class="dropdown-wrapper" style="position: relative;">
              <button id="hero-btn-more-options" class="btn btn-outline" style="width: 3.2rem; height: 3.2rem; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; border-color: rgba(255,255,255,0.3); color: #fff;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="19" cy="12" r="1.5"></circle>
                  <circle cx="5" cy="12" r="1.5"></circle>
                </svg>
              </button>
              <div id="hero-more-dropdown" class="dropdown-menu" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem; flex-direction: column; gap: 0.5rem; z-index: 100; min-width: 220px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);">
                <button id="hero-btn-replay-envelope" class="btn btn-outline" style="width: 100%; justify-content: flex-start; border: none; padding: 0.75rem 1rem;">💌 Replay Opening</button>
                <button id="hero-btn-add-cal" class="btn btn-outline" style="width: 100%; justify-content: flex-start; border: none; padding: 0.75rem 1rem;">📅 Add to Calendar</button>
                <button id="hero-btn-print-card" class="btn btn-outline" style="width: 100%; justify-content: flex-start; border: none; padding: 0.75rem 1rem;">🖨️ Printable Card</button>
                <a id="hero-btn-share-wa" class="btn btn-outline" style="width: 100%; justify-content: flex-start; border: none; padding: 0.75rem 1rem; color: #25D366;" target="_blank">💬 Share WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic Reorderable Sections -->
      ${(() => {
        const order = activeEvent.sectionOrder || ['story', 'gallery', 'schedule', 'dresscode', 'wishes'];
        const sectionMap = {
          story: (activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones && activeEvent.storyMilestones.length > 0) ? `
            <section id="section-story" class="inv-section reveal-on-scroll">
              <div class="section-header">
                <div class="section-tag">Memories & Milestones</div>
                <h2 class="section-title">Our Journey</h2>
              </div>
              <div class="story-timeline">
                ${activeEvent.storyMilestones.map(m => `
                  <div class="timeline-item">
                    <div class="timeline-node"></div>
                    <div class="timeline-content theme-card">
                      <div class="timeline-date">${m.date}</div>
                      <div class="timeline-title">${m.title}</div>
                      <div class="timeline-desc">${m.description}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : '',

          gallery: `
            <section id="section-gallery" class="inv-section reveal-on-scroll">
              <div class="section-header">
                <div class="section-tag">Capturing Our Joy</div>
                <h2 class="section-title">Pre-Wedding Highlights</h2>
              </div>
              <div class="gallery-cards-grid">
                <div class="gallery-photo-card theme-card">
                  <div style="background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(61,15,26,0.9) 100%); height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">👑</div>
                    <div style="font-family: var(--theme-font-script); font-size: 1.8rem; color: var(--theme-accent);">Royal Portrait</div>
                  </div>
                  <div class="gallery-photo-caption">
                    <div class="gallery-photo-title">The Royal Portrait Session</div>
                    <div class="gallery-photo-sub">Captured at Taj Falaknuma Palace</div>
                  </div>
                </div>

                <div class="gallery-photo-card theme-card">
                  <div style="background: linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(20,30,55,0.9) 100%); height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">💌</div>
                    <div style="font-family: var(--theme-font-script); font-size: 1.8rem; color: var(--theme-accent);">The Nikkah Ceremony</div>
                  </div>
                  <div class="gallery-photo-caption">
                    <div class="gallery-photo-title">Sacred Vows & Shlokas</div>
                    <div class="gallery-photo-sub">Intimate Family Gathering</div>
                  </div>
                </div>

                <div class="gallery-photo-card theme-card">
                  <div style="background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(74,18,8,0.9) 100%); height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">✨</div>
                    <div style="font-family: var(--theme-font-script); font-size: 1.8rem; color: var(--theme-accent);">Sangeet & Gala Night</div>
                  </div>
                  <div class="gallery-photo-caption">
                    <div class="gallery-photo-title">Celebration & Dance Gala</div>
                    <div class="gallery-photo-sub">Music, Feasts & Festivities</div>
                  </div>
                </div>
              </div>
            </section>
          `,

          schedule: (activeEvent.visibleSections?.schedule !== false) ? `
            <section id="section-schedule" class="inv-section reveal-on-scroll">
              <div class="section-header">
                <div class="section-tag">Date & Location</div>
                <h2 class="section-title">Event Schedule</h2>
              </div>
              <div class="venues-grid">
                ${(activeEvent.venues || []).map(v => `
                  <div class="venue-card theme-card">
                    <div class="venue-name">${v.name}</div>
                    <div class="venue-date">📅 ${v.date}</div>
                    <div class="venue-address">📍 ${v.address}</div>
                    <div style="margin-top: 1rem;">
                      <a href="https://maps.google.com/?q=${encodeURIComponent(v.address)}" target="_blank" class="btn btn-sm btn-outline">
                        🗺️ Open in Google Maps
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : '',

          dresscode: (activeEvent.visibleSections?.dressCode !== false && activeEvent.dressCode) ? `
            <section id="section-dresscode" class="inv-section reveal-on-scroll">
              <div class="section-header">
                <div class="section-tag">Guest Attire</div>
                <h2 class="section-title">${activeEvent.dressCode.title || 'Dress Code'}</h2>
                <p style="margin-top: 0.5rem; color: var(--theme-text-secondary);">${activeEvent.dressCode.description || ''}</p>
              </div>
              <div class="dress-colors-flex" style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
                ${(activeEvent.dressCode.colors || []).map(c => `
                  <div style="text-align: center;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: ${c.hex}; margin: 0 auto; border: 2px solid var(--theme-card-border); box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>
                    <div style="font-size: 0.8rem; margin-top: 0.4rem; color: var(--theme-text-primary); font-weight: 600;">${c.label}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : '',

          wishes: (activeEvent.visibleSections?.wishes !== false) ? `
            <section id="section-wishes" class="inv-section reveal-on-scroll">
              <div class="section-header">
                <div class="section-tag">Love & Blessings</div>
                <h2 class="section-title">Guest Wishes Wall</h2>
              </div>
              <div class="wishes-wall-grid">
                ${(activeEvent.wishes || []).filter(w => w.approved).map(w => `
                  <div class="wish-card theme-card">
                    <div class="wish-text">"${w.text}"</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--theme-card-border); padding-top: 0.5rem;">
                      <div class="wish-author">— ${w.author}</div>
                      <button class="wish-like-btn" data-id="${w.id}">
                        ❤️ <span>${w.hearts || 0}</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''
        };

        return order.map(key => sectionMap[key] || '').join('');
      })()}
    </div>

    <!-- RSVP Modal Form (Minimalist 1-Screen) -->
    <div class="modal-backdrop" id="rsvp-modal">
      <div class="modal-content theme-card" style="max-width: 440px; padding: 1.8rem;">
        <button class="modal-close" id="rsvp-modal-close">✕</button>
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <div style="font-family: var(--theme-font-script); font-size: 1.6rem; color: var(--theme-accent);">Celebrate With Us</div>
          <h2 style="font-family: var(--theme-font-title); font-size: 1.5rem; margin-top: 0.2rem;">RSVP Attendance</h2>
          <p style="font-size: 0.82rem; color: var(--theme-text-secondary); margin-top: 0.2rem;">Quick 10-second response</p>
        </div>

        <form id="rsvp-submit-form">
          <!-- 1. Full Name -->
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Your Name</label>
            <input type="text" class="form-input" id="rsvp-name" required placeholder="e.g. Zainab & Tariq Rahman">
          </div>

          <!-- 2. Attendance Status Pills -->
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Will You Attend?</label>
            <div class="attendance-pills-group">
              <button type="button" class="pill-choice-btn active-attending" id="pill-attending">
                🎉 Joyfully Attending
              </button>
              <button type="button" class="pill-choice-btn" id="pill-declining">
                ✉️ Regretfully Declining
              </button>
            </div>
            <input type="hidden" id="rsvp-status" value="attending">
          </div>

          <!-- 3. Guest Count (+1s) - Shown if attending -->
          <div class="form-group" id="group-plusones" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Total Guests Attending</label>
            <div class="guest-counter-pills">
              <button type="button" class="counter-pill-btn active" data-value="0">1 Guest</button>
              <button type="button" class="counter-pill-btn" data-value="1">2 (+1)</button>
              <button type="button" class="counter-pill-btn" data-value="2">3 (+2)</button>
              <button type="button" class="counter-pill-btn" data-value="3">4 (+3)</button>
            </div>
            <input type="hidden" id="rsvp-plusones" value="0">
          </div>

          <!-- 4. Optional Note/Wish -->
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Wish / Note for Hosts <span style="font-weight:400; text-transform:none; opacity:0.7;">(Optional)</span></label>
            <input type="text" class="form-input" id="rsvp-notes" placeholder="Send a short prayer or warm wish...">
          </div>

          <button type="submit" class="btn btn-accent btn-lg w-full" style="margin-top: 0.5rem; font-size: 1rem;">
            Confirm & Get Entry Pass 🎟️
          </button>
        </form>
      </div>
    </div>

    <!-- Gate Pass Confirmation Modal -->
    <div class="modal-backdrop" id="gatepass-modal">
      <div class="modal-content" style="background: transparent; border: none; padding: 0;">
        <div class="gatepass-card">
          <div style="font-family: var(--theme-font-script); font-size: 2rem; color: var(--theme-accent);">Attendance Confirmed</div>
          <h2 style="font-family: var(--theme-font-title); font-size: 2rem; margin: 0.5rem 0;" id="gp-guest-name">Guest Pass</h2>
          <p style="font-size: 0.9rem; color: var(--theme-text-secondary);">Your Digital Entry Pass for ${activeEvent.title}</p>
          
          <div class="gatepass-qr-wrapper" id="gp-qr-container"></div>
          
          <div style="font-family: monospace; font-size: 1.4rem; font-weight: 700; color: var(--theme-accent);" id="gp-passcode">PASS-9999</div>

          <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; justify-content: center; flex-wrap:wrap;">
            <button class="btn btn-accent" id="gp-btn-download">💾 Download Image</button>
            <a id="gp-btn-wa" class="btn btn-outline" style="border-color:#25D366; color:#25D366;" target="_blank">💬 Send WA Proof</a>
            <button class="btn btn-outline" id="gp-btn-close">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // 1. Particle Canvas Engine Initialization
  const canvas = container.querySelector('#particle-canvas');
  let particleEngine = null;
  if (canvas) {
    particleEngine = new ParticleEngine(canvas);
    particleEngine.setType(themeObj.particleType || 'petals');
    particleEngine.start();
  }

  // 2. Audio Control & Autoplay Reference
  const audioBtn = container.querySelector('#audio-player-control');
  const bgAudio = container.querySelector('#inv-bg-audio');
  const eqVisual = container.querySelector('.audio-equalizer');
  const audioLabel = container.querySelector('#audio-btn-label');

  if (audioBtn && bgAudio) {
    audioBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          if (eqVisual) eqVisual.classList.remove('paused');
          if (audioLabel) audioLabel.textContent = '🎵 Playing: Royal Sangeet Acoustic Ensemble';
        }).catch(() => alert('Click again to play background audio.'));
      } else {
        bgAudio.pause();
        if (eqVisual) eqVisual.classList.add('paused');
        if (audioLabel) audioLabel.textContent = '🎵 Play Background Symphony';
      }
    });
  }

  // 3. Premium Cinematic Envelope Engine
  const openerOverlay = container.querySelector('#envelope-opener-overlay');
  let envelopeEngine = null;

  if (openerOverlay) {
    if (openerOverlay.parentElement !== document.body) {
      document.body.appendChild(openerOverlay);
    }

    // Apply light mode class BEFORE engine renders (so CSS is active from frame 1)
    if (themeObj?.lightEnvelope === true) {
      openerOverlay.classList.add('env-light-mode');
    } else {
      openerOverlay.classList.remove('env-light-mode');
    }

    const eventTitle = activeEvent.title || 'An Exclusive Event';
    const eventHosts = activeEvent.hostNames || '';
    envelopeEngine = new PremiumEnvelopeEngine(openerOverlay, eventTitle, eventHosts, themeObj);

    // On envelope open: play background music
    const origTrigger = envelopeEngine.triggerOpen.bind(envelopeEngine);
    envelopeEngine.triggerOpen = () => {
      if (bgAudio && bgAudio.paused) {
        bgAudio.play().then(() => {
          if (eqVisual) eqVisual.classList.remove('paused');
          if (audioLabel) audioLabel.textContent = '🎵 Playing: Royal Sangeet Acoustic Ensemble';
        }).catch(() => {});
      }
      origTrigger();
    };
  }

  // Replay Opening Animation
  const replayBtn = container.querySelector('#hero-btn-replay-envelope');
  if (replayBtn && envelopeEngine) {
    replayBtn.addEventListener('click', () => {
      envelopeEngine.reset();
    });
  }

  // More Options Dropdown Toggle
  const moreBtn = container.querySelector('#hero-btn-more-options');
  const moreDropdown = container.querySelector('#hero-more-dropdown');
  if (moreBtn && moreDropdown) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = moreDropdown.style.display === 'flex';
      moreDropdown.style.display = isVisible ? 'none' : 'flex';
    });
    document.addEventListener('click', (e) => {
      if (!moreDropdown.contains(e.target) && e.target !== moreBtn) {
        moreDropdown.style.display = 'none';
      }
    });
  }

  // 4. Countdown Timer Loop
  const eventTime = new Date(activeEvent.startDate).getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventTime - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const d = container.querySelector('#cd-days');
      const h = container.querySelector('#cd-hours');
      const m = container.querySelector('#cd-mins');
      const s = container.querySelector('#cd-secs');

      if (d) d.textContent = String(days).padStart(2, '0');
      if (h) h.textContent = String(hours).padStart(2, '0');
      if (m) m.textContent = String(mins).padStart(2, '0');
      if (s) {
        s.textContent = String(secs).padStart(2, '0');
        s.classList.remove('ticking');
        void s.offsetWidth; // Trigger reflow for animation restart
        s.classList.add('ticking');
      }
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Section Scroll Reveal Observer
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  container.querySelectorAll('.reveal-on-scroll').forEach(sec => secObserver.observe(sec));

  // Hero WhatsApp Share
  const heroWa = container.querySelector('#hero-btn-share-wa');
  if (heroWa) {
    const text = encodeURIComponent(`✨ You are invited to ${activeEvent.title} hosted by ${activeEvent.hostNames}!\nView details and RSVP: ${currentUrl}`);
    heroWa.href = `https://api.whatsapp.com/send?text=${text}`;
  }

  // 5. Minimalist RSVP Modal Logic & Interactive Pills
  const rsvpModal = container.querySelector('#rsvp-modal');
  const rsvpClose = container.querySelector('#rsvp-modal-close');
  const heroRsvpBtn = container.querySelector('#hero-btn-rsvp');
  const rsvpForm = container.querySelector('#rsvp-submit-form');
  const gatepassModal = container.querySelector('#gatepass-modal');
  let currentRsvpData = null;

  if (heroRsvpBtn) heroRsvpBtn.addEventListener('click', () => rsvpModal.classList.add('active'));
  if (rsvpClose) rsvpClose.addEventListener('click', () => rsvpModal.classList.remove('active'));

  // Attendance Pill Choices
  const pillAttending = container.querySelector('#pill-attending');
  const pillDeclining = container.querySelector('#pill-declining');
  const rsvpStatusInput = container.querySelector('#rsvp-status');
  const groupPlusones = container.querySelector('#group-plusones');

  if (pillAttending && pillDeclining) {
    pillAttending.addEventListener('click', () => {
      pillAttending.className = 'pill-choice-btn active-attending';
      pillDeclining.className = 'pill-choice-btn';
      rsvpStatusInput.value = 'attending';
      if (groupPlusones) groupPlusones.style.display = 'block';
    });

    pillDeclining.addEventListener('click', () => {
      pillDeclining.className = 'pill-choice-btn active-declining';
      pillAttending.className = 'pill-choice-btn';
      rsvpStatusInput.value = 'declined';
      if (groupPlusones) groupPlusones.style.display = 'none';
    });
  }

  // Guest Counter Pills
  const counterPills = container.querySelectorAll('.counter-pill-btn');
  const rsvpPlusonesInput = container.querySelector('#rsvp-plusones');
  counterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      counterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      rsvpPlusonesInput.value = pill.dataset.value;
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#rsvp-name').value;
      const status = container.querySelector('#rsvp-status').value;
      const plusOnes = parseInt(container.querySelector('#rsvp-plusones').value) || 0;
      const notes = container.querySelector('#rsvp-notes').value || '';

      const newRsvp = db.addRSVP(activeEvent.id, {
        guestName: name,
        email: name.toLowerCase().replace(/[^a-z0-9]/g,'') + '@guest.com',
        status: status,
        plusOnes: plusOnes,
        mealPref: 'Default Chef Choice',
        songRequest: '',
        notes: notes
      });

      currentRsvpData = newRsvp;

      // Close RSVP modal, open Gate Pass
      rsvpModal.classList.remove('active');

      // Trigger Celebration Confetti
      ParticleEngine.triggerConfetti();

      // Setup Gate Pass Modal
      container.querySelector('#gp-guest-name').textContent = name;
      container.querySelector('#gp-passcode').textContent = newRsvp.passCode;
      const qrContainer = container.querySelector('#gp-qr-container');
      qrContainer.innerHTML = generateQRCodeSVG(newRsvp.passCode, 160);

      // WhatsApp Gatepass Send
      const gpWaBtn = container.querySelector('#gp-btn-wa');
      if (gpWaBtn) {
        const msg = encodeURIComponent(`🎉 I have confirmed my RSVP for ${activeEvent.title}!\nGuest: ${name}\nEntry Passcode: ${newRsvp.passCode}`);
        gpWaBtn.href = `https://api.whatsapp.com/send?text=${msg}`;
      }

      gatepassModal.classList.add('active');
    });
  }

  container.querySelector('#gp-btn-close').addEventListener('click', () => gatepassModal.classList.remove('active'));
  container.querySelector('#gp-btn-download').addEventListener('click', () => {
    if (currentRsvpData) downloadDigitalGatePass(activeEvent, currentRsvpData);
  });

  // Calendar & Print buttons
  const calBtn = container.querySelector('#hero-btn-add-cal');
  if (calBtn) calBtn.addEventListener('click', () => downloadICSFile(activeEvent));

  const printBtn = container.querySelector('#hero-btn-print-card');
  if (printBtn) printBtn.addEventListener('click', () => downloadPrintableCard(activeEvent));

  // Wishes Heart Likes
  container.querySelectorAll('.wish-like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wishId = btn.dataset.id;
      db.likeWish(activeEvent.id, wishId);
      const span = btn.querySelector('span');
      span.textContent = parseInt(span.textContent) + 1;
    });
  });

  // Floating Section Nav Dots
  const dots = container.querySelectorAll('.nav-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.section;
      const sec = container.querySelector('#' + targetId);
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderExpiredScreen(container, activeEvent, themeObj) {
  container.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #fff; text-align: center; padding: 2rem;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">✨</div>
      <h1 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 0.5rem; color: #f59e0b;">This Celebration Has Concluded</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; margin-bottom: 2rem;">
        The invitation for <strong>${activeEvent.title}</strong> hosted by ${activeEvent.hostNames} has automatically expired. Thank you to everyone who joined and made it special!
      </p>
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <p style="font-size: 0.9rem; color: #cbd5e1;">Looking to create an ultra-luxury wedding invitation like this?</p>
        <a href="landing.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Explore Celebrati</a>
      </div>
    </div>
  `;
}

function render404Screen(container) {
  container.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #fff; text-align: center; padding: 2rem;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
      <h1 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 0.5rem; color: #f87171;">Invitation Not Found</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; max-width: 600px; margin-bottom: 2rem;">
        The invitation link you followed seems to be invalid or the event has been removed by the host.
      </p>
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <a href="landing.html" class="btn btn-primary" style="display: inline-block;">Return to Celebrati Home</a>
      </div>
    </div>
  `;
}
