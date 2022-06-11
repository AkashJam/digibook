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

  const pages = ["Home", "Categories", "Settings"];

  const navigate = (screen) => {
    props.toggleSideMenu(false);
    if (screen !== props.screen) navigation.navigate(screen);
  };

  const Options = () => {
    return pages.map((page) => {
      return (
        <Text
          style={{
            ...styles.headings,
            color: props.screen === page ? COLORS.secondary : COLORS.accent,
            backgroundColor:
              props.screen === page ? COLORS.primary : COLORS.secondary,
          }}
          onPress={() => navigate(page)}
        >
          {page}
        </Text>
      );
    });
  };

  return (
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
        style={styles.background}
        onPress={() => props.toggleSideMenu(false)}
      >
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <Options />
            <Text
              style={{
                ...styles.headings,
                color: COLORS.accent,
                backgroundColor: COLORS.secondary,
              }}
              onPress={() => navigate("Auth")}
            >
              Logout
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    width: "100%",
    zIndex: 3,
  },
  container: {
    width: "30%",
    minWidth: 250,
    height: "100%",
    backgroundColor: COLORS.secondary,
    paddingVertical: "20%",
  },
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
