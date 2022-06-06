import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../../constants";

export default function SideMenu(props) {
  const navigation = useNavigation();
  return (
    // <View style={styles.overlay}>
    <Modal
      animationType="fade"
      transparent={true}
      style={{
        height: Dimensions.get("window").height,
      }}
      visible={props.active}
      onRequestClose={() => props.toggleSideMenu(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          height: "100%",
          width: "100%",
          zIndex: 3,
        }}
        onPress={() => props.toggleSideMenu(false)}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              width: "30%",
              minWidth: 250,
              height: "100%",
              backgroundColor: COLORS.secondary,
              paddingVertical: "20%",
            }}
          >
            <Text
              style={{
                ...styles.headings,
                color:
                  props.screen === "Home" ? COLORS.secondary : COLORS.accent,
                backgroundColor:
                  props.screen === "Home" ? COLORS.primary : COLORS.secondary,
              }}
              onPress={() => {
                if (props.screen !== "Home") navigation.navigate("Home");
                props.toggleSideMenu(false);
              }}
            >
              Home
            </Text>
            <Text
              style={{
                ...styles.headings,
                color:
                  props.screen === "Activities"
                    ? COLORS.secondary
                    : COLORS.accent,
                backgroundColor:
                  props.screen === "Activities"
                    ? COLORS.primary
                    : COLORS.secondary,
              }}
              onPress={() => {
                if (props.screen !== "Activities")
                  navigation.navigate("Categories");
                props.toggleSideMenu(false);
              }}
            >
              Activities
            </Text>
            <Text
              style={{
                ...styles.headings,
                color:
                  props.screen === "Settings"
                    ? COLORS.secondary
                    : COLORS.accent,
                backgroundColor:
                  props.screen === "Settings"
                    ? COLORS.primary
                    : COLORS.secondary,
              }}
              onPress={() => {
                if (props.screen !== "Settings")
                  navigation.navigate("Settings");
                props.toggleSideMenu(false);
              }}
            >
              Settings
            </Text>
            <Text
              style={{
                ...styles.headings,
                color: COLORS.accent,
                backgroundColor: COLORS.secondary,
              }}
              onPress={() => {
                navigation.navigate("Auth");
                props.toggleSideMenu(false);
              }}
            >
              Logout
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
    // </View>
  );
}

const styles = StyleSheet.create({
  headings: {
    paddingHorizontal: "8%",
    paddingVertical: SIZES.padding,
    ...FONTS.h1_bold,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 3,
  },
});
