import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW } from "../../constants";

export default function ControlButton(props) {
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(0);

  const newTask = async () => {
    if (value !== "") {
      setToggle(false);
      props.addTask(value);
      setValue("");
    } else setToggle(false);
  };

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
      <View style={styles.textBoxWrapper}>
        <TextInput
          multiline={true}
          placeholder="Add New Task"
          placeholderTextColor={COLORS.secondary}
          onChangeText={(text) => setValue(text)}
          onContentSizeChange={(event) =>
            setHeight(event.nativeEvent.contentSize.height)
          }
          style={{
            ...styles.textInput,
            height: Math.max(Dimensions.get("window").width / 10, height),
          }}
          value={value}
        />
        <TouchableOpacity style={styles.button} onPress={newTask}>
          <Text style={{ ...FONTS.h1_bold }}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textBoxWrapper: {
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: "5%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  boxWrapper: {
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    right: `-${SIZES.margin}`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: SIZES.padding,
    margin: SIZES.margin,
  },
  textInput: {
    ...SHADOW,
    ...FONTS.p_regular,
    borderRadius: SIZES.textBoxRadius,
    backgroundColor: COLORS.accent,
    height: 44,
    width: "80%",
    color: COLORS.secondary,
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
  },
});
