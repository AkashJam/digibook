import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { COLORS, SIZES, FONTS } from "../constants";

export default function Card(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
      <Checkbox style={styles.checkbox} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "97%",
    paddingVertical: 5,
    paddingHorizontal: SIZES.padding,
    margin: SIZES.margin,
    borderRadius: SIZES.borderRadius,
    elevation: 12,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 2, height: 12 },
    shadowRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  text: {
    ...FONTS.h2_bold,
    color: COLORS.primary,
  },
  checkbox: {
    height: 26,
    width: 26,
    color: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primary,
    marginLeft: "auto",
  },
});
