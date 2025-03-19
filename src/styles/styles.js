import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
      padding: 16,
    },
    input: {
      marginBottom: 16,
    },
    
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 8,
    },
    email: {
      fontSize: 16,
      color: 'gray',
      marginBottom: 16,
    },
    button: {
      borderColor: '#bb86fc',
      color: '#bb86fc',
    },
});
