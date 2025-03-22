import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Stack.Screen 
        screenOptions={{ headerShown: false }}
        name="AddExpenseScreen" 
        component={AddExpenseScreen} 
        options={{ title: 'Add Expense' , headerShown: false }} 
      />
    </Stack.Navigator>
  );
}