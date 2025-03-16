import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import { sendInvite, fetchInvites, fetchGroupDetails } from '../../api/group';

const GroupDetailScreen = ({ route }) => {
  const { groupId } = route.params;
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const groupData = await fetchGroupDetails(groupId);
      const invitesData = await fetchInvites(groupId);
      setGroup(groupData);
      setInvites(invitesData);
    };
    loadData();
  }, [groupId]);

  const handleSendInvite = async () => {
    await sendInvite(email, groupId);
    setEmail('');
    const invitesData = await fetchInvites(groupId);
    setInvites(invitesData);
  };

  return (
    <View style={styles.container}>
      {group && (
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          <Text style={styles.groupMembers}>Members: {group.members.length}</Text>
        </View>
      )}
      <View style={styles.inviteContainer}>
        <Text style={styles.inviteTitle}>Invite to Group</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSendInvite} style={styles.button}>
          Send Invite
        </Button>
      </View>
      <View style={styles.invitesContainer}>
        <Text style={styles.invitesTitle}>Pending Invites</Text>
        <FlatList
          data={invites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.email}
              description={`Status: ${item.status}`}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 16,
    color: 'gray',
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  invitesContainer: {
    flex: 1,
  },
  invitesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default GroupDetailScreen;