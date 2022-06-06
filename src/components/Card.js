import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeRow } from "react-native-swipe-list-view";

export default function Card(props) {
  const [height, setHeight] = useState(0);
  const swipeDist = Dimensions.get("window").width / 4;
  const [backColor, setColor] = useState(COLORS.primary);
  const [notify, setNotify] = useState(props.task.notify);
  const [active, setActive] = useState(false);

  let backCount = 0;
  const cardPress = () => {
    backCount++;
    clearTimeout(backTimer);
    if (backCount === 2) {
      backCount = 0;
      props.setEdit(props.task.id);
    }
    const backTimer = setTimeout(() => {
      if (backCount === 1) {
        props.notifyToggle(props.task.id, !notify);
        setNotify(!notify);
      }
      backCount = 0;
    }, 500);
  };

  const swipeEnd = (key, data) => {
    if (data.translateX < -swipeDist) props.deleteTask(props.task.id);
    else if (data.translateX > swipeDist)
      setTimeout(() => {
        if (notify && !props.task.completed)
          props.notifyToggle(props.task.id, !notify);
        props.setCompleted(props.task.id, !props.task.completed);
      }, 500);
  };

  function onSwipeValueChange(swipeData) {
    const { value } = swipeData;
    if (Math.abs(value) > swipeDist && active === false) setActive(true);
    else if (Math.abs(value) < swipeDist && active === true) setActive(false);
    let coolers =
      value > 0
        ? props.task.completed
          ? COLORS.orange
          : COLORS.green
        : value < 0
        ? COLORS.red
        : COLORS.primary;
    if (backColor !== coolers) setColor(coolers);
  }

  function NotifyIcon() {
    return (
      <MaterialCommunityIcons
        name={props.task.notify ? "bell" : "bell-off"}
        size={FONTS.h1_bold.fontSize}
        color={props.task.notify ? COLORS.accent : COLORS.primary}
      />
    );
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
          height: height,
          backgroundColor: backColor,
          borderColor: backColor,
        }}
      >
        {(backColor === COLORS.green || backColor === COLORS.orange) && (
          <Text style={styles.left}>
            {props.task.completed ? "Incomplete" : "Completed"}
          </Text>
        )}
        {backColor === COLORS.red && <Text style={styles.right}>Delete</Text>}
      </View>
      <Pressable onPress={cardPress}>
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
            {props.task.description}
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
  left: {
    ...FONTS.p_regular,
    color: COLORS.secondary,
    paddingHorizontal: SIZES.padding,
  },
  right: {
    ...FONTS.p_regular,
    marginLeft: "auto",
    color: COLORS.accent,
    paddingHorizontal: SIZES.padding,
  },
});
