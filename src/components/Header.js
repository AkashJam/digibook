import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../constants";
import SideMenu from "./Modals/SideMenu";

export default function Header({ screen, route }) {
  const [sideMenu, setSideMenu] = useState(false);
  const navigation = useNavigation();
  // console.log(route.name);
  // const route = useRoute();
  // const screen = route.name;
  return (
    <>
      <View style={styles.container}>
        {screen !== "Activity" && (
          <TouchableOpacity
            accessibilityRole="menu"
            onPress={() => setSideMenu(true)}
          >
            <Ionicons name="menu" size={32} color={COLORS.secondary} />
          </TouchableOpacity>
        )}
        {screen === "Activity" && (
          <TouchableOpacity
            accessibilityRole="menu"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={32} color={COLORS.secondary} />
          </TouchableOpacity>
        )}
        <Text style={{ color: COLORS.secondary, marginLeft: 10, fontSize: 18 }}>
          {screen}
        </Text>
      </View>
      {/* {sideMenu && ( */}
        <SideMenu
          screen={screen}
          active={sideMenu}
          toggleSideMenu={setSideMenu}
        />
      {/* )} */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingTop: 45,
    width: "100%",
    backgroundColor: COLORS.primary,
    zIndex: 2,
    height: 80,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  },
});
