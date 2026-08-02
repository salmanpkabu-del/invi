/* ==========================================================================
   CELEBRATI — LOCALSTORAGE & LIGHTWEIGHT FIREBASE HYBRID STORAGE MANAGER
   ========================================================================== */

import { initFirebase, getFirestoreDb, getFirebaseAuth, FIREBASE_SETTINGS } from './firebase-config.js';

const STORAGE_KEY_EVENTS  = 'celebrati_events_v1';
const STORAGE_KEY_ACTIVE  = 'celebrati_active_event_id';
const STORAGE_KEY_AUTH    = 'celebrati_admin_session';
const STORAGE_KEY_PASS    = 'celebrati_admin_pass';
const DEFAULT_ADMIN_PASS  = 'celebrati2026';

const SEEDED_EVENTS = [
  {
    id: 'evt-wedding-01',
    slug: 'alaya-farhan-wedding',
    title: 'The Royal Wedding of Alaya & Farhan',
    eventType: 'wedding',
    hostNames: 'Alaya Khan & Farhan Qureshi',
    tagline: 'Two Souls, One Timeless Promise',
    theme: 'theme-royal',
    startDate: '2026-11-14T18:00',
    rsvpDeadline: '2026-11-01',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3',
    musicTitle: 'Romantic Canon in D Piano',
    hashtag: '#AlayaTiesTheFarhan',
    paymentStatus: 'paid', // 'unpaid' | 'pending_review' | 'paid'
    paid: true,
    dressCode: {
      title: 'Royal Ethnic & Black Tie Luxury',
      description: 'Gentlemen: Formal Sherwanis or Tuxedos. Ladies: Anarkalis, Sarees or Evening Gowns.',
      colors: [
        { hex: '#3D0F1A', label: 'Burgundy' },
        { hex: '#E5A965', label: 'Rose Gold' },
        { hex: '#FFF5EA', label: 'Ivory' },
        { hex: '#1F060B', label: 'Obsidian' }
      ]
    },
    storyMilestones: [
      { date: 'June 2021', title: 'First Encounter in London', description: 'A chance meeting at a cozy cafe near Hyde Park sparked an unforgettable 4-hour conversation.' },
      { date: 'December 2023', title: 'The Proposal under Northern Lights', description: 'Under the ethereal glow of Tromsø Aurora Borealis, Farhan asked the eternal question.' },
      { date: 'November 2026', title: 'Beginning Our Forever', description: 'We invite you to celebrate our union surrounded by love, music, and lifelong memories.' }
    ],
    venues: [
      {
        name: 'Grand Sangeet & Mehendi Night',
        date: 'Friday, November 13, 2026 • 7:00 PM',
        address: 'The Grand Imperial Ballroom, 100 Royal Palm Ave, Dubai',
        lat: 25.2048,
        lng: 55.2708,
        mapUrl: 'https://maps.google.com'
      },
      {
        name: 'Nikkah & Royal Banquet Reception',
        date: 'Saturday, November 14, 2026 • 6:00 PM',
        address: 'Atlantis Royal Garden Pavilion, Palm Jumeirah, Dubai',
        lat: 25.1304,
        lng: 55.1172,
        mapUrl: 'https://maps.google.com'
      }
    ],
    faq: [
      { q: 'Is there parking at the venue?', a: 'Yes! Valet parking will be provided at the main pavilion entrance.' },
      { q: 'Can I bring children?', a: 'While we love your little ones, this will be an adults-only celebration.' },
      { q: 'What is the gift policy?', a: 'Your presence is our biggest gift! For those wishing to contribute, a honeymoon box will be available.' }
    ],
    giftRegistryUrl: 'https://amazon.com/wedding-registry',
    rsvps: [
      { id: 'rsvp-1', guestName: 'Zainab & Tariq Rahman', email: 'tariq@example.com', segment: 'Family', status: 'attending', plusOnes: 1, mealPref: 'Non-Veg Chef Special', songRequest: 'Tere Bina - Guru', notes: 'So happy for you both!', passCode: 'PASS-8912', createdAt: '2026-07-28' },
      { id: 'rsvp-2', guestName: 'Aamir Vance', email: 'aamir@example.com', segment: 'Friends', status: 'attending', plusOnes: 0, mealPref: 'Chef Special Veg', songRequest: 'Pasoori', notes: 'Cant wait to dance at the Sangeet!', passCode: 'PASS-4421', createdAt: '2026-07-29' },
      { id: 'rsvp-3', guestName: 'Dr. Sarah Jenkins', email: 'sarah@example.com', segment: 'VIP', status: 'attending', plusOnes: 1, mealPref: 'Gluten-Free Veg', songRequest: 'Perfect - Ed Sheeran', notes: 'Honored to attend!', passCode: 'PASS-3310', createdAt: '2026-07-30' },
      { id: 'rsvp-4', guestName: 'Hamza Siddiqui', email: 'hamza@example.com', status: 'declined', plusOnes: 0, mealPref: 'N/A', songRequest: '', notes: 'Wishing you all the best from Canada!', passCode: '', createdAt: '2026-07-30' },
      { id: 'rsvp-5', guestName: 'Nadia & Bilal Malik', email: 'bilal@example.com', segment: 'Family', status: 'pending', plusOnes: 2, mealPref: 'Pending', songRequest: '', notes: '', passCode: 'PASS-9081', createdAt: '2026-07-31' }
    ],
    wishes: [
      { id: 'w-1', author: 'Zainab & Tariq', text: 'May your love story shine brighter than all the stars in the Dubai night sky!', hearts: 14, approved: true },
      { id: 'w-2', author: 'Aamir Vance', text: 'Get ready for the wildest Sangeet dance floor history has ever seen! Huge congrats bro!', hearts: 22, approved: true },
      { id: 'w-3', author: 'Auntie Yasmin', text: 'May Allah bless this beautiful union with eternal bliss, contentment, and joy.', hearts: 19, approved: true }
    ],
    status: 'published',
    customColor: null,
    customFont: null,
    visibleSections: {
      story: true,
      schedule: true,
      dressCode: true,
      wishes: true
    }
  },
  {
    id: 'evt-bday-02',
    slug: 'alexander-30th-gala',
    title: 'Alexander’s 30th Midnight Luxe Gala',
    eventType: 'birthday',
    hostNames: 'Alexander Sterling',
    tagline: 'Decade Three: A Celebration of Extraordinary Milestones',
    theme: 'theme-midnight',
    startDate: '2026-09-20T20:00',
    rsvpDeadline: '2026-09-10',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c87b92f7.mp3?filename=lounge-jazz-club-10871.mp3',
    musicTitle: 'Midnight Velvet Lounge Jazz',
    hashtag: '#AlexTurns30Luxe',
    paymentStatus: 'paid',
    paid: true,
    dressCode: {
      title: 'Midnight Elegance & Gold Accents',
      description: 'Dark obsidian, emerald green, and gold watches/gowns.',
      colors: [
        { hex: '#061811', label: 'Emerald' },
        { hex: '#D4AF37', label: 'Gold Foil' },
        { hex: '#0F172A', label: 'Obsidian' }
      ]
    },
    storyMilestones: [
      { date: '2016 - 2026', title: 'A Decade of Adventures', description: 'From launching tech startups in London to exploring 30 countries across 5 continents.' }
    ],
    venues: [
      {
        name: 'The Glass Pavilion Rooftop Bar',
        date: 'Saturday, September 20, 2026 • 8:00 PM till Late',
        address: 'Level 54, The Obsidian Tower, Downtown City',
        lat: 25.2048,
        lng: 55.2708,
        mapUrl: 'https://maps.google.com'
      }
    ],
    faq: [],
    giftRegistryUrl: '',
    rsvps: [
      { id: 'rsvp-b1', guestName: 'Marcus Cole', email: 'marcus@example.com', segment: 'VIP', status: 'attending', plusOnes: 1, mealPref: 'Non-Veg Chef Special', songRequest: 'Starboy - The Weeknd', notes: 'Pop the champagne!', passCode: 'PASS-5511', createdAt: '2026-07-29' }
    ],
    wishes: [
      { id: 'wb-1', author: 'Marcus Cole', text: '30 never looked so good my friend! Cheers to the next chapter.', hearts: 9, approved: true }
    ],
    status: 'published',
    customColor: null,
    customFont: null,
    visibleSections: {
      story: true,
      schedule: true,
      dressCode: true,
      wishes: true
    }
  }
];

