import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components";
import { COLORS, FONTS, PAGE, PAGEHEAD, SIZES } from "../constants";
import { FontAwesome } from "@expo/vector-icons";

import { UserContext, toastr, API } from "../globalvars";
import { TextInput } from "react-native-gesture-handler";

export default function SettingsPage() {
  const [state, dispatch] = React.useContext(UserContext);
  const [name, setName] = useState(state.displayName);
  const [value, setValue] = useState(state.range);
  const [password, setPassword] = useState("");
  const [change, setChange] = useState(false);
  useEffect(() => {
    if (
      name === state.displayName &&
      value === state.range &&
      password === "12341234"
    )
      setChange(false);
    else setChange(true);
  }, [name, password, value]);

  const editUserConfig = async () => {
    if (name !== state.displayName && name !== "") {
      const data = await API.updateUser({
        id: state.id,
        user: { display_name: name },
      });
      if (data.code === 200) {
        dispatch({
          type: "update_display_name",
          displayName: name,
        });

        console.log("name updated");
      }
    }
    if (value !== state.range) {
      const data = await API.updateUser({
        id: state.id,
        user: { range: value },
      });
      if (data.code === 200) {
        dispatch({
          type: "update_user_range",
          range: value,
        });
        console.log("range updated");
      }
    }
    // toastr("User config updated")
  };

  return (
    <>
      <Header screen={"Settings"} />
      <View style={PAGE}>
        <View
          style={{
            paddingTop: SIZES.padding,
            width: "100%",
            alignItems: "center",
          }}
        >
          <FontAwesome
            name="user-circle"
            size={Dimensions.get("window").height / 4.5}
            color={COLORS.secondary}
          />
          <Text style={{ ...PAGEHEAD, color: COLORS.secondary }}>
            {state.username}
          </Text>
        </View>
        <View
          style={{
            // flex: 1,
            margin: SIZES.padding,
            backgroundColor: COLORS.primary,
            borderRadius: SIZES.borderRadius,
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                ...styles.option,
                minWidth: 143,
              }}
            >
              Display name
            </Text>
            <TextInput
              placeholder="Enter your name"
              style={{
                flex: 1,
                padding: SIZES.padding,
                backgroundColor: COLORS.accent,
                ...FONTS.p_regular,
              }}
              value={name}
              onChangeText={(text) => setName(text)}
              // onFocus={() => setName(false)}
              // onBlur={() => setName(true)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: SIZES.margin,
              // backgroundColor: COLORS.primary,
            }}
          >
            <Text
              style={{
                ...styles.option,
                minWidth: 143,
              }}
            >
              Password
            </Text>
            <TextInput
              placeholder="Enter new password"
              style={{
                flex: 1,
                paddingHorizontal: SIZES.padding,
                backgroundColor: COLORS.accent,
                ...FONTS.p_regular,
                fontSize: 16,
              }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              // paddingVertical: SIZES.margin,
            }}
          >
            <Text
              style={{
                ...styles.option,
                minWidth: 143,
              }}
            >
              Range: {Math.round(value * 1000)}m
            </Text>
            <View
              style={{
                flex: 1,
                paddingHorizontal: SIZES.padding,
                paddingVertical: "1%",
                backgroundColor: COLORS.accent,
              }}
            >
              <Slider
                step={0.05}
                minimumValue={0.5}
                maximumValue={1.5}
                value={value}
                onValueChange={(value) => setValue(value[0])}
                thumbTintColor={COLORS.primary}
                // animateTransitions={true}
              />
            </View>
          </View>
          <Text
            style={{
              ...styles.option,
              marginVertical: SIZES.margin,
            }}
          >
            View Collaborators
          </Text>
          <Text style={styles.option}>Logout</Text>
        </View>
        {change && (
          <TouchableOpacity onPress={editUserConfig} style={styles.button}>
            <Text style={{ ...FONTS.h2_bold, color: COLORS.secondary }}>
              Confirm
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    ...FONTS.p_regular,
    color: COLORS.accent,
    backgroundColor: COLORS.secondary,
    padding: SIZES.padding,
  },
  button: {
    marginVertical: SIZES.padding,
    marginHorizontal: "25%",
    borderRadius: SIZES.borderRadius,
    padding: SIZES.margin,
    backgroundColor: COLORS.accent,
    alignItems: "center",
  },
});
