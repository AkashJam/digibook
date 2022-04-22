import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, FONTS } from "../../constants/index";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";

export default function LocateMap(props) {
  const [coordinates, setCoordinates] = useState(
    props.location ? props.location : { latitude: 45.4642, longitude: 9.19 }
  );

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={{ backgroundColor: COLORS.primary }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 45.4642,
              longitude: 9.19,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              draggable
              title="Hold to drag"
              coordinate={coordinates}
              onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
            />
          </MapView>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.button} onPress={props.close}>
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.setLocation(coordinates)}
            >
              <Text style={{ ...FONTS.h2_bold, color: COLORS.primary }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = new StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    elevation: 5,
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    //   backgroundColor: COLORS.accent,
    padding: 20,
  },
  map: {
    // margin: SIZES.padding,
    borderColor: COLORS.accent,
    borderWidth: 10,
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 1.4,
  },
  bottom: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: COLORS.accent,
    borderTopWidth: 3,
    borderColor: COLORS.secondary,
  },
  button: {
    height: 40,
    width: 80,
    borderRadius: SIZES.textBoxRadius,
    alignItems: "center",
    justifyContent: "center",
  },
});
