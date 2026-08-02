import re

with open('js/components/invite.js', 'r') as f:
    content = f.read()

# Define section templates map
old_sections_block = """      <!-- Story Timeline Section -->
      ${(activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones && activeEvent.storyMilestones.length > 0) ? `
        <section id="section-story" class="inv-section">
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
      ` : ''}

      <!-- Schedule & Venues Section -->
      ${(activeEvent.visibleSections?.schedule !== false) ? `
      <section id="section-schedule" class="inv-section">
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
      ` : ''}

      <!-- Dress Code Section -->
      ${(activeEvent.visibleSections?.dressCode !== false && activeEvent.dressCode) ? `
        <section id="section-dresscode" class="inv-section">
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
      ` : ''}

      <!-- Wishes & Guestbook Section -->
      ${(activeEvent.visibleSections?.wishes !== false) ? `
      <section id="section-wishes" class="inv-section">
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
      ` : ''}"""

new_sections_block = """      <!-- Dynamic Reorderable Sections -->
      ${(() => {
        const order = activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes'];
        const sectionMap = {
          story: (activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones && activeEvent.storyMilestones.length > 0) ? `
            <section id="section-story" class="inv-section">
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

          schedule: (activeEvent.visibleSections?.schedule !== false) ? `
            <section id="section-schedule" class="inv-section">
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
            <section id="section-dresscode" class="inv-section">
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
            <section id="section-wishes" class="inv-section">
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
      })()}"""

content = content.replace(old_sections_block, new_sections_block)

with open('js/components/invite.js', 'w') as f:
    f.write(content)

print("invite.js updated to support dynamic section reordering!")
