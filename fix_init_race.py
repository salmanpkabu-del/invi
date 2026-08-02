import re

with open('js/storage.js', 'r') as f:
    content = f.read()

# Store init promise
old_constructor = """  constructor() {
    this.firebaseInitialized = false;
    this.firebaseUser = null;
    this.authReady = false;
    this.init();
  }"""
new_constructor = """  constructor() {
    this.firebaseInitialized = false;
    this.firebaseUser = null;
    this.authReady = false;
    this.initPromise = this.init();
  }
  
  async waitForInit() {
    return this.initPromise;
  }"""
content = content.replace(old_constructor, new_constructor)

with open('js/storage.js', 'w') as f:
    f.write(content)

with open('js/app.js', 'r') as f:
    app_js = f.read()

# Update app.js to wait for db.waitForInit()
old_app_init = """  init() {
    // Check hash first to decide if auth is needed"""
new_app_init = """  async init() {
    await db.waitForInit();
    // Pull events if logged in
    if (db.isAdminLoggedIn() && typeof db.pullEventsFromFirebase === 'function') {
      await db.pullEventsFromFirebase();
    }
    
    // Check hash first to decide if auth is needed"""
app_js = app_js.replace(old_app_init, new_app_init)

# Fix logout in app.js
old_logout = """        db.logoutAdmin();
        window.location.reload();"""
new_logout = """        db.logoutAdmin().then(() => {
          window.location.reload();
        });"""
app_js = app_js.replace(old_logout, new_logout)

with open('js/app.js', 'w') as f:
    f.write(app_js)

print("Race condition fixed")
