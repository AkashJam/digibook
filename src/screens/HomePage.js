import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, ControlButton, Testcomp, Notify, Header } from "../components";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CALENDRIFIC } from "@env";
import { UserContext } from "../globalvars";

const initialTodos = [];

export default function HomePage({ navigation }) {
  const [state, dispatch] = React.useContext(UserContext);

  const [list, setList] = useState(state.activities);
  const [edit, setEdit] = useState(0);

  const [date, setDate] = useState(new Date());

  const [calendar, setCalendar] = useState(false);
  const showCalender = () => {
    setCalendar(true);
  };

  const hideCalendar = () => {
    setCalendar(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    setCalendar(false);
  };

  useEffect(() => {
    setList(state.activities);
  }, [state]);

  // const [holiday, setHoliday] = useState("");
  // if (date.toDateString() === new Date().toDateString() && holiday!=="") {
  //   let day = new Date().getDate();
  //   let month = new Date().getMonth() + 1;
  //   let year = new Date().getFullYear();
  //   const response = fetch(
  //     `https://calendarific.com/api/v2/holidays?&api_key=${process.env.calendrific}&country=IT&year=${year}&day=${day}&month=${month}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setHoliday(data.response.holidays[0].description));
  // }

  function addTask(taskName) {
    dispatch({
      type: "add_task",
      taskName: taskName,
      datetime: date.toDateString(),
    });
  }

  const manageTask = {
    setCompleted: (id) => dispatch({ type: "toggle_completion", id: id }),
    renameTask: (id, value) =>
      dispatch({ type: "rename_task", id: id, taskName: value }),
    notifyToggle: (id) => dispatch({ type: "toggle_alarm", id: id }),
    changeDate: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      if (taskToUpdate.date !== value) {
        dispatch({ type: "change_datetime", id: id, datetime: value });
      }
    },
    changeLocation: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      if (taskToUpdate.date !== value) {
        dispatch({ type: "change_location", id: id, location: value });
      }
    },
    deleteTask: (id) => {
      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => dispatch({ type: "delete_task", id: id }),
        },
      ]);
    },
  };

  return (
    <>
      <View style={PAGE}>
        <DateTimePickerModal
          isVisible={calendar}
          date={date}
          mode="date"
          onCancel={hideCalendar}
          onConfirm={handleConfirm}
        />
        <View style={styles.info}>
          <Pressable
            onPress={() => navigation.navigate("Auth")}
            style={styles.date}
          >
            <Text
              style={{
                ...PAGEHEAD,
                margin: SIZES.margin,
                marginBottom: 0,
                color: COLORS.secondary,
              }}
            >
              {date.toDateString()}
            </Text>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={showCalender}
            >
              <Ionicons
                style={{
                  margin: SIZES.margin,
                  marginBottom: 0,
                  padding: SIZES.padding,
                }}
                name="calendar"
                size={28}
              />
            </TouchableOpacity>
          </Pressable>
          {/* <Text
            style={{
              ...PAGEHEAD,
              backgroundColor: COLORS.secondary,
              margin: SIZES.margin,
              marginTop: 0,
              color: COLORS.accent,
              borderRadius: SIZES.borderRadius
            }}
          >
            {holiday}
          </Text> */}
        </View>
        {/*calender icon which opens a calender modal with dates that have tasks highlighted as well as selected date*/}
        {date.toDateString() === new Date().toDateString() && (
          <Text style={PAGEHEAD}>What to do today</Text>
        )}
        {date.toDateString() !== new Date().toDateString() && (
          <Text style={PAGEHEAD}>
            {date < new Date() &&
              "What you did on " + date.toDateString().substring(4, 10)}
            {date > new Date() &&
              "What to do on " + date.toDateString().substring(4, 10)}
          </Text>
        )}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FlatList
            data={list.filter(
              (task) =>
                task.active &&
                task.datetime &&
                task.datetime === date.toDateString()
            )}
            renderItem={({ item, index }) => (
              <Card
                task={item}
                index={index}
                edit={edit === item.id}
                setEdit={setEdit}
                {...manageTask}
              />
            )}
            keyExtractor={(item) => item.key}
          />
        </GestureHandlerRootView>
      </View>
      <ControlButton addTask={addTask} />
      {edit !== 0 && (
        <Notify
          task={list.filter((item) => item.id === edit)[0]}
          close={() => setEdit(0)}
          {...manageTask}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight + 10,
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
  },
  heading: {
    ...FONTS.h1_bold,
    color: COLORS.accent,
    padding: SIZES.padding,
  },
  info: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius,
    margin: SIZES.margin,
  },
  date: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
