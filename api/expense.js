import { collection, addDoc, Timestamp, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export const addExpense = async (groupId, amount, splitAmong) => {
  try {
    const createdByName = auth.currentUser.displayName;
    if (!createdByName) {
      throw new Error('User display name not found!');
    }
    
    const expensesRef = collection(firestore, `groups/${groupId}/expenses`);
    
    const expenseData = {
      amount,
      splitAmong,
      createdBy: auth.currentUser.uid,
      createdByName,
      createdAt: Timestamp.now(),
      settled: false,
    };

    const expenseRef = await addDoc(expensesRef, expenseData);
    return { success: true, expenseId: expenseRef.id, message: 'Expense added successfully!' };
  } catch (error) {
    console.error('Error adding expense:', error);
    return { success: false, message: error.message };
  }
};

export const getExpenses = async (groupId) => {
  try {
    const expensesRef = collection(firestore, `groups/${groupId}/expenses`);
    const snapshot = await getDocs(expensesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const updateExpense = async (groupId, expenseId, updatedData) => {
  try {
    const expenseRef = doc(firestore, `groups/${groupId}/expenses`, expenseId);
    await updateDoc(expenseRef, updatedData);
    return { success: true, message: 'Expense updated successfully!' };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, message: error.message };
  }
};

export const deleteExpense = async (groupId, expenseId) => {
  try {
    const expenseRef = doc(firestore, `groups/${groupId}/expenses`, expenseId);
    await deleteDoc(expenseRef);
    return { success: true, message: 'Expense deleted successfully!' };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, message: error.message };
  }
};

export const markExpensesSettled = async (groupId, expenseIds) => {
  try {
    const batch = writeBatch(firestore);
    
    expenseIds.forEach(expenseId => {
      const expenseRef = doc(firestore, `groups/${groupId}/expenses`, expenseId);
      batch.update(expenseRef, { settled: true });
    });

    await batch.commit();
    return { success: true, message: 'Expenses marked as settled!' };
  } catch (error) {
    console.error('Error marking expenses as settled:', error);
    return { success: false, message: error.message };
  }
};
