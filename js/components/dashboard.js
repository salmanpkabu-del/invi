/* ==========================================================================
   CELEBRATI — CUSTOMER RSVP & ANALYTICS DASHBOARD COMPONENT
   ========================================================================== */

import { db } from '../storage.js';
import { FIREBASE_SETTINGS } from '../firebase-config.js';

export function renderDashboardView(container, onNavigateToAdmin, onNavigateToInvite) {
  const activeEvent = db.getActiveEvent();
  const rsvps = activeEvent.rsvps || [];
  const paymentStatus = db.getPaymentStatus(activeEvent.id);

  // Metrics calculations
  const totalInvites = rsvps.length;
  const attendingCount = rsvps.filter(r => r.status === 'attending').length;
  const declinedCount = rsvps.filter(r => r.status === 'declined').length;
  const pendingCount = rsvps.filter(r => r.status === 'pending').length;

  const totalHeadcount = rsvps
    .filter(r => r.status === 'attending')
    .reduce((acc, r) => acc + 1 + (parseInt(r.plusOnes) || 0), 0);

  // Meal preferences breakdown
  const meals = {};
  rsvps.filter(r => r.status === 'attending').forEach(r => {
    const pref = r.mealPref || 'Default Chef Choice';
    meals[pref] = (meals[pref] || 0) + (1 + (parseInt(r.plusOnes) || 0));
  });

  container.innerHTML = `
    <div class="dashboard-layout">
      <!-- Payment Status Alert Banner -->
      ${paymentStatus !== 'paid' ? `
        <div class="glass-panel" style="padding:1rem 1.5rem; margin-bottom:1.5rem; border-left:4px solid #F59E0B; background:rgba(245, 158, 11, 0.1); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <strong>⏳ Event Payment Pending Offline Verification</strong>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Send payment proof via WhatsApp / Email from Admin Studio to activate full verified status.</div>
          </div>
          <button id="dash-btn-open-admin-pay" class="btn btn-sm btn-primary">Manage Payment</button>
        </div>
      ` : ''}

      <!-- Top Bar Header -->
      <div class="view-header">
        <div class="view-header-title">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Guest Analytics & RSVP Dashboard
          </h1>
          <p>Real-time guest tracking, meal counts, digital pass verification & wishes moderation for <strong>${activeEvent.title}</strong>.</p>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          ${FIREBASE_SETTINGS.ENABLE_FIREBASE ? `
            <button id="dash-btn-pull-firebase" class="btn btn-secondary" style="border-color: #3B82F6; color: #60A5FA;">
              🔥 Sync Cloud RSVPs
            </button>
          ` : ''}
          <button id="dash-btn-whatsapp-reminder" class="btn btn-secondary" style="border-color: #10B981; color: #10B981;">
            💬 WhatsApp Blast
          </button>
          <button id="dash-btn-scan-pass" class="btn btn-secondary">
            🎟️ Gatekeeper Check-in
          </button>
          <button id="dash-btn-export-csv" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button id="dash-btn-edit-event" class="btn btn-outline">Edit Event</button>
          <button id="dash-btn-view-invite" class="btn btn-primary">Live Invite</button>
        </div>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(59, 130, 246, 0.15); color: #3B82F6;">📨</div>
          <div>
            <div class="kpi-value">${totalInvites}</div>
            <div class="kpi-label">Total Guests Listed</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">✅</div>
          <div>
            <div class="kpi-value">${attendingCount}</div>
            <div class="kpi-label">Confirmed Attending</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(239, 68, 68, 0.15); color: #EF4444;">❌</div>
          <div>
            <div class="kpi-value">${declinedCount}</div>
            <div class="kpi-label">Declined</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;">⏳</div>
          <div>
            <div class="kpi-value">${pendingCount}</div>
            <div class="kpi-label">Awaiting Response</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(124, 58, 237, 0.15); color: #7C3AED;">👥</div>
          <div>
            <div class="kpi-value">${totalHeadcount}</div>
            <div class="kpi-label">Total Headcount (+1s)</div>
          </div>
        </div>
      </div>

      <!-- Charts & Analytics Section -->
      <div class="analytics-grid">
        <div class="chart-box">
          <div class="chart-header">
            <div class="chart-title">RSVP Response Distribution</div>
            <span class="badge badge-info">${totalInvites ? Math.round((attendingCount/totalInvites)*100) : 0}% Response Rate</span>
          </div>
          <!-- Custom SVG Donut Chart -->
          <div style="display: flex; align-items: center; justify-content: space-around; min-height: 200px; flex-wrap: wrap; gap: 1rem;">
            <svg width="180" height="180" viewBox="0 0 42 42" class="donut">
              <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.08)" stroke-width="5"></circle>
              <!-- Segment 1: Attending (Green) -->
              <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" stroke-width="5" stroke-dasharray="${totalInvites ? (attendingCount/totalInvites)*100 : 0} ${totalInvites ? 100 - (attendingCount/totalInvites)*100 : 100}" stroke-dashoffset="25"></circle>
              <!-- Segment 2: Declined (Red) -->
              <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" stroke-width="5" stroke-dasharray="${totalInvites ? (declinedCount/totalInvites)*100 : 0} ${totalInvites ? 100 - (declinedCount/totalInvites)*100 : 100}" stroke-dashoffset="${25 - (totalInvites ? (attendingCount/totalInvites)*100 : 0)}"></circle>
            </svg>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: #10B981;"></div>
                <span style="font-size: 0.9rem;">Attending (${attendingCount})</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: #EF4444;"></div>
                <span style="font-size: 0.9rem;">Declined (${declinedCount})</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: #F59E0B;"></div>
                <span style="font-size: 0.9rem;">Pending (${pendingCount})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-box">
          <div class="chart-header">
            <div class="chart-title">Caterer Meal Breakdown</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
            ${Object.keys(meals).length === 0 ? '<p style="color:var(--text-secondary); font-size:0.9rem;">No meal preferences submitted yet.</p>' : ''}
            ${Object.entries(meals).map(([meal, count]) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                  <span>${meal}</span>
                  <strong>${count} meals</strong>
                </div>
                <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                  <div style="height: 100%; width: ${totalHeadcount ? Math.min(100, (count/totalHeadcount)*100) : 0}%; background: var(--brand-primary); border-radius: 4px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Guest Management Table -->
      <div class="table-container">
        <div class="table-toolbar">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Guest Master List</h3>
            <span class="badge badge-info">${rsvps.length} Records</span>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <input type="text" id="table-search-input" class="form-input" placeholder="Search by name or email..." style="width: 240px; padding: 0.4rem 0.8rem; font-size: 0.85rem;">
            <select id="table-status-filter" class="form-select" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
              <option value="all">All Statuses</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <table class="guest-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Status</th>
              <th>+1s</th>
              <th>Meal Preference</th>
              <th>Song Request</th>
              <th>Gate Pass</th>
              <th>Date</th>
              <th>Share Pass</th>
            </tr>
          </thead>
          <tbody id="guest-table-body">
            ${rsvps.map(r => {
              const shareMsg = encodeURIComponent(`Hi ${r.guestName}, here is your VIP Entry Pass code for ${activeEvent.title}: ${r.passCode || 'N/A'}.\nShow this at the entrance!`);
              const waLink = `https://api.whatsapp.com/send?text=${shareMsg}`;
              const mailLink = `mailto:${r.email}?subject=${encodeURIComponent('Your Entry Pass passcode')}&body=${shareMsg}`;

              return `
              <tr data-status="${r.status}" data-search="${r.guestName.toLowerCase()} ${r.email.toLowerCase()}">
                <td>
                  <strong>${r.guestName}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${r.email}</div>
                </td>
                <td>
                  <span class="badge ${r.status === 'attending' ? 'badge-success' : (r.status === 'declined' ? 'badge-danger' : 'badge-warning')}">
                    ${r.status}
                  </span>
                </td>
                <td>${r.plusOnes || 0}</td>
                <td>${r.mealPref || 'N/A'}</td>
                <td>${r.songRequest ? `🎵 ${r.songRequest}` : '—'}</td>
                <td>
                  <code style="font-family: monospace; font-size: 0.8rem; color: var(--brand-accent);">${r.passCode || 'N/A'}</code>
                </td>
                <td>${r.createdAt || 'N/A'}</td>
                <td>
                  <div style="display:flex; gap:0.25rem;">
                    <a href="${waLink}" target="_blank" class="btn btn-sm btn-outline" style="padding:0.2rem 0.4rem; font-size:0.75rem; border-color:#25D366; color:#25D366;" title="Send Pass via WhatsApp">💬 WA</a>
                    <a href="${mailLink}" target="_blank" class="btn btn-sm btn-outline" style="padding:0.2rem 0.4rem; font-size:0.75rem;" title="Send Pass via Email">✉️ Mail</a>
                  </div>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>

      <!-- Guest Wishes Moderation Section -->
      <div class="glass-panel" style="padding: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700;">Digital Guestbook Wishes Moderation</h3>
          <span class="badge badge-success">${(activeEvent.wishes || []).filter(w => w.approved).length} Published</span>
        </div>
        <div class="wishes-moderation-grid">
          ${(activeEvent.wishes || []).map(w => `
            <div class="wish-mod-card">
              <div>
                <div class="wish-mod-author">${w.author}</div>
                <div class="wish-mod-text">"${w.text}"</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">❤️ ${w.hearts || 0} Likes</span>
                <button class="btn btn-sm ${w.approved ? 'btn-secondary' : 'btn-primary'} btn-toggle-wish" data-id="${w.id}">
                  ${w.approved ? 'Hide' : 'Approve'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  const editBtn = container.querySelector('#dash-btn-edit-event');
  if (editBtn) editBtn.addEventListener('click', () => onNavigateToAdmin());

  const viewInviteBtn = container.querySelector('#dash-btn-view-invite');
  if (viewInviteBtn) viewInviteBtn.addEventListener('click', () => onNavigateToInvite());

  const adminPayBtn = container.querySelector('#dash-btn-open-admin-pay');
  if (adminPayBtn) adminPayBtn.addEventListener('click', () => onNavigateToAdmin());

  // Pull Firebase Sync
  const pullFirebaseBtn = container.querySelector('#dash-btn-pull-firebase');
  if (pullFirebaseBtn) {
    pullFirebaseBtn.addEventListener('click', async () => {
      pullFirebaseBtn.textContent = 'Syncing...';
      const updated = await db.pullFreshRsvpsFromFirebase(activeEvent.id);
      if (updated) {
        alert('🔥 Synced latest guest RSVPs from Firebase cloud!');
        renderDashboardView(container, onNavigateToAdmin, onNavigateToInvite);
      } else {
        alert('✓ Local data is already up to date with cloud.');
        pullFirebaseBtn.textContent = '🔥 Sync Cloud RSVPs';
      }
    });
  }

  // CSV Export
  const csvBtn = container.querySelector('#dash-btn-export-csv');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => exportGuestListToCSV(activeEvent));
  }

  // WhatsApp Broadcast Simulator
  const waBtn = container.querySelector('#dash-btn-whatsapp-reminder');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const text = `*Reminder for ${activeEvent.title}*\nDear Guest, please confirm your attendance at your earliest convenience: ${window.location.origin}/#invite-${activeEvent.id}`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  // Gatekeeper Scanner Check-in Simulator
  const scanBtn = container.querySelector('#dash-btn-scan-pass');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      const code = prompt('🎟️ Enter Guest Passcode to Verify Entry (e.g. PASS-8912):');
      if (code) {
        const found = (activeEvent.rsvps || []).find(r => r.passCode.toUpperCase() === code.trim().toUpperCase());
        if (found) {
          alert(`✅ ACCESS GRANTED!\n\nGuest: ${found.guestName}\nStatus: ${found.status.toUpperCase()}\nHeadcount: ${(found.plusOnes || 0) + 1} person(s)\nMeal: ${found.mealPref || 'N/A'}`);
        } else {
          alert(`❌ INVALID PASSCODE!\nNo guest record found for "${code}".`);
        }
      }
    });
  }

  // Search & Filters
  const searchInput = container.querySelector('#table-search-input');
  const statusFilter = container.querySelector('#table-status-filter');
  const rows = container.querySelectorAll('#guest-table-body tr');

  function filterTable() {
    const q = searchInput.value.toLowerCase();
    const st = statusFilter.value;

    rows.forEach(r => {
      const matchSearch = r.dataset.search.includes(q);
      const matchStatus = st === 'all' || r.dataset.status === st;
      r.style.display = (matchSearch && matchStatus) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);

  // Wish moderation toggles
  container.querySelectorAll('.btn-toggle-wish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wishId = e.target.dataset.id;
      db.toggleWishApproval(activeEvent.id, wishId);
      renderDashboardView(container, onNavigateToAdmin, onNavigateToInvite);
    });
  });
}

function exportGuestListToCSV(event) {
  const headers = ['Guest Name', 'Email', 'Status', 'Plus Ones', 'Meal Preference', 'Song Request', 'Passcode', 'Submitted Date'];
  const rows = (event.rsvps || []).map(r => [
    `"${r.guestName}"`,
    `"${r.email}"`,
    `"${r.status}"`,
    r.plusOnes || 0,
    `"${r.mealPref || ''}"`,
    `"${r.songRequest || ''}"`,
    `"${r.passCode || ''}"`,
    `"${r.createdAt || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${event.slug || 'event'}-guest-list.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
