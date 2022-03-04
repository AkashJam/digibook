import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { Card } from "../components";
import { COLORS, SIZES, FONTS } from "../constants";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What to do today...</Text>
      <Card text={"First Task"} />
      <Card text={"First Task"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight + 10,
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
  },
  heading: {
    ...FONTS.h1_bold,
    color: COLORS.accent,
    padding: SIZES.padding,
  },
});
