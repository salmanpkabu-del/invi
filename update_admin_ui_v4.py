import re

with open('js/components/admin.js', 'r') as f:
    content = f.read()

# Replace Header with Hero Header
old_header = """      <!-- ── Top Header Bar ── -->
      <div class="view-header">
        <div class="view-header-title">
          <h1>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Admin Creator Studio
          </h1>
          <p>Create event invitations → choose a template → share the unique link → collect payment.</p>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <div class="badge ${isFirebaseEnabled ? 'badge-success' : 'badge-warning'}" style="padding:0.4rem 0.8rem; font-size:0.78rem;">
            ${isFirebaseEnabled ? '🔥 Firebase Sync' : '⚡ Local Mode'}
          </div>
          <button id="btn-create-new-event" class="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Event
          </button>
        </div>
      </div>"""

new_header = """      <!-- ── Top Hero Header Bar ── -->
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
      </div>"""

content = content.replace(old_header, new_header)

# Replace Managed Events container heading
old_managed_heading = """      <!-- ── Events Library ── -->
      <div class="glass-panel" style="padding:1.25rem; margin-bottom:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="font-size:1rem; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-secondary);">
            Managed Events (${events.length})
          </h3>
        </div>"""

new_managed_heading = """      <!-- ── Events Library ── -->
      <div class="managed-events-section">
        <div class="section-heading">
          <div class="section-heading-title">
            <span>📚 Managed Events (${events.length})</span>
          </div>
        </div>"""

content = content.replace(old_managed_heading, new_managed_heading)

# Update card structure
old_card_struct = """            <div class="event-card ${isActive ? 'active-event' : ''}" id="evtcard-${evt.id}">
              <div>
                <div class="event-card-top">
                  <div class="event-card-type-icon">
                    ${evt.eventType === 'wedding' ? '💍' : (evt.eventType === 'birthday' ? '🎂' : '🥂')}
                  </div>
                  <span class="badge ${pStatus === 'paid' ? 'badge-success' : (pStatus === 'pending_review' ? 'badge-warning' : 'badge-danger')}">
                    ${pStatus === 'paid' ? '✓ Paid' : (pStatus === 'pending_review' ? '⏳ Review' : 'Unpaid')}
                  </span>
                </div>
                <div class="event-card-title">${evt.title}</div>
                <div class="event-card-hosts" style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.2rem;">${evt.hostNames}</div>
                <div class="event-card-meta">
                  <span>📅 ${new Date(evt.startDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
                  <span>👥 ${evt.rsvps ? evt.rsvps.length : 0} Guests</span>
                  <span class="badge" style="font-size:0.65rem; padding:0.15rem 0.4rem; background:rgba(255,255,255,0.05);">${THEMES[evt.theme]?.name?.replace(/^[^\s]+\s/,'') || 'Royal'}</span>
                </div>
              </div>
              <div class="event-card-actions">
                <button class="btn btn-secondary btn-sm btn-select-event" data-id="${evt.id}">
                  ${isActive ? '✓ Editing' : 'Edit'}
                </button>
                <button class="btn btn-outline btn-sm btn-copy-url" data-url="${evtInviteUrl}" title="Copy customer invite URL">
                  📋 Copy URL
                </button>
                <button class="btn btn-outline btn-sm btn-open-dash" data-id="${evt.id}">Dashboard</button>
              </div>
            </div>"""

new_card_struct = """            <div class="event-card ${isActive ? 'active-event' : ''}" id="evtcard-${evt.id}">
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
            </div>"""

content = content.replace(old_card_struct, new_card_struct)

# Close managed-events-section div instead of glass-panel
content = content.replace("        </div>\n      </div>\n\n      <!-- ── Wizard + Preview ── -->", "        </div>\n      </div>\n\n      <!-- ── Wizard + Preview ── -->")

with open('js/components/admin.js', 'w') as f:
    f.write(content)

print("admin.js UI v4 updated successfully")
