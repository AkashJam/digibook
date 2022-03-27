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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { SwipeRow } from "react-native-swipe-list-view";

export default function Card(props) {
  const [value, setValue] = useState(props.task.taskName);
  const [edit, setEdit] = useState(false);
  const [active, setActive] = useState(false);
  const [backColor, setColor] = useState({
    backgroundColor: "rgb(0, 166, 251)",
  });
  const [height, setHeight] = useState(0);
  const swipeDist = Dimensions.get("window").width / 2.5;
  let backCount = 0;

  const swipeEnd = (key, data) => {
    if (data.translateX < -swipeDist) props.deleteTask(props.task.id);
    else if (data.translateX > swipeDist) props.setCompleted(props.task.id);
    // setActive(false);
  };

  const swipeBegin = (key, data) => {
    // setActive(true);
  };

  // get colors rgba
  // let green = COLORS.green.substring(4).slice(0, -1).split(",")
  // let red = COLORS.red.substring(4).slice(0, -1).split(",")
  // console.log(green,red)

  //rgb(0, 166, 251) blue
  //rgb(246,240,237) white to rgb(246,81,29)red or green
  function onSwipeValueChange(swipeData) {
    const { value } = swipeData;
    if (Math.abs(value) > swipeDist && active === false) setActive(true);
    else if (Math.abs(value) < swipeDist && active === true) setActive(false);
    let coolers =
      value > 0 ? COLORS.green : value < 0 ? COLORS.red : "rgb(0, 166, 251)";
    if (backColor.backgroundColor !== coolers)
      setColor({ backgroundColor: coolers });
    // let r =
    //   value < 0
    //     ? Math.round(
    //         Math.min(value / (-swipeDist), 1) * 255
    //       )
    //     : 0;
    // let g =
    //   value < 0
    //     ? 166 +
    //       Math.round(
    //         Math.max(value / (swipeDist), -1) * 166
    //       )
    //     : 166 +
    //       Math.round(
    //         Math.min(value / (swipeDist), 1) * 89
    //       );
    // let b =
    //   251 -
    //   Math.round(
    //     Math.min(Math.abs(value) / (swipeDist), 1) *
    //       251
    //   );
    // let a = Math.min(Math.abs(value / (swipeDist)), 1);
    // if (backColor.backgroundColor !== `rgb(${r},${g},${b})`) {
    //   setColor({ backgroundColor: `rgb(${r},${g},${b})` });
    // }
  }

  function NotifyIcon() {
    if (props.task.notify) {
      return (
        <Ionicons
          style={{ marginRight: "3%" }}
          name="alarm"
          size={28}
          color={active ? COLORS.secondary : COLORS.accent}
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
              : edit
              ? COLORS.secondary
              : COLORS.primary
          }
        />
      );
    }
  }

  if (edit) {
    return (
      <View
        style={{
          ...styles.container,
          ...SHADOW,
          backgroundColor: edit
            ? COLORS.primary
            : active
            ? COLORS.accent
            : COLORS.secondary,
          borderColor: props.task.notify ? COLORS.accent : COLORS.secondary,
        }}
      >
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
          onPress={() => {
            props.renameTask(props.task.id, value);
            setEdit(false);
          }}
        >
          <Text style={{ ...FONTS.h1_bold }}>+</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <SwipeRow
        onSwipeValueChange={onSwipeValueChange}
        friction={100}
        swipeGestureEnded={swipeEnd}
        swipeGestureBegan={swipeBegin}
      >
        <View
          style={{
            ...styles.container,
            ...backColor,
            height: height - 15,
            borderWidth: 0,
            borderColor: "none",
            // justifyContent:'space-between'
            // marginVertical: SIZES.padding,
          }}
        >
          {backColor.backgroundColor === COLORS.green && (
            <Text
              style={{ ...FONTS.p_regular, paddingHorizontal: SIZES.padding }}
            >
              Completed
            </Text>
          )}
          {backColor.backgroundColor === COLORS.red && (
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
        <View
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}
        >
          <Pressable
            onPress={() => {
              backCount++;
              clearTimeout(backTimer);
              if (backCount === 2) {
                backCount = 0;
                setEdit(true);
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
                backgroundColor: edit
                  ? COLORS.primary
                  : active
                  ? COLORS.accent
                  : COLORS.secondary,
                borderColor: active ? COLORS.accent : COLORS.secondary,
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
        </View>
      </SwipeRow>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
