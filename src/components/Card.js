import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";

export default function Card(props) {
  // const [isChecked, setChecked] = useState(props.task.isCompleted);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.isActive ? COLORS.accent : COLORS.secondary,
        borderColor: props.task.notify ? COLORS.accent : COLORS.secondary,
      }}
    >
      <Text
        style={{
          ...styles.text,
          textDecorationLine: props.task.completed ? "line-through" : "none",
          color: props.isActive ? COLORS.secondary : COLORS.accent,
        }}
        // onLongPress={() => props.deleteTask(props.task.id)}
      >
        {props.task.taskName}
      </Text>
      {/* <Checkbox
        style={styles.checkbox}
        value={props.task.completed}
        onValueChange={() => props.setCompleted(props.task.id)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...SHADOW,
    width: "97%",
    paddingVertical: 5,
    paddingHorizontal: SIZES.padding,
    margin: SIZES.margin,
    borderRadius: SIZES.borderRadius,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 5,
  },
  text: {
    ...FONTS.h2_bold,
    flex: 1,
    paddingRight: 5,
  },
  checkbox: {
    height: 26,
    width: 26,
    color: "black",
    borderRadius: SIZES.borderRadius,
    // borderColor: COLORS.accent,
    backgroundColor: COLORS.primary,
    marginLeft: "auto",
  },
});
