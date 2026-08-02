import re

with open('js/components/admin.js', 'r') as f:
    content = f.read()

# 1. Update Wizard Steps HTML
old_steps = """            <div class="wizard-step-item" data-step="4">
              <div class="step-number">4</div>
              <span class="step-label">Venues</span>
            </div>
            <div class="wizard-step-item" data-step="5">
              <div class="step-number">5</div>
              <span class="step-label">Publish & Share</span>
            </div>"""
new_steps = """            <div class="wizard-step-item" data-step="4">
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
content = content.replace(old_steps, new_steps)

# 2. Update Wizard Content HTML (Color/Font, Music, Sections)
old_music = """              <div class="form-group" style="margin-top:1.5rem;">
                <label class="form-label">🎵 Background Music URL (.mp3)</label>
                <input type="text" class="form-input" id="field-audioUrl" value="${activeEvent.audioUrl || ''}" placeholder="https://cdn.example.com/song.mp3">
                <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.3rem;">Leave blank for no music. Free tracks: pixabay.com/music</div>
              </div>
              <div class="form-group">
                <label class="form-label">Music Track Name (shown to guests)</label>
                <input type="text" class="form-input" id="field-musicTitle" value="${activeEvent.musicTitle || ''}" placeholder="e.g. Romantic Canon in D Piano">
              </div>
            </div>"""
            
new_music = """              <div class="form-row" style="margin-top:1.5rem;">
                <div class="form-group">
                  <label class="form-label">🎨 Custom Primary Color (Optional)</label>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="color" class="form-input" id="field-customColor" value="${activeEvent.customColor || THEMES[activeEvent.theme]?.primaryColor || '#E5A965'}" style="height: 40px; width: 60px; padding: 0.2rem; cursor: pointer;">
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

              <div class="form-group" style="margin-top:1.5rem;">
                <label class="form-label">🎵 Background Music URL (.mp3)</label>
                <input type="text" class="form-input" id="field-audioUrl" value="${activeEvent.audioUrl || ''}" placeholder="https://cdn.example.com/song.mp3">
                <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.3rem;">Leave blank for no music. Note: For file uploads, please host your MP3 file online and paste the link here.</div>
              </div>
              <div class="form-group">
                <label class="form-label">Music Track Name (shown to guests)</label>
                <input type="text" class="form-input" id="field-musicTitle" value="${activeEvent.musicTitle || ''}" placeholder="e.g. Romantic Canon in D Piano">
              </div>
            </div>"""
content = content.replace(old_music, new_music)

# Change Step 5 id to Step 6
content = content.replace('<div class="wizard-step-content hidden" id="step-5-content">', '<div class="wizard-step-content hidden" id="step-6-content">')

# Add Step 5 for Sections
sections_step = """            <!-- ════ STEP 5: Sections ════ -->
            <div class="wizard-step-content hidden" id="step-5-content">
              <h3 style="margin-bottom:1.25rem; font-family:var(--font-display);">Manage Sections</h3>
              <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">Toggle which sections will be visible on the invitation.</p>
              
              <div style="display:flex; flex-direction:column; gap:1rem;">
                <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
                  <input type="checkbox" id="field-sec-story" ${activeEvent.visibleSections?.story !== false ? 'checked' : ''} style="width:20px;height:20px;">
                  <span style="font-size:1.1rem;">📖 Our Story (Milestones)</span>
                </label>
                <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
                  <input type="checkbox" id="field-sec-schedule" ${activeEvent.visibleSections?.schedule !== false ? 'checked' : ''} style="width:20px;height:20px;">
                  <span style="font-size:1.1rem;">📅 Event Schedule & Venues</span>
                </label>
                <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
                  <input type="checkbox" id="field-sec-dressCode" ${activeEvent.visibleSections?.dressCode !== false ? 'checked' : ''} style="width:20px;height:20px;">
                  <span style="font-size:1.1rem;">👗 Dress Code</span>
                </label>
                <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;">
                  <input type="checkbox" id="field-sec-wishes" ${activeEvent.visibleSections?.wishes !== false ? 'checked' : ''} style="width:20px;height:20px;">
                  <span style="font-size:1.1rem;">💬 Wishes Wall</span>
                </label>
              </div>
            </div>

            <!-- ════ STEP 6: Publish & Share ════ -->"""
content = content.replace('<!-- ════ STEP 5: Publish & Share ════ -->', sections_step)

# 3. Add Modal HTML to end of layout
modal_html = """    </div>

    <!-- Template Gallery Modal -->
    <div class="modal-backdrop" id="template-gallery-modal" style="display: none; z-index: 9999;">
      <div class="modal-content theme-card" style="max-width: 900px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" id="gallery-modal-close" type="button">✕</button>
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-primary);">Template Gallery</h2>
          <p style="color: var(--text-secondary);">Select a stunning design for your celebration.</p>
          
          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" id="gallery-category-filters">
            <button type="button" class="btn btn-sm btn-secondary active-filter" data-cat="all">All</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="general-premium">General Premium</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-hindu">Hindu Wedding</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-muslim">Muslim Wedding</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-christian">Christian Wedding</button>
          </div>
        </div>
        
        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;" id="gallery-grid-container">
          ${Object.entries(THEMES).map(([key, t]) => `
            <div class="gallery-card" data-cat="${t.category || 'general-premium'}" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; background: ${t.bgPreview}; transition: transform 0.3s ease;">
              <div style="height: 160px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(145deg, ${t.bgPreview} 0%, ${t.swatches[0]} 100%);">
                <div style="font-family: Georgia, serif; font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Sample Event</div>
                <div style="display: flex; gap: 0.25rem;">
                  ${t.swatches.map(s => `<span style="width:12px;height:12px;border-radius:50%;background:${s};display:inline-block;"></span>`).join('')}
                </div>
              </div>
              <div style="padding: 1rem; background: rgba(0,0,0,0.4);">
                <div style="font-weight: 700; font-size: 1rem;">${t.name}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem;">${t.description}</div>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn-sm btn-primary btn-use-template" style="flex:1;" data-theme="${key}">Use Template</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;"""
content = content.replace("    </div>\n  `;", modal_html)


# 4. Modify Create New Event listener
old_create_listener = """    // Create New Event
    const createBtn = container.querySelector('#btn-create-new-event');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const newId = 'evt-' + Date.now();
        const newEvt = {
          id: newId,
          slug: 'event-' + newId,
          title: 'New Luxury Celebration',
          eventType: 'wedding',
          hostNames: 'Host & Partner Names',
          tagline: 'Join Us for a Magical Evening',
          theme: 'theme-royal',
          startDate: '2026-12-01T18:00',
          rsvpDeadline: '2026-11-20',
          audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3',
          musicTitle: 'Romantic Piano Theme',
          paymentStatus: 'unpaid',
          paid: false,
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
    }"""

new_create_listener = """    // Template Gallery Modal Logic
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
    });"""

content = content.replace(old_create_listener, new_create_listener)

# 5. Fix currentStep < 5 limit
content = content.replace("nextBtn.textContent = currentStep === 5 ? '🚀 Publish Event' : 'Next Step →';", "nextBtn.textContent = currentStep === 6 ? '🚀 Publish Event' : 'Next Step →';")
content = content.replace("if (currentStep < 5) {", "if (currentStep < 6) {")

# 6. Update saveFormData
old_save = """      theme:        selectedTheme,
      audioUrl:     container.querySelector('#field-audioUrl')?.value     ?? activeEvent.audioUrl,
      musicTitle:   container.querySelector('#field-musicTitle')?.value   ?? activeEvent.musicTitle,
      hashtag:      container.querySelector('#field-hashtag')?.value      ?? activeEvent.hashtag,
      dressCode: {"""
new_save = """      theme:        selectedTheme,
      customColor:  container.querySelector('#field-customColor')?.value  || null,
      customFont:   container.querySelector('#field-customFont')?.value   || null,
      audioUrl:     container.querySelector('#field-audioUrl')?.value     ?? activeEvent.audioUrl,
      musicTitle:   container.querySelector('#field-musicTitle')?.value   ?? activeEvent.musicTitle,
      hashtag:      container.querySelector('#field-hashtag')?.value      ?? activeEvent.hashtag,
      visibleSections: {
        story:      container.querySelector('#field-sec-story')?.checked ?? true,
        schedule:   container.querySelector('#field-sec-schedule')?.checked ?? true,
        dressCode:  container.querySelector('#field-sec-dressCode')?.checked ?? true,
        wishes:     container.querySelector('#field-sec-wishes')?.checked ?? true
      },
      dressCode: {"""
content = content.replace(old_save, new_save)

with open('js/components/admin.js', 'w') as f:
    f.write(content)

print("Admin.js updated successfully")
