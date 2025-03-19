import { MD3DarkTheme } from "react-native-paper";

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#bb86fc",
    background: "#121212",
    surface: "#1e1e1e",
  },
};

export default CustomDarkTheme;
