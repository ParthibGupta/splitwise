import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError(""); // Reset the error message
    if (!username) {
      setError("Username is required");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      navigation.navigate("Home"); // Redirect to Home after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleSignup} style={styles.button}>
        Sign Up
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
      >
        Already have an account? Log in
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  loginButton: {
    marginTop: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default SignupScreen;
