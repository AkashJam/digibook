import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, ControlButton, Testcomp, Header, UserNotifications } from "../components";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CALENDRIFIC } from "@env";
import { UserContext, toastr, API } from "../globalvars";

export default function HomePage({ navigation }) {
  const [state, dispatch] = React.useContext(UserContext);
  const defGroup = state.groups.filter((group) => group.name === "All");
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
    setList(state.activities);
  }, [state]);

  const [holiday, setHoliday] = useState("");
  // useEffect(() => {
  //   if (holiday === "") {
  //     // let day = new Date().getDate();
  //     let month = date.getMonth() + 1;
  //     let year = date.getFullYear();
  //     const response = fetch(
  //       `https://calendarific.com/api/v2/holidays?&api_key=${process.env.calendrific}&country=IT&year=${year}&month=${month}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         if (data.response.holidays.length !== 0)
  //           setHoliday(data.response.holidays[0].description);
  //       });
  //   }
  // }, [date]);

  let data = {};
  const addTask = async (taskName) => {
    try {
      data = await API.createTask({
        id: defGroup[0].id,
        task: {
          datetime: date,
          description: taskName,
        },
      });
      if (data.code == 200)
        dispatch({
          type: "add_task",
          id: data.id,
          description: taskName,
          datetime: date.toString(),
          group_id: defGroup[0].id,
        });
      else toastr(data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const manageTask = {
    setCompleted: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { completed: value, datetime: new Date() },
        });
        if (data.code == 200)
          dispatch({ type: "toggle_completion", id: id, completed: value });
        else toastr(data.status);
      } catch (error) {
        console.log(error);
      }
    },
    notifyToggle: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { notify: value },
        });
        if (data.code == 200)
          dispatch({ type: "toggle_notification", id: id, notify: value });
        else toastr(data.status);
      } catch (error) {
        console.log(error);
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
          onPress: async () => {
            data = await API.updateTask({
              id: id,
              task: { active: false },
            });
            if (data.code == 200) dispatch({ type: "delete_task", id: id });
            else toastr(data.status);
          },
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
          <Pressable style={styles.date}>
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
                  keyExtractor={(item) => `${item.id}`}
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
                    keyExtractor={(item) => `${item.id}`}
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
                    task.datetime &&
                    new Date(task.datetime).toDateString() ===
                      date.toDateString()
                ).length === 0 && (
                  <Text style={styles.empty}>Nothing planned for this day</Text>
                )}
              <FlatList
                data={list.filter(
                  (task) =>
                    task.datetime &&
                    new Date(task.datetime).toDateString() ===
                      date.toDateString()
                )}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
              />
            </>
          )}
        </GestureHandlerRootView>
      </View>
      <ControlButton addTask={addTask} />
      <UserNotifications />
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
