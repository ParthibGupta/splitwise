import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { fetchPendingInvites, acceptInvite, declineInvite } from '../../api/group';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/styles';

const GroupInvites = ({ currentUser }) => {
  const [invites, setInvites] = useState([]);

  const loadInvites = async () => {
    const pendingInvites = await fetchPendingInvites(currentUser.email);
    setInvites(pendingInvites);
  };

  useEffect(() => {
    loadInvites();
  }, [currentUser.email]);

  useFocusEffect(
    useCallback(() => {
      loadInvites();
    }, [])
  );

  const handleAccept = async (inviteId, groupId) => {
    await acceptInvite(inviteId, groupId);
    setInvites(invites.filter(invite => invite.id !== inviteId));
  };

  const handleDecline = async (inviteId) => {
    await declineInvite(inviteId);
    setInvites(invites.filter(invite => invite.id !== inviteId));
  };

  return (
    <>
    {invites.length > 0 && <Text style={styles.title}>Group Invites</Text>}
    <FlatList
      data={invites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text style={{ marginBottom: 8, fontSize: 14 }}>You were invited to join the group - {item.groupName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button mode="contained" style={{ flex: 1, marginRight: 8, height: 40 }} onPress={() => handleAccept(item.id, item.groupId)}>Accept</Button>
              <Button mode="outlined" style={{ flex: 1, height: 40 }} onPress={() => handleDecline(item.id)}>Decline</Button>
            </View>
          </Card.Content>
        </Card>
      )}
    />
    </>
  );
};

export default GroupInvites;
