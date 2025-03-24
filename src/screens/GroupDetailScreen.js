import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";
import { Text, TextInput, Button, List, Snackbar } from "react-native-paper";
import { sendInvite, fetchInvites, fetchGroupDetails } from "../../api/group";

const GroupDetailScreen = ({ route }) => {
  const { groupId, groupName } = route.params;
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [group, setGroup] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // 'success' or 'error'

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
    Keyboard.dismiss();
    const response = await sendInvite(email, groupId, groupName);
    if (response.success) {
      setEmail("");
      setSnackbarMessage("Invite sent successfully!");
      setSnackbarType("success");
      setSnackbarVisible(true);
      const invitesData = await fetchInvites(groupId);
      setInvites(invitesData);
    } else {
      setSnackbarMessage(response.message || "Failed to send invite.");
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
      <View style={styles.inviteContainer}>
        <Text style={styles.inviteTitle}>Invite to Group</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSendInvite}
          style={styles.button}
        >
          Send Invite
        </Button>
      </View>
      <View style={styles.invitesContainer}>
        <Text style={styles.invitesTitle}>Invited</Text>
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

      {/* Snackbar for Feedback */}
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
    padding: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  groupMembers: {
    fontSize: 16,
    color: "gray",
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteTitle: {
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
  invitesContainer: {
    flex: 1,
  },
  invitesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  snackbarSuccess: {
    backgroundColor: "green",
  },
  snackbarError: {
    backgroundColor: "red",
  },
});

export default GroupDetailScreen;
