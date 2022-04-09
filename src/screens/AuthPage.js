import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD, TOAST } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalvars } from "../globalvars";

export default function AuthPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [canRegister, setCanRegister] = useState(false);
  const [canLogin, setCanLogin] = useState(false);

  const [userColor, setUserColor] = useState(COLORS.primary);
  const [pwdColor, setPwdColor] = useState(COLORS.primary);

  const userValidation = () => {
    let validUser,
      validPwd = false;

    //Border validation
    if (username !== "") {
      if (username.length < 3 || username.length > 20) setUserColor(COLORS.red);
      else {
        setUserColor(COLORS.green);
        validUser = true;
      }
    } else setUserColor(COLORS.primary);

    if (password !== "") {
      if (password.length < 8 || password.length > 20) setPwdColor(COLORS.red);
      else {
        setPwdColor(COLORS.green);
        validPwd = true;
      }
    } else setPwdColor(COLORS.primary);

    //Button validation
    if (validUser && validPwd) {
      setCanLogin(true);
      setCanRegister(true);
    } else {
      setCanLogin(false);
      setCanRegister(false);
    }
  };

  const login = async () => {
    const check = setTimeout(() => {
      // Add notification that user does not exist and you can create a user with that name
      globalvars.toast("User does not exist.", 5000);
      setCanLogin(false);
    }, 5000); //Timeout if no reseponse for 5 sec

    //Need to check with api if user exists and login else
    const user = await AsyncStorage.getItem(username); //Check local storage for user

    if (user !== null) {
      clearTimeout(check);
      //if wrong password
      if (password !== user) {
        setCanLogin(false);
        setCanRegister(false);
        setUserColor(COLORS.red);
        setPwdColor(COLORS.red);
        globalvars.toast("Wrong username or password.", 5000);
      } else navigation.navigate('Home');
    }
  };

  const register = async () => {
    const check = setTimeout(async () => {
      console.log("registering");
      try {
        console.log("saving");
        await AsyncStorage.setItem(username, password);
        setCanRegister(false);
        setCanLogin(true);
        console.log("saved");
      } catch (e) {
        console.log("saving error");
      }
    }, 5000);

    //Need to check with api if user exists and login else
    const user = await AsyncStorage.getItem(username); //Check local storage for user
    //if user exists
    if (user !== null) {
      clearTimeout(check);
      //Notification that username exists
      globalvars.toast("Username already exists.", 5000);
      setCanRegister(false);
    }
  };

  useEffect(() => {
    userValidation(); //Set highlight of border and buttons
  }, [username, password]);

  return (
    <View
      style={{
        ...PAGE,
        backgroundColor: COLORS.secondary,
        paddingTop: "25%",
        alignItems: "center",
      }}
    >
      <Text style={PAGEHEAD}>Digital Notebook</Text>
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
        disabled={!canLogin}
        style={{
          ...styles.buttons,
          backgroundColor: canLogin ? COLORS.primary : COLORS.accent,
        }}
        onPress={login}
      >
        <Text
          style={{
            ...FONTS.p_regular,
            color: canLogin ? COLORS.accent : COLORS.secondary,
          }}
        >
          LOGIN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!canRegister}
        style={{
          ...styles.buttons,
          backgroundColor: canRegister ? COLORS.primary : COLORS.accent,
        }}
        onPress={register}
      >
        <Text
          style={{
            ...FONTS.p_regular,
            color: canRegister ? COLORS.accent : COLORS.secondary,
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
