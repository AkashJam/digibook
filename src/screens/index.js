import HomePage from "./HomePage";
import { UserProvider } from "../globalvars";
import AuthPage from "./AuthPage";
import TestPage from "./TestPage";
import ActivityPage from "./ActivityPage";
import CategoryPage from "./CategoryPage";
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
      <Stack.Screen name="Categories" component={CategoryPage} />
      <Stack.Screen name="Activity" component={ActivityPage} />
      {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
    </Stack.Navigator>
  );
}

export default function UI() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </UserProvider>
  );
}
