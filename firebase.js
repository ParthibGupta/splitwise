import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfsi_4eJnc3VpFA1s8Z8BtNHcSwzxAeE0",
  authDomain: "splitwiser-7c523.firebaseapp.com",
  projectId: "splitwiser-7c523",
  storageBucket: "splitwiser-7c523.firebasestorage.app",
  messagingSenderId: "157902431553",
  appId: "1:157902431553:web:6675ee1fed35b14b71edc0",
  measurementId: "G-XMCMT5QQDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, app, firestore, collection };
