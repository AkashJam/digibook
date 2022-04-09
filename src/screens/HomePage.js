import React, { useState } from "react";
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
import { globalvars } from "../globalvars";

export default function HomePage({ navigation }) {

  //list.filter(task => task.datetime.toDateString() === date.toDateString())
  const [list, setList] = useState([]);
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

  // console.log("key",CALENDRIFIC)
  // const response = fetch(
  //   `https://calendarific.com/api/v2/holidays?&api_key=${process.env.calendrific}&country=IT&year=2022`
  // )
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
  // const [isLoading, setLoading] = useState(true);
  // const [data, setData] = useState([]);

  // const getHoliday = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://calendarific.com/api/v2/holidays?api_key=239803d7337674b1c74ae9a53515a86148255669"
  //     );
  //     // const json = await response.json();
  //     console.log(response);
  //     setData(json);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  function addTask(taskName) {
    let duplicate = list.filter((task) => task.taskName === taskName);
    if (duplicate.length === 0) {
      let id = Math.random() * 10000; //Find a new way to calculate the id
      if (taskName !== "") {
        let newTask = {
          id: id,
          key: `item-${id}`,
          taskName: taskName,
          notify: false,
          datetime: date,
          completed: false,
        };
        setList((prev) => {
          return [newTask, ...prev];
        });
        globalvars.toast("Task added.", 5000);
      } else {
        alert("Please name the task");
      }
    } else {
      alert("Task already exists");
    }
  }

  const manageTask = {
    setCompleted: (id) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.completed = !taskToUpdate.completed;
      setList((prev) =>
        prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
      globalvars.toast("Task completed.", 5000);
    },

    renameTask: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      if (taskToUpdate.taskName !== value) {
        taskToUpdate.taskName = value;
        setList((prev) =>
          prev.map((item) => (item.id === id ? taskToUpdate : item))
        );
      }
      globalvars.toast("Task renamed.", 5000);
    },

    changeDate: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      if (taskToUpdate.date !== value) {
        taskToUpdate.date = value;
        setList((prev) =>
          prev.map((item) => (item.id === id ? taskToUpdate : item))
        );
      }
      globalvars.toast("Date changed.", 5000);
    },

    notifyToggle: (id) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.notify = !taskToUpdate.notify;
      setList((prev) =>
      prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
      if (taskToUpdate.notify) globalvars.toast("Alarm On.", 5000);
      else globalvars.toast("Alarm Off.", 5000);
    },

    deleteTask: (id) => {
      Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            let updatedTasks = list.filter((todo) => todo.id !== id);
            setList(updatedTasks);
            globalvars.toast("Task deleted.", 5000);
          },
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
        <Pressable onPress={() => navigation.navigate('Auth')} style={styles.date}>
          <Text
            style={{
              ...PAGEHEAD,
              margin: SIZES.margin,
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
              style={{ margin: SIZES.margin, padding: SIZES.padding }}
              name="calendar"
              size={28}
            />
          </TouchableOpacity>
        </Pressable>
        {/*calender icon which opens a calender modal with dates that have tasks highlighted as well as selected date*/}
        {date.toDateString() === new Date().toDateString() && (
          <Text style={PAGEHEAD}>What to do today</Text>
        )}
        {date.toDateString() !== new Date().toDateString() && (
          <Text style={PAGEHEAD}>
            What to do on {date.toDateString().substring(4, 10)}
          </Text>
        )}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FlatList
            data={list.filter(
              (task) => task.datetime.toDateString() === date.toDateString()
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
  date: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius,
    margin: SIZES.margin,
    // marginTop: "20%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
