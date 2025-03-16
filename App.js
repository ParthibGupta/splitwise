import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';

// Import screens
import GroupsScreen from './src/screens/GroupsScreen';
import GroupDetailScreen from './src/screens/GroupDetailScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Bottom Tab Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GroupsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupsScreen" component={GroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
}

// Main App Flow
export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = 'home-outline';
                } else if (route.name === 'Groups') {
                  iconName = 'people-outline';
                } else if (route.name === 'Profile') {
                  iconName = 'person-circle-outline';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'purple',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: { backgroundColor: 'white' }, // Set tab bar background color
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Groups" component={GroupsStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
