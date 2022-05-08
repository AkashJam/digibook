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
import { UserContext } from "../globalvars";
import { COLORS, FONTS, PAGE, SIZES } from "../constants";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, ControlButton, Header } from "../components";
import { useNavigation } from "@react-navigation/native";

export default function CategoryPage() {
  const navigation = useNavigation();
  const [state, dispatch] = React.useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  let categories = [{ label: "All", value: 1 }];
  state.groups.forEach((element) => {
    if(element.active) categories.push({ label: element.name, value: element.id });
  });
  const [items, setItems] = useState(categories);

  function addTask(taskName) {
    dispatch({
      type: "add_task",
      name: taskName,
      group: value === 1 ? null : value,
    });
  }

  function addGroup(groupName) {
    dispatch({
      type: "add_group",
      name: groupName,
    });
  }

  useEffect(() => {
    if (items.length - 1 !== state.groups.length) {
      // for (let i = 1; i < items.length; i++) {
      //   if (items[i].label !== state.groups[i-1].name) console.log("add group");
      // }
      // } else {
      if (items.length - 1 > state.groups.length) addGroup(items[items.length - 1].label);
    }
  }, [items]);

  const manageTask = {
    setCompleted: (id) => dispatch({ type: "toggle_completion", id: id }),
    notifyToggle: (id) => dispatch({ type: "toggle_alarm", id: id }),
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
          searchPlaceholder="Enter a group name"
          addCustomItem={true}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <GestureHandlerRootView style={{ flex: 1, marginVertical: 20 }}>
          <FlatList
            data={state.activities.filter(
              (task) => task.active && (value === 1 || task.group === value)
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
            keyExtractor={(item) => item.key}
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
