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
import {
  GestureHandlerRootView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Card, CollabMenu, ControlButton, Header } from "../components";
import { useNavigation } from "@react-navigation/native";
import { Octicons, Ionicons, FontAwesome } from "@expo/vector-icons";

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
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [collabMenu, setCollabMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [owner, setOwner] = useState(false);
  const [groupMenu, setGroupMenu] = useState(false);

  let data = {};

  useEffect(() => {
    if (items.length > state.groups.length) {
      console.log(state.groups.length);
      manageGroup.addGroup(items[items.length - 1].label);
    }
  }, [items]);

  useEffect(async () => {
    if (value !== def[0].id) {
      const userdata = await API.getUserGroups(value);
      setUsers(userdata);
      console.log(users)
      const groupinfo = userdata.filter(
        (user) => user.username === state.username
      );
      if (groupinfo[0].owner) setOwner(true);
      else setOwner(false);
    } else setOwner(true);
  }, [value]);

  const manageTask = {
    addTask: async (taskName) => {
      try {
        data = await API.createTask({
          id: value,
          task: {
            description: taskName,
          },
        });
        console.log(data);
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
    },
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

  const manageGroup = {
    addGroup: async (groupName) => {
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
          setValue(data.id);
        } else toastr(data.status);
      } catch (error) {
        console.log(error);
      }
    },
    renameGroupToggle: () => {
      const group = state.groups.filter((group) => group.id === value);
      setName(group[0].name);
      setEdit(true);
      setGroupMenu(false);
    },
    renameGroup: async () => {
      if (name !== "") {
        setEdit(false);
        const group = state.groups.filter((group) => group.id === value);
        if (name !== group[0].name) {
          data = await API.updateGroup({
            id: value,
            group: { name: name },
          });
          console.log(data);
          if (data.code == 200) {
            const newItems = items.map((item) => {
              if (item.value === value) return { label: name, value: value };
              else return item;
            });
            setItems(newItems);
            dispatch({ type: "rename_group", id: value, name: name });
          } else toastr(data.status);
        }
      } else toastr("Group needs a name");
    },
    toggleCollabMenu: async () => {
      // const data = await API.getUserGroups(value);
      // setUsers(data);
      setGroupMenu(false);
      setCollabMenu(true);
    },
    deleteGroup: () => {
      setGroupMenu(false);
      Alert.alert(
        "Delete Group",
        "Are you sure you want to delete group?\nAll tasks in group will be removed as well",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              if (owner)
                data = await API.updateGroup({
                  id: value,
                  group: { active: false },
                });
              else
                data = await API.updateUserGroup({
                  id: value,
                  user: { username: state.username },
                  group: { active: false },
                });
              if (data.code == 200) {
                dispatch({ type: "delete_group", id: value });
                const newItems = items.filter((item) => item.value !== value);
                setItems(newItems);
                setValue(def[0].id);
              } else toastr(data.status);
            },
          },
        ]
      );
    },
  };

  const editGroupMenu = () => {
    if (edit) setEdit(false);
    else setGroupMenu(!groupMenu);
  };

  const Menu = () => {
    if (value === def[0].id) return <></>;
    return (
      <View
        style={{
          ...styles.menuContainer,
          padding: groupMenu ? SIZES.margin : 0,
          borderColor: groupMenu ? COLORS.accent : COLORS.primary,
          backgroundColor: groupMenu ? COLORS.secondary : COLORS.primary,
        }}
      >
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={editGroupMenu}>
          {!groupMenu && !edit && (
            <Octicons name="kebab-horizontal" size={32} color={COLORS.accent} />
          )}
          {groupMenu && (
            <Ionicons name="close" size={32} color={COLORS.accent} />
          )}
          {edit && <Ionicons name="close" size={32} color={COLORS.accent} />}
        </TouchableOpacity>
        {groupMenu && (
          <View style={styles.options}>
            <TouchableOpacity onPress={manageGroup.renameGroupToggle}>
              <Text style={styles.menuText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={manageGroup.toggleCollabMenu}>
              <Text style={styles.menuTextAlt}>Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={manageGroup.deleteGroup}>
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Header screen={"Categories"} />
      <Menu />
      <CollabMenu
        active={collabMenu}
        close={() => setCollabMenu(false)}
        id={value}
        owner={owner}
        users={users}
        setUsers={(newUsers) => setUsers(newUsers)}
      />
      <View style={PAGE}>
        {edit && (
          <View style={styles.group}>
            <TouchableOpacity
              style={styles.button}
              onPress={manageGroup.renameGroup}
            >
              <FontAwesome name="edit" color={COLORS.accent} size={32} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => setName(text)}
              onBlur={() => setEdit(false)}
            />
          </View>
        )}
        {!edit && (
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
            searchPlaceholder="Enter a new name to create group"
            addCustomItem={true}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        )}
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
        <ControlButton addTask={manageTask.addTask} />
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
  menuContainer: {
    borderWidth: 2,
    marginRight: "1%",
    position: "absolute",
    top: 45,
    right: SIZES.padding,
    zIndex: 4,
    borderRadius: SIZES.borderRadius,
    flexDirection: "row-reverse",
  },
  options: {
    // marginTop: SIZES.padding,
    // marginRight: SIZES.padding,
    // paddingRight: SIZES.padding,
    paddingVertical: SIZES.padding,
    flexDirection: "column",
    justifyContent: "space-evenly",
    // paddingRight: 0,
    // flex: 1,
  },
  menuText: {
    textAlign: "center",
    ...FONTS.p_regular,
    color: COLORS.accent,
  },
  menuTextAlt: {
    textAlign: "center",
    ...FONTS.p_regular,
    color: COLORS.accent,
    paddingVertical: 10,
    marginVertical: 5,
    borderColor: COLORS.accent,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  group: {
    margin: SIZES.margin,
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius,
    flexDirection: "row-reverse",
    overflow: "hidden",
  },
  button: {
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    paddingVertical: "12%",
    paddingHorizontal: SIZES.padding,
  },
  textInput: {
    ...FONTS.h1_bold,
    color: COLORS.secondary,
    flex: 1,
    marginHorizontal: SIZES.padding,
  },
});
