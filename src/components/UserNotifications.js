import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext, toastr, API } from "../globalvars";

const BACKGROUND_FETCH_TASK = "background-fetch";

const notify = async (activities) => {
  let datalog = await AsyncStorage.getItem("DN_userlog");
  let data = JSON.parse(datalog);
  // console.log(data.notifications);
  activities.forEach(async (activity) => {
    if (activity.datetime) {
      const timer = Math.abs(new Date(activity.datetime) - new Date()) / 60000;
      if (5 < timer && timer < 15) {
        // If notification timer is in less than 15 minutes
        registerForPushNotificationsAsync();
        await schedulePushNotification(
          activity.description,
          Math.floor(timer).toString(),
          "time"
        );
        // markNotified(data, activity.id, places[places.length - 1], "time");
      }
    } else {
      const act_loc = JSON.parse(activity.location);
      if (!act_loc) return null;
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") return null;
      await Location.getCurrentPositionAsync().then(async (currentLoc) => {
        const searchDistance = 0.02;
        if (act_loc.type !== "custom") {
          if (
            data.locations &&
            data.locations.latitude &&
            data.locations.longitude &&
            Math.abs(data.locations.latitude - currentLoc.coords.latitude) <=
              searchDistance / 2 &&
            Math.abs(data.locations.longitude - currentLoc.coords.longitude) <=
              searchDistance / 2 &&
            data.locations[`${act_loc.type}`] !== undefined &&
            data.locations[`${act_loc.type}`].length !== 0
          ) {
            const places = nearestPoint(
              data.locations[`${act_loc.type}`],
              currentLoc,
              data.range
            );
            if (places.length !== 0)
              data = prepNotification(data, activity, places);
          } else {
            let type = act_loc.type === "supermarket" ? "shop" : "amenity";
            fetch(
              `http://www.overpass-api.de/api/interpreter?data=[out:json];node
                  ["${type}"=${act_loc.type}]
                  (${currentLoc.coords.latitude - searchDistance},${
                currentLoc.coords.longitude - searchDistance
              },${currentLoc.coords.latitude + searchDistance},${
                currentLoc.coords.longitude + searchDistance
              });
                  out;`
            )
              .then((response) => response.json())
              .then(async (API_resp) => {
                if (API_resp.elements.length !== 0) {
                  const API_data = API_resp.elements.map((element) => {
                    return {
                      id: element.id,
                      latitude: element.lat,
                      longitude: element.lon,
                      name: element.tags.name,
                    };
                  });
                  if (Object.keys(data.locations).length !== 0)
                    Object.keys(data.locations).forEach((e) => {
                      if (e !== "lat" && e !== "lon") data.locations[e] = [];
                    });
                  if (
                    !(
                      data.locations &&
                      data.locations.latitude &&
                      data.locations.longitude &&
                      (Math.abs(
                        data.locations.latitude - loc.coords.latitude
                      ) <=
                        searchDistance / 2 ||
                        Math.abs(
                          data.locations.longitude - loc.coords.longitude
                        ) <=
                          searchDistance / 2)
                    )
                  ) {
                    data.locations.latitude = loc.coords.latitude;
                    data.locations.longitude = loc.coords.longitude;
                  }
                  data.locations[`${act_loc.type}`] = API_data;
                  AsyncStorage.setItem(`DN_userlog`, JSON.stringify(data));
                  const places = nearestPoint(API_data, currentLoc, data.range);
                  if (places.length !== 0)
                    data = prepNotification(data, activity, places);
                }
              });
          }
        } else {
          const places = nearestPoint([act_loc], currentLoc, data.range);
          if (places.length !== 0)
            data = prepNotification(data, activity, places);
        }
      });
    }
  });
  return data.notifications;
};

async function prepNotification(data, activity, places) {
  const prevNotification = data.notifications.filter(
    (task) => task.id === activity.id
  );
  if (
    prevNotification.length === 0 ||
    prevNotification[0].date !== new Date().toDateString() ||
    (prevNotification[0].lat !== places[places.length - 1].latitude &&
      prevNotification[0].lon !== places[places.length - 1].longitude)
  ) {
    // console.log(prevNotification[0],"not same so new notify")
    registerForPushNotificationsAsync();
    await schedulePushNotification(
      activity.description,
      places[places.length - 1].distance.toString(),
      "loc"
    );
    data = await markNotified(activity.id, places[places.length - 1]);
  }
  return data;
}

