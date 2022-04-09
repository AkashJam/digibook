import HomePage from "./HomePage";
import TestPage from "./TestPage";
import AuthPage from "./AuthPage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function StackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthPage} />
      <Stack.Screen name="Home" component={HomePage} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
    </Stack.Navigator>
  );
}

export default function UI() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}
