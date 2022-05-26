import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";

export default function SettingsPage() {
  //   const [expoPushToken, setExpoPushToken] = useState("");
  //   const [notification, setNotification] = useState(false);
  //   const notificationListener = useRef();
  //   const responseListener = useRef();

  //   useEffect(() => {
  //     registerForPushNotificationsAsync().then((token) =>
  //       setExpoPushToken(token)
  //     );

  //     notificationListener.current =
  //       Notifications.addNotificationReceivedListener((notification) => {
  //         setNotification(notification);
  //       });

  //     responseListener.current =
  //       Notifications.addNotificationResponseReceivedListener((response) => {
  //         console.log("notification response", response);
  //       });

  //     return () => {
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     };
  //   }, []);

  return <View>
      <Text>Display name</Text>
      <Text>Password</Text>
      <Text>Range</Text>
      <Text>Collaborators</Text>
  </View>;
}

// // const styles = StyleSheet.create({
// //   screen: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   textContainer: {
// //     margin: 10,
// //   },
// //   boldText: {
// //     fontWeight: "bold",
// //   },
// // });
