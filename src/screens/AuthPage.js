import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import {
  COLORS,
  SIZES,
  FONTS,
  SHADOW,
  PAGE,
  PAGEHEAD,
  TOAST,
} from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastr, UserContext } from "../globalvars";
import { ActivityIndicator } from "react-native";

export default function AuthPage({ navigation }) {
  const [state, dispatch] = React.useContext(UserContext);

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

  const [isLoading, setLoading] = useState(false);

  const login = async () => {
    const check = setTimeout(() => {
      // Add notification that user does not exist and you can create a user with that name
      setLoading(false);
      toastr("User does not exist.", 5000);
      setCanLogin(false);
    }, 5000); //Timeout if no reseponse for 5 sec
    setLoading(true);
    //Need to check with api if user exists and login else
    const user = await AsyncStorage.getItem(username); //Check local storage for user

    if (user !== null) {
      clearTimeout(check);
      setLoading(false);
      //if wrong password
      if (password !== user) {
        setCanLogin(false);
        setCanRegister(false);
        setUserColor(COLORS.red);
        setPwdColor(COLORS.red);
        toastr("Wrong username or password.", 5000);
      } else {
        let log = await AsyncStorage.getItem(`${username}_log`); //Check local storage for user;
        let obj = {
          username: username,
          activities: log != null ? JSON.parse(log) : [],
        };
        dispatch({ type: "set_user", user: obj });
        toastr(`Welcome ${username}`, 5000);
        setUsername("");
        setPassword("");
        navigation.navigate("Home");
      }
    }
  };

  const register = async () => {
    const check = setTimeout(async () => {
      setLoading(false);
      try {
        await AsyncStorage.setItem(username, password);
        await AsyncStorage.setItem(`${username}_log`, JSON.stringify([]));
        setCanRegister(false);
        setCanLogin(true);
        toastr("You have been registered.", 5000);
      } catch (e) {
        toastr("Registration error.", 5000);
      }
    }, 5000);
    setLoading(true);
    //Need to check with api if user exists and login else
    const user = await AsyncStorage.getItem(username); //Check local storage for user
    //if user exists
    if (user !== null) {
      clearTimeout(check);
      //Notification that username exists
      setLoading(false);
      toastr("Username already exists.", 5000);
      setCanRegister(false);
    }
  };

  useEffect(() => {
    userValidation(); //Set highlight of border and buttons
  }, [username, password]);

  return (
    <View style={styles.page}>
      {isLoading && (
        <View style={styles.activity}>
          <ActivityIndicator size={100} color={COLORS.primary} />
        </View>
      )}
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
  page: {
    height: "100%",
    backgroundColor: COLORS.secondary,
    paddingTop: "25%",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
  },
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
  activity: {
    position: "absolute",
    top: 0,
    right: 0,
    height: Dimensions.get("window").height / 1.5,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
