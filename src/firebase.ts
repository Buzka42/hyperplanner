
import { initializeApp } from 'firebase/app';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBaVAyAt3GIKkZ_W6eOULq20s_g-KztsBo",
  authDomain: "workout-planner-b5bd6.firebaseapp.com",
  projectId: "workout-planner-b5bd6",
  storageBucket: "workout-planner-b5bd6.firebasestorage.app",
  messagingSenderId: "93180527378",
  appId: "1:93180527378:web:f4b0c339dcef86766669cb"
};

const app = initializeApp(firebaseConfig);

// Disable offline persistence to prevent Opera GX from running in offline mode
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  // Force server-side operations - no local persistence
  experimentalForceLongPolling: true
});

export const auth = getAuth(app);
