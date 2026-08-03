/* ==========================================================================
   CELEBRATI — ADMIN CREATOR STUDIO COMPONENT (v2 — Workflow Redesign)
   ========================================================================== */

import { db } from '../storage.js';
import { THEMES } from '../themes.js';
import { OFFLINE_PAYMENT_CONFIG, FIREBASE_SETTINGS } from '../firebase-config.js';

export function renderAdminView(container, onNavigateToDashboard, onNavigateToInvite) {
  const events       = db.getEvents();
  const activeEvent  = db.getActiveEvent();
  const paymentStatus = db.getPaymentStatus(activeEvent.id);
  const isFirebaseEnabled = FIREBASE_SETTINGS.ENABLE_FIREBASE;

  // Build invite URL using current origin (works on localhost + production domain)
  const baseOrigin = window.location.origin;
  const inviteUrl  = `${baseOrigin}/app.html#invite-${activeEvent.id}`;
  const trackerUrl = `${baseOrigin}/app.html#tracker-${activeEvent.id}`;

  container.innerHTML = `
    <div class="admin-layout">
      <!-- ── Top Hero Header Bar ── -->
      <div class="admin-hero-header">
        <div>
          <div class="admin-hero-title">Admin Creator Studio</div>
          <div class="admin-hero-sub">Craft bespoke digital invitations • Select from 12+ luxury templates • Deliver live links & stats to couples</div>
        </div>
        <div class="admin-hero-actions">
          <div class="admin-mode-badge ${isFirebaseEnabled ? 'cloud' : 'local'}">
            ${isFirebaseEnabled ? '🔥 Firebase Cloud Sync' : '⚡ Local Storage Mode'}
          </div>
          <button id="btn-create-new-event" class="btn-new-event">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + New Event
          </button>
        </div>
      </div>

      <!-- ── Events Library ── -->
      <div class="managed-events-section">
        <div class="section-heading">
          <div class="section-heading-title">
            <span>📚 Managed Events (${events.length})</span>
          </div>
        </div>
        <div class="event-grid" id="event-library-grid">
          ${events.map(evt => {
            const pStatus = db.getPaymentStatus(evt.id);
            const isActive = evt.id === activeEvent.id;
            const evtInviteUrl = `${baseOrigin}/#invite-${evt.id}`;
            return `
            <div class="event-card ${isActive ? 'active-event' : ''}" id="evtcard-${evt.id}">
              <div class="event-card-bar"></div>
              <div class="event-card-body">
                <div class="event-card-top">
                  <div class="event-card-type-icon">
                    ${evt.eventType === 'wedding' ? '💍' : (evt.eventType === 'birthday' ? '🎂' : '🥂')}
                  </div>
                  <span class="badge ${pStatus === 'paid' ? 'badge-success' : (pStatus === 'pending_review' ? 'badge-warning' : 'badge-danger')}">
                    ${pStatus === 'paid' ? '✓ Paid' : (pStatus === 'pending_review' ? '⏳ Review' : 'Unpaid')}
                  </span>
                </div>
                <div class="event-card-title">${evt.title}</div>
                <div class="event-card-hosts">${evt.hostNames}</div>
                <div class="event-card-meta">
                  <span class="meta-chip">📅 ${new Date(evt.startDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
                  <span class="meta-chip">👥 ${evt.rsvps ? evt.rsvps.length : 0} Guests</span>
                  <span class="meta-chip">🎨 ${THEMES[evt.theme]?.name?.replace(/^[^\s]+\s/,'') || 'Royal'}</span>
                </div>
              </div>
              <div class="event-card-actions">
                <button class="btn btn-secondary btn-sm btn-select-event" data-id="${evt.id}">
                  ${isActive ? '✓ Editing' : '✏️ Edit'}
                </button>
                <button class="btn btn-outline btn-sm btn-copy-url" data-url="${evtInviteUrl}" title="Copy customer invite URL">
                  📋 Copy URL
                </button>
                <button class="btn btn-outline btn-sm btn-open-dash" data-id="${evt.id}">📊 Stats</button>
              </div>
            </div>
          `}).join('')}
        </div>
      </div>

      <!-- ── Wizard + Preview ── -->
      <div class="wizard-split" id="wizard-section">
        <!-- Wizard Form Panel -->
        <div class="wizard-form-container">
          <!-- Step Indicator -->
          <div class="wizard-steps">
            <div class="wizard-step-item active" data-step="1">
              <div class="step-number">1</div>
              <span class="step-label">Select Template</span>
            </div>
            <div class="wizard-step-item" data-step="2">
              <div class="step-number">2</div>
              <span class="step-label">Event Info</span>
            </div>
            <div class="wizard-step-item" data-step="3">
              <div class="step-number">3</div>
              <span class="step-label">Photos & Colors</span>
            </div>
            <div class="wizard-step-item" data-step="4">
              <div class="step-number">4</div>
              <span class="step-label">Venues</span>
            </div>
            <div class="wizard-step-item" data-step="5">
              <div class="step-number">5</div>
              <span class="step-label">Sections</span>
            </div>
            <div class="wizard-step-item" data-step="6">
              <div class="step-number">6</div>
              <span class="step-label">Submit & Deliver</span>
            </div>
          </div>

          <form id="admin-event-form">
                        <!-- ════ STEP 1: Select Template ════ -->
            <div class="wizard-step-content" id="step-1-content">
              <h3 style="margin-bottom:0.4rem; font-family:var(--font-display);">Select Invitation Template</h3>
              <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.5rem;">Choose a luxury template based on your customer's cultural, religious, or event theme requirement.</p>

              <div class="theme-picker-grid" id="theme-picker-grid">
                ${Object.entries(THEMES).map(([key, t]) => `
                  <div class="theme-pick-card ${activeEvent.theme === key ? 'selected' : ''}"
                       data-theme="${key}"
                       style="background: linear-gradient(145deg, ${t.bgPreview} 0%, ${t.swatches[0]} 100%);">
                    <div class="theme-pick-preview" style="min-height: 180px; position: relative; border-radius: 12px 12px 0 0; border-bottom: 2px solid ${t.primaryColor}; background: linear-gradient(145deg, ${t.bgPreview} 0%, ${t.swatches[0] || t.bgPreview} 100%); overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                      ${t.layoutType === 'modern' ? `
                        <div style="display:flex; width:100%; height:100%; padding:1.2rem; align-items:center; justify-content:space-between; box-sizing:border-box;">
                          <div style="width:45%; height:85px; background:rgba(255,255,255,0.06); border-radius:10px; border:1px solid ${t.primaryColor}; box-shadow:0 8px 16px rgba(0,0,0,0.5);"></div>
                          <div style="width:45%; display:flex; flex-direction:column; gap:8px;">
                            <div style="width:100%; height:8px; background:${t.primaryColor}; border-radius:4px;"></div>
                            <div style="width:70%; height:6px; background:rgba(255,255,255,0.4); border-radius:3px;"></div>
                            <div style="width:40%; height:6px; background:rgba(255,255,255,0.2); border-radius:3px;"></div>
                          </div>
                        </div>
                      ` : t.layoutType === 'editorial' ? `
                        <div style="width:100%; height:100%; position:relative; padding:1.2rem; box-sizing:border-box; background:rgba(255,255,255,0.02);">
                          <div style="font-size:1.8rem; font-weight:900; font-family:serif; letter-spacing:-1px; color:${t.primaryColor}; line-height:0.95; margin-top:0.3rem;">ALAYA<br>& FARHAN</div>
                          <div style="position:absolute; bottom:15px; left:1.2rem; width:50px; height:3px; background:${t.primaryColor};"></div>
                        </div>
                      ` : `
                        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:1.2rem; box-sizing:border-box;">
                          <div style="width:50px; height:50px; border-radius:50%; border:2px solid ${t.primaryColor}; background:rgba(255,255,255,0.08); margin-bottom:10px; box-shadow:0 5px 15px rgba(0,0,0,0.4);"></div>
                          <div style="width:90px; height:6px; background:${t.primaryColor}; border-radius:3px; margin-bottom:6px;"></div>
                          <div style="width:50px; height:4px; background:rgba(255,255,255,0.4); border-radius:2px;"></div>
                        </div>
                      `}

                      <div style="position: absolute; bottom: 0; inset-x: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 70%, transparent 100%); padding: 0.75rem 1rem 0.5rem; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                          <div style="font-size:0.58rem; letter-spacing:2px; text-transform:uppercase; color:${t.primaryColor}; font-weight: 700;">${t.categoryLabel || 'Luxury'}</div>
                          <div style="font-size:0.95rem; font-weight:700; color:#fff; font-family:var(--font-display); line-height:1.2;">
                            ${t.name}
                          </div>
                        </div>
                        <div style="display:flex; gap:0.2rem; background:rgba(0,0,0,0.6); padding:3px 6px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                          ${t.swatches.map(s => `<span style="width:8px;height:8px;border-radius:50%;background:${s};display:inline-block;"></span>`).join('')}
                        </div>
                      </div>
                    </div>
                    <div class="theme-pick-info">
                      <div style="font-weight:700; font-size:0.88rem;">${t.name}</div>
                      <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); margin-top:0.2rem; line-height:1.3; margin-bottom: 0.8rem;">${t.description}</div>
                      <button type="button" class="btn btn-sm btn-outline btn-preview-template" data-theme="${key}" style="width:100%; border-color:rgba(255,255,255,0.2); font-size:0.75rem; padding:0.3rem; margin-top:0.5rem; background: rgba(255,255,255,0.05); color: #fff;">✨ Preview & Customize</button>
                    </div>
                    <div class="theme-pick-check" style="display:${activeEvent.theme === key ? 'flex' : 'none'}; background:${t.primaryColor}; color:#000;">✓</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- ════ STEP 2: Customer & Event Info ════ -->
            <div class="wizard-step-content hidden" id="step-2-content">
              <h3 style="margin-bottom:1.25rem; font-family:var(--font-display);">Customer & Event Essentials</h3>
              
              <div class="customer-details-box">
                <div class="customer-details-label">👤 Customer Details (For Link Delivery)</div>
                <div class="form-row" style="margin-bottom:0;">
                  <div class="form-group">
                    <label class="form-label">Customer Name</label>
                    <input type="text" class="form-input" id="field-customerName" value="${activeEvent.customerName || ''}" placeholder="e.g. Farhan Qureshi">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Customer WhatsApp Number</label>
                    <input type="text" class="form-input" id="field-customerPhone" value="${activeEvent.customerPhone || ''}" placeholder="e.g. +919876543210">
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Event Type</label>
                  <select class="form-select" id="field-eventType">
                    <option value="wedding"     ${activeEvent.eventType === 'wedding'     ? 'selected' : ''}>💍 Wedding / Nikkah / Anand Karaj</option>
                    <option value="birthday"    ${activeEvent.eventType === 'birthday'    ? 'selected' : ''}>🎂 Birthday / Milestone Gala</option>
                    <option value="anniversary" ${activeEvent.eventType === 'anniversary' ? 'selected' : ''}>🌸 Anniversary / Celebration</option>
                    <option value="corporate"   ${activeEvent.eventType === 'corporate'   ? 'selected' : ''}>🥂 VIP Launch / Corporate Gala</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Event Title</label>
                  <input type="text" class="form-input" id="field-title" value="${activeEvent.title}" placeholder="e.g. The Royal Wedding of Alaya & Farhan">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Host / Couple Names (shown on invite)</label>
                  <input type="text" class="form-input" id="field-hostNames" value="${activeEvent.hostNames}" placeholder="e.g. Alaya Khan & Farhan Qureshi">
                </div>
                <div class="form-group">
                  <label class="form-label">Tagline / Subtitle</label>
                  <input type="text" class="form-input" id="field-tagline" value="${activeEvent.tagline}" placeholder="e.g. Two Souls, One Timeless Promise">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Event Date & Time</label>
                  <input type="datetime-local" class="form-input" id="field-startDate" value="${activeEvent.startDate}">
                </div>
                <div class="form-group">
                  <label class="form-label">RSVP Deadline</label>
                  <input type="date" class="form-input" id="field-rsvpDeadline" value="${activeEvent.rsvpDeadline}">
                </div>
              </div>
            </div>

            <!-- ════ STEP 3: Photos & Customization ════ -->
            <div class="wizard-step-content hidden" id="step-3-content">
              <h3 style="margin-bottom:0.4rem; font-family:var(--font-display);">Upload Photos & Styling</h3>
              <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.5rem;">Upload the couple/host hero photo and customize colors & music track.</p>

              <!-- Image Upload Box -->
              <div class="glass-panel" style="padding:1.25rem; margin-bottom:1.5rem;">
                <label class="form-label">🖼️ Couple / Host Hero Photo Upload</label>
                <div style="display:flex; gap:1.25rem; align-items:center; flex-wrap:wrap; margin-top:0.5rem;">
                  <div id="couple-photo-preview" style="width:100px; height:100px; border-radius:14px; background:#0F172A; border:2px dashed rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; overflow:hidden; background-size:cover; background-position:center; background-image:url('${activeEvent.couplePhoto || ''}');">
                    ${!activeEvent.couplePhoto ? '<span style="font-size:2rem; opacity:0.5;">📷</span>' : ''}
                  </div>
                  <div style="flex:1; min-width:200px;">
                    <input type="file" id="field-couplePhotoFile" accept="image/*" class="form-input" style="padding:0.4rem; font-size:0.85rem; margin-bottom:0.5rem;">
                    <input type="text" id="field-couplePhotoUrl" class="form-input" value="${activeEvent.couplePhoto || ''}" placeholder="Or paste image URL (https://...)" style="font-size:0.82rem;">
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">🎨 Custom Primary Color (Optional)</label>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="color" class="form-input" id="field-customColor" value="${activeEvent.customColor || THEMES[activeEvent.theme]?.primaryColor || '#E5A965'}" style="height: 42px; width: 60px; padding: 0.2rem; cursor: pointer;">
                    <button type="button" class="btn btn-sm btn-outline" onclick="document.getElementById('field-customColor').value=''" title="Reset color">↺ Reset</button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">✍️ Custom Typography</label>
                  <select class="form-select" id="field-customFont">
                    <option value="">Default Theme Font</option>
                    <option value="'Italiana', serif" ${activeEvent.customFont === "'Italiana', serif" ? 'selected' : ''}>🇮🇹 Italiana (High-Fashion Didone Serif)</option>
                    <option value="'Montserrat', sans-serif" ${activeEvent.customFont === "'Montserrat', sans-serif" ? 'selected' : ''}>✨ Montserrat (Modern Geometric Pair)</option>
                    <option value="'Playfair Display', serif" ${activeEvent.customFont === "'Playfair Display', serif" ? 'selected' : ''}>Playfair Display</option>
                    <option value="'Cinzel', serif" ${activeEvent.customFont === "'Cinzel', serif" ? 'selected' : ''}>Cinzel</option>
                    <option value="'Great Vibes', cursive" ${activeEvent.customFont === "'Great Vibes', cursive" ? 'selected' : ''}>Great Vibes</option>
                    <option value="'Lora', serif" ${activeEvent.customFont === "'Lora', serif" ? 'selected' : ''}>Lora</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">🎵 Background Music URL (.mp3)</label>
                <input type="text" class="form-input" id="field-audioUrl" value="${activeEvent.audioUrl || ''}" placeholder="https://cdn.example.com/song.mp3">
              </div>
              <div class="form-group">
                <label class="form-label">Music Track Name (shown to guests)</label>
                <input type="text" class="form-input" id="field-musicTitle" value="${activeEvent.musicTitle || ''}" placeholder="e.g. Romantic Canon in D Piano">
              </div>
            </div>

            <!-- ════ STEP 3: Story & Dress ════ -->
            <div class="wizard-step-content hidden" id="step-3-content">
              <h3 style="margin-bottom:1.25rem; font-family:var(--font-display);">Story & Dress Code</h3>
              <div class="form-group">
                <label class="form-label">Event Hashtag</label>
                <input type="text" class="form-input" id="field-hashtag" value="${activeEvent.hashtag || ''}" placeholder="#YourEventHashtag">
              </div>
              <div class="form-group">
                <label class="form-label">Dress Code Title</label>
                <input type="text" class="form-input" id="field-dressCodeTitle" value="${activeEvent.dressCode ? activeEvent.dressCode.title : ''}" placeholder="e.g. Royal Ethnic & Black Tie Luxury">
              </div>
              <div class="form-group">
                <label class="form-label">Dress Code Description</label>
                <textarea class="form-input" id="field-dressCodeDesc" rows="3" placeholder="Describe the expected attire for guests...">${activeEvent.dressCode ? activeEvent.dressCode.description : ''}</textarea>
              </div>
              <div style="background:rgba(255,255,255,0.04); border:1px dashed var(--border-color); border-radius:8px; padding:1rem; margin-top:0.5rem; font-size:0.82rem; color:var(--text-secondary);">
                <strong style="color:var(--text-primary);">💡 Tip:</strong> Story milestones, FAQ, and gift registry are pre-populated from event data and can be customized via direct code edit in storage.js for now.
              </div>
            </div>

            <!-- ════ STEP 4: Venues ════ -->
            <div class="wizard-step-content hidden" id="step-4-content">
              <h3 style="margin-bottom:1.25rem; font-family:var(--font-display);">Venues & Schedule</h3>
              <div class="form-group">
                <label class="form-label">Main Venue Name</label>
                <input type="text" class="form-input" id="field-venueName" value="${activeEvent.venues && activeEvent.venues[0] ? activeEvent.venues[0].name : ''}" placeholder="e.g. Grand Imperial Ballroom">
              </div>
              <div class="form-group">
                <label class="form-label">Date & Time (display format)</label>
                <input type="text" class="form-input" id="field-venueDate" value="${activeEvent.venues && activeEvent.venues[0] ? activeEvent.venues[0].date : ''}" placeholder="e.g. Saturday, Dec 14, 2026 • 7:00 PM">
              </div>
              <div class="form-group">
                <label class="form-label">Full Venue Address</label>
                <input type="text" class="form-input" id="field-venueAddress" value="${activeEvent.venues && activeEvent.venues[0] ? activeEvent.venues[0].address : ''}" placeholder="e.g. Atlantis Pavilion, Palm Jumeirah, Dubai">
              </div>
              <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border-color); border-radius:8px; padding:0.85rem; margin-top:0.5rem; font-size:0.82rem; color:var(--text-secondary);">
                <strong style="color:var(--text-primary);">📍 Note:</strong> A Google Maps button is auto-generated from the address. Multiple venues (e.g. Sangeet + Wedding) need to be added in code currently — multi-venue UI editor coming soon.
              </div>
            </div>

                        <!-- ════ STEP 5: Sections & Layout Arrangement ════ -->
            <div class="wizard-step-content hidden" id="step-5-content">
              <h3 style="margin-bottom:0.4rem; font-family:var(--font-display);">Sections & Page Arrangement</h3>
              <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.5rem;">Toggle section visibility and reorder the layout arrangement of the invitation.</p>

              <!-- Section Visibility Toggles -->
              <div class="glass-panel" style="padding:1.25rem; margin-bottom:1.5rem;">
                <label class="form-label" style="margin-bottom:0.8rem;">👁️ Visibility Toggles</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                  <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; background:rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                    <input type="checkbox" id="field-sec-story" ${activeEvent.visibleSections?.story !== false ? 'checked' : ''} style="width:18px;height:18px;">
                    <span style="font-size:0.92rem; font-weight:600;">📖 Our Story</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; background:rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                    <input type="checkbox" id="field-sec-schedule" ${activeEvent.visibleSections?.schedule !== false ? 'checked' : ''} style="width:18px;height:18px;">
                    <span style="font-size:0.92rem; font-weight:600;">📅 Schedule & Venues</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; background:rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                    <input type="checkbox" id="field-sec-dressCode" ${activeEvent.visibleSections?.dressCode !== false ? 'checked' : ''} style="width:18px;height:18px;">
                    <span style="font-size:0.92rem; font-weight:600;">👗 Dress Code</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; background:rgba(0,0,0,0.3); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
                    <input type="checkbox" id="field-sec-wishes" ${activeEvent.visibleSections?.wishes !== false ? 'checked' : ''} style="width:18px;height:18px;">
                    <span style="font-size:0.92rem; font-weight:600;">💬 Wishes Wall</span>
                  </label>
                </div>
              </div>

              <!-- Section Reordering Controls -->
              <div class="glass-panel" style="padding:1.25rem;">
                <label class="form-label" style="margin-bottom:0.8rem;">🔃 Reorder Page Layout Arrangement</label>
                <div id="section-order-list" style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${(() => {
                    const order = activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes'];
                    const labels = {
                      story: '📖 Our Story (Milestones)',
                      schedule: '📅 Schedule & Venues',
                      dresscode: '👗 Dress Code & Attire',
                      wishes: '💬 Guest Wishes Wall'
                    };
                    return order.map((key, idx) => `
                      <div class="order-item-card" data-key="${key}" style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); padding:0.6rem 1rem; border-radius:10px;">
                        <span style="font-size:0.9rem; font-weight:600;">${idx + 1}. ${labels[key] || key}</span>
                        <div style="display:flex; gap:0.3rem;">
                          <button type="button" class="btn btn-sm btn-outline btn-move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>⬆️ Up</button>
                          <button type="button" class="btn btn-sm btn-outline btn-move-down" data-idx="${idx}" ${idx === order.length - 1 ? 'disabled' : ''}>⬇️ Down</button>
                        </div>
                      </div>
                    `).join('');
                  })()}
                </div>
              </div>
            </div>

            <!-- ════ STEP 6: Publish & Share ════ -->
            <div class="wizard-step-content hidden" id="step-6-content">
              <h3 style="margin-bottom:1.25rem; font-family:var(--font-display);">Publish, Share & Payment</h3>

              <!-- ── PUBLISH STATUS BANNER ── -->
              <div id="publish-status-banner" style="background:${activeEvent.status === 'published'
                ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.25))'
                : 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(217,119,6,0.2))'};
                border:1px solid ${activeEvent.status === 'published' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.3)'};
                border-radius:10px; padding:1rem 1.25rem; margin-bottom:1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span style="font-size:1.5rem;">${activeEvent.status === 'published' ? '🟢' : '🟡'}</span>
                  <div>
                    <div style="font-weight:700;">${activeEvent.status === 'published' ? 'Invitation is LIVE' : 'Draft — Not Published Yet'}</div>
                    <div style="font-size:0.82rem; color:var(--text-secondary);">
                      ${activeEvent.status === 'published' ? 'Guests can open and RSVP via the link below.' : 'Save & publish to make this invitation accessible to guests.'}
                    </div>
                  </div>
                </div>
                ${activeEvent.status !== 'published' ? `
                  <button type="button" class="btn btn-primary" id="btn-publish-now" style="white-space:nowrap;">
                    🚀 Publish Now
                  </button>
                ` : `
                  <button type="button" class="btn btn-outline btn-sm" id="btn-unpublish" style="color:var(--text-secondary);">
                    Unpublish
                  </button>
                `}
              </div>

              <!-- ── CUSTOMER DELIVERY PACKAGE (2 LINKS + PIN + WHATSAPP) ── -->
              <div class="customer-delivery-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
                  <div>
                    <h4 style="font-size:1.1rem; font-weight:800; color:#FFD700; display:flex; align-items:center; gap:0.5rem;">
                      🚀 Customer Delivery Package
                    </h4>
                    <p style="font-size:0.82rem; color:#94A3B8; margin-top:0.2rem;">Send both links & security PIN directly to your customer.</p>
                  </div>
                  <a id="btn-deliver-all-wa" class="whatsapp-share-btn" target="_blank">
                    💬 Send Both Links via WhatsApp
                  </a>
                </div>

                <!-- Link 1: Public Invitation -->
                <div style="margin-bottom:1.2rem;">
                  <label style="font-size:0.78rem; font-weight:700; color:#E5A965; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:0.4rem;">
                    💌 Link 1: Public Invitation Link (For Guests to RSVP)
                  </label>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="text" class="form-input" id="share-link-invite" value="${inviteUrl}" readonly style="flex:1; font-family:monospace; font-size:0.85rem; background:rgba(0,0,0,0.3);">
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-invite-link">📋 Copy Link 1</button>
                  </div>
                </div>

                <!-- Link 2: Host RSVP Tracker & Stats -->
                <div style="margin-bottom:1.2rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                    <label style="font-size:0.78rem; font-weight:700; color:#6EE7B7; text-transform:uppercase; letter-spacing:1px;">
                      📊 Link 2: Private RSVP Tracker & Stats (For Couple Only)
                    </label>
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                      <span style="font-size:0.75rem; color:#94A3B8;">Security PIN:</span>
                      <span class="pin-display-tag" id="display-tracker-pin">${activeEvent.trackerPin || '4281'}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="text" class="form-input" id="share-link-tracker" value="${trackerUrl}" readonly style="flex:1; font-family:monospace; font-size:0.85rem; background:rgba(0,0,0,0.3);">
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-tracker-link">📋 Copy Link 2</button>
                  </div>
                </div>
              </div>

              <!-- ── HOST TRACKER LINK ── -->
              <div class="glass-panel" style="padding:1.25rem; margin-bottom:1.25rem;">
                <label class="form-label" style="display:block; margin-bottom:0.6rem; font-size:0.82rem; letter-spacing:1.5px; text-transform:uppercase;">
                  📊 Host Tracker Link (Private — for couple only)
                </label>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center; margin-bottom:0.5rem;">
                  <input type="text" class="form-input" id="share-link-tracker"
                    value="${trackerUrl}" readonly
                    style="flex:1; min-width:220px; font-family:monospace; font-size:0.88rem; background:rgba(255,255,255,0.04);">
                  <button type="button" class="btn btn-secondary" id="btn-copy-tracker-link">📋 Copy</button>
                  <a id="btn-share-tracker-wa" class="btn" style="background:#25D366; color:#fff; border:none;" target="_blank">💬 WhatsApp</a>
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.4rem; flex-wrap:wrap;">
                  <span style="font-size:0.8rem; color:var(--text-secondary);">Security PIN:</span>
                  <input type="text" class="form-input" id="field-tracker-pin"
                    value="${activeEvent.trackerPin || ''}" placeholder="e.g. 4281"
                    style="width:90px; padding:0.3rem 0.5rem; font-size:0.85rem;">
                  <button type="button" class="btn btn-outline btn-sm" id="btn-save-pin">Save PIN</button>
                </div>
              </div>

              <!-- ── OFFLINE PAYMENT STATUS ── -->
              <div class="glass-panel" style="padding:1.25rem; border-left:4px solid ${paymentStatus === 'paid' ? '#10B981' : (paymentStatus === 'pending_review' ? '#F59E0B' : '#EF4444')};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem; margin-bottom:1rem;">
                  <div>
                    <div style="font-weight:700; font-size:1rem;">
                      💳 Payment — ${OFFLINE_PAYMENT_CONFIG.pricePerEvent} / event
                    </div>
                    <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.2rem;">
                      Status:
                      ${paymentStatus === 'paid'
                        ? '<span class="badge badge-success">✓ Verified & Paid</span>'
                        : (paymentStatus === 'pending_review'
                          ? '<span class="badge badge-warning">⏳ Proof Submitted — Reviewing</span>'
                          : '<span class="badge badge-danger">⚠️ Unpaid</span>')}
                    </div>
                  </div>
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    ${paymentStatus !== 'paid' ? `
                      <button type="button" class="btn btn-sm" id="btn-mark-paid" style="background:#10B981; color:#fff; border:none;">
                        ✓ Mark as Paid
                      </button>
                    ` : `
                      <button type="button" class="btn btn-outline btn-sm" id="btn-mark-pending" style="color:#F59E0B; border-color:#F59E0B;">
                        Revert to Pending
                      </button>
                    `}
                  </div>
                </div>

                <!-- Payment instructions shown TO admin for reference -->
                <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border-color); border-radius:8px; padding:0.9rem; font-size:0.82rem;">
                  <div style="font-weight:700; margin-bottom:0.5rem; color:var(--color-primary);">🏦 Your Payment Details (send to customer):</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:0.4rem; color:var(--text-secondary); line-height:1.7;">
                    <div>• <strong>UPI:</strong> ${OFFLINE_PAYMENT_CONFIG.upiId}</div>
                    <div>• <strong>Bank:</strong> ${OFFLINE_PAYMENT_CONFIG.bankDetails.bankName}</div>
                    <div>• <strong>Account:</strong> ${OFFLINE_PAYMENT_CONFIG.bankDetails.accountNumber}</div>
                    <div>• <strong>IFSC:</strong> ${OFFLINE_PAYMENT_CONFIG.bankDetails.ifscCode}</div>
                  </div>
                  <div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">
                    <a id="btn-send-whatsapp-proof" class="btn btn-sm" style="background:rgba(37,211,102,0.15); color:#25D366; border:1px solid rgba(37,211,102,0.3);" target="_blank">
                      💬 Send Payment Instructions via WhatsApp
                    </a>
                    <a id="btn-send-email-proof" class="btn btn-sm btn-outline" target="_blank">
                      ✉️ Send via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wizard Navigation -->
            <div style="display:flex; justify-content:space-between; margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
              <button type="button" class="btn btn-secondary" id="wizard-btn-prev" disabled>← Back</button>
              <div style="display:flex; gap:0.5rem;">
                <button type="button" class="btn btn-secondary" id="wizard-btn-save">Save Draft</button>
                <button type="button" class="btn btn-primary" id="wizard-btn-next">Next Step →</button>
              </div>
            </div>
          </form>
        </div>

        <!-- ── Live Preview Phone Mockup ── -->
        <div class="preview-panel">
          <div style="font-size:0.72rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:0.6rem; display:flex; align-items:center; gap:0.5rem;">
            <span style="width:8px;height:8px;border-radius:50%;background:#10B981;display:inline-block;"></span>
            Live Guest Preview
          </div>
          <div class="phone-mockup">
            <div class="phone-notch"></div>
            <iframe id="phone-preview-iframe" class="phone-screen"
              src="${inviteUrl}"
              style="border:none; width:100%; height:100%;"
              sandbox="allow-scripts allow-same-origin">
            </iframe>
          </div>
          <div style="margin-top:0.75rem; display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-secondary" id="btn-refresh-preview">🔄 Refresh</button>
            <button type="button" class="btn btn-sm btn-outline" id="btn-preview-fullscreen">↗ Open Full</button>
            <button type="button" class="btn btn-sm btn-outline" id="btn-open-dash-direct">📊 Dashboard</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Gallery Modal -->
    <div class="modal-backdrop" id="template-gallery-modal" style="display: none; z-index: 9999;">
      <div class="modal-content theme-card" style="max-width: 900px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" id="gallery-modal-close" type="button">✕</button>
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-primary);">Template Gallery</h2>
          <p style="color: var(--text-secondary);">Select a stunning design for your celebration.</p>
          
          <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;" id="gallery-category-filters">
            <button type="button" class="category-filter-btn active" data-cat="all">✨ All Templates (12)</button>
            <button type="button" class="category-filter-btn" data-cat="general-premium">👑 General Premium</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-hindu">🪔 Hindu Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-muslim">🕌 Muslim Nikkah</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-christian">🌸 Christian Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-sikh">🗡️ Sikh Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="birthday-party">🎊 Birthday & Party</button>
            <button type="button" class="category-filter-btn" data-cat="corporate">🏢 Corporate</button>
          </div>
        </div>
        
        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;" id="gallery-grid-container">
          ${Object.entries(THEMES).map(([key, t]) => `
            <div class="gallery-card" data-cat="${t.category || 'general-premium'}" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; background: ${t.bgPreview}; transition: transform 0.3s ease;">
              <div style="height: 160px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; background: linear-gradient(145deg, ${t.bgPreview} 0%, ${t.swatches[0] || t.bgPreview} 100%); overflow: hidden;">
                
                ${t.layoutType === 'modern' ? `
                  <div style="display:flex; width:100%; height:100%; padding:1.5rem; align-items:center; justify-content:space-between; box-sizing:border-box;">
                    <div style="width:45%; height:90px; background:rgba(255,255,255,0.05); border-radius:12px; border:1px solid ${t.primaryColor}; box-shadow:0 10px 20px rgba(0,0,0,0.5);"></div>
                    <div style="width:45%; display:flex; flex-direction:column; gap:8px;">
                      <div style="width:100%; height:8px; background:${t.primaryColor}; border-radius:4px;"></div>
                      <div style="width:70%; height:6px; background:rgba(255,255,255,0.4); border-radius:3px;"></div>
                      <div style="width:40%; height:6px; background:rgba(255,255,255,0.2); border-radius:3px;"></div>
                    </div>
                  </div>
                ` : t.layoutType === 'editorial' ? `
                  <div style="width:100%; height:100%; position:relative; background:rgba(255,255,255,0.02);">
                    <div style="position:absolute; top:20px; left:20px; font-size:2.5rem; font-weight:900; font-family:serif; letter-spacing:-2px; color:${t.primaryColor}; line-height:0.9;">A<br>& B</div>
                    <div style="position:absolute; bottom:20px; left:20px; width:60px; height:4px; background:${t.primaryColor};"></div>
                    <div style="position:absolute; bottom:20px; right:20px; width:40px; height:40px; background:rgba(255,255,255,0.05); border-left:2px solid ${t.primaryColor};"></div>
                  </div>
                ` : `
                  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
                    <div style="width:60px; height:60px; border-radius:50%; border:2px solid ${t.primaryColor}; background:rgba(255,255,255,0.08); margin-bottom:15px; box-shadow:0 5px 15px rgba(0,0,0,0.5);"></div>
                    <div style="width:100px; height:6px; background:${t.primaryColor}; border-radius:3px; margin-bottom:8px;"></div>
                    <div style="width:60px; height:4px; background:rgba(255,255,255,0.4); border-radius:2px;"></div>
                  </div>
                `}
                
                <div style="position:absolute; top:10px; right:10px; display: flex; gap: 0.25rem; background:rgba(0,0,0,0.5); padding:4px; border-radius:12px; backdrop-filter:blur(4px);">
                  ${t.swatches.map(s => `<span style="width:10px;height:10px;border-radius:50%;background:${s};display:inline-block;"></span>`).join('')}
                </div>
              </div>
              <div style="padding: 1rem; background: rgba(0,0,0,0.4);">
                <div style="font-weight: 700; font-size: 1rem;">${t.name}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem;">${t.description}</div>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn-sm btn-outline btn-preview-template" style="flex:1;" data-theme="${key}">👁️ Preview</button>
                  <button type="button" class="btn btn-sm btn-primary btn-use-template" style="flex:1;" data-theme="${key}">✨ Use Template</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // ── Internal state ──────────────────────────────────────────────────────
  let currentStep    = 1;
  let selectedTheme  = activeEvent.theme || 'theme-royal';
  let currentSectionOrder = [...(activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes'])];

  setupAdminListeners();

  // ── Listener Setup ──────────────────────────────────────────────────────
  function setupAdminListeners() {
    // Event library — select to edit
    container.querySelectorAll('.btn-select-event').forEach(btn => {
      btn.addEventListener('click', e => {
        db.setActiveEventId(e.currentTarget.dataset.id);
        renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
      });
    });

    // Event library — open dashboard
    container.querySelectorAll('.btn-open-dash').forEach(btn => {
      btn.addEventListener('click', e => {
        db.setActiveEventId(e.currentTarget.dataset.id);
        onNavigateToDashboard();
      });
    });

    // Event library — 📋 Copy URL
    container.querySelectorAll('.btn-copy-url').forEach(btn => {
      btn.addEventListener('click', e => {
        const url = e.currentTarget.dataset.url;
        navigator.clipboard.writeText(url).then(() => {
          const original = e.currentTarget.textContent;
          e.currentTarget.textContent = '✓ Copied!';
          e.currentTarget.style.color = '#10B981';
          setTimeout(() => { e.currentTarget.textContent = original; e.currentTarget.style.color = ''; }, 2000);
        });
      });
    });

    // Template Gallery Modal Logic
    const galleryModal = container.querySelector('#template-gallery-modal');
    
    // Create New Event -> Show Gallery
    const createBtn = container.querySelector('#btn-create-new-event');
    if (createBtn && galleryModal) {
      createBtn.addEventListener('click', () => {
        galleryModal.style.display = 'flex';
      });
    }

    const closeGallery = container.querySelector('#gallery-modal-close');
    if (closeGallery && galleryModal) {
      closeGallery.addEventListener('click', () => {
        galleryModal.style.display = 'none';
      });
    }

    // Reorder Sections Up / Down buttons
    function bindReorderButtons() {
      const containerList = container.querySelector('#section-order-list');
      if (!containerList) return;
      
      const labels = {
        story: '📖 Our Story (Milestones)',
        schedule: '📅 Schedule & Venues',
        dresscode: '👗 Dress Code & Attire',
        wishes: '💬 Guest Wishes Wall'
      };

      containerList.querySelectorAll('.btn-move-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          if (idx > 0) {
            const temp = currentSectionOrder[idx];
            currentSectionOrder[idx] = currentSectionOrder[idx - 1];
            currentSectionOrder[idx - 1] = temp;
            renderReorderList();
            saveFormData();
            refreshPreview();
          }
        });
      });

      containerList.querySelectorAll('.btn-move-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          if (idx < currentSectionOrder.length - 1) {
            const temp = currentSectionOrder[idx];
            currentSectionOrder[idx] = currentSectionOrder[idx + 1];
            currentSectionOrder[idx + 1] = temp;
            renderReorderList();
            saveFormData();
            refreshPreview();
          }
        });
      });
    }

    function renderReorderList() {
      const containerList = container.querySelector('#section-order-list');
      if (!containerList) return;
      const labels = {
        story: '📖 Our Story (Milestones)',
        schedule: '📅 Schedule & Venues',
        dresscode: '👗 Dress Code & Attire',
        wishes: '💬 Guest Wishes Wall'
      };
      containerList.innerHTML = currentSectionOrder.map((key, idx) => `
        <div class="order-item-card" data-key="${key}" style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); padding:0.6rem 1rem; border-radius:10px;">
          <span style="font-size:0.9rem; font-weight:600;">${idx + 1}. ${labels[key] || key}</span>
          <div style="display:flex; gap:0.3rem;">
            <button type="button" class="btn btn-sm btn-outline btn-move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>⬆️ Up</button>
            <button type="button" class="btn btn-sm btn-outline btn-move-down" data-idx="${idx}" ${idx === currentSectionOrder.length - 1 ? 'disabled' : ''}>⬇️ Down</button>
          </div>
        </div>
      `).join('');
      bindReorderButtons();
    }

    bindReorderButtons();

    // Preview Template Button Logic
    container.querySelectorAll('.btn-preview-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Stop event from bubbling to the card selection
        e.stopPropagation();
        e.preventDefault();
        const themeId = e.currentTarget.dataset.theme;
        openLiveTemplatePreview(themeId);
      });
    });

    // Couple photo file upload listener
    const photoFileInput = container.querySelector('#field-couplePhotoFile');
    const photoUrlInput  = container.querySelector('#field-couplePhotoUrl');
    const photoPreview   = container.querySelector('#couple-photo-preview');

    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const MAX_WIDTH = 800;

              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              const compressedB64 = canvas.toDataURL('image/jpeg', 0.7);
              
              if (photoUrlInput) {
                photoUrlInput.value = compressedB64;
                // Dispatch input event to trigger the debounced autosave
                photoUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
              if (photoPreview) {
                photoPreview.style.backgroundImage = `url(${compressedB64})`;
                photoPreview.innerHTML = '';
              }
            };
            img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (photoUrlInput) {
      photoUrlInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (photoPreview) {
          photoPreview.style.backgroundImage = val ? `url(${val})` : 'none';
          photoPreview.innerHTML = val ? '' : '<span style="font-size:2rem; opacity:0.5;">📷</span>';
        }
      });
    }

    // Delivery All WhatsApp Link setup
    const deliverWaBtn = container.querySelector('#btn-deliver-all-wa');
    if (deliverWaBtn) {
      const pinCode = activeEvent.trackerPin || '4281';
      const custName = activeEvent.customerName || activeEvent.hostNames;
      const msgText = encodeURIComponent(`✨ Hello ${custName}!

Your luxury digital invitation is ready! Below are your two personal links:

1️⃣ **Guest Invitation Link** (Share with guests to RSVP):
${inviteUrl}

2️⃣ **Private RSVP Tracker** (For you to track guest RSVPs):
${trackerUrl}
🔒 Security PIN: ${pinCode}

Thank you for choosing Celebrati!`);
      const phoneNum = (activeEvent.customerPhone || '').replace(/[^0-9]/g, '');
      deliverWaBtn.href = phoneNum ? `https://api.whatsapp.com/send?phone=${phoneNum}&text=${msgText}` : `https://api.whatsapp.com/send?text=${msgText}`;
    }

    // Category Filtering
    const filterBtns = container.querySelectorAll('#gallery-category-filters button');
    const galleryCards = container.querySelectorAll('.gallery-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.replace('btn-secondary', 'btn-outline'));
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.replace('btn-outline', 'btn-secondary');
        btn.classList.add('active-filter');
        
        const cat = btn.dataset.cat;
        galleryCards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Use Template (creates event)
    container.querySelectorAll('.btn-use-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = e.currentTarget.dataset.theme;
        galleryModal.style.display = 'none';
        
        const newId = 'evt-' + Date.now();
        const newEvt = {
          id: newId,
          slug: 'event-' + newId,
          title: 'New Luxury Celebration',
          eventType: 'wedding',
          hostNames: 'Host & Partner Names',
          tagline: 'Join Us for a Magical Evening',
          theme: themeId,
          startDate: '2026-12-01T18:00',
          rsvpDeadline: '2026-11-20',
          audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3',
          musicTitle: 'Romantic Piano Theme',
          paymentStatus: 'unpaid',
          paid: false,
          customColor: null,
          customFont: null,
          visibleSections: { story: true, schedule: true, dressCode: true, wishes: true },
          dressCode: { title: 'Formal Elegance', description: 'Black Tie & Elegant Attire', colors: [{ hex: '#3D0F1A', label: 'Burgundy' }, { hex: '#E5A965', label: 'Gold' }] },
          venues: [{ name: 'Grand Ballroom', date: 'Saturday, Dec 1, 2026', address: '100 Luxury Blvd' }],
          rsvps: [],
          wishes: [],
          storyMilestones: [],
          status: 'draft'
        };
        db.saveEvent(newEvt);
        db.setActiveEventId(newId);
        renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
        
        // Scroll to wizard
        setTimeout(() => {
          const ws = document.getElementById('wizard-section');
          if (ws) ws.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    });

    // ── Wizard Step Navigation ──────────────────────────────────────────
    const stepItems    = container.querySelectorAll('.wizard-step-item');
    const stepContents = container.querySelectorAll('.wizard-step-content');
    const prevBtn      = container.querySelector('#wizard-btn-prev');
    const nextBtn      = container.querySelector('#wizard-btn-next');

    function updateStepUI() {
      stepItems.forEach(item => {
        const s = parseInt(item.dataset.step);
        item.classList.toggle('active', s === currentStep);
        item.classList.toggle('completed', s < currentStep);
      });
      stepContents.forEach((content, idx) => {
        content.classList.toggle('hidden', idx + 1 !== currentStep);
      });
      prevBtn.disabled = (currentStep === 1);
      nextBtn.textContent = currentStep === 6 ? '🚀 Publish Event' : 'Next Step →';
    }

    stepItems.forEach(item => {
      item.addEventListener('click', () => {
        currentStep = parseInt(item.dataset.step);
        updateStepUI();
      });
    });

    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) { currentStep--; updateStepUI(); }
    });

    nextBtn.addEventListener('click', () => {
      if (currentStep < 6) {
        saveFormData();
        currentStep++;
        updateStepUI();
        // refresh phone preview on each step save
        refreshPreview();
      } else {
        saveFormData('published');
        showPublishSuccess();
      }
    });

    container.querySelector('#wizard-btn-save').addEventListener('click', () => {
      saveFormData('draft');
      showToast('✓ Draft saved');
      refreshPreview();
    });

    // ── Theme Picker ──────────────────────────────────────────────────────
    container.querySelectorAll('.theme-pick-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.theme-pick-card').forEach(c => {
          c.classList.remove('selected');
          const chk = c.querySelector('.theme-pick-check');
          if (chk) chk.style.display = 'none';
        });
        card.classList.add('selected');
        selectedTheme = card.dataset.theme;
        const chk = card.querySelector('.theme-pick-check');
        if (chk) chk.style.display = 'flex';
      });
    });

    // ── Publish Now button ─────────────────────────────────────────────────
    const publishNowBtn = container.querySelector('#btn-publish-now');
    if (publishNowBtn) {
      publishNowBtn.addEventListener('click', () => {
        saveFormData('published');
        showPublishSuccess();
      });
    }
    const unpublishBtn = container.querySelector('#btn-unpublish');
    if (unpublishBtn) {
      unpublishBtn.addEventListener('click', () => {
        saveFormData('draft');
        renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
      });
    }

    // ── Guest Personalised URL ─────────────────────────────────────────────
    const genPersonalBtn = container.querySelector('#btn-gen-personal-url');
    if (genPersonalBtn) {
      genPersonalBtn.addEventListener('click', () => {
        const guestName = container.querySelector('#field-guest-name').value.trim();
        if (!guestName) { showToast('Enter a guest name first', 'warn'); return; }
        const personalUrl = `${inviteUrl}?guest=${encodeURIComponent(guestName)}`;
        const outputDiv   = container.querySelector('#personalised-url-output');
        const urlField    = container.querySelector('#personal-url-field');
        const waBtn       = container.querySelector('#btn-wa-personal-url');
        urlField.value    = personalUrl;
        outputDiv.style.display = 'block';
        const waText = encodeURIComponent(`✨ You are cordially invited, ${guestName}!\nView your personal invitation: ${personalUrl}`);
        waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
      });
    }

    const copyPersonalBtn = container.querySelector('#btn-copy-personal-url');
    if (copyPersonalBtn) {
      copyPersonalBtn.addEventListener('click', () => {
        const v = container.querySelector('#personal-url-field')?.value;
        if (v) {
          navigator.clipboard.writeText(v);
          showToast('✓ Personal link copied!');
        }
      });
    }

    // ── Payment Mark Buttons ──────────────────────────────────────────────
    const markPaidBtn = container.querySelector('#btn-mark-paid');
    if (markPaidBtn) {
      markPaidBtn.addEventListener('click', () => {
        db.markPaid(activeEvent.id);
        showToast(`✓ Payment of ${OFFLINE_PAYMENT_CONFIG.pricePerEvent} marked as received!`);
        renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
      });
    }
    const markPendingBtn = container.querySelector('#btn-mark-pending');
    if (markPendingBtn) {
      markPendingBtn.addEventListener('click', () => {
        db.markPaymentPending(activeEvent.id);
        renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
      });
    }

    // ── WhatsApp / Email proof send ───────────────────────────────────────
    const waProofBtn = container.querySelector('#btn-send-whatsapp-proof');
    if (waProofBtn) {
      const msg = encodeURIComponent(`Hi, please make the payment for your event "${activeEvent.title}".\n\nPayment details:\n• UPI: ${OFFLINE_PAYMENT_CONFIG.upiId}\n• Bank: ${OFFLINE_PAYMENT_CONFIG.bankDetails.bankName}\n• Account: ${OFFLINE_PAYMENT_CONFIG.bankDetails.accountNumber}\n• IFSC: ${OFFLINE_PAYMENT_CONFIG.bankDetails.ifscCode}\n\nAmount: ${OFFLINE_PAYMENT_CONFIG.pricePerEvent}\n\nAfter payment, reply with your screenshot.`);
      waProofBtn.href = `https://api.whatsapp.com/send?phone=${OFFLINE_PAYMENT_CONFIG.whatsappNumber.replace(/[^0-9]/g,'')}&text=${msg}`;
    }
    const mailProofBtn = container.querySelector('#btn-send-email-proof');
    if (mailProofBtn) {
      const subject = encodeURIComponent(`Payment Required — ${activeEvent.title}`);
      const body    = encodeURIComponent(`Hi,\n\nPlease complete the payment for your event invitation.\n\nEvent: ${activeEvent.title}\nAmount: ${OFFLINE_PAYMENT_CONFIG.pricePerEvent}\nUPI: ${OFFLINE_PAYMENT_CONFIG.upiId}\nBank: ${OFFLINE_PAYMENT_CONFIG.bankDetails.bankName}\nAccount: ${OFFLINE_PAYMENT_CONFIG.bankDetails.accountNumber}\nIFSC: ${OFFLINE_PAYMENT_CONFIG.bankDetails.ifscCode}\n\nKindly reply with your payment screenshot.`);
      mailProofBtn.href = `mailto:?subject=${subject}&body=${body}`;
    }

    // ── Invite share links ────────────────────────────────────────────────
    const shareInviteWa = container.querySelector('#btn-share-invite-wa');
    if (shareInviteWa) {
      const text = encodeURIComponent(`✨ You are cordially invited to ${activeEvent.title}!\nView invitation & RSVP here:\n${inviteUrl}`);
      shareInviteWa.href = `https://api.whatsapp.com/send?text=${text}`;
    }
    const shareInviteMail = container.querySelector('#btn-share-invite-mail');
    if (shareInviteMail) {
      const subject = encodeURIComponent(`Invitation: ${activeEvent.title}`);
      const body    = encodeURIComponent(`Dear Guest,\n\nYou are warmly invited to ${activeEvent.title}.\n\nPlease view your invitation and RSVP here:\n${inviteUrl}\n\nWarm regards,\n${activeEvent.hostNames}`);
      shareInviteMail.href = `mailto:?subject=${subject}&body=${body}`;
    }

    // ── Tracker link ──────────────────────────────────────────────────────
    const shareTrackerWa = container.querySelector('#btn-share-tracker-wa');
    if (shareTrackerWa) {
      const pinMsg = activeEvent.trackerPin ? ` (PIN: ${activeEvent.trackerPin})` : '';
      const text   = encodeURIComponent(`📊 Your private guest tracker for ${activeEvent.title}${pinMsg}:\n${trackerUrl}`);
      shareTrackerWa.href = `https://api.whatsapp.com/send?text=${text}`;
    }

    // ── Copy buttons ──────────────────────────────────────────────────────
    setupCopyBtn('#btn-copy-invite-link', '#share-link-invite');
    setupCopyBtn('#btn-copy-tracker-link', '#share-link-tracker');

    function setupCopyBtn(btnSel, inputSel) {
      const btn = container.querySelector(btnSel);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const inp = container.querySelector(inputSel);
        if (!inp) return;
        navigator.clipboard.writeText(inp.value);
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.background = '#10B981';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
      });
    }

    // ── PIN save ─────────────────────────────────────────────────────────
    const savePinBtn = container.querySelector('#btn-save-pin');
    if (savePinBtn) {
      savePinBtn.addEventListener('click', () => {
        const pinVal = container.querySelector('#field-tracker-pin').value;
        db.setTrackerPin(activeEvent.id, pinVal);
        showToast(`✓ Tracker PIN saved: ${pinVal || 'none'}`);
      });
    }

    // ── Debounced Form Autosave ──────────────────────────────────────────
    let autosaveTimer = null;
    const adminForm = container.querySelector('#admin-event-form');
    if (adminForm) {
      adminForm.addEventListener('input', () => {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
          saveFormData();
          showToast('✓ Changes autosaved', 'success', 1200);
        }, 1200);
      });
      adminForm.addEventListener('change', () => {
        saveFormData();
        refreshPreview();
      });
    }

    // ── Preview controls ──────────────────────────────────────────────────
    const refreshPreviewBtn = container.querySelector('#btn-refresh-preview');
    if (refreshPreviewBtn) refreshPreviewBtn.addEventListener('click', refreshPreview);

    const previewFsBtn = container.querySelector('#btn-preview-fullscreen');
    if (previewFsBtn) previewFsBtn.addEventListener('click', () => onNavigateToInvite());

    const dashDirectBtn = container.querySelector('#btn-open-dash-direct');
    if (dashDirectBtn) dashDirectBtn.addEventListener('click', () => onNavigateToDashboard());
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  function refreshPreview() {
    const iframe = container.querySelector('#phone-preview-iframe');
    if (iframe) { iframe.src = ''; setTimeout(() => { iframe.src = inviteUrl; }, 80); }
  }

  function saveFormData(statusOverride) {
    const updated = {
      ...activeEvent,
      customerName:  container.querySelector('#field-customerName')?.value  || (activeEvent.customerName || ''),
      customerPhone: container.querySelector('#field-customerPhone')?.value || (activeEvent.customerPhone || ''),
      couplePhoto:  container.querySelector('#field-couplePhotoUrl')?.value  || (activeEvent.couplePhoto || ''),
      title:        container.querySelector('#field-title')?.value        || activeEvent.title,
      eventType:    container.querySelector('#field-eventType')?.value    || activeEvent.eventType,
      hostNames:    container.querySelector('#field-hostNames')?.value    || activeEvent.hostNames,
      tagline:      container.querySelector('#field-tagline')?.value      || activeEvent.tagline,
      startDate:    container.querySelector('#field-startDate')?.value    || activeEvent.startDate,
      rsvpDeadline: container.querySelector('#field-rsvpDeadline')?.value || activeEvent.rsvpDeadline,
      theme:        selectedTheme,
      customColor:  container.querySelector('#field-customColor')?.value  || null,
      customFont:   container.querySelector('#field-customFont')?.value   || null,
      audioUrl:     container.querySelector('#field-audioUrl')?.value     ?? activeEvent.audioUrl,
      musicTitle:   container.querySelector('#field-musicTitle')?.value   ?? activeEvent.musicTitle,
      hashtag:      container.querySelector('#field-hashtag')?.value      ?? activeEvent.hashtag,
      sectionOrder: currentSectionOrder || (activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes']),
      visibleSections: {
        story:      container.querySelector('#field-sec-story')?.checked ?? true,
        schedule:   container.querySelector('#field-sec-schedule')?.checked ?? true,
        dressCode:  container.querySelector('#field-sec-dressCode')?.checked ?? true,
        wishes:     container.querySelector('#field-sec-wishes')?.checked ?? true
      },
      dressCode: {
        title:       container.querySelector('#field-dressCodeTitle')?.value || (activeEvent.dressCode?.title || ''),
        description: container.querySelector('#field-dressCodeDesc')?.value  || (activeEvent.dressCode?.description || ''),
        colors:      activeEvent.dressCode?.colors || []
      },
      venues: [{
        name:    container.querySelector('#field-venueName')?.value    || (activeEvent.venues?.[0]?.name    || ''),
        date:    container.querySelector('#field-venueDate')?.value    || (activeEvent.venues?.[0]?.date    || ''),
        address: container.querySelector('#field-venueAddress')?.value || (activeEvent.venues?.[0]?.address || '')
      }],
      status: statusOverride !== undefined ? statusOverride : activeEvent.status
    };
    db.saveEvent(updated);
  }

  function showPublishSuccess() {
    saveFormData('published');
    // Show toast then re-render so banner shows green LIVE state
    showToast('🎉 Invitation is now LIVE! Share the link with your customers.', 'success', 4000);
    setTimeout(() => renderAdminView(container, onNavigateToDashboard, onNavigateToInvite), 300);
  }

  
  function openLiveTemplatePreview(themeId) {
    let modal = document.getElementById('celebrati-preview-overlay');
    if (modal) modal.remove();

    const theme = THEMES[themeId] || THEMES['theme-royal'];

    // Set initial preview state in sessionStorage (non-destructive)
    const initialPreviewState = {
      theme: themeId,
      customColor: activeEvent.customColor || theme.primaryColor,
      customFont: activeEvent.customFont || '',
      visibleSections: activeEvent.visibleSections ? { ...activeEvent.visibleSections } : { story: true, schedule: true, dressCode: true, wishes: true }
    };
    sessionStorage.setItem('celebrati_preview_temp', JSON.stringify(initialPreviewState));

    modal = document.createElement('div');
    modal.id = 'celebrati-preview-overlay';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0, 10, 25, 0.92); backdrop-filter: blur(16px);
      z-index: 999999; display: flex; items-center: center; justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div style="width:100%; max-width:960px; background:linear-gradient(145deg, #0F172A 0%, #1E293B 100%); border:1px solid rgba(255,255,255,0.12); border-radius:24px; padding:1.75rem; box-shadow:0 30px 80px rgba(0,0,0,0.8); display:grid; grid-template-columns:320px 1fr; gap:1.5rem; max-height:90vh; overflow:hidden;">
        <!-- Controls Left Panel -->
        <div style="display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid rgba(255,255,255,0.08); padding-right:1.25rem; overflow-y:auto;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <h3 style="font-size:1.1rem; font-weight:800; color:#FFF; font-family:var(--font-display);">🎨 Live Template Customizer</h3>
            </div>
            
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:0.85rem; border-radius:12px; margin-bottom:1.25rem;">
              <div style="font-size:0.75rem; color:#A78BFA; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Active Template</div>
              <div style="font-size:1rem; font-weight:700; color:#FFF; margin-top:0.2rem;">${theme.name}</div>
            </div>

            <!-- Color Swatch Picker -->
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="form-label" style="font-size:0.75rem;">🎨 Accent Color</label>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <input type="color" id="modal-customColor" class="form-input" value="${activeEvent.customColor || theme.primaryColor}" style="height:40px; width:55px; padding:0.2rem; cursor:pointer;">
                <span style="font-size:0.8rem; color:#94A3B8;">Custom Hex</span>
              </div>
            </div>

            <!-- Typography Picker -->
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="form-label" style="font-size:0.75rem;">✍️ Typography</label>
              <select id="modal-customFont" class="form-select" style="font-size:0.85rem;">
                <option value="">Default Theme Font</option>
                <option value="'Italiana', serif" ${activeEvent.customFont === "'Italiana', serif" ? 'selected' : ''}>Italiana (with Montserrat)</option>
                <option value="'Playfair Display', serif" ${activeEvent.customFont === "'Playfair Display', serif" ? 'selected' : ''}>Playfair Display</option>
                <option value="'Cinzel', serif" ${activeEvent.customFont === "'Cinzel', serif" ? 'selected' : ''}>Cinzel</option>
                <option value="'Great Vibes', cursive" ${activeEvent.customFont === "'Great Vibes', cursive" ? 'selected' : ''}>Great Vibes</option>
                <option value="'Lora', serif" ${activeEvent.customFont === "'Lora', serif" ? 'selected' : ''}>Lora</option>
                <option value="'Cormorant Garamond', serif" ${activeEvent.customFont === "'Cormorant Garamond', serif" ? 'selected' : ''}>Cormorant Garamond</option>
              </select>
            </div>

            <!-- Arrangement / Sections -->
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="form-label" style="font-size:0.75rem;">🔄 Section Visibility</label>
              <div style="font-size:0.8rem; color:#94A3B8; margin-bottom:0.5rem;">Toggle sections on/off:</div>
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#FFF; cursor:pointer;">
                  <input type="checkbox" class="modal-sec-toggle" data-sec="story" ${(activeEvent.visibleSections?.story ?? true) ? 'checked' : ''}> Our Story
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#FFF; cursor:pointer;">
                  <input type="checkbox" class="modal-sec-toggle" data-sec="schedule" ${(activeEvent.visibleSections?.schedule ?? true) ? 'checked' : ''}> Schedule & Venues
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#FFF; cursor:pointer;">
                  <input type="checkbox" class="modal-sec-toggle" data-sec="dressCode" ${(activeEvent.visibleSections?.dressCode ?? true) ? 'checked' : ''}> Dress Code
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#FFF; cursor:pointer;">
                  <input type="checkbox" class="modal-sec-toggle" data-sec="wishes" ${(activeEvent.visibleSections?.wishes ?? true) ? 'checked' : ''}> Wishes Wall
                </label>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:1rem;">
            <button type="button" id="modal-apply-customization" class="btn btn-primary" style="width:100%; justify-content:center;">
              ✨ Use This Customization
            </button>
            <button type="button" id="close-preview-overlay" class="btn btn-outline" style="width:100%; justify-content:center;">
              Close Preview
            </button>
          </div>
        </div>

        <!-- Phone Mockup Live View Right Panel -->
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
          <button id="close-preview-overlay-x" style="position:absolute; top:0; right:0; background:rgba(255,255,255,0.08); border:none; color:#FFF; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700;">✕</button>
          <div style="width:330px; height:600px; background:#000; border-radius:36px; padding:10px; position:relative; box-shadow:0 25px 60px rgba(0,0,0,0.8);">
            <div style="width:110px; height:20px; background:#000; position:absolute; top:10px; left:50%; transform:translateX(-50%); border-bottom-left-radius:12px; border-bottom-right-radius:12px; z-index:100;"></div>
            <iframe id="preview-template-iframe-modal" src="${window.location.origin}/app.html#invite-${activeEvent.id}" style="width:100%; height:100%; border:none; border-radius:26px;"></iframe>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const colorInput = document.getElementById('modal-customColor');
    const fontInput = document.getElementById('modal-customFont');
    const secToggles = document.querySelectorAll('.modal-sec-toggle');
    const iframe = document.getElementById('preview-template-iframe-modal');

    function updateLivePreview() {
      const pState = {
        theme: themeId,
        customColor: colorInput ? colorInput.value : activeEvent.customColor,
        customFont: fontInput ? fontInput.value : activeEvent.customFont,
        visibleSections: { story: true, schedule: true, dressCode: true, wishes: true }
      };
      secToggles.forEach(toggle => {
        pState.visibleSections[toggle.dataset.sec] = toggle.checked;
      });

      sessionStorage.setItem('celebrati_preview_temp', JSON.stringify(pState));

      if (iframe) {
        iframe.src = '';
        setTimeout(() => { iframe.src = `${window.location.origin}/app.html#invite-${activeEvent.id}`; }, 50);
      }
    }

    if (colorInput) colorInput.addEventListener('change', updateLivePreview);
    if (fontInput) fontInput.addEventListener('change', updateLivePreview);
    secToggles.forEach(toggle => toggle.addEventListener('change', updateLivePreview));

    function dismissModal() {
      sessionStorage.removeItem('celebrati_preview_temp');
      modal.remove();
    }

    document.getElementById('modal-apply-customization').addEventListener('click', () => {
      sessionStorage.removeItem('celebrati_preview_temp');
      selectedTheme = themeId;
      activeEvent.theme = themeId;
      if (colorInput) activeEvent.customColor = colorInput.value;
      if (fontInput) activeEvent.customFont = fontInput.value;
      if (!activeEvent.visibleSections) activeEvent.visibleSections = { story: true, schedule: true, dressCode: true, wishes: true };
      secToggles.forEach(toggle => {
        activeEvent.visibleSections[toggle.dataset.sec] = toggle.checked;
      });
      db.saveEvent(activeEvent);
      dismissModal();
      renderAdminView(container, onNavigateToDashboard, onNavigateToInvite);
      showToast('✓ Customization applied & saved!');
    });

    document.getElementById('close-preview-overlay').addEventListener('click', dismissModal);
    document.getElementById('close-preview-overlay-x').addEventListener('click', dismissModal);
  }

  function showToast(msg, type = 'success', duration = 2500) {
    let toast = document.getElementById('celebrati-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'celebrati-toast';
      toast.style.cssText = `
        position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px);
        background:${type === 'warn' ? '#F59E0B' : type === 'error' ? '#EF4444' : '#10B981'};
        color:#fff; padding:0.7rem 1.5rem; border-radius:999px;
        font-weight:700; font-size:0.9rem; z-index:999999;
        opacity:0; transition:all 0.3s cubic-bezier(0.22,1,0.36,1);
        box-shadow:0 8px 30px rgba(0,0,0,0.4); white-space:nowrap;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = type === 'warn' ? '#F59E0B' : type === 'error' ? '#EF4444' : '#10B981';
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
  }
}
