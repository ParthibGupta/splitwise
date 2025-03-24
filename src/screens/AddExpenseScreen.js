import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, List, TextInput, Checkbox } from "react-native-paper";
import { fetchGroupDetails } from "../../api/group";
import { FlatList } from "react-native-gesture-handler";

const AddExpenseScreen = ({ route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const groupData = await fetchGroupDetails(groupId);
      setGroup(groupData);
      setGroupMembers(group.members);
    };
    loadData();
  }, [groupId]);

  const handleAddExpense = async () => {};

  return (
    <View style={styles.container}>
      {group && (
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          <Text style={styles.groupMembers}>
            Members: {group.members.length}
          </Text>
        </View>
      )}
      <View style={styles.addExpenseContainer}>
        <Text style={styles.addExpenseTitle}>Add Expense</Text>
        <TextInput
          label="Description"
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Amount"
          onChangeText={setAmount}
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleAddExpense}
          style={styles.button}
        >
          Add
        </Button>
      </View>
      <View>
        <Text style={styles.addExpenseTitle}>Involved Members</Text>
        <List.Section>
          <List.Accordion
            title="Involved Members"
            left={(props) => (
              <List.Icon {...props} icon="account-details-outline" />
            )}
          >
            {groupMembers.map((member, index) => (
              // <List.Item
              //   key={member}
              //   title={member}
              //   right={(props) => (
              //     <List.Icon {...props} icon="checkbox-marked-circle" />
              //   )}
              // />
              <Checkbox.Item key={member} label={member} status="checked" />
            ))}
          </List.Accordion>
        </List.Section>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 16,
    color: "gray",
  },
  addExpenseContainer: {
    marginBottom: 16,
  },
  addExpenseTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default AddExpenseScreen;
