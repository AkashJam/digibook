import { StyleSheet, View } from "react-native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { HomePage, AuthPage } from "./src/screens"
import { useEffect, useState } from "react";

export default function App() {

  // console.log("Screen Dimensions", Dimensions.get('window'))
  // console.log('statusBarHeight: ', StatBar.currentHeight);
  const [auth, setAuth] = useState(false)

  let [fontsLoaded] = useFonts({
    "Caviar_Dreams_Bold": require("./assets/fonts/CaviarDreams_Bold.ttf"),
    "Fredoka_Regular": require("./assets/fonts/Fredoka-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    if(auth) {
      return (  
        <HomePage logout={()=>setAuth(false)} />
        );
      } else {
        return (  
          <AuthPage login={()=>setAuth(true)}/>
          );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
