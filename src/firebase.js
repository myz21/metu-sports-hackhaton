import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

const requiredFirebaseConfig = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId
};

export const firebaseMissingConfigKeys = Object.entries(requiredFirebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

// Check if Firebase is configured in the environment
export const isFirebaseConfigured = firebaseMissingConfigKeys.length === 0;

let app = null;
let auth = null;
let db = null;
let firebaseInitError = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Set standard session persistence
    setPersistence(auth, browserSessionPersistence).catch((err) => {
      console.warn("Firebase persistence could not be set, falling back to default:", err);
    });
  } catch (error) {
    firebaseInitError = error;
    console.error("Firebase initialization failed:", error);
  }
}

export const isFirebaseReady = isFirebaseConfigured && !!auth && !!db;
export const firebaseStatusMessage = !isFirebaseConfigured
  ? `Firebase config eksik: ${firebaseMissingConfigKeys.join(", ")}`
  : firebaseInitError
    ? `Firebase initialize edilemedi: ${firebaseInitError.message}`
    : "";

function createFirebaseUnavailableError(action) {
  const error = new Error(`${action} su anda kullanilamiyor. ${firebaseStatusMessage || "Firebase auth hazir degil."}`);
  error.code = !isFirebaseConfigured ? "app/firebase-not-configured" : "app/firebase-init-failed";
  return error;
}

// ----------------------------------------------------
// HYBRID FIREBASE / LOCALSTORAGE HELPER METHODS
// ----------------------------------------------------

/**
 * Handle user registration.
 */
export async function dbRegister(email, password, displayName, skateChoice = "Edea Chorus + Coronation Ace") {
  if (!isFirebaseReady) {
    throw createFirebaseUnavailableError("Kayit");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Set display name in auth
  await updateProfile(user, { displayName });
  
  // Save user profile in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const initialProfile = {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    skateChoice: skateChoice,
    selectedMovements: [],
    createdAt: new Date().toISOString()
  };
  await setDoc(userDocRef, initialProfile);
  return initialProfile;
}

/**
 * Handle user login.
 */
export async function dbLogin(email, password) {
  if (!isFirebaseReady) {
    throw createFirebaseUnavailableError("Giris");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Fetch profile
  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }

  // Create user doc if not exists
  const fallbackProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || email.split("@")[0],
    skateChoice: "Edea Chorus + Coronation Ace",
    selectedMovements: [],
    createdAt: new Date().toISOString()
  };
  await setDoc(userDocRef, fallbackProfile);
  return fallbackProfile;
}

/**
 * Handle user logout.
 */
export async function dbLogout() {
  if (!auth) {
    throw createFirebaseUnavailableError("Cikis");
  }

  await signOut(auth);
}

/**
 * Listen to auth state changes.
 */
export function subscribeToAuth(callback) {
  if (!isFirebaseReady) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch profile from firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
            skateChoice: "Edea Chorus + Coronation Ace",
            selectedMovements: [],
            createdAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error("Error fetching user profile:", e);
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0]
        });
      }
    } else {
      callback(null);
    }
  });
}

/**
 * Update active user profile.
 */
export async function dbUpdateProfile(uid, updatedProfile) {
  if (!isFirebaseReady) {
    throw createFirebaseUnavailableError("Profil guncelleme");
  }

  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, updatedProfile);
  return updatedProfile;
}

/**
 * Save music analysis timeline.
 */
export async function dbSaveMusicAnalysis(uid, analysisData) {
  const analysisObj = {
    ...analysisData,
    uid,
    createdAt: new Date().toISOString()
  };
  
  if (isFirebaseConfigured && db) {
    const collectionRef = collection(db, "music_analyses");
    const docRef = await addDoc(collectionRef, analysisObj);
    return { ...analysisObj, id: docRef.id };
  } else {
    const localHistory = JSON.parse(localStorage.getItem(`mock_music_${uid}`) || "[]");
    const id = "mock_music_" + Date.now();
    const withId = { ...analysisObj, id };
    localHistory.push(withId);
    localStorage.setItem(`mock_music_${uid}`, JSON.stringify(localHistory));
    return withId;
  }
}

/**
 * Get music analyses for specific athlete.
 */
export async function dbGetMusicAnalyses(uid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, "music_analyses"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem(`mock_music_${uid}`) || "[]");
  }
}

/**
 * Save video analysis result.
 */
export async function dbSaveVideoAnalysis(uid, videoAnalysis) {
  const videoObj = {
    ...videoAnalysis,
    uid,
    createdAt: new Date().toISOString()
  };
  
  if (isFirebaseConfigured && db) {
    const collectionRef = collection(db, "video_analyses");
    const docRef = await addDoc(collectionRef, videoObj);
    return { ...videoObj, id: docRef.id };
  } else {
    const localHistory = JSON.parse(localStorage.getItem(`mock_video_${uid}`) || "[]");
    const id = "mock_video_" + Date.now();
    const withId = { ...videoObj, id };
    localHistory.push(withId);
    localStorage.setItem(`mock_video_${uid}`, JSON.stringify(localHistory));
    return withId;
  }
}

/**
 * Get video analyses for specific athlete.
 */
export async function dbGetVideoAnalyses(uid) {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, "video_analyses"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return JSON.parse(localStorage.getItem(`mock_video_${uid}`) || "[]");
  }
}

export { auth, db };
