import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GroupsScreen from "../screens/GroupsScreen";
import GroupDetailScreen from "../screens/GroupDetailScreen";

const Stack = createStackNavigator();

export default function GroupsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GroupsScreen"
        component={GroupsScreen}
        options={{ title: "Groups" }}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: "Groups" }}
      />
    </Stack.Navigator>
  );
}
