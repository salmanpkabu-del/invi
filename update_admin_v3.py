import re

with open('js/components/admin.js', 'r') as f:
    content = f.read()

# Replace gallery modal HTML with improved 12+ template gallery and category filters
old_modal_html = """          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" id="gallery-category-filters">
            <button type="button" class="btn btn-sm btn-secondary active-filter" data-cat="all">All</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="general-premium">General Premium</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-hindu">Hindu Wedding</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-muslim">Muslim Wedding</button>
            <button type="button" class="btn btn-sm btn-outline" data-cat="wedding-christian">Christian Wedding</button>
          </div>"""

new_modal_html = """          <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;" id="gallery-category-filters">
            <button type="button" class="category-filter-btn active" data-cat="all">✨ All Templates (12)</button>
            <button type="button" class="category-filter-btn" data-cat="general-premium">👑 General Premium</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-hindu">🪔 Hindu Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-muslim">🕌 Muslim Nikkah</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-christian">🌸 Christian Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="wedding-sikh">🗡️ Sikh Wedding</button>
            <button type="button" class="category-filter-btn" data-cat="birthday-party">🎊 Birthday & Party</button>
            <button type="button" class="category-filter-btn" data-cat="corporate">🏢 Corporate</button>
          </div>"""

content = content.replace(old_modal_html, new_modal_html)

# Add Preview button to gallery cards
old_card_actions = """                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn-sm btn-primary btn-use-template" style="flex:1;" data-theme="${key}">Use Template</button>
                </div>"""

new_card_actions = """                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn-sm btn-outline btn-preview-template" style="flex:1;" data-theme="${key}">👁️ Preview</button>
                  <button type="button" class="btn btn-sm btn-primary btn-use-template" style="flex:1;" data-theme="${key}">✨ Use Template</button>
                </div>"""

content = content.replace(old_card_actions, new_card_actions)

# Update Step 1 to include Customer Contact details
old_step1 = """              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Host / Couple Names</label>
                  <input type="text" class="form-input" id="field-hostNames" value="${activeEvent.hostNames}" placeholder="e.g. Alaya Khan & Farhan Qureshi">
                </div>
                <div class="form-group">
                  <label class="form-label">Tagline / Subtitle</label>
                  <input type="text" class="form-input" id="field-tagline" value="${activeEvent.tagline}" placeholder="e.g. Two Souls, One Timeless Promise">
                </div>
              </div>"""

new_step1 = """              <div style="background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.2); border-radius:10px; padding:1rem; margin-bottom:1.25rem;">
                <div style="font-size:0.85rem; font-weight:700; color:var(--brand-primary); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.75rem;">👤 Customer Details (For Delivery)</div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Customer Contact Name</label>
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
                  <label class="form-label">Host / Couple Names (shown on invite)</label>
                  <input type="text" class="form-input" id="field-hostNames" value="${activeEvent.hostNames}" placeholder="e.g. Alaya Khan & Farhan Qureshi">
                </div>
                <div class="form-group">
                  <label class="form-label">Tagline / Subtitle</label>
                  <input type="text" class="form-input" id="field-tagline" value="${activeEvent.tagline}" placeholder="e.g. Two Souls, One Timeless Promise">
                </div>
              </div>"""

content = content.replace(old_step1, new_step1)

# Add customer delivery box to Step 6 Publish
old_step6_delivery = """              <!-- ── CUSTOMER INVITE URL (Primary Action) ── -->
              <div class="glass-panel" style="padding:1.25rem; margin-bottom:1.25rem; border:1px solid rgba(212,175,55,0.2);">
                <label class="form-label" style="display:block; margin-bottom:0.6rem; color:var(--color-primary); font-size:0.82rem; letter-spacing:1.5px;">
                  💌 CUSTOMER INVITATION LINK
                </label>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center; margin-bottom:0.75rem;">
                  <input type="text" class="form-input" id="share-link-invite"
                    value="${inviteUrl}" readonly
                    style="flex:1; min-width:220px; font-family:monospace; font-size:0.88rem; background:rgba(255,255,255,0.04);">
                  <button type="button" class="btn btn-secondary" id="btn-copy-invite-link">📋 Copy</button>
                  <a id="btn-share-invite-wa" class="btn" style="background:#25D366; color:#fff; border:none; white-space:nowrap;" target="_blank">💬 WhatsApp</a>
                  <a id="btn-share-invite-mail" class="btn btn-outline" target="_blank" style="white-space:nowrap;">✉️ Email</a>
                </div>

                <!-- Guest-Personalised URL Generator -->
                <div style="border-top:1px solid var(--border-color); padding-top:0.85rem; margin-top:0.75rem;">
                  <div style="font-size:0.82rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-secondary); margin-bottom:0.5rem;">
                    ✨ Generate Personalised Link (Optional)
                  </div>
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                    <input type="text" class="form-input" id="field-guest-name"
                      placeholder="Guest name, e.g. Zainab & Tariq"
                      style="flex:1; min-width:180px; font-size:0.9rem;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-gen-personal-url">Generate</button>
                  </div>
                  <div id="personalised-url-output" style="display:none; margin-top:0.6rem;">
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                      <input type="text" class="form-input" id="personal-url-field" readonly
                        style="flex:1; min-width:220px; font-family:monospace; font-size:0.82rem; background:rgba(255,255,255,0.04); color:#D4AF37;">
                      <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-personal-url">Copy</button>
                      <a id="btn-wa-personal-url" class="btn btn-sm" style="background:#25D366; color:#fff; border:none;" target="_blank">💬 Send</a>
                    </div>
                  </div>
                </div>
              </div>"""

