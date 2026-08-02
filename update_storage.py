import re

with open('js/storage.js', 'r') as f:
    content = f.read()

# Add getFirebaseAuth
content = content.replace("import { initFirebase, getFirestoreDb } from './firebase-config.js';", "import { initFirebase, getFirestoreDb, getFirebaseAuth, FIREBASE_SETTINGS } from './firebase-config.js';")

# Add auth state variables
content = content.replace("this.firebaseInitialized = false;", "this.firebaseInitialized = false;\n    this.firebaseUser = null;\n    this.authReady = false;")

# Initialize Auth State Listener
old_init = """    // Initialize Firebase in background if configured
    const firestore = await initFirebase();
    if (firestore) {
      this.firebaseInitialized = true;
    }"""
new_init = """    // Initialize Firebase in background if configured
    const firestore = await initFirebase();
    if (firestore) {
      this.firebaseInitialized = true;
      const auth = getFirebaseAuth();
      if (auth) {
        const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
        return new Promise(resolve => {
          onAuthStateChanged(auth, (user) => {
            this.firebaseUser = user;
            this.authReady = true;
            resolve();
          });
        });
      }
    }
    this.authReady = true;"""
content = content.replace(old_init, new_init)

# Update isAdminLoggedIn
old_is_admin = """  isAdminLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEY_AUTH);
  }"""
new_is_admin = """  isAdminLoggedIn() {
    if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
      return !!this.firebaseUser;
    }
    return !!localStorage.getItem(STORAGE_KEY_AUTH);
  }"""
content = content.replace(old_is_admin, new_is_admin)

# Update loginAdmin
old_login = """  loginAdmin(password) {
    const storedPass = localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_ADMIN_PASS;
    if (password === storedPass) {
      localStorage.setItem(STORAGE_KEY_AUTH, 'session_' + Date.now());
      return true;
    }
    return false;
  }"""
new_login = """  async loginAdmin(email, password) {
    if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
      const auth = getFirebaseAuth();
      if (!auth) return false;
      const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.firebaseUser = userCredential.user;
        return true;
      } catch (err) {
        console.error("Firebase Login Error:", err);
        throw err;
      }
    }
    
    // Fallback Local Storage logic
    const storedPass = localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_ADMIN_PASS;
    if (password === storedPass) {
      localStorage.setItem(STORAGE_KEY_AUTH, 'session_' + Date.now());
      return true;
    }
    return false;
  }"""
content = content.replace(old_login, new_login)

# Update logoutAdmin
old_logout = """  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }"""
new_logout = """  async logoutAdmin() {
    if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
      const auth = getFirebaseAuth();
      if (auth) {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
        await signOut(auth);
      }
    }
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }"""
content = content.replace(old_logout, new_logout)

# Update getEvents to pull from Firestore if enabled
old_get_events = """  getEvents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS)) || SEEDED_EVENTS;
    } catch (e) {
      return SEEDED_EVENTS;
    }
  }"""
new_get_events = """  getEvents() {
    // If we have loaded from firestore, we should use that in memory, but since it's synchronous here,
    // we still rely on localStorage as a cache. The actual cloud pull should happen on boot.
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS)) || SEEDED_EVENTS;
    } catch (e) {
      return SEEDED_EVENTS;
    }
  }
  
  async pullEventsFromFirebase() {
    if (!FIREBASE_SETTINGS.ENABLE_FIREBASE || !this.firebaseUser) return false;
    const firestore = getFirestoreDb();
    if (!firestore) return false;

    try {
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const eventsRef = collection(firestore, `users/${this.firebaseUser.uid}/events`);
      const snapshot = await getDocs(eventsRef);
      if (!snapshot.empty) {
        const remoteEvents = [];
        snapshot.forEach(docSnap => remoteEvents.push(docSnap.data()));
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(remoteEvents));
        if (remoteEvents.length > 0) {
            this.setActiveEventId(remoteEvents[0].id);
        }
        return true;
      }
    } catch (err) {
      console.warn("⚠️ Error pulling remote Events from Firebase:", err);
    }
    return false;
  }"""
content = content.replace(old_get_events, new_get_events)

# Update syncEventToFirebase to save to users/{uid}/events/{eventId} instead of global events
old_sync = """      const eventRef = doc(firestore, 'events', eventData.id);"""
new_sync = """      if (!this.firebaseUser) return;
      const eventRef = doc(firestore, `users/${this.firebaseUser.uid}/events`, eventData.id);"""
content = content.replace(old_sync, new_sync)


with open('js/storage.js', 'w') as f:
    f.write(content)

print("storage.js updated successfully")
