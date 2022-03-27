import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../../constants";

export default function ControlButton(props) {
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState("");

  function newTask() {
    setToggle(false);
    props.addTask(value);
    setValue("");
  }

  if (!toggle) {
    return (
      <View style={styles.boxWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => setToggle(true)}>
          <Text style={{ ...FONTS.h1_bold }}>+</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      // <View style={{}}>
        <View style={styles.textBoxWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Add New Task"
            placeholderTextColor={COLORS.secondary}
            onChangeText={(text) => setValue(text)}
            value={value}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => (value === "" ? setToggle(false) : newTask())}
          >
            <Text style={{ ...FONTS.h1_bold }}>+</Text>
          </TouchableOpacity>
        </View>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  textBoxWrapper: {
    width: "110%", //The width does not register screen width at 100%
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6%",
    // margin: SIZES.margin,
    backgroundColor: COLORS.primary,
  },
  boxWrapper: {
    width: "111%", //The width does not register screen width at 100%
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: SIZES.padding,
    // backgroundColor: COLORS.secondary,
  },
  textInput: {
    ...SHADOW,
    ...FONTS.p_regular,
    borderRadius: SIZES.textBoxRadius,
    backgroundColor: COLORS.accent,
    height: 44,
    width: "80%",
    color: COLORS.secondary,
    // marginVertical: SIZES.margin,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    color: COLORS.primary,
    height: 44,
    width: 44,
    borderRadius: SIZES.textBoxRadius,
    // marginVertical: SIZES.margin,
  },
});