new_step6_delivery = """              <!-- ── CUSTOMER DELIVERY PACKAGE (2 LINKS + PIN + WHATSAPP) ── -->
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
              </div>"""

content = content.replace(old_step6_delivery, new_step6_delivery)

# Save customer details in saveFormData
old_save_data = """      title:        container.querySelector('#field-title')?.value        || activeEvent.title,"""
new_save_data = """      customerName:  container.querySelector('#field-customerName')?.value  || (activeEvent.customerName || ''),
      customerPhone: container.querySelector('#field-customerPhone')?.value || (activeEvent.customerPhone || ''),
      title:        container.querySelector('#field-title')?.value        || activeEvent.title,"""

content = content.replace(old_save_data, new_save_data)

# Add Template Preview Modal Logic to setupAdminListeners
old_listeners = """    // Category Filtering
    const filterBtns = container.querySelectorAll('#gallery-category-filters button');"""

new_listeners = """    # Preview Template Button Logic
    container.querySelectorAll('.btn-preview-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = e.currentTarget.dataset.theme;
        openLiveTemplatePreview(themeId);
      });
    });

    // Delivery All WhatsApp Link setup
    const deliverWaBtn = container.querySelector('#btn-deliver-all-wa');
    if (deliverWaBtn) {
      const pinCode = activeEvent.trackerPin || '4281';
      const custName = activeEvent.customerName || activeEvent.hostNames;
      const msgText = encodeURIComponent(`✨ Hello ${custName}!\n\nYour luxury digital invitation is ready! Below are your two personal links:\n\n1️⃣ **Guest Invitation Link** (Share with guests to RSVP):\n${inviteUrl}\n\n2️⃣ **Private RSVP Tracker** (For you to track guest RSVPs):\n${trackerUrl}\n🔒 Security PIN: ${pinCode}\n\nThank you for choosing Celebrati!`);
      const phoneNum = (activeEvent.customerPhone || '').replace(/[^0-9]/g, '');
      deliverWaBtn.href = phoneNum ? `https://api.whatsapp.com/send?phone=${phoneNum}&text=${msgText}` : `https://api.whatsapp.com/send?text=${msgText}`;
    }

    // Category Filtering
    const filterBtns = container.querySelectorAll('#gallery-category-filters button');"""

content = content.replace(old_listeners, new_listeners)

# Add openLiveTemplatePreview helper function
preview_helper = """
  function openLiveTemplatePreview(themeId) {
    let modal = document.getElementById('celebrati-preview-overlay');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'celebrati-preview-overlay';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
      z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 1.5rem;
    `;

    const theme = THEMES[themeId] || THEMES['theme-royal'];
    modal.innerHTML = `
      <div style="width:100%; max-width:420px; background:#000; border-radius:36px; padding:12px; position:relative; box-shadow:0 25px 60px rgba(0,0,0,0.8);">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 1rem; color:#FFF; font-weight:700; font-size:0.9rem;">
          <span>Preview: ${theme.name}</span>
          <button id="close-preview-overlay" style="background:none; border:none; color:#FFF; font-size:1.2rem; cursor:pointer;">✕</button>
        </div>
        <div style="height:620px; border-radius:26px; overflow:hidden; position:relative;">
          <iframe id="preview-template-iframe" src="${window.location.origin}/app.html#invite-${activeEvent.id}" style="width:100%; height:100%; border:none;"></iframe>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('close-preview-overlay').addEventListener('click', () => modal.remove());
  }
"""

content = content.replace("function showToast(msg, type = 'success', duration = 2500) {", preview_helper + "\n  function showToast(msg, type = 'success', duration = 2500) {")

with open('js/components/admin.js', 'w') as f:
    f.write(content)

print("admin.js updated successfully")
