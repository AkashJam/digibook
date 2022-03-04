import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { HomePage } from "./src/screens"
// import { Dimensions, StatusBar } from 'react-native'

export default function App() {

  // console.log("Screen Dimensions", Dimensions.get('window'))
  // console.log('statusBarHeight: ', StatBar.currentHeight);

  let [fontsLoaded] = useFonts({
    "Caviar_Dreams_Bold": require("./assets/fonts/CaviarDreams_Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      // <View style={styles.container}>
      //   <Text style={{...FONTS.h1_bold}}>yo!</Text>
      //   <StatusBar style="auto" />
      // </View>
      <HomePage />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
