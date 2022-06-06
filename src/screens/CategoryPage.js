import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Modal,
  StyleSheet,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { UserContext, toastr, API } from "../globalvars";
import { COLORS, FONTS, PAGE, SIZES } from "../constants";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, ControlButton, Header } from "../components";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

export default function CategoryPage() {
  const navigation = useNavigation();
  const [state, dispatch] = React.useContext(UserContext);
  const [open, setOpen] = useState(false);
  const def = state.groups.filter((group) => group.name === "All");
  const [value, setValue] = useState(def[0].id);
  let categories = [];
  state.groups.forEach((element) => {
    categories.push({ label: element.name, value: element.id });
  });
  const [items, setItems] = useState(categories);
  // console.log(value);

  let data = {};
  const addTask = async (taskName) => {
    try {
      data = await API.createTask({
        id: value,
        task: {
          description: taskName,
        },
      });
      console.log(data)
      if (data.code == 200)
        dispatch({
          type: "add_task",
          id: data.id,
          description: taskName,
          group_id: value,
        });
      else toastr(data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const addGroup = async (groupName) => {
    try {
      data = await API.createGroup({
        id: state.id,
        group: { name: groupName },
      });
      console.log(data);
      if (data.code == 200) {
        dispatch({
          type: "add_group",
          name: groupName,
          id: data.id,
        });
        let updatedList = items;
        updatedList[updatedList.length - 1].value = data.id;
        setItems(updatedList);
      } else toastr(data.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (items.length > state.groups.length) {
      console.log(state.groups.length);
      addGroup(items[items.length - 1].label);
    }
  }, [items]);

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

  return (
    <>
      <Header screen={"Activities"} />
      <View style={PAGE}>
        <DropDownPicker
          style={styles.dropdown}
          dropDownContainerStyle={styles.container}
          textStyle={{
            color: COLORS.secondary,
            ...FONTS.h1_bold,
          }}
          listItemLabelStyle={FONTS.p_regular}
          searchTextInputStyle={FONTS.p_regular}
          searchable={true}
          searchPlaceholder="Create new group name"
          addCustomItem={true}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <Octicons name="kebab-horizontal" size={32} color={COLORS.accent} style={{paddingHorizontal: SIZES.padding}} />
        <GestureHandlerRootView style={{ flex: 1, marginVertical: 20 }}>
          <FlatList
            data={state.activities.filter(
              (task) => value === def[0].id || task.group_id === value
            )}
            renderItem={({ item, index }) => (
              <Card
                task={item}
                index={index}
                edit={false}
                setEdit={(id) => navigation.navigate("Activity", { id })}
                {...manageTask}
              />
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </GestureHandlerRootView>
        <ControlButton addTask={addTask} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.accent,
    marginHorizontal: SIZES.margin,
    width: "96%",
    padding: 10,
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    margin: SIZES.margin,
    width: "96%",
    borderRadius: SIZES.borderRadius,
    borderWidth: 0,
  },
});
