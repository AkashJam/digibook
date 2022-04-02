import { View, StyleSheet, Dimensions, Text, Pressable, Button } from "react-native";
import {
  COLORS,
  SHADOW,
  SIZES,
  FONTS,
  PAGE,
  PAGEHEAD,
} from "../../constants/index";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Notify(props) {



  // const hideDatePicker = () => {
  //   props.hideCalendar;
  // };

  // const handleConfirm = (date) => {
  //   props.setDate(date);
  //   hideDatePicker();
  // };

  // return (
  //   <>
  //     <DateTimePickerModal
  //       isVisible={true}
  //       date={props.date}
  //       mode="date"
  //       onConfirm={handleConfirm}
  //       onCancel={hideDatePicker}
  //       />
  //   </>
  // );


  return (
    <View style={styles.modal}>
      <View
        style={{
          backgroundColor: COLORS.accent,
          borderWidth: 5,
          borderColor: COLORS.secondary,
          width: "75%",
          height: "75%",
          borderRadius: SIZES.textBoxRadius,
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            right: 5,
            top: 5,
            backgroundColor: COLORS.secondary,
            height: 25,
            width: 25,
            borderRadius: SIZES.textBoxRadius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={props.close}
        >
          <MaterialIcons name="close" size={20} color={COLORS.accent} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = new StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    right: 90,
    height: "100%",
    width: 150,
    backgroundColor: "rgba(255,255,255,1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    elevation: 5,
  },
});
