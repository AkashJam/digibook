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
// import { Notify } from "./index";
import { SwipeRow } from "react-native-swipe-list-view";

export default function Card(props) {
  const [value, setValue] = useState(props.task.taskName);
  const [active, setActive] = useState(false);
  const [backColor, setColor] = useState({
    backgroundColor: "rgb(0, 166, 251)",
  });
  const [height, setHeight] = useState(0);
  const [notify, setNotify] = useState(false);
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
      value > 0 ? COLORS.green : value < 0 ? COLORS.red : "rgb(0, 166, 251)";
    if (backColor.backgroundColor !== coolers)
      setColor({ backgroundColor: coolers });
  }

  function NotifyIcon() {
    if (props.edit) {
      return (
        <>
          <MaterialCommunityIcons
            style={{ marginRight: "3%" }}
            name="calendar-clock"
            size={28}
            color={props.task.notify ? COLORS.accent : COLORS.secondary}
          />
          {/* <MaterialCommunityIcons
            style={{ marginRight: "3%" }}
            name="calendar-clock"
            size={28}
            color={props.task.notify ? COLORS.accent : COLORS.secondary}
          /> */}
        </>
      );
    } else {
      if (props.task.notify) {
        return (
          <Ionicons
            style={{ width: "9%", marginRight: "3%" }}
            name="alarm"
            size={28}
            color={active ? COLORS.secondary : COLORS.accent}
          />
        );
      } else {
        return (
          <MaterialIcons
            style={{ width: "9%", marginRight: "3%" }}
            name="alarm-off"
            size={28}
            color={
              props.task.notify
                ? COLORS.accent
                : props.edit
                ? COLORS.secondary
                : COLORS.primary
            }
          />
        );
      }
    }
  }

  const handleClose = () => setNotify(false);

  if (props.edit) {
    return (
      <>
        {/* {notify && <Notify close={handleClose} />} */}
        <View
          style={{
            ...styles.container,
            ...SHADOW,
            backgroundColor: COLORS.accent,
            borderColor: props.task.notify ? COLORS.accent : COLORS.secondary,
          }}
        >
          <TextInput
            multiline={true}
            placeholder="Add New Task"
            placeholderTextColor={COLORS.secondary}
            onChangeText={(text) => setValue(text)}
            onContentSizeChange={(event) => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              ...styles.textInput,
              height: height,
            }}
            value={value}
          />
          <TouchableOpacity onPress={() => setNotify(true)}>
            <NotifyIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.button,
              height: height,
            }}
            onPress={() => {
              if (value !== "") {
                props.renameTask(props.task.id, value);
                setValue(props.task.taskName);
              }
              props.setEdit(0);
            }}
          >
            <Text style={{ ...FONTS.h1_bold, color: COLORS.accent }}>+</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  } else {
    return (
      <SwipeRow
        onSwipeValueChange={onSwipeValueChange}
        friction={100}
        swipeGestureEnded={swipeEnd}
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
            // activeOpacity={1}
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
                backgroundColor: props.edit
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
    ...FONTS.p_regular,
    // flex: 1,
    paddingRight: 5,
    marginVertical: 5,
    marginHorizontal: SIZES.padding,
    width: "80%",
    // textAlign: "justify",
  },
  textInput: {
    ...FONTS.h2_bold,
    // backgroundColor: COLORS.accent,
    width: "73%",
    // flex: 1,
    color: COLORS.secondary,
    // paddingRight: 5,
    paddingVertical: SIZES.margin,
    marginLeft: SIZES.padding,
    // textAlign: "justify",
  },
  button: {
    alignItems: "center",
    // alignContent: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    // paddingVertical: 3,
    width: "12%",
    // height: "100%"
  },
});
