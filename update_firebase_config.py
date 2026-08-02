import re

with open('js/firebase-config.js', 'r') as f:
    content = f.read()

# Add getAuth to imports
old_import = """    const { getFirestore }  = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');"""
new_import = """    const { getFirestore }  = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    const { getAuth }       = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');"""
content = content.replace(old_import, new_import)

# Initialize Auth
old_init = """    const app = initializeApp(FIREBASE_SETTINGS.config);
    firestoreDb = getFirestore(app);
    console.log("🔥 Firebase initialized successfully.");
    return firestoreDb;"""
new_init = """    const app = initializeApp(FIREBASE_SETTINGS.config);
    firestoreDb = getFirestore(app);
    firebaseAuth = getAuth(app);
    console.log("🔥 Firebase initialized successfully.");
    return { firestoreDb, firebaseAuth };"""
content = content.replace(old_init, new_init)

# Add firebaseAuth variable and getter
content = content.replace("let firestoreDb = null;", "let firestoreDb = null;\nlet firebaseAuth = null;")
content += "\nexport function getFirebaseAuth() {\n  return firebaseAuth;\n}\n"

with open('js/firebase-config.js', 'w') as f:
    f.write(content)

print("firebase-config.js updated successfully")
