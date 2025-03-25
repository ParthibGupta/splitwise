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