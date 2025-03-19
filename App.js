import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "react-native";
import CustomDarkTheme from "./src/styles/theme";
import { AuthProvider, useAuth } from "./src/components/AuthProvider";
import AuthStack from "./src/navigation/AuthStack";
import BottomTabs from "./src/navigation/NavbarStack";

function RootNavigator() {
  const { currentUser } = useAuth();
  return currentUser ? <BottomTabs /> : <AuthStack />;
}

export default function App() {
  return (
    <PaperProvider theme={CustomDarkTheme}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer theme={NavigationDarkTheme}>
            <StatusBar barStyle="light-content"/>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
