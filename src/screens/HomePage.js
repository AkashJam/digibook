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
import { Card, ControlButton, Testcomp, Header } from "../components";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CALENDRIFIC } from "@env";
import { UserContext } from "../globalvars";

export default function HomePage({ navigation }) {
  const [state, dispatch] = React.useContext(UserContext);
  const [list, setList] = useState(state.activities);
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
    setList(state.activities.filter((task) => task.active));
  }, [state]);

  const [holiday, setHoliday] = useState("");
  if (holiday === "") {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    const response = fetch(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.calendrific}&country=IT&year=${year}&day=${day}&month=${month}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.response.holidays.length !== 0)
          setHoliday(data.response.holidays[0].description);
      });
  }

  function addTask(taskName) {
    dispatch({
      type: "add_task",
      name: taskName,
      datetime: date.toString(),
    });
  }

  const manageTask = {
    setCompleted: (id) => dispatch({ type: "toggle_completion", id: id }),
    renameTask: (id, value) =>
      dispatch({ type: "rename_task", id: id, name: value }),
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

  const renderItem = ({ item, index }) => {
    return (
      <Card
        task={item}
        index={index}
        setEdit={(id) => navigation.navigate("Activity", { id })}
        {...manageTask}
      />
    );
  };

  return (
    <>
      <Header screen={"Home"} />
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
          {holiday !== "" && (
            <Text
              style={{
                ...PAGEHEAD,
                backgroundColor: COLORS.secondary,
                margin: SIZES.margin,
                marginTop: 0,
                color: COLORS.accent,
                borderRadius: SIZES.borderRadius,
              }}
            >
              {holiday}
            </Text>
          )}
        </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/*calender icon which opens a calender modal with dates that have tasks highlighted as well as selected date*/}
          {date.toDateString() === new Date().toDateString() && (
            <>
              <Text style={PAGEHEAD}>What to do today</Text>
              {list.filter(
                (task) =>
                  task.datetime &&
                  !task.completed &&
                  new Date(task.datetime).toDateString() === date.toDateString()
              ).length !== 0 && (
                <FlatList
                  data={list.filter(
                    (task) =>
                      task.datetime &&
                      !task.completed &&
                      new Date(task.datetime).toDateString() ===
                        date.toDateString()
                  )}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.key}
                />
              )}
              {list.filter(
                (task) =>
                  task.datetime &&
                  !task.completed &&
                  new Date(task.datetime).toDateString() === date.toDateString()
              ).length === 0 && (
                <Text style={styles.empty}>
                  {list.filter(
                    (task) =>
                      task.datetime &&
                      task.completed &&
                      new Date(task.datetime).toDateString() ===
                        date.toDateString()
                  ).length !== 0
                    ? "Nothing else planned for today"
                    : "Nothing planned for today"}
                </Text>
              )}
              {list.filter(
                (task) =>
                  task.datetime &&
                  task.completed &&
                  new Date(task.datetime).toDateString() === date.toDateString()
              ).length !== 0 && (
                <>
                  <Text style={PAGEHEAD}>What you did today</Text>
                  <FlatList
                    data={list.filter(
                      (task) =>
                        task.completed &&
                        task.datetime &&
                        new Date(task.datetime).toDateString() ===
                          date.toDateString()
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.key}
                  />
                </>
              )}
            </>
          )}
          {date.toDateString() !== new Date().toDateString() && (
            <>
              <Text style={PAGEHEAD}>
                {date < new Date() &&
                  "What you did on " + date.toDateString().substring(4, 10)}
                {date > new Date() &&
                  "What to do on " + date.toDateString().substring(4, 10)}
              </Text>
              {date > new Date() &&
                list.filter(
                  (task) =>
                    task.active &&
                    task.datetime &&
                    new Date(task.datetime).toDateString() ===
                      date.toDateString()
                ).length === 0 && (
                  <Text style={styles.empty}>Nothing planned for this day</Text>
                )}
              <FlatList
                data={list.filter(
                  (task) =>
                    task.active &&
                    task.datetime &&
                    new Date(task.datetime).toDateString() ===
                      date.toDateString()
                )}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
              />
            </>
          )}
        </GestureHandlerRootView>
      </View>
      <ControlButton addTask={addTask} />
    </>
  );
}

const styles = StyleSheet.create({
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
  empty: {
    ...FONTS.h2_bold,
    color: COLORS.secondary,
    margin: SIZES.padding,
  },
});
