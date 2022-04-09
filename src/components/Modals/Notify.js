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
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from "react-native-gesture-handler";
import MapView from "react-native-maps";

export default function Notify(props) {
  const [value, setValue] = useState(props.task.taskName);
  const [notify, setNotify] = useState(props.task.notify);

  const [calendar, setCalendar] = useState(false);
  const [clock, setClock] = useState(false);
  const [map, setMap] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleCalendar = () => {
    setCalendar(!calendar);
  };

  const toggleClock = () => {
    setClock(!clock);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    props.changeDate(props.task.id, selectedDate);
    if (calendar === true) setCalendar(false);
    else if (clock === true) setClock(false);
  };

  const handleToggle = () => {
    setNotify(!notify);
    props.notifyToggle(props.task.id);
  };

  const handleEdit = () => {
    props.renameTask(props.task.id,value);
    props.close;
  };

  return (
    <View style={styles.modal}>
      <Modal
        transparent={true}
        animationType="fade"
        onRequestClose={props.close}
        style={{ justifyContent: "center" }}
      >
        <DateTimePickerModal
          isVisible={calendar || clock}
          date={date}
          mode={calendar ? "date" : "time"}
          onCancel={calendar ? toggleCalendar : toggleClock}
          onConfirm={handleConfirm}
        />
        {map && <MapView style={styles.map} />}
        <View style={styles.position}>
          <View style={styles.container}>
            <View style={styles.tabs}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={props.task.Notify ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleToggle}
                value={notify}
              />
              <TouchableOpacity onPress={toggleCalendar}>
                <MaterialIcons
                  name="calendar-today"
                  size={32}
                  color={
                    notify && props.task.date > new Date()
                      ? COLORS.accent
                      : COLORS.secondary
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleClock}>
                <MaterialIcons
                  name="access-time"
                  size={32}
                  color={
                    notify && props.task.date > new Date()
                      ? COLORS.accent
                      : COLORS.secondary
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMap(true)}>
                <MaterialIcons
                  name="location-pin"
                  size={32}
                  color={COLORS.secondary}
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
              <TouchableOpacity style={styles.button} onPress={props.task.taskName!==value&&props.task.taskName!==""?handleEdit:props.close}>
                <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "rgba(0,0,0,0.8)",
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
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    marginHorizontal: SIZES.padding,
    width: Dimensions.get("window").width/1.1,
    height: Dimensions.get("window").height/1.1,
    elevation: 2,
  },
});
