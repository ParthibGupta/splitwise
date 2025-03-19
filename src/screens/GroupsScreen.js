import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, FAB, List } from 'react-native-paper';
import { fetchGroups, createGroup } from '../../api/group';

const GroupsScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const groupsData = await fetchGroups();
      setGroups(groupsData);
    };
    loadData();
  }, []);

  const handleCreateGroup = async () => {
    await createGroup(groupName);
    setGroupName('');
    setModalVisible(false);
    const groupsData = await fetchGroups();
    setGroups(groupsData);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Members: ${item.members.length}`}
            left={(props) => <List.Icon {...props} icon="group" />}
            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
          />
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Create New Group"
        onPress={() => setModalVisible(true)}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <TextInput
              label="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              mode="outlined"
              style={styles.input}
            />
            <Button mode="outlined" onPress={handleCreateGroup} style={styles.button}>
              Create
            </Button>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#121212',
    color: '#ffffff',
  },
  button: {
    marginTop: 16,
    width: '100%',
    borderColor: '#bb86fc',
    color: '#bb86fc',
  },
  closeButton: {
    marginTop: 16,
  },
  closeButtonText: {
    color: '#bb86fc',
  },
});

export default GroupsScreen;