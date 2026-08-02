/* ==========================================================================
   CELEBRATI — ADMIN LOGIN GATE COMPONENT
   ========================================================================== */

import { db } from '../storage.js';
import { FIREBASE_SETTINGS } from '../firebase-config.js';

/**
 * Renders a full-screen login gate over the app.
 * Resolves onSuccess() when admin is authenticated.
 */
export function showLoginGate(onSuccess) {
  // Remove any existing gate
  document.getElementById('celebrati-auth-gate')?.remove();

  const gate = document.createElement('div');
  gate.id = 'celebrati-auth-gate';
  gate.innerHTML = `
    <div class="auth-bg-layer"></div>

    <div class="auth-card">
      <!-- Brand -->
      <div class="auth-brand">
        <div class="auth-brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div>
          <div class="auth-brand-name">CELEBRATI</div>
          <div class="auth-brand-sub">Admin Creator Studio</div>
        </div>
      </div>

      <h2 class="auth-title">Welcome Back</h2>
      <p class="auth-subtitle">Sign in to manage your wedding invitations</p>

      <form id="auth-login-form" autocomplete="off">
                <div class="auth-field" id="auth-email-container" style="display: none; margin-bottom: 1rem;">
          <label class="auth-label">Email Address</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input
              type="email"
              id="auth-email-input"
              class="auth-input"
              placeholder="admin@celebrati.com"
              autocomplete="email"
            />
          </div>
        </div>

        <div class="auth-field">
          <label class="auth-label">Admin Password</label>
          <div class="auth-input-wrap">
            <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              type="password"
              id="auth-password-input"
              class="auth-input"
              placeholder="Enter password"
              autocomplete="current-password"
            />
            <button type="button" id="auth-toggle-pass" class="auth-eye-btn" title="Show/Hide password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="auth-error" id="auth-error-msg"></div>
        </div>

        <button type="submit" class="auth-submit-btn" id="auth-submit-btn">
          <span id="auth-btn-text">Sign In to Studio</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>

      <div class="auth-hint">
        Default password: <code>celebrati2026</code>
      </div>
    </div>

    <!-- Decorative floating rings -->
    <div class="auth-ring auth-ring-1"></div>
    <div class="auth-ring auth-ring-2"></div>
    <div class="auth-ring auth-ring-3"></div>
  `;

  document.body.appendChild(gate);
  
  if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
    document.getElementById('auth-email-container').style.display = 'block';
    document.getElementById('auth-email-input').required = true;
    document.querySelector('.auth-hint').style.display = 'none';
  }

  // Animate in
  requestAnimationFrame(() => gate.classList.add('visible'));

  // Toggle password visibility
  document.getElementById('auth-toggle-pass').addEventListener('click', () => {
    const input = document.getElementById('auth-password-input');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Submit handler
  document.getElementById('auth-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email-input')?.value || '';
    const pass = document.getElementById('auth-password-input').value;
    const errMsg = document.getElementById('auth-error-msg');
    const btn = document.getElementById('auth-submit-btn');
    const btnText = document.getElementById('auth-btn-text');

    errMsg.textContent = '';
    btnText.textContent = 'Signing in…';
    btn.disabled = true;

    try {
      const success = await db.loginAdmin(email, pass);
      if (success) {
        gate.classList.add('auth-success');
        setTimeout(() => {
          gate.remove();
          onSuccess();
        }, 600);
      } else {
        errMsg.textContent = '❌ Incorrect credentials. Please try again.';
        btnText.textContent = 'Sign In to Studio';
        btn.disabled = false;
        document.getElementById('auth-password-input').focus();
        document.getElementById('auth-password-input').select();
      }
    } catch (err) {
      errMsg.textContent = '❌ Error: ' + err.message;
      btnText.textContent = 'Sign In to Studio';
      btn.disabled = false;
    }
  });
}
