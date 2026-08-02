import re

with open('js/components/auth.js', 'r') as f:
    content = f.read()

# Make email field dynamic
old_email = """        <div class="auth-field" style="margin-bottom: 1rem;">
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
        </div>"""

new_email = """        <div class="auth-field" id="auth-email-container" style="display: none; margin-bottom: 1rem;">
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
        </div>"""

content = content.replace(old_email, new_email)

# Import FIREBASE_SETTINGS
content = content.replace("import { db } from '../storage.js';", "import { db } from '../storage.js';\nimport { FIREBASE_SETTINGS } from '../firebase-config.js';")

# Show email only if Firebase enabled
old_body_append = """  document.body.appendChild(gate);

  // Animate in"""

new_body_append = """  document.body.appendChild(gate);
  
  if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
    document.getElementById('auth-email-container').style.display = 'block';
    document.getElementById('auth-email-input').required = true;
    document.querySelector('.auth-hint').style.display = 'none';
  }

  // Animate in"""
content = content.replace(old_body_append, new_body_append)

# Fix email value logic
old_submit = """    const email = document.getElementById('auth-email-input').value;"""
new_submit = """    const email = document.getElementById('auth-email-input')?.value || '';"""
content = content.replace(old_submit, new_submit)


with open('js/components/auth.js', 'w') as f:
    f.write(content)

print("auth ui fixed")
