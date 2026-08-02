import re

with open('js/app.js', 'r') as f:
    content = f.read()

old_admin_hash = """    } else if (hash === '#admin') {
      if (!db.isAdminLoggedIn()) { showLoginGate(() => this.bootApp()); return; }
      this.bootApp();
      this.switchView('admin');

    } else if (hash === '#dashboard') {
      if (!db.isAdminLoggedIn()) { showLoginGate(() => this.bootApp()); return; }
      this.bootApp();
      this.switchView('dashboard');
    }"""

new_admin_hash = """    } else if (hash === '#admin') {
      if (!db.isAdminLoggedIn()) { 
        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          this.switchView('admin');
        }); 
        return; 
      }
      this.bootApp();
      this.switchView('admin');

    } else if (hash === '#dashboard') {
      if (!db.isAdminLoggedIn()) { 
        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          this.switchView('dashboard');
        }); 
        return; 
      }
      this.bootApp();
      this.switchView('dashboard');
    }"""

content = content.replace(old_admin_hash, new_admin_hash)

old_init_gate = """        showLoginGate(() => {
          this.bootApp();
          if (window.location.hash === '#admin') this.switchView('admin');
          else if (window.location.hash === '#dashboard') this.switchView('dashboard');
        });"""

new_init_gate = """        showLoginGate(async () => {
          if (typeof db.pullEventsFromFirebase === 'function') await db.pullEventsFromFirebase();
          this.bootApp();
          if (window.location.hash === '#admin') this.switchView('admin');
          else if (window.location.hash === '#dashboard') this.switchView('dashboard');
        });"""

content = content.replace(old_init_gate, new_init_gate)

with open('js/app.js', 'w') as f:
    f.write(content)

print("app.js logic fixed")
