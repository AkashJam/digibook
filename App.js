import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { HomePage, AuthPage, TestPage } from "./src/screens";
import { useState } from "react";

export default function App() {
  // console.log("Screen Dimensions", Dimensions.get('window'))
  // console.log('statusBarHeight: ', StatBar.currentHeight);
  const [auth, setAuth] = useState(false);

  let [fontsLoaded] = useFonts({
    Caviar_Dreams_Bold: require("./assets/fonts/CaviarDreams_Bold.ttf"),
    Fredoka_Regular: require("./assets/fonts/Fredoka-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    if (auth) {
      // return <TestPage />;
      return <HomePage logout={() => setAuth(false)} />;
    } else {
      return <AuthPage login={() => setAuth(true)} />;
    }
  }
}
