import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { COLORS, SIZES, FONTS, SHADOW, PAGEHEAD } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastr, UserContext, API } from "../globalvars";
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
    setLoading(true);
    const data = await API.login({ username: username, password: password });
    const { code, status, ...userdata } = data;
    if (code == 200) {
      try {
        const datalog = await AsyncStorage.getItem("DN_userlog");
        const user = JSON.parse(datalog);
        setLoading(false);
        dispatch({
          type: "set_user",
          user: userdata,
          locations:
            user && user.locations
              ? user.locations
              : {
                  lat: null,
                  lon: null,
                },
        });
        setUsername("");
        setPassword("");
        navigation.navigate("Home");
      } catch (e) {
        console.log(e);
        setLoading(false);
        toastr("Login error.", 5000);
      }
    } else {
      if (code == 406) {
        setCanLogin(false);
        setCanRegister(false);
        setUserColor(COLORS.red);
        setPwdColor(COLORS.red);
      }
      setLoading(false);
      setCanLogin(false);
      toastr(data.status, 5000);
    }
    // const check = setTimeout(() => {
    //   // Add notification that user does not exist and you can create a user with that name
    //   setLoading(false);
    //   toastr("User does not exist.", 5000);
    //   setCanLogin(false);
    // }, 5000); //Timeout if no reseponse for 5 sec
    // setLoading(true);
    // //Need to check with api if user exists and login else
    // const data = await API.login({ username: username, password: password });
    // let { code, status, ...userdata } = data;
    // if (code != 404) {
    //   const datainfo = await AsyncStorage.getItem("DN_userinfo");
    //   let user = JSON.parse(datainfo);
    //   if (user !== null) {
    //     clearTimeout(check);
    //     setLoading(false);
    //     //if wrong password
    //     if (password !== user.passwordHash) {
    //       setCanLogin(false);
    //       setCanRegister(false);
    //       setUserColor(COLORS.red);
    //       setPwdColor(COLORS.red);
    //       toastr("Wrong username or password.", 5000);
    //     } else {
    //       const datalog = await AsyncStorage.getItem("DN_userlog"); //Check local storage for user
    //       let log = JSON.parse(datalog);
    //       let obj = {
    //         username: username,
    //         displayName: user.displayName,
    //         range: user.range,
    //         collaborators: user.collaborators,
    //         groups: log.groups,
    //         activities: log.activities,
    //       };
    //       dispatch({ type: "set_user", user: obj });
    //       toastr(`Welcome ${username}`, 5000);
    //       setUsername("");
    //       setPassword("");
    //       navigation.navigate("Home");
    //     }
    //   }
    // }
  };

  const register = async () => {
    setLoading(true);
    const data = await API.register({ username: username, password: password });
    console.log(data);
    if (data.code == 200) {
      try {
        await AsyncStorage.setItem(
          "DN_userlog",
          JSON.stringify({
            id: data.id,
            username: username,
            displayName: "",
            range: 0.75,
            collaborators: [],
            groups: [],
            activities: [],
            locations: {
              lat: null,
              lon: null,
            },
          })
        );
        setLoading(false);
        setCanRegister(false);
        setCanLogin(true);
        toastr("You have been registered.", 5000);
      } catch (e) {
        toastr("Registration error.", 5000);
      }
    } else {
      setLoading(false);
      setCanRegister(false);
      toastr(data.status, 5000);
    }
    // const check = setTimeout(async () => {
    //   setLoading(false);
    //   try {
    //     await AsyncStorage.setItem(
    //       "DN_userinfo",
    //       JSON.stringify({
    //         username: username,
    //         displayName: "",
    //         range: 0.75,
    //         passwordHash: password,
    //         collaborators: [],
    //       })
    //     );
    //     await AsyncStorage.setItem(
    //       "DN_userlog",
    //       JSON.stringify({
    //         groups: [],
    //         activities: [],
    //         locations: {}
    //       })
    //     );
    //     setCanRegister(false);
    //     setCanLogin(true);
    //     toastr("You have been registered.", 5000);
    //   } catch (e) {
    //     toastr("Registration error.", 5000);
    //   }
    // }, 5000);
    // setLoading(true);
    // //Need to check with api if user exists and login else
    // const user = await AsyncStorage.getItem(`${username}_info`); //Check local storage for user
    // //if user exists
    // if (user !== null) {
    //   clearTimeout(check);
    //   //Notification that username exists
    //   setLoading(false);
    //   toastr("Username already exists.", 5000);
    //   setCanRegister(false);
    // }
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
        secureTextEntry={true}
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
