import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { SwipeRow } from "react-native-swipe-list-view";

export default function Card(props) {
  const [active, setActive] = useState(false);
  const [backColor, setColor] = useState(COLORS.primary);
  const [height, setHeight] = useState(0);
  const swipeDist = Dimensions.get("window").width / 4;
  let backCount = 0;

  const swipeEnd = (key, data) => {
    if (data.translateX < -swipeDist) props.deleteTask(props.task.id);
    else if (data.translateX > swipeDist) props.setCompleted(props.task.id);
  };

  function onSwipeValueChange(swipeData) {
    const { value } = swipeData;
    if (Math.abs(value) > swipeDist && active === false) setActive(true);
    else if (Math.abs(value) < swipeDist && active === true) setActive(false);
    let coolers =
      value > 0 ? COLORS.green : value < 0 ? COLORS.red : COLORS.primary;
    if (backColor !== coolers)
      setColor(coolers);
  }

  function NotifyIcon() {
    if (props.task.notify) {
      return (
        <Ionicons
          name="alarm"
          size={28}
          color={active ? COLORS.secondary : COLORS.accent}
        />
      );
    } else {
      return (
        <MaterialIcons
          name="alarm-off"
          size={28}
          color={props.task.notify ? COLORS.accent : COLORS.primary}
        />
      );
    }
  }

  return (
    <SwipeRow
      onSwipeValueChange={onSwipeValueChange}
      friction={100}
      swipeGestureEnded={swipeEnd}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: backColor,
          height: height,
          borderColor: backColor,
        }}
      >
        {backColor === COLORS.green && (
          <Text
            style={{
              ...FONTS.p_regular,
              color: COLORS.secondary,
              paddingHorizontal: SIZES.padding,
            }}
          >
            Completed
          </Text>
        )}
        {backColor === COLORS.red && (
          <Text
            style={{
              ...FONTS.p_regular,
              marginLeft: "auto",
              color: COLORS.accent,
              paddingHorizontal: SIZES.padding,
            }}
          >
            Delete
          </Text>
        )}
      </View>
      <Pressable
        onPress={() => {
          backCount++;
          clearTimeout(backTimer);
          if (backCount === 2) {
            backCount = 0;
            props.setEdit(props.task.id);
          }
          const backTimer = setTimeout(() => {
            if (backCount === 1) {
              props.notifyToggle(props.task.id);
            }
            backCount = 0;
          }, 500);
        }}
      >
        <View
          style={{
            ...styles.container,
            ...SHADOW,
            backgroundColor: active ? COLORS.accent : COLORS.secondary,
            borderColor: active ? COLORS.accent : COLORS.secondary,
          }}
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}
        >
          <Text
            style={{
              ...styles.text,
              textDecorationLine: props.task.completed
                ? "line-through"
                : "none",
              color: active ? COLORS.secondary : COLORS.accent,
            }}
          >
            {props.task.taskName}
          </Text>
          <NotifyIcon />
        </View>
      </Pressable>
    </SwipeRow>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    margin: SIZES.margin,
    borderRadius: SIZES.borderRadius,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 5,
  },
  text: {
    ...FONTS.p_regular,
    paddingRight: 5,
    marginVertical: 5,
    marginHorizontal: SIZES.padding,
    width: "80%",
    textAlign: "justify",
  },
});
