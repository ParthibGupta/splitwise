import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfsi_4eJnc3VpFA1s8Z8BtNHcSwzxAeE0",
  authDomain: "splitwiser-7c523.firebaseapp.com",
  projectId: "splitwiser-7c523",
  storageBucket: "splitwiser-7c523.appspot.com", // Fixed storageBucket URL
  messagingSenderId: "157902431553",
  appId: "1:157902431553:web:6675ee1fed35b14b71edc0",
  measurementId: "G-XMCMT5QQDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, app, firestore, collection };
