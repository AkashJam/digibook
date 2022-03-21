import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, ControlButton } from "../components";
import { COLORS, SIZES, FONTS, SHADOW } from "../constants";

export default function HomePage() {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(0);

  function addTask(taskName) {
    let duplicate = list.filter((task) => task.taskName === taskName);
    // console.log("task", taskName, duplicate);
    if (duplicate.length===0) {
      let id = Math.random() * 10000; //Find a new way to calculate the id
      if (taskName !== "") {
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
    },

    renameTask: (id, value) => {
      let taskToUpdate = list.filter((todo) => todo.id === id)[0];
      taskToUpdate.taskName = value;
      setList((prev) =>
        prev.map((item) => (item.id === id ? taskToUpdate : item))
      );
      setEdit(0);
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

  const renderItem = ({ item, index, drag, isActive }) => {
    if (edit === item.id) {
      return <Card task={item} index={index} isEdit={true} {...manageTask} />;
    } else {
      let backCount = 0;
      return (
        <Pressable
          onLongPress={drag}
          onPress={() => {
            backCount++;
            clearTimeout(backTimer);
            if (backCount === 2) {
              backCount = 0;
              setEdit(item.id);
            }
            const backTimer = setTimeout(() => {
              if (backCount === 1) {
                manageTask.notifyToggle(item.id);
              }
              backCount = 0;
            }, 500);
          }}
        >
          <Card
            task={item}
            index={index}
            isEdit={false}
            isActive={isActive}
            {...manageTask}
          />
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What to do today...</Text>
      <GestureHandlerRootView>
        <DraggableFlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={(d) => setList(d.data)}
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
