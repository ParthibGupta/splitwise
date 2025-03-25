import { auth, firestore, functions, httpsCallable } from '../firebase';
import { sendEmail } from '../services/emailService';

import { collection, doc, setDoc, query, where, getDocs, Timestamp, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const sendInvite = async (email, groupId, groupName) => {
  try {
    if (email === auth.currentUser.email) {
      return { success: false, message: "You cannot invite yourself." };
    }

    const invitesRef = collection(firestore, 'invites');
    const q = query(invitesRef, where('email', '==', email), where('groupId', '==', groupId));
    const invitesSnapshot = await getDocs(q);

    if (!invitesSnapshot.empty) {
      return { success: false, message: "This user has already been already invited." };
    }

    const inviteRef = doc(invitesRef);
    await setDoc(inviteRef, {
      email,
      groupId: groupId,
      sender: auth.currentUser.uid,
      status: 'pending',
      createdAt: Timestamp.now(),
      groupName: groupName,
    });

    await sendEmail(email, groupName, 'Group Invite', `You have been invited to join the group - ${groupName} by ${auth.currentUser.displayName}, in Splitwiser. If you're not signed up yet, download Splitwiser to join.`);
    return { success: true, message: "Invite sent successfully!" };
  } catch (error) {
    console.error('Error sending invite:', error.message);
    return { success: false, message: error.message };
  }
};

export const fetchInvites = async (groupId) => {
  try {
    const invitesRef = collection(firestore, 'invites');
    const q = query(invitesRef, where('groupId', '==', groupId));
    const invitesSnapshot = await getDocs(q);
    return invitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching invites:', error);
  }
};

export const fetchGroups = async () => {
  try {
    const groupsRef = collection(firestore, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', auth.currentUser.uid));
    const groupsSnapshot = await getDocs(q);
    return groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

export const createGroup = async (name) => {
  try {
    const groupRef = await addDoc(collection(firestore, 'groups'), {
      name,
      owner: auth.currentUser.uid,
      members: [auth.currentUser.uid],
      invitedUsers: [],
      createdAt: Timestamp.now(),
    });
    return groupRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
  }
};

export const fetchGroupDetails = async (groupId) => {
  try {
    const groupRef = doc(firestore, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    return { id: groupDoc.id, ...groupDoc.data() };
  } catch (error) {
    console.error('Error fetching group details:', error);
  }
};

export const fetchPendingInvites = async (email) => {
  try {
    const invitesRef = collection(firestore, 'invites');
    const q = query(invitesRef, where('email', '==', email), where('status', '==', 'pending'));
    const invitesSnapshot = await getDocs(q);
    return invitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching pending invites:', error);
  }
};

export const acceptInvite = async (inviteId, groupId) => {
  try {
    const inviteRef = doc(firestore, 'invites', inviteId);
    await updateDoc(inviteRef, { status: 'accepted' });
    await addMember(groupId, auth.currentUser.uid);
  } catch (error) {
    console.error('Error accepting invite:', error);
  }
};

export const declineInvite = async (inviteId) => {
  try {
    const inviteRef = doc(firestore, 'invites', inviteId);
    await updateDoc(inviteRef, { status: 'declined' });
  } catch (error) {
    console.error('Error declining invite:', error);
  }
};

export const addMember = async (groupId, memberId) => {
  try {
    const groupRef = doc(firestore, 'groups', groupId);
    console.log('groupRef', groupRef);
    console.log('memberId', memberId);

    await updateDoc(groupRef, {
      members: arrayUnion(memberId),  
      invitedUsers: arrayRemove(memberId) 
    });
  } catch (error) {
    console.error('Error adding member:', error);
  }
}

export const fetchGroupDetailsWithMembers = async (groupId) => {
  try {
    const fetchGroupDetailsFirebase = httpsCallable(functions, 'fetchGroupDetailsWithMembers'); 
    const result = await fetchGroupDetailsFirebase({ groupId: groupId });
    return result.data; 
  } catch (error) {
    console.error('Error fetching group details with members:', error);
  }
};