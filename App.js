import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import UI from "./src/screens";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  // console.log("Screen Dimensions", Dimensions.get('window'))
  // console.log('statusBarHeight: ', StatBar.currentHeight);

  let [fontsLoaded] = useFonts({
    Caviar_Dreams_Bold: require("./assets/fonts/CaviarDreams_Bold.ttf"),
    Fredoka_Regular: require("./assets/fonts/Fredoka-Regular.ttf"),
  });

  if (!fontsLoaded) return <AppLoading />;
  else
    return (
      //toast wrapper
      <RootSiblingParent>
        <UI />
      </RootSiblingParent>
    );
}
