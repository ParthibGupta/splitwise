import React, { useEffect, useState } from "react";
import { Keyboard, View, Text, StyleSheet } from "react-native";
import { Button, List, TextInput, Checkbox, Snackbar } from "react-native-paper";
import { fetchGroupDetailsWithMembers } from "../../api/group";
import { addExpense } from "../../api/expense";

const AddExpenseScreen = ({ route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [involvedMembers, setInvolvedMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // 'success' or 'error'

  // Fetch group details and set the involved members state
  useEffect(() => {
    const loadData = async () => {
      const groupData = await fetchGroupDetailsWithMembers(groupId);
      setGroup(groupData);
      setGroupMembers(groupData.members);
      
      setInvolvedMembers(groupData.members.map(member => member.uid)); 
    };

    loadData();
  }, [groupId]);

  useEffect(() => {
  }, [involvedMembers]);

  const handleCheckboxChange = (memberUid) => {
    if (involvedMembers.includes(memberUid)) {
      setInvolvedMembers(involvedMembers.filter((uid) => uid !== memberUid));  
    } else {
      setInvolvedMembers([...involvedMembers, memberUid]);
    }
  };

  const handleAddExpense = async () => {
    Keyboard.dismiss();
    
    if (amount <= 0) {
      setSnackbarMessage("Please enter a valid amount.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    if (involvedMembers.length === 0) {
      setSnackbarMessage("Atleast one member must be selected");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    
    const response = await addExpense(description, groupId, amount, involvedMembers);
    if (response.success) {
      setSnackbarMessage("Expense added successfully!");
      setSnackbarType("success");
      setSnackbarVisible(true);
      setDescription("");
      setAmount(0);
    } else {
      setSnackbarMessage('Error adding expense: ' + response.message);
      setSnackbarType("error");
      setSnackbarVisible(true);
    }
    
  };

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
          keyboardType="numeric"
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
        <List.Section>
          <List.Accordion
            title="Involved Members"
            left={(props) => (
              <List.Icon {...props} icon="account-details-outline" />
            )}
          >
            {groupMembers.map((member) => (
              <Checkbox.Item
                key={member.uid}
                label={member.name}
                status={involvedMembers.includes(member.uid) ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(member.uid)}
              />
            ))}
          </List.Accordion>
        </List.Section>
      </View>

      <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              style={
                snackbarType === "error"
                  ? styles.snackbarError
                  : styles.snackbarSuccess
              }
            >
              {snackbarMessage}
        </Snackbar>
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
  snackbarSuccess: {
    backgroundColor: "green",
  },
  snackbarError: {
    backgroundColor: "red",
  },
});

export default AddExpenseScreen;
