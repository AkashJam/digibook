import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Card(props) {
  const [value, setValue] = useState(props.task.taskName);

  function NotifyIcon() {
    if (props.task.notify) {
      return (
        <Ionicons
          style={{ marginRight: "3%" }}
          name="alarm"
          size={28}
          color={props.isActive ? COLORS.secondary : COLORS.accent}
        />
      );
    } else {
      return (
        <MaterialIcons
          style={{ marginRight: "3%" }}
          name="alarm-off"
          size={28}
          color={
            props.task.notify
              ? COLORS.accent
              : props.isEdit
              ? COLORS.secondary
              : COLORS.primary
          }
        />
      );
    }
  }

  function CardView() {
    if (props.isEdit) {
      return (
        <>
          <TextInput
            style={styles.textInput}
            placeholder="Add New Task"
            placeholderTextColor={COLORS.secondary}
            onChangeText={(text) => setValue(text)}
            value={value}
          />
          <TouchableOpacity onPress={() => props.setCompleted(props.task.id)}>
            <NotifyIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.renameTask(props.task.id, value)}
          >
            <Text style={{ ...FONTS.h1_bold }}>+</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <Text
            style={{
              ...styles.text,
              textDecorationLine: props.task.completed
                ? "line-through"
                : "none",
              color: props.isActive ? COLORS.secondary : COLORS.accent,
            }}
          >
            {props.task.taskName}
          </Text>
          <NotifyIcon />
        </>
      );
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.isEdit
          ? COLORS.primary
          : props.isActive
          ? COLORS.accent
          : COLORS.secondary,
        borderColor: props.task.notify ? COLORS.accent : COLORS.secondary,
      }}
    >
      <CardView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...SHADOW,
    width: "97%",
    overflow: "hidden",
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
    marginVertical: 5,
    marginHorizontal: SIZES.padding,
    width: "88%",
  },
  textBoxWrapper: {
    width: "111%", //The width does not register screen width at 100%
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
  },
  textInput: {
    ...FONTS.h2_bold,
    backgroundColor: COLORS.primary,
    width: "77%",
    color: COLORS.accent,
    marginVertical: 3,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    color: COLORS.primary,
    paddingVertical: 3,
    width: "12%",
  },
});
