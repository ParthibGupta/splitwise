import { auth, firestore } from '../firebase';
import { sendEmail } from '../services/emailService';
import { collection, doc, setDoc, query, where, getDocs, Timestamp, addDoc, getDoc } from 'firebase/firestore';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';

// Import screens
import GroupsScreen from '../src/screens/GroupsScreen';
import GroupDetailScreen from '../src/screens/GroupDetailScreen';
import HomeScreen from '../src/screens/HomeScreen';
import ProfileScreen from '../src/screens/ProfileScreen';

// Bottom Tab Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GroupsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = 'home-outline';
                  } else if (route.name === 'Groups') {
                    iconName = 'people-outline';
                  } else if (route.name === 'Profile') {
                    iconName = 'person-circle-outline';
                  }
                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'white' }, // Set tab bar background color
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Groups" component={GroupsStack} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export const sendInvite = async (email, groupId) => {
  try {
    const inviteRef = doc(collection(firestore, 'invites'));
    await setDoc(inviteRef, {
      email,
      groupId: groupId,
      sender: auth.currentUser.uid,
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    await sendEmail(email, 'Group Invite', `You have been invited to join a group. If you're not signed up yet, download Splitwiser to join.`);
  } catch (error) {
    console.error('Error sending invite:', error);
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