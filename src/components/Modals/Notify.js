import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  Switch,
  Button,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  COLORS,
  SHADOW,
  SIZES,
  FONTS,
  PAGE,
  PAGEHEAD,
} from "../../constants/index";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from "react-native-gesture-handler";
import { LocateMap } from "../";
import { toastr } from "../../globalvars";

export default function Notify(props) {
  const [value, setValue] = useState(props.task.taskName);
  const [notify, setNotify] = useState(props.task.notify);

  const [calendarClock, setCalendarClock] = useState(false);
  const [map, setMap] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleCalendarClock = () => {
    setCalendarClock(!calendarClock);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    setCalendarClock(false);
    if (props.task.datetime !== date.toDateString())
      props.changeDate(props.task.id, date.toDateString());
  };

  const handleToggle = () => {
    setNotify(!notify);
    props.notifyToggle(props.task.id);
  };

  const handleEdit = () => {
    if (value !== "") {
      if (props.task.taskName !== value) props.renameTask(props.task.id, value);
      props.close();
    } else toastr("Task needs a name.", 3000);
  };

  const setLocation = (value) => {
    props.changeLocation(props.task.id, value);
    setMap(false);
  };

  const removeLocation = () => {
    Alert.alert(
      "Remove Location",
      "Are you sure you want to remove location tag?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => props.changeLocation(props.task.id, null),
        },
      ]
    );
  };

  const removeDate = () => {
    Alert.alert("Remove Date", "Are you sure you want to remove date tag?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => props.changeDate(props.task.id, null),
      },
    ]);
  };

  return (
    <View style={styles.modal}>
      <DateTimePickerModal
        isVisible={calendarClock}
        date={date}
        mode={"datetime"}
        onCancel={toggleCalendarClock}
        onConfirm={handleConfirm}
      />
      {map && (
        <LocateMap
          location={props.task.location}
          close={() => setMap(false)}
          setLocation={setLocation}
        />
      )}
      {/* <Modal
        transparent={true}
        animationType="fade"
        onRequestClose={props.close}
        style={{ justifyContent: "center" }}
      > */}
      <View style={styles.position} pointerEvents={map ? "none" : "auto"}>
        <View style={styles.container}>
          <View style={styles.tabs}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={props.task.Notify ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={notify}
            />
            <TouchableOpacity
              onPress={toggleCalendarClock}
              onLongPress={removeDate}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={32}
                color={
                  notify &&
                  props.task.datetime &&
                  new Date(props.task.datetime) > new Date()
                    ? COLORS.accent
                    : COLORS.secondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMap(true)}
              onLongPress={removeLocation}
            >
              <MaterialIcons
                name="location-pin"
                size={32}
                color={
                  notify &&
                  props.task.location &&
                  (!props.task.datetime ||
                    (props.task.datetime &&
                      new Date(props.task.datetime) > new Date()))
                    ? COLORS.accent
                    : COLORS.secondary
                }
              />
            </TouchableOpacity>
          </View>
          <TextInput
            multiline={true}
            onChangeText={(text) => setValue(text)}
            style={{
              ...styles.textInput,
              textDecorationLine: props.task.completed
                ? "line-through"
                : "none",
            }}
            placeholder="Add New Task"
            placeholderTextColor={COLORS.secondary}
            value={value}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: COLORS.accent,
            }}
          >
            <TouchableOpacity style={styles.button} onPress={props.close}>
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </Modal> */}
    </View>
  );
}

const styles = new StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  button: {
    height: 40,
    width: 80,
    borderRadius: SIZES.textBoxRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    ...FONTS.h2_bold,
    backgroundColor: COLORS.accent,
    padding: 20,
    color: COLORS.secondary,
    textAlign: "justify",
  },
  position: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  container: {
    backgroundColor: COLORS.primary,
    width: "75%",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: SIZES.padding,
    alignItems: "center",
  },
});
