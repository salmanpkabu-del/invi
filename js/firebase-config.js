/* ==========================================================================
   CELEBRATI — FIREBASE & OFFLINE PAYMENT CONFIGURATION
   ========================================================================== */

/**
 * FIREBASE CONFIGURATION
 * Set ENABLE_FIREBASE to true after inserting your Firebase project credentials.
 * Firebase is used lightly for real-time RSVP & Wish synchronization.
 */
export const FIREBASE_SETTINGS = {
  ENABLE_FIREBASE: false, // Set to true once credentials below are filled
  config: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};

/**
 * OFFLINE PAYMENT INSTRUCTIONS CONFIG
 * Customers can pay offline via UPI or Bank Transfer, then send payment proof
 * directly via WhatsApp or Email.
 */
export const OFFLINE_PAYMENT_CONFIG = {
  pricePerEvent: "₹699",
  upiId: "celebrati@upi",
  bankDetails: {
    bankName: "HDFC Bank",
    accountName: "Celebrati Event Technologies",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234"
  },
  whatsappNumber: "+919876543210",
  contactEmail: "payments@celebrati.com"
};

/* Firebase SDK Instance Holder */
let firestoreDb = null;
let firebaseAuth = null;

export async function initFirebase() {
  if (!FIREBASE_SETTINGS.ENABLE_FIREBASE) return null;
  if (firestoreDb) return firestoreDb;

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore }  = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    const { getAuth }       = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    const app = initializeApp(FIREBASE_SETTINGS.config);
    firestoreDb = getFirestore(app);
    firebaseAuth = getAuth(app);
    console.log("🔥 Firebase initialized successfully.");
    return { firestoreDb, firebaseAuth };
  } catch (err) {
    console.warn("⚠️ Firebase init failed or offline. Falling back to Local Storage.", err);
    return null;
  }
}

export function getFirestoreDb() {
  return firestoreDb;
}

export function getFirebaseAuth() {
  return firebaseAuth;
}
