import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { UserContext, toastr, API } from "../globalvars";
import { COLORS, PAGE, SIZES, FONTS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { Header, LocateMap } from "../components";
import * as Location from "expo-location";

export default function ActivityPage({ route }) {
  const [state, dispatch] = React.useContext(UserContext);
  const currentTask = state.activities.filter(
    (task) => task.id === route.params.id
  );
  const [task, setTask] = useState(currentTask[0]);

  const [name, setName] = useState(task.description);
  const [height, setHeight] = useState(0);
  const [notify, setNotify] = useState(task.notify);
  const [date, setDate] = useState(
    task.datetime ? new Date(task.datetime) : new Date()
  );
  const prevLoc = task.location
    ? task.location.type
      ? task.location
      : JSON.parse(task.location)
    : null;
  const [loc, setLoc] = useState(prevLoc);
  const [completed, setCompleted] = useState(task.completed);

  const [open, setOpen] = useState(false);
  // const def = state.groups.filter((group) => group.name === "All");
  const [value, setValue] = useState(task.group_id);
  let categories = [];
  state.groups.forEach((element) =>
    categories.push({ label: element.name, value: element.id })
  );
  const [items, setItems] = useState(categories);
  const [calendarClock, setCalendarClock] = useState(false);
  const [map, setMap] = useState(false);

  const toggleCalendarClock = () => {
    setCalendarClock(!calendarClock);
  };

  const navigation = useNavigation();
  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    setCalendarClock(false);
    if (task.datetime !== selectedDate.toString())
      manageTask.changeDate(task.id, selectedDate);
  };

  const handleNotifyToggle = () => {
    if (!notify && !(task.datetime || task.location)) {
      Alert.alert(
        "Unable to Notify",
        "Requires either a date and time set in the future or a location",
        [
          {
            text: "Ok",
            style: "cancel",
          },
        ]
      );
    } else {
      manageTask.notifyToggle(task.id, !notify);
      setNotify(!notify);
    }
  };

  const handleCompletedToggle = () => {
    manageTask.setCompleted(task.id, !completed);
    setCompleted(!completed);
  };

  const handleEdit = async () => {
    if (name !== "") {
      if (task.description !== name) manageTask.renameTask(task.id, name);
      if (task.group_id !== value) manageTask.changeGroup(task.id, value);
      navigation.goBack();
    } else toastr("Task needs a name.");
  };

  const toggleMapModal = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    } else {
      setMap(true);
    }
  };

  const setLocation = (location) => {
    if (task.location !== location) {
      manageTask.changeLocation(task.id, location);
      setMap(false);
    }
  };

  const removeLocation = () => {
    if (task.location !== null) {
      Alert.alert(
        "Remove Location",
        "Are you sure you want to remove location tag?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              manageTask.changeLocation(task.id, null);
              if (!task.datetime && notify) handleNotifyToggle();
            },
          },
        ]
      );
    }
  };

  const removeDate = () => {
    if (task.datetime !== null) {
      Alert.alert("Remove Date", "Are you sure you want to remove date tag?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            manageTask.changeDate(task.id, null);
            if (!loc && notify) handleNotifyToggle();
          },
        },
      ]);
    }
  };

  let data = {};
  const manageTask = {
    setCompleted: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { completed: value, datetime: new Date() },
        });
        if (data.code == 200) {
          dispatch({ type: "toggle_completion", id: id, completed: value });
          setCompleted(value);
        } else toastr(data.status);
      } catch (error) {
        console.log(error);
      }
    },
    renameTask: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { description: value },
        });
        if (data.code == 200)
          dispatch({ type: "rename_task", id: id, description: value });
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
    changeDate: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { datetime: value },
        });
        if (data.code == 200) {
          dispatch({ type: "change_datetime", id: id, datetime: value });
          setTask({ ...task, datetime: value });
        } else {
          toastr(data.status);
        }
      } catch (error) {
        console.log(error);
      }
    },
    changeLocation: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { location: JSON.stringify(value) },
        });
        if (data.code == 200) {
          dispatch({
            type: "change_location",
            id: id,
            location: JSON.stringify(value),
          });
          setTask({ ...task, location: JSON.stringify(value) });
          setLoc(value);
        } else {
          toastr(data.status);
        }
      } catch (error) {
        console.log(error);
      }
    },
    changeGroup: async (id, value) => {
      try {
        data = await API.updateTask({
          id: id,
          task: { group_id: value },
        });
        if (data.code == 200)
          dispatch({ type: "change_group", id: id, group_id: value });
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

  function IconsTray() {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: SIZES.padding,
          marginHorizontal: SIZES.margin,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name={notify ? "bell" : "bell-off"}
          style={{ margin: SIZES.margin }}
          size={32}
          color={notify ? COLORS.primary : COLORS.secondary}
          onPress={handleNotifyToggle}
        />
        <MaterialIcons
          name={completed ? "check-box" : "check-box-outline-blank"}
          style={{ margin: SIZES.margin }}
          size={32}
          color={completed ? COLORS.primary : COLORS.secondary}
          onPress={handleCompletedToggle}
        />
        {!task.datetime && (
          <MaterialCommunityIcons
            name={"calendar-remove"}
            style={{ margin: SIZES.margin }}
            size={32}
            color={COLORS.secondary}
            onPress={toggleCalendarClock}
          />
        )}
        {!loc && (
          <MaterialCommunityIcons
            name={"pin-off"}
            style={{ margin: SIZES.margin }}
            size={32}
            color={COLORS.secondary}
            onPress={toggleMapModal}
          />
        )}
        <MaterialCommunityIcons
          name={"trash-can"}
          style={{ margin: SIZES.margin }}
          size={32}
          color={COLORS.secondary}
          onPress={() => manageTask.deleteTask(task.id)}
        />
      </View>
    );
  }

  function AvailableDatetime() {
    return (
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={toggleCalendarClock}
          onLongPress={removeDate}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={32}
            style={{ margin: SIZES.margin }}
            color={
              notify && new Date(task.datetime) > new Date()
                ? COLORS.primary
                : COLORS.secondary
            }
          />
        </TouchableOpacity>
        <Text
          style={{
            marginHorizontal: SIZES.padding,
            // marginVertical: SIZES.margin,
            ...FONTS.p_regular,
            // alignSelf: "flex-end",
          }}
        >
          {date.toDateString() + ", "}
          {date.getHours() > 12
            ? (date.getHours() - 12).toString()
            : date.getHours().toString()}
          {":" + date.getMinutes().toString()}
          {date.getHours() > 11 ? " PM" : " AM"}
        </Text>
      </View>
    );
  }

  function AvailableLocation() {
    return (
      <View style={styles.tabs}>
        <TouchableOpacity onPress={toggleMapModal} onLongPress={removeLocation}>
          <MaterialIcons
            name="location-pin"
            size={32}
            style={{ margin: SIZES.margin }}
            color={
              notify &&
              (!task.datetime ||
                (task.datetime && new Date(task.datetime) > new Date()))
                ? COLORS.primary
                : COLORS.secondary
            }
          />
        </TouchableOpacity>
        <Text
          style={{
            // flex: 1,
            marginHorizontal: SIZES.padding,
            ...FONTS.p_regular,
            // alignContent: "flex-end",
          }}
        >
          {loc.type
            ? loc.type === "custom"
              ? `Latitude: ${loc.latitude.toFixed(
                  7
                )}\nLongitude: ${loc.longitude.toFixed(7)}`
              : `nearby ${loc.type}`
            : "Not Set"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Header screen={"Activity"} />
      <DateTimePickerModal
        isVisible={calendarClock}
        date={date}
        mode={"datetime"}
        onCancel={toggleCalendarClock}
        onConfirm={handleConfirm}
      />
      <LocateMap
        map={map}
        location={loc}
        close={() => setMap(false)}
        setLocation={setLocation}
      />
      <View style={PAGE} pointerEvents={map ? "none" : "auto"}>
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
          searchPlaceholder="Select a group name"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />

        <View style={styles.activity}>
          <TextInput
            multiline={true}
            onChangeText={(text) => setName(text)}
            onContentSizeChange={(event) =>
              setHeight(event.nativeEvent.contentSize.height)
            }
            style={{
              ...styles.textInput,
              maxHeight: Math.min(
                height,
                Dimensions.get("window").height / 2.76
              ),
            }}
            placeholder="Add New Task"
            placeholderTextColor={COLORS.secondary}
            value={name}
          />
          <IconsTray />
          {task.datetime && <AvailableDatetime />}
          {loc && <AvailableLocation />}
          <View style={styles.end}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = new StyleSheet.create({
  button: {
    height: 40,
    width: 80,
    borderRadius: SIZES.textBoxRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    ...FONTS.h2_bold,
    backgroundColor: COLORS.accent,
    margin: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    color: COLORS.secondary,
    textAlign: "justify",
  },
  position: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabs: {
    // justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: SIZES.padding,
    margin: SIZES.padding,
    alignItems: "center",
  },
  container: {
    backgroundColor: COLORS.accent,
    marginHorizontal: SIZES.margin,
    width: "96%",
    padding: 10,
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.padding,
    margin: SIZES.margin,
    width: "96%",
    borderRadius: SIZES.borderRadius,
    borderWidth: 0,
  },
  activity: {
    height: Dimensions.get("window").height / 1.3,
    margin: SIZES.margin,
    paddingHorizontal: SIZES.margin,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.borderRadius,
  },
  end: {
    position: "absolute",
    bottom: SIZES.margin,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
