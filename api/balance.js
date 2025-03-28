import { auth, firestore, functions, httpsCallable } from '../firebase';
import { sendEmail } from '../services/emailService';

import { collection, doc, setDoc, query, where, getDocs, Timestamp, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const getUserBalance = async (groupId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        console.log(token); // Verify the token is generated
      const fetchBalancesByUser = httpsCallable(functions, 'getUserBalance'); 
      const result = await fetchBalancesByUser({token});
      console.log(result)
      return result.data; 
    } catch (error) {
      console.error('Error fetching user balances:', error);
    }
};