function nearestPoint(data, location, range) {
  let places = [];
  // console.log("place", data);
  let delta = range;
  for (let i = 0; i < data.length; i++) {
    let deltaTest = distance(
      data[i].latitude,
      location.coords.latitude,
      data[i].longitude,
      location.coords.longitude
    );
    // console.log("distance", deltaTest);
    if (delta > deltaTest) {
      delta = deltaTest;
      places.push({ ...data[i], distance: delta });
    }
  }

  return places;
}

function distance(lat1, lat2, lon1, lon2) {
  // The math module contains a function named toRadians which converts from degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;
  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956 for miles
  let r = 6371;
  // calculate the result
  return c * r;
}

async function markNotified(id, place) {
  const datalog = await AsyncStorage.getItem("DN_userlog");
  const data = JSON.parse(datalog);
  const notifications = data.notifications.filter((task) => task.id === id);
  if (notifications.length === 0)
    data.notifications.push({
      id: id,
      lat: place.latitude,
      lon: place.longitude,
      date: new Date().toDateString(),
    });
  else
    data.notifications = data.notifications.map((task) => {
      if (task.id === id) {
        task.lat = place.latitude;
        task.lon = place.longitude;
        task.date = new Date().toDateString();
      }
      return task;
    });
  // console.log(data);
  AsyncStorage.setItem(`DN_userlog`, JSON.stringify(data));
  return data;
}

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log("background push notification:", now.toString());

  const datalog = await AsyncStorage.getItem("DN_userlog");
  if (datalog) {
    const data = JSON.parse(datalog);
    const activities = data.activities.filter(
      (activity) =>
        activity.notify &&
        activity.notified === undefined &&
        ((activity.datetime === null && activity.location) ||
          new Date(activity.datetime).toDateString() ===
            new Date().toDateString())
    );
    if (activities.length !== 0) notify(activities);
  }

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(
  description,
  notificationTrigger,
  type
) {
  // console.log(description, notificationTrigger, type);
  if (type === "loc")
    await Notifications.scheduleNotificationAsync({
      content: {
        title: description,
        body: Math.round(notificationTrigger) + "m away",
        // data: { data: data },
      },
      trigger: { seconds: 2 },
    });
  else
    await Notifications.scheduleNotificationAsync({
      content: {
        title: description,
        body: "in about " + notificationTrigger + " mins",
        // data: { data: data },
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
    // console.log(token);
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

async function addBackgroundFetch() {
  const registered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );
  if (!registered) {
    console.log("background task registered");
    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      // minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  } else {
    // console.log("background task already registered");
  }
}

const objectsEqual = (o1, o2) =>
  Object.keys(o1).length === Object.keys(o2).length &&
  Object.keys(o1).every((p) => o1[p] === o2[p]);

export default function UserNotifications() {
  const [state, dispatch] = React.useContext(UserContext);
  addBackgroundFetch();
  // const [isRegistered, setIsRegistered] = useState(false);
  useEffect(async () => {
    // const datalog = await AsyncStorage.getItem("DN_userlog");
    const activities = state.activities.filter(
      (activity) =>
        activity.notify &&
        activity.notified === undefined &&
        ((activity.datetime === null && activity.location) ||
          new Date(activity.datetime).toDateString() ===
            new Date().toDateString())
    );
    // console.log(datalog);
    // const registered = await TaskManager.isTaskRegisteredAsync(
    //   BACKGROUND_FETCH_TASK
    // );
    // setIsRegistered(registered);
    if (activities.length !== 0) {
      const notifications = await notify(activities);
      let notUpdate = true;
      notifications.every((newnote) => {
        const oldnote = state.notifications.filter(
          (note) => note.id === newnote.id
        );
        // console.log(oldnote,newnote)
        if (oldnote.length === 0) {
          console.log("missing data");
          notUpdate = false;
        } else {
          notUpdate = objectsEqual(oldnote[0], newnote);
          // console.log("equal objs", notUpdate);
        }
        return notUpdate;
      });
      // console.log(!notUpdate)
      if (!notUpdate) {
        console.log("dispatched");
        dispatch({
          type: "update_notifications",
          notifications: notifications,
        });
      }
      // console.log("background task registered");
      // BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      //   // minimumInterval: 60 * 15, // 15 minutes
      //   stopOnTerminate: false, // android only,
      //   startOnBoot: true, // android only
      // });
    }
  }, [state]);
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
