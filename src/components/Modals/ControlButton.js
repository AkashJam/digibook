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
  Dimensions,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../../constants";

export default function ControlButton(props) {
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(0);

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
          multiline={true}
          placeholder="Add New Task"
          placeholderTextColor={COLORS.secondary}
          onChangeText={(text) => setValue(text)}
          onContentSizeChange={(event) =>
            setHeight(event.nativeEvent.contentSize.height)
          }
          style={{ ...styles.textInput, height: Math.max(Dimensions.get("window").width/10,height)}}
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
    width: Dimensions.get("window").width, //The width does not register screen width at 100%
    position: "absolute",
    bottom: 0,
    // right: `-${SIZES.margin}`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: "5%",
    // margin: SIZES.margin,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  boxWrapper: {
    width: Dimensions.get("window").width, //The width does not register screen width at 100%
    position: "absolute",
    bottom: 0,
    right: `-${SIZES.margin}`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: SIZES.padding,
    margin: SIZES.margin,
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
    ...SHADOW,
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
