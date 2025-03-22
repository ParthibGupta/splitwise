import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { useAuth } from '../components/AuthProvider';
import { styles } from '../styles/styles';
import GroupInvites from '../components/GroupInvites';
import { fetchGroups } from '../../api/group';


const HomeScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getGroups = async () => {
      const fetchedGroups = await fetchGroups();
      setGroups(fetchedGroups);
      setFilteredGroups(fetchedGroups);
    };
    getGroups();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleGroupSelect = (groupId) => {
    setIsModalVisible(false);
    navigation.navigate('AddExpenseScreen', { groupId });
  };

  const renderGroup = ({ item }) => (
    <Card style={{ marginBottom: 10, padding: 15, backgroundColor: '#333', borderRadius: 10 }} onPress={() => handleGroupSelect(item.id)}>
      <Text style={{ color: 'white' }}>{item.name}</Text>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GroupInvites currentUser={currentUser} />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setIsModalVisible(true)}
        label="Add Expense"
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#1c1c1c', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
            <TextInput
              placeholder="Search Groups" placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor: '#333', color: 'white', borderColor: '#555' }}
            />
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item.id}
              renderItem={renderGroup}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={{ color: '#ff6666', textAlign: 'center', marginVertical: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
