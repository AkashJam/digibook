import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { SwipeRow } from "react-native-swipe-list-view";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Card, ControlButton, Testcomp } from "../components";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";

export default function AuthPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userColor, setUserColor] = useState(COLORS.primary);
  const [pwdColor, setPwdColor] = useState(COLORS.primary);

  useEffect(() => {
    setTimeout(() => {
      userValidation();
      pwdValidation();
    }, 2000)
  }, [username, password]);

  const userValidation = () => {

    username !== "" ? (username.length < 3 || username.length > 20) ? setUserColor(COLORS.red) : setUserColor(COLORS.green) : setUserColor(COLORS.primary);
  }

  const pwdValidation = () => {
    // if (password.length < 8 || password.length > 20)
    // console.log(password.length)
    password !== "" ? (password.length < 8 || password.length > 20) ? setPwdColor(COLORS.red) : setPwdColor(COLORS.green) : setPwdColor(COLORS.primary);
  }

  return (
    <View
      style={{
        ...PAGE,
        backgroundColor: COLORS.secondary,
        paddingTop: "25%",
        alignItems: "center",
      }}
    >
      <Text style={PAGEHEAD}>Digibook</Text>
      <TextInput
        style={{...styles.textInput, borderColor: userColor}}
        placeholder="Username"
        placeholderTextColor={COLORS.secondary}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={{...styles.textInput, borderColor: pwdColor}}
        placeholder="Password"
        placeholderTextColor={COLORS.secondary}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Pressable
        style={{ ...styles.buttons, backgroundColor: (userColor===COLORS.green && pwdColor===COLORS.green) ? COLORS.primary : COLORS.accent }}
        onPress={props.login}
      >
        <Text style={{ ...FONTS.p_regular }}>LOGIN</Text>
      </Pressable>
      <Pressable style={{ ...styles.buttons, backgroundColor: (userColor===COLORS.green && pwdColor===COLORS.green) ? COLORS.primary : COLORS.accent }}>
        <Text style={{ ...FONTS.p_regular }}>REGISTER</Text>
      </Pressable>
    </View>
  );
}

const styles = new StyleSheet.create({
  textInput: {
    ...FONTS.h2_bold,
    backgroundColor: COLORS.accent,
    width: "100%",
    color: COLORS.secondary,
    marginVertical: 10,
    paddingHorizontal: "10%",
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.textBoxRadius,
    borderWidth: 8,
    // borderColor: COLORS.primary,
  },
  buttons: {
    ...SHADOW,
    width: "50%",
    marginHorizontal: "25%",
    marginTop: "7%",
    padding: SIZES.padding,
    alignItems: "center",
    borderRadius: SIZES.textBoxRadius,
  },
});
