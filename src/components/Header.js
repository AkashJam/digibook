import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants";

export default function Header({ screen }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {screen !== "Activity" && (
        <TouchableOpacity
          onPress={() =>
            screen === "Home"
              ? navigation.navigate("Categories")
              : navigation.navigate("Home")
          }
        >
          <Ionicons name="menu" size={32} color={COLORS.secondary} />
        </TouchableOpacity>
      )}
      {screen === "Activity" && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color={COLORS.secondary} />
        </TouchableOpacity>
      )}
      {/* <Pressable onPress={()=> console.log("hello")}> */}
      <Text style={{ color: COLORS.secondary, marginLeft: 10, fontSize: 18 }}>
        {screen}
      </Text>
      {/* </Pressable> */}
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingTop: 48,
    // top: 0,
    // left: 0,
    width: "100%",
    backgroundColor: COLORS.primary,
    zIndex: 2,
    height: 86,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    // justifyContent: "space-between",
  },
});
