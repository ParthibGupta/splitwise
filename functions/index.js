const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const region = 'australia-southeast1';

exports.getUserById = onRequest({ region }, async (req, res) => {
  const userId = req.query.userId; 
  try {
    const userRecord = await getAuth().getUser(userId);
    res.status(200).send(userRecord.toJSON());
  } catch (error) {
    res.status(400).send('Error getting user data: ' + error.message);
  }
});

exports.fetchGroupDetailsWithMembers = onCall({ region }, async (request) => {

  //console.log("Received data on server-side:", JSON.stringify(data));
  const groupId = request.data.groupId; // Group ID passed as data
  console.log('Group ID:', groupId);
  if (!groupId) {
    throw new HttpsError('invalid-argument', 'Group ID is required.');
  }

  try {
    const groupRef = getFirestore().collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      throw new HttpsError('not-found', 'Group not found.');
    }

    const groupData = groupDoc.data();
    const memberUids = groupData.members || [];

    const memberNames = await Promise.all(
      memberUids.map(async (uid) => {
        try {
          const userRecord = await getAuth().getUser(uid); 
          return { uid, name: userRecord.displayName || 'Unknown User' }; 
        } catch (error) {
          console.error('Error fetching user data for UID:', uid, error);
          return { uid, name: 'Unknown User' }; 
        }
      })
    );

    return {
      groupId: groupDoc.id,
      name: groupData.name,
      members: memberNames,
      createdAt: groupData.createdAt,
    };

  } catch (error) {
    console.error('Error fetching group details with members:', error);
    throw new HttpsError('internal', 'Error fetching group details.');
  }
});

exports.calculateGroupBalances = onCall({ region },async (data, context) => {
    try {
        const { groupId } = data;
        if (!groupId) {
            throw new HttpsError("invalid-argument", "groupId is required");
        }

        const expensesSnapshot = await admin.firestore()
            .collection("groups")
            .doc(groupId)
            .collection("expenses")
            .get();

        if (expensesSnapshot.empty) {
            return { message: "No expenses found", balances: {} };
        }

        let balances = {};

        expensesSnapshot.forEach(doc => {
            const expense = doc.data();
            const totalAmount = parseFloat(expense.amount);
            const payer = expense.createdBy;
            const participants = expense.splitAmong;
            const share = totalAmount / participants.length;

            participants.forEach(userId => {
                if (userId !== payer) {
                    if (!balances[userId]) balances[userId] = {};
                    if (!balances[userId][payer]) balances[userId][payer] = 0;
                    balances[userId][payer] += share;
                }
            });
        });

        return { balances };
    } catch (error) {
        console.error("Error calculating balances:", error);
        throw new HttpsError("internal", "Error calculating balances");
    }
});


exports.getUserBalance = onCall({ region }, async (data, context) => {
    try {
        const userId = await getAuth().getUser();
        if (!userId) {
            throw new HttpsError("unauthenticated", "User must be authenticated");
        }
        
        
        const groupsSnapshot = await admin.firestore().collection("groups").get();
        if (groupsSnapshot.empty) {
            return { message: "No groups found", totalBalance: 0, groupBalances: [] };
        }

        let totalBalance = 0;
        let groupBalances = [];

        for (const groupDoc of groupsSnapshot.docs) {
            const groupId = groupDoc.id;
            const groupName = groupDoc.data().name;
            let groupBalance = 0;

            const expensesSnapshot = await admin.firestore()
                .collection("groups")
                .doc(groupId)
                .collection("expenses")
                .get();

            expensesSnapshot.forEach(doc => {
                const expense = doc.data();
                const totalAmount = parseFloat(expense.amount);
                const payer = expense.createdBy;
                const participants = expense.splitAmong;
                const share = totalAmount / participants.length;

                if (participants.includes(userId) && userId !== payer) {
                    groupBalance -= share;
                }
                if (payer === userId) {
                    groupBalance += totalAmount - share;
                }
            });

            if (groupBalance !== 0) {
                groupBalances.push({ groupId, groupName, balance: groupBalance });
                totalBalance += groupBalance;
            }
        }

        return { totalBalance, groupBalances };
    } catch (error) {
        console.error("Error calculating user balance:", error);
        throw new HttpsError("internal", "Error calculating user balance");
    }
});
