import { getAuth, firestore } from '../firebase';
import { auth } from "../firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getUserDetails = async () => {
  try {
    const user = auth.currentUser;
    return user;

  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

export const signOut = async () => {
    try {
      await auth.signOut();
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
};