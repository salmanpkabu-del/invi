import re

with open('js/components/admin.js', 'r') as f:
    content = f.read()

# Update Step Labels
old_step_indicators = """            <div class="wizard-step-item active" data-step="1">
              <div class="step-number">1</div>
              <span class="step-label">Basic Info</span>
            </div>
            <div class="wizard-step-item" data-step="2">
              <div class="step-number">2</div>
              <span class="step-label">Template</span>
            </div>
            <div class="wizard-step-item" data-step="3">
              <div class="step-number">3</div>
              <span class="step-label">Details</span>
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
              <span class="step-label">Publish & Share</span>
            </div>"""

new_step_indicators = """            <div class="wizard-step-item active" data-step="1">
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
            </div>"""

content = content.replace(old_step_indicators, new_step_indicators)

# Swap Step 1 and Step 2 HTML contents
# Step 1 becomes Template Selection
# Step 2 becomes Customer & Event Essentials
# Step 3 becomes Photos & Customization (with file upload for couple photo)

new_steps_html = """            <!-- ════ STEP 1: Select Template ════ -->
            <div class="wizard-step-content" id="step-1-content">
              <h3 style="margin-bottom:0.4rem; font-family:var(--font-display);">Select Invitation Template</h3>
              <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.5rem;">Choose a luxury template based on your customer's cultural, religious, or event theme requirement.</p>

              <div class="theme-picker-grid" id="theme-picker-grid">
                ${Object.entries(THEMES).map(([key, t]) => `
                  <div class="theme-pick-card ${activeEvent.theme === key ? 'selected' : ''}"
                       data-theme="${key}"
                       style="background: linear-gradient(145deg, ${t.bgPreview} 0%, ${t.swatches[0]} 100%);">
                    <div class="theme-pick-preview" style="background:${t.bgPreview};">
                      <div style="text-align:center; padding:1rem 0.5rem;">
                        <div style="font-size:0.55rem; letter-spacing:2px; text-transform:uppercase; color:${t.primaryColor}; opacity:0.8; margin-bottom:0.3rem;">${t.categoryLabel || 'Luxury'}</div>
                        <div style="font-size:0.92rem; font-weight:700; color:#fff; font-family:Georgia,serif; line-height:1.2;">${t.name.split(' ')[1] || 'Theme'}</div>
                        <div style="margin-top:0.4rem; display:flex; justify-content:center; gap:0.25rem;">
                          ${t.swatches.map(s => `<span style="width:10px;height:10px;border-radius:50%;background:${s};display:inline-block;"></span>`).join('')}
                        </div>
                      </div>
                    </div>
                    <div class="theme-pick-info">
                      <div style="font-weight:700; font-size:0.88rem;">${t.name}</div>
                      <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); margin-top:0.2rem; line-height:1.3;">${t.description}</div>
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
            </div>"""

# Replace old Step 1, 2, 3 content in file
step_regex = re.compile(r'<!-- ════ STEP 1: Basic Info ════ -->.*?<!-- ════ STEP 3: Story & Dress ════ -->', re.DOTALL)
content = step_regex.sub(new_steps_html + '\n\n            <!-- ════ STEP 3: Story & Dress ════ -->', content)

# Save photo data in saveFormData
old_save = """      title:        container.querySelector('#field-title')?.value        || activeEvent.title,"""
new_save = """      couplePhoto:  container.querySelector('#field-couplePhotoUrl')?.value  || (activeEvent.couplePhoto || ''),
      title:        container.querySelector('#field-title')?.value        || activeEvent.title,"""

content = content.replace(old_save, new_save)

# Add file upload listener for couple photo in setupAdminListeners
old_listener_start = """    // Delivery All WhatsApp Link setup"""

new_listener_start = """    // Couple photo file upload listener
    const photoFileInput = container.querySelector('#field-couplePhotoFile');
    const photoUrlInput  = container.querySelector('#field-couplePhotoUrl');
    const photoPreview   = container.querySelector('#couple-photo-preview');

    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const b64 = evt.target.result;
            if (photoUrlInput) photoUrlInput.value = b64;
            if (photoPreview) {
              photoPreview.style.backgroundImage = `url(${b64})`;
              photoPreview.innerHTML = '';
            }
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

    // Delivery All WhatsApp Link setup"""

content = content.replace(old_listener_start, new_listener_start)

with open('js/components/admin.js', 'w') as f:
    f.write(content)

print("admin.js updated with new workflow order and image upload!")
