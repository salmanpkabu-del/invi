/* ==========================================================================
   CELEBRATI — READ-ONLY RSVP TRACKER VIEW (Couple's Private Link)
   ========================================================================== */

import { db } from '../storage.js';

export function renderTrackerView(container, eventId) {
  const events = db.getEvents();
  const event = events.find(e => e.id === eventId) || db.getActiveEvent();

  if (!event) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;gap:1rem;text-align:center;padding:2rem;">
        <div style="font-size:4rem;">🔍</div>
        <h2 style="font-family:var(--font-display);font-size:2rem;">Invitation Not Found</h2>
        <p style="color:var(--text-secondary);">This tracker link may be invalid or the event has been removed.</p>
      </div>`;
    return;
  }

  const pinKey = `tracker_unlocked_${event.id}`;
  const isUnlocked = sessionStorage.getItem(pinKey) === 'yes';

  if (!isUnlocked) {
    renderPinGate(container, event, pinKey);
    return;
  }

  renderTrackerDashboard(container, event);
}

/* ── PIN Gate Screen ──────────────────────────────────────────────────────── */
function renderPinGate(container, event, pinKey) {
  container.innerHTML = `
    <div class="tracker-gate-wrap">
      <div class="tracker-gate-card">
        <div class="tracker-gate-icon">📊</div>
        <h2 class="tracker-gate-title">${event.title}</h2>
        <p class="tracker-gate-sub">Enter your 4-digit PIN to view the RSVP tracker</p>

        <div class="tracker-pin-inputs" id="pin-inputs">
          <input class="pin-digit" maxlength="1" type="password" inputmode="numeric" data-index="0" />
          <input class="pin-digit" maxlength="1" type="password" inputmode="numeric" data-index="1" />
          <input class="pin-digit" maxlength="1" type="password" inputmode="numeric" data-index="2" />
          <input class="pin-digit" maxlength="1" type="password" inputmode="numeric" data-index="3" />
        </div>

        <div class="tracker-pin-error" id="pin-error"></div>

        <button class="tracker-pin-btn" id="pin-submit-btn">
          Unlock Tracker
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
          </svg>
        </button>

        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:1rem;">This PIN was sent to you by the event organiser.</p>
      </div>
    </div>
  `;

  // Auto-advance PIN inputs
  const digits = container.querySelectorAll('.pin-digit');
  digits.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && i < digits.length - 1) digits[i + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) digits[i - 1].focus();
    });
  });

  digits[0].focus();

  container.querySelector('#pin-submit-btn').addEventListener('click', () => {
    const entered = Array.from(digits).map(d => d.value).join('');
    const correct = db.getTrackerPin(event.id);

    if (!correct) {
      // No PIN set — allow access (admin hasn't set one yet)
      sessionStorage.setItem(pinKey, 'yes');
      renderTrackerDashboard(container, event);
      return;
    }

    if (entered === correct) {
      sessionStorage.setItem(pinKey, 'yes');
      renderTrackerDashboard(container, event);
    } else {
      const err = container.querySelector('#pin-error');
      err.textContent = '❌ Incorrect PIN. Please try again.';
      digits.forEach(d => { d.value = ''; d.classList.add('pin-shake'); });
      setTimeout(() => digits.forEach(d => d.classList.remove('pin-shake')), 500);
      digits[0].focus();
    }
  });
}

/* ── Tracker Dashboard ────────────────────────────────────────────────────── */
function renderTrackerDashboard(container, event) {
  const rsvps = event.rsvps || [];
  const attending   = rsvps.filter(r => r.status === 'attending');
  const declined    = rsvps.filter(r => r.status === 'declined');
  const pending     = rsvps.filter(r => r.status === 'pending');
  const totalGuests = attending.reduce((sum, r) => sum + 1 + (r.plusOnes || 0), 0);

  container.innerHTML = `
    <div class="tracker-wrap">
      <!-- Header -->
      <div class="tracker-header">
        <div>
          <div class="tracker-eyebrow">📊 RSVP Tracker</div>
          <h1 class="tracker-event-title">${event.title}</h1>
          <p class="tracker-event-date">
            ${event.startDate ? new Date(event.startDate).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : ''}
          </p>
        </div>
        <div class="tracker-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          CELEBRATI
        </div>
      </div>

      <!-- Stats Row -->
      <div class="tracker-stats">
        <div class="tracker-stat tracker-stat-attending">
          <div class="tracker-stat-number">${attending.length}</div>
          <div class="tracker-stat-label">✅ Attending</div>
          <div class="tracker-stat-sub">${totalGuests} total guests incl. +1s</div>
        </div>
        <div class="tracker-stat tracker-stat-declined">
          <div class="tracker-stat-number">${declined.length}</div>
          <div class="tracker-stat-label">❌ Declined</div>
          <div class="tracker-stat-sub">Unable to attend</div>
        </div>
        <div class="tracker-stat tracker-stat-pending">
          <div class="tracker-stat-number">${pending.length}</div>
          <div class="tracker-stat-label">⏳ Awaiting</div>
          <div class="tracker-stat-sub">Yet to respond</div>
        </div>
        <div class="tracker-stat tracker-stat-total">
          <div class="tracker-stat-number">${rsvps.length}</div>
          <div class="tracker-stat-label">📋 Total RSVPs</div>
          <div class="tracker-stat-sub">Responses received</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="tracker-progress-section">
        <div class="tracker-progress-label">
          <span>Response Rate</span>
          <span>${rsvps.length > 0 ? Math.round(((attending.length + declined.length) / rsvps.length) * 100) : 0}% responded</span>
        </div>
        <div class="tracker-progress-bar">
          <div class="tracker-bar-attending" style="width:${rsvps.length > 0 ? (attending.length / rsvps.length) * 100 : 0}%"></div>
          <div class="tracker-bar-declined"  style="width:${rsvps.length > 0 ? (declined.length / rsvps.length) * 100 : 0}%"></div>
          <div class="tracker-bar-pending"   style="width:${rsvps.length > 0 ? (pending.length / rsvps.length) * 100 : 0}%"></div>
        </div>
        <div class="tracker-progress-legend">
          <span><span class="legend-dot dot-green"></span> Attending</span>
          <span><span class="legend-dot dot-red"></span> Declined</span>
          <span><span class="legend-dot dot-amber"></span> Pending</span>
        </div>
      </div>

      <!-- Guest Table -->
      <div class="tracker-table-section">
        <div class="tracker-table-header">
          <h3>Guest Responses</h3>
          <div class="tracker-filter-tabs">
            <button class="tracker-tab active" data-filter="all">All (${rsvps.length})</button>
            <button class="tracker-tab" data-filter="attending">✅ Attending (${attending.length})</button>
            <button class="tracker-tab" data-filter="declined">❌ Declined (${declined.length})</button>
            <button class="tracker-tab" data-filter="pending">⏳ Pending (${pending.length})</button>
          </div>
        </div>

        ${rsvps.length === 0 ? `
          <div class="tracker-empty">
            <div style="font-size:3rem;margin-bottom:1rem;">💌</div>
            <p>No RSVPs received yet. Share your invitation link to start collecting responses.</p>
          </div>
        ` : `
          <div class="tracker-table-wrap">
            <table class="tracker-table" id="tracker-guest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Guest Name</th>
                  <th>Status</th>
                  <th>+1s</th>
                  <th>Meal Preference</th>
                  <th>Song Request</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${rsvps.map((r, i) => `
                  <tr class="tracker-row" data-status="${r.status}">
                    <td style="color:var(--text-muted);font-size:0.8rem;">${i + 1}</td>
                    <td>
                      <div class="tracker-guest-name">${r.guestName}</div>
                      ${r.notes ? `<div class="tracker-guest-note">"${r.notes}"</div>` : ''}
                    </td>
                    <td>
                      <span class="tracker-status-badge tracker-status-${r.status}">
                        ${r.status === 'attending' ? '✅ Attending' : r.status === 'declined' ? '❌ Declined' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style="text-align:center;">${r.plusOnes > 0 ? `+${r.plusOnes}` : '—'}</td>
                    <td style="font-size:0.85rem;">${r.mealPref || '—'}</td>
                    <td style="font-size:0.85rem;font-style:italic;color:var(--text-secondary);">${r.songRequest ? `🎵 ${r.songRequest}` : '—'}</td>
                    <td style="font-size:0.78rem;color:var(--text-muted);">${r.createdAt || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Footer -->
      <div class="tracker-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Powered by <strong>Celebrati</strong> &nbsp;·&nbsp; Read-only view &nbsp;·&nbsp; Last updated: ${new Date().toLocaleTimeString('en-IN')}
      </div>
    </div>
  `;

  // Tab filter
  container.querySelectorAll('.tracker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tracker-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      container.querySelectorAll('.tracker-row').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.status === filter) ? '' : 'none';
      });
    });
  });
}
