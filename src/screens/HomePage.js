import React, { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SwipeRow } from "react-native-swipe-list-view";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Card, ControlButton, Testcomp } from "../components";
import { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD } from "../constants";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage(props) {
  const [list, setList] = useState([]);

  const date = new Date().toDateString();
  const name = " James";

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

  // if (date!==new Date().toDateString()) getHoliday();

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
          datetime: new Date(),
          completed: false,
        };
        setList((prev) => {
          return [newTask, ...prev];
        });
      } else {
        alert("Please name the task");
      }
    } else {
      alert("Task already exists");
    }
  }

  const manageTask = {
    // deactivateNotify: new Promise((res) => {
    //   Alert.alert("Remove Reminder", "Since you have completed the task, shall I remove the reminder?", [
    //     {
    //       text: "Cancel",
    //       style: "cancel",
    //       onPress: () => res("dont")
    //     },
    //     {
    //       text: "Yes",
    //       onPress: () => {
    //         // taskToUpdate.notify = false
    //         res("notify")
    //       },
    //     },
    //   ]);
    // }),
    setCompleted: (id) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.completed = !taskToUpdate.completed;
      // if(taskToUpdate.completed === true) {
      //   console.log(await manageTask.deactivateNotify())
      // }
      // console.log(taskToUpdate)
      setList((prev) =>
        prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
    },

    renameTask: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.taskName = value;
      setList((prev) =>
        prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
    },

    notifyToggle: (id) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.notify = !taskToUpdate.notify;
      setList((prev) =>
        prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
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
          },
        },
      ]);
    },
  };

  return (
    <View style={PAGE}>
      <Pressable
        onPress={props.logout}
        style={{
          backgroundColor: COLORS.accent,
          borderRadius: SIZES.borderRadius,
          margin: SIZES.margin,
          justifyContent: "space-between",
          flexDirection: 'row'
        }}
      >
        <Text style={{ ...PAGEHEAD,  margin: SIZES.margin, color: COLORS.secondary }}>{date}</Text>
        <Ionicons
          style={{ margin: SIZES.margin, padding: SIZES.padding }}
          name="calendar"
          size={28}
          // color={active ? COLORS.secondary : COLORS.accent}
        />
        {/*calender icon which opens a calender modal with dates that have tasks highlighted as well as selected date*/}
      </Pressable>
      {/* <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.releaseYear}</Text>
          )}
        />
      )}
    </View> */}
      <Text style={PAGEHEAD}>What to do today...</Text>
      <GestureHandlerRootView>
        <FlatList
          data={list}
          renderItem={({ item, index }) => (
            <Card task={item} index={index} {...manageTask} />
          )}
          keyExtractor={(item) => item.key}
        />
      </GestureHandlerRootView>
      <ControlButton addTask={addTask} />
    </View>
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
});
