import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyg0RCdt1CLBasSwxshsUenXe2FQxdl5s",
  authDomain: "flashgenius-e06dd.firebaseapp.com",
  projectId: "flashgenius-e06dd",
  storageBucket: "flashgenius-e06dd.firebasestorage.app",
  messagingSenderId: "488294594642",
  appId: "1:488294594642:android:fd5c721eab8eff7c3ec78b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize other Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;