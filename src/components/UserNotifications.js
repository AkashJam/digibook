import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  let { status } = await Location.requestBackgroundPermissionsAsync();
  console.log("background location push notification:", now.toString(), status);
  let location = {};
  if (status !== "granted") {
    console.log("Permission to access location was denied");
  } else {
    location = await Location.getCurrentPositionAsync({}).then((response) =>
      console.log("response", response)
    );
  }

  if (location) {
    registerForPushNotificationsAsync();
    await schedulePushNotification(location);
  }

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
// async function registerBackgroundFetchAsync() {
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     // minimumInterval: 60 * 15, // 15 minutes
//     stopOnTerminate: false, // android only,
//     startOnBoot: true, // android only
//   });
// }

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
// async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// }

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Digital Notebook notification! 📬",
      body: "Upcoming task",
      data: { data: data },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function UserNotifications() {
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(async () => {
    const datalog = await AsyncStorage.getItem("DN_userlog");
    const registered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setIsRegistered(registered);
    console.log(registered, "data", datalog);
    if (datalog && !isRegistered) {
      BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        // minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
    }
  }, []);
  // const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   checkStatusAsync();
  // }, []);

  // const checkStatusAsync = async () => {
  //   const status = await BackgroundFetch.getStatusAsync();
  //   const isRegistered = await TaskManager.isTaskRegisteredAsync(
  //     BACKGROUND_FETCH_TASK
  //   );
  //   setStatus(status);
  //   setIsRegistered(isRegistered);
  // };

  // registerBackgroundFetchAsync();
  // checkStatusAsync();
  // const toggleFetchTask = async () => {
  //   if (isRegistered) {
  //     await unregisterBackgroundFetchAsync();
  //   } else {
  //     await registerBackgroundFetchAsync();
  //   }

  //   checkStatusAsync();
  // };

  return <></>;
}
