import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATX-OMcNCWY_hjbrunoCra4KSUB0CEnps",
  authDomain: "interview-prep-platform-c1f48.firebaseapp.com",
  projectId: "interview-prep-platform-c1f48",
  storageBucket: "interview-prep-platform-c1f48.appspot.com",
  messagingSenderId: "710004831758",
  appId: "1:710004831758:web:d82a86b5ba6856ae7f6e5f",
  measurementId: "G-F89JTMNHS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage

const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider }; // Export storage
