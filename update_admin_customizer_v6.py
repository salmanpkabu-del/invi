import re

with open('js/components/admin.js', 'r') as f:
    content = f.read()

# Update Step 5 HTML to include Section Reordering Controls
old_step5_content = """            <!-- ════ STEP 5: Sections ════ -->
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
            </div>"""

new_step5_content = """            <!-- ════ STEP 5: Sections & Layout Arrangement ════ -->
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
            </div>"""

content = content.replace(old_step5_content, new_step5_content)

# Update saveFormData to preserve sectionOrder
old_save_formData = """      visibleSections: {
        story:      container.querySelector('#field-sec-story')?.checked ?? true,
        schedule:   container.querySelector('#field-sec-schedule')?.checked ?? true,
        dressCode:  container.querySelector('#field-sec-dressCode')?.checked ?? true,
        wishes:     container.querySelector('#field-sec-wishes')?.checked ?? true
      },"""

new_save_formData = """      sectionOrder: currentSectionOrder || (activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes']),
      visibleSections: {
        story:      container.querySelector('#field-sec-story')?.checked ?? true,
        schedule:   container.querySelector('#field-sec-schedule')?.checked ?? true,
        dressCode:  container.querySelector('#field-sec-dressCode')?.checked ?? true,
        wishes:     container.querySelector('#field-sec-wishes')?.checked ?? true
      },"""

content = content.replace(old_save_formData, new_save_formData)

# Add currentSectionOrder state and reordering logic to setupAdminListeners
old_listeners_init = """  // ── Internal state ──────────────────────────────────────────────────────
  let currentStep    = 1;
  let selectedTheme  = activeEvent.theme || 'theme-royal';"""

new_listeners_init = """  // ── Internal state ──────────────────────────────────────────────────────
  let currentStep    = 1;
  let selectedTheme  = activeEvent.theme || 'theme-royal';
  let currentSectionOrder = [...(activeEvent.sectionOrder || ['story', 'schedule', 'dresscode', 'wishes'])];"""

content = content.replace(old_listeners_init, new_listeners_init)

# Add Section Reorder Button Event Listeners in setupAdminListeners
old_listeners_end = """    // Preview Template Button Logic"""

new_listeners_end = """    // Reorder Sections Up / Down buttons
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

    // Preview Template Button Logic"""

content = content.replace(old_listeners_end, new_listeners_end)

with open('js/components/admin.js', 'w') as f:
    f.write(content)

print("admin.js updated with interactive section reordering!")