class StorageManager {
  constructor() {
    this.firebaseInitialized = false;
    this.firebaseUser = null;
    this.authReady = false;
    this.initPromise = this.init();
  }
  
  async waitForInit() {
    return this.initPromise;
  }

  async init() {
    if (!localStorage.getItem(STORAGE_KEY_EVENTS)) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(SEEDED_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ACTIVE)) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, SEEDED_EVENTS[0].id);
    }

    // Initialize Firebase in background if configured
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
    this.authReady = true;
  }

  getEvents() {
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
  }

  getActiveEventId() {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || SEEDED_EVENTS[0].id;
  }

  setActiveEventId(id) {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  }

  getActiveEvent() {
    const events = this.getEvents();
    const activeId = this.getActiveEventId();
    return events.find(e => e.id === activeId) || events[0];
  }

  saveEvent(eventData) {
    const events = this.getEvents();
    const existingIndex = events.findIndex(e => e.id === eventData.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = { ...events[existingIndex], ...eventData };
    } else {
      events.unshift(eventData);
    }

    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    this.setActiveEventId(eventData.id);

    // Light Firebase sync (1 write per event save)
    this.syncEventToFirebase(eventData);

    return eventData;
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    if (events.length > 0) {
      this.setActiveEventId(events[0].id);
    }
    return events;
  }

  addRSVP(eventId, rsvpData) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return null;

    const newRsvp = {
      id: 'rsvp-' + Date.now(),
      passCode: 'PASS-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split('T')[0],
      ...rsvpData
    };

    event.rsvps.unshift(newRsvp);
    
    // Also save wish if provided
    let newWish = null;
    if (rsvpData.notes && rsvpData.notes.trim()) {
      newWish = {
        id: 'wish-' + Date.now(),
        author: rsvpData.guestName,
        text: rsvpData.notes,
        hearts: 1,
        approved: true
      };
      event.wishes.unshift(newWish);
    }

    this.saveEvent(event);

    // Light Firebase write (1 document write only)
    this.syncRsvpToFirebase(eventId, newRsvp, newWish);

    return newRsvp;
  }

  toggleWishApproval(eventId, wishId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const wish = event.wishes.find(w => w.id === wishId);
    if (wish) {
      wish.approved = !wish.approved;
      this.saveEvent(event);
    }
  }

  likeWish(eventId, wishId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const wish = event.wishes.find(w => w.id === wishId);
    if (wish) {
      wish.hearts = (wish.hearts || 0) + 1;
      this.saveEvent(event);
    }
  }

  /* ── Firebase Light Sync Methods ──────────────────────────── */
  async syncEventToFirebase(eventData) {
    const firestore = getFirestoreDb();
    if (!firestore) return;

    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      if (!this.firebaseUser) return;
      const eventRef = doc(firestore, `users/${this.firebaseUser.uid}/events`, eventData.id);
      await setDoc(eventRef, {
        title: eventData.title,
        eventType: eventData.eventType,
        hostNames: eventData.hostNames,
        tagline: eventData.tagline,
        theme: eventData.theme,
        startDate: eventData.startDate,
        rsvpDeadline: eventData.rsvpDeadline,
        paymentStatus: eventData.paymentStatus || 'paid',
        status: eventData.status || 'published',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("⚠️ Firebase event sync skipped:", err);
    }
  }

  async syncRsvpToFirebase(eventId, rsvpData, wishData) {
    const firestore = getFirestoreDb();
    if (!firestore) return;

    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const rsvpRef = doc(firestore, `events/${eventId}/rsvps`, rsvpData.id);
      await setDoc(rsvpRef, rsvpData);

      if (wishData) {
        const wishRef = doc(firestore, `events/${eventId}/wishes`, wishData.id);
        await setDoc(wishRef, wishData);
      }
    } catch (err) {
      console.warn("⚠️ Firebase RSVP sync skipped:", err);
    }
  }

  async pullFreshRsvpsFromFirebase(eventId) {
    const firestore = getFirestoreDb();
    if (!firestore) return false;

    try {
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const rsvpsRef = collection(firestore, `events/${eventId}/rsvps`);
      const snapshot = await getDocs(rsvpsRef);
      if (snapshot.empty) return false;

      const remoteRsvps = [];
      snapshot.forEach(docSnap => remoteRsvps.push(docSnap.data()));

      const events = this.getEvents();
      const event = events.find(e => e.id === eventId);
      if (event && remoteRsvps.length > 0) {
        // Merge without duplicating
        const existingIds = new Set(event.rsvps.map(r => r.id));
        remoteRsvps.forEach(r => {
          if (!existingIds.has(r.id)) {
            event.rsvps.unshift(r);
          }
        });
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
        return true;
      }
    } catch (err) {
      console.warn("⚠️ Error pulling remote RSVPs from Firebase:", err);
    }
    return false;
  }

  /* ── Admin Auth ──────────────────────────────────────────── */
  isAdminLoggedIn() {
    if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
      return !!this.firebaseUser;
    }
    return !!localStorage.getItem(STORAGE_KEY_AUTH);
  }

  async loginAdmin(email, password) {
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
  }

  async logoutAdmin() {
    if (FIREBASE_SETTINGS.ENABLE_FIREBASE) {
      const auth = getFirebaseAuth();
      if (auth) {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
        await signOut(auth);
      }
    }
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }

  changeAdminPassword(newPass) {
    localStorage.setItem(STORAGE_KEY_PASS, newPass);
  }

  /* ── Offline Payment Management ─────────────────────────── */
  setPaymentStatus(eventId, status) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.paymentStatus = status; // 'unpaid' | 'pending_review' | 'paid'
      event.paid = (status === 'paid');
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
      this.syncEventToFirebase(event);
    }
  }

  markPaid(eventId) {
    this.setPaymentStatus(eventId, 'paid');
  }

  markPaymentPending(eventId) {
    this.setPaymentStatus(eventId, 'pending_review');
  }

  isPaid(eventId) {
    const event = this.getEvents().find(e => e.id === eventId);
    if (!event) return false;
    return event.paymentStatus === 'paid' || !!event.paid;
  }

  getPaymentStatus(eventId) {
    const event = this.getEvents().find(e => e.id === eventId);
    if (!event) return 'unpaid';
    return event.paymentStatus || (event.paid ? 'paid' : 'unpaid');
  }

  /* ── Auto-Expiry ─────────────────────────────────────────── */
  isExpired(event) {
    if (!event || !event.startDate) return false;
    const eventDate = new Date(event.startDate);
    const oneDayAfter = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayAfter;
  }

  /* ── Tracker PIN ─────────────────────────────────────────── */
  setTrackerPin(eventId, pin) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.trackerPin = String(pin).trim();
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    }
  }

  getTrackerPin(eventId) {
    const event = this.getEvents().find(e => e.id === eventId);
    return event ? (event.trackerPin || '') : '';
  }
}

export const db = new StorageManager();
