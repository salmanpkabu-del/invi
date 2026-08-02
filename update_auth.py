import re

with open('js/components/auth.js', 'r') as f:
    content = f.read()

# Add email field before password
email_field = """        <div class="auth-field" style="margin-bottom: 1rem;">
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
"""
content = content.replace('<div class="auth-field">', email_field + '\n        <div class="auth-field">', 1)

# Make submit handler async and pass email
old_submit = """  // Submit handler
  document.getElementById('auth-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('auth-password-input').value;"""

new_submit = """  // Submit handler
  document.getElementById('auth-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email-input').value;
    const pass = document.getElementById('auth-password-input').value;"""
content = content.replace(old_submit, new_submit)

old_login = """    // Small artificial delay for UX
    setTimeout(() => {
      if (db.loginAdmin(pass)) {
        gate.classList.add('auth-success');
        setTimeout(() => {
          gate.remove();
          onSuccess();
        }, 600);
      } else {
        errMsg.textContent = '❌ Incorrect password. Please try again.';
        btnText.textContent = 'Sign In to Studio';
        btn.disabled = false;
        document.getElementById('auth-password-input').focus();
        document.getElementById('auth-password-input').select();
      }
    }, 400);"""

new_login = """    try {
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
    }"""
content = content.replace(old_login, new_login)

with open('js/components/auth.js', 'w') as f:
    f.write(content)

print("auth.js updated successfully")
