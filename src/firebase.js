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

// Check if Firebase is configured in the environment
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;

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
    console.error("Firebase initialization failed, falling back to mock mode:", error);
  }
}

// ----------------------------------------------------
// HYBRID FIREBASE / LOCALSTORAGE HELPER METHODS
// ----------------------------------------------------

/**
 * Handle user registration.
 */
export async function dbRegister(email, password, displayName, skateChoice = "Edea Chorus + Coronation Ace") {
  if (isFirebaseConfigured && auth && db) {
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
  } else {
    // LocalStorage mock implementation
    const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
    if (users[email]) {
      throw new Error("auth/email-already-in-use");
    }
    const mockUid = "mock_uid_" + Date.now();
    const newUser = {
      uid: mockUid,
      email: email,
      displayName: displayName,
      skateChoice: skateChoice,
      selectedMovements: [],
      createdAt: new Date().toISOString()
    };
    users[email] = { ...newUser, password }; // store password simple for mock login
    localStorage.setItem("mock_users", JSON.stringify(users));
    localStorage.setItem("mock_current_user", JSON.stringify(newUser));
    return newUser;
  }
}

/**
 * Handle user login.
 */
export async function dbLogin(email, password) {
  if (isFirebaseConfigured && auth && db) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
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
  } else {
    // LocalStorage mock implementation
    const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
    const matchedUser = users[email];
    if (!matchedUser || matchedUser.password !== password) {
      throw new Error("auth/wrong-password-or-user-not-found");
    }
    
    // Remove password before returning
    const { password: _, ...profile } = matchedUser;
    localStorage.setItem("mock_current_user", JSON.stringify(profile));
    return profile;
  }
}

/**
 * Handle user logout.
 */
export async function dbLogout() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem("mock_current_user");
  }
}

/**
 * Listen to auth state changes.
 */
export function subscribeToAuth(callback) {
  if (isFirebaseConfigured && auth && db) {
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
  } else {
    // Static poll check for mock mode
    const checkCurrentUser = () => {
      const stored = localStorage.getItem("mock_current_user");
      callback(stored ? JSON.parse(stored) : null);
    };
    checkCurrentUser();
    // Simulate active listener
    const interval = setInterval(checkCurrentUser, 1500);
    return () => clearInterval(interval);
  }
}

/**
 * Update active user profile.
 */
export async function dbUpdateProfile(uid, updatedProfile) {
  if (isFirebaseConfigured && db) {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, updatedProfile);
    return updatedProfile;
  } else {
    // LocalStorage update
    const currentUser = JSON.parse(localStorage.getItem("mock_current_user") || "{}");
    if (currentUser.uid === uid) {
      const mergedUser = { ...currentUser, ...updatedProfile };
      localStorage.setItem("mock_current_user", JSON.stringify(mergedUser));
      
      // Update entry inside users catalog as well
      const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
      if (users[currentUser.email]) {
        users[currentUser.email] = { ...users[currentUser.email], ...updatedProfile };
        localStorage.setItem("mock_users", JSON.stringify(users));
      }
      return mergedUser;
    }
    return updatedProfile;
  }
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
