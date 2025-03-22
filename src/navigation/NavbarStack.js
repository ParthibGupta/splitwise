import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import GroupsStack from "./GroupsStack";
import HomeStack from "./HomeStack";
import ProfileScreen from "../screens/ProfileScreen";
import CustomDarkTheme from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home-outline",
            Groups: "people-outline",
            Profile: "person-circle-outline",
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: CustomDarkTheme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: CustomDarkTheme.colors.background },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
