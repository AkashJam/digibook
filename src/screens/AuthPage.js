import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";

export default function AuthPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [userColor, setUserColor] = useState(COLORS.primary);
  const [pwdColor, setPwdColor] = useState(COLORS.primary);

  useEffect(() => {
    clearTimeout(backTimer);
    const backTimer = setTimeout(() => {
      userValidation();
    }, 1000);
  }, [username, password]);

  const userValidation = () => {
    let validUser,
      validPwd = false;

    if (username !== "") {
      if (username.length < 3 || username.length > 20) setUserColor(COLORS.red);
      else {
        setUserColor(COLORS.green);
        validUser = true;
      }
    } else setUserColor(COLORS.primary);

    if (password !== "") {
      if (password.length < 8 || password.length > 20) {
        setPwdColor(COLORS.red);
        validPwd = false;
      } else {
        setPwdColor(COLORS.green);
        validPwd = true;
      }
    } else {
      setPwdColor(COLORS.primary);
      validPwd = false;
    }
    if (validUser && validPwd) setAuth(true);
  };

  const login = () => {
    username.length < 3 ||
    username.length > 20 ||
    password.length < 8 ||
    password.length > 20
      ? setAuth(false)
      : setAuth(true);
    if (auth) props.login();
    //else console.log("oops I did it again"); Alert user of invalid username or password
  };

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
        style={{ ...styles.textInput, borderColor: userColor }}
        placeholder="Username"
        placeholderTextColor={COLORS.secondary}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={{ ...styles.textInput, borderColor: pwdColor }}
        placeholder="Password"
        placeholderTextColor={COLORS.secondary}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity
        style={{
          ...styles.buttons,
          backgroundColor: auth ? COLORS.primary : COLORS.accent,
        }}
        onPress={login}
      >
        <Text
          style={{
            ...FONTS.p_regular,
            color: auth ? COLORS.accent : COLORS.secondary,
          }}
        >
          LOGIN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.buttons,
          backgroundColor: auth ? COLORS.primary : COLORS.accent,
        }}
      >
        <Text
          style={{
            ...FONTS.p_regular,
            color: auth ? COLORS.accent : COLORS.secondary,
          }}
        >
          REGISTER
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = new StyleSheet.create({
  textInput: {
    ...FONTS.h2_bold,
    backgroundColor: COLORS.accent,
    width: "100%",
    // color: COLORS.secondary,
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
