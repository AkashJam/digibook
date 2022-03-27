import { View } from "react-native";
import {
  COLORS,
  SHADOW,
  SIZES,
  FONTS,
  PAGE,
  PAGEHEAD,
} from "../../constants/index";

export default function Reminder() {
  return <View style={styles.modal}></View>;
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
  },
});
