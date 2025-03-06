import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJLGskdHVVjmgthZFfeVp0XqBFP6ZnHow",
  authDomain: "interview-prep-platform-ce2a1.firebaseapp.com",
  projectId: "interview-prep-platform-ce2a1",
  storageBucket: "interview-prep-platform-ce2a1.firebasestorage.app",
  messagingSenderId: "199869598719",
  appId: "1:199869598719:web:43975674c2a8175453f5ca",
  measurementId: "G-EG7HP2S0CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage

const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider }; // Export storage
