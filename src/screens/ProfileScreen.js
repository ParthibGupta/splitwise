import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { getUserDetails, updateUserProfilePhoto, signOut } from '../../api/user';
import { styles } from '../styles/styles'


const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetails();
      setUser(userDetails);
      setLoading(false);
    };
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    await signOut();
    console.log("Here")
    navigation.replace('Login'); // Navigate to the login screen after logout
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={
            user.photoURL
            ? { uri: user.photoURL }
            : require("../../assets/user.png")
        }
        style={styles.profilePhoto}
        />
      <Text style={styles.name}>{user.displayName}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

export default ProfileScreen;