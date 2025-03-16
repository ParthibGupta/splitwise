import { doc, collection, addDoc } from "firebase/firestore";

const addExpense = async (groupId, amount, paidBy, splitAmong, description) => {
  try {
    await addDoc(collection(db, `groups/${groupId}/expenses`), {
      amount,
      paidBy,
      splitAmong,
      description,
      createdAt: serverTimestamp(),
    });
    console.log("Expense added!");
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

const getExpenses = async (groupId) => {
    try {
      const snapshot = await getDocs(collection(db, `groups/${groupId}/expenses`));
      const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Expenses:", expenses);
      return expenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  