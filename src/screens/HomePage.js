import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Pressable,
} from "react-native";

import DraggableFlatList from "react-native-draggable-flatlist";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Card } from "../components";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";

export default function HomePage() {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");

  function addTask(taskName) {
    // let duplicate = list.filter((task) => (task.taskName = newTask.taskName));
    console.log("task", taskName);
    // if (!duplicate) {
    let id = Math.random() * 10000; //Find a new way to calculate the id
    if (value !== "") {
      let newTask = {
        id: id,
        key: `item-${id}`,
        taskName: taskName,
        notify: false,
        completed: false,
      };
      setList((prev) => {
        return [newTask, ...prev];
      });
      setValue("");
      // alert("Task successfully added");
    } else {
      alert("Please name the task");
    }

    // } else {
    //   console.log("duplicate");
    // }
  }

  manageTask = {
    setCompleted: (id) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.completed = !taskToUpdate.completed;
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
      console.log(taskToUpdate.notify)
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
            console.log(updatedTasks);
          },
        },
      ]);
    },
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <Pressable onLongPress={drag} onPress={() => manageTask.notifyToggle(item.id)}>
        <Card task={item} index={index} isActive={isActive} {...manageTask} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What to do today...</Text>
      <GestureHandlerRootView>
        <DraggableFlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={(d) => {console.log(d.data),console.log(list),setList(d.data)}}
        />
      </GestureHandlerRootView>
      <View style={styles.textBoxWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Add New Task"
          placeholderTextColor={COLORS.secondary}
          onChangeText={(text) => setValue(text)}
          value={value}
        />
        <TouchableOpacity style={styles.button} onPress={() => addTask(value)}>
          <Text style={{ ...FONTS.h1_bold }}>+</Text>
        </TouchableOpacity>
      </View>
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
  textBoxWrapper: {
    width: "111%", //The width does not register screen width at 100%
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.padding,
    // margin: SIZES.margin,
    backgroundColor: COLORS.secondary,
  },
  textInput: {
    ...SHADOW,
    ...FONTS.p_regular,
    borderRadius: SIZES.textBoxRadius,
    backgroundColor: COLORS.primary,
    height: 44,
    width: "80%",
    color: COLORS.accent,
    marginVertical: SIZES.margin,
    paddingHorizontal: 20,
    // borderColor: COLORS.accent,
    // borderWidth: 3,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    color: COLORS.primary,
    height: 44,
    width: 44,
    borderRadius: SIZES.textBoxRadius,
    marginVertical: SIZES.margin,
    // borderColor: COLORS.accent,
    // borderWidth: 3,
  },
});
