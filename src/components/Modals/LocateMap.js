import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, FONTS, PAGEHEAD } from "../../constants/index";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import DropDownPicker from "react-native-dropdown-picker";

export default function LocateMap(props) {
  const [coordinates, setCoordinates] = useState(
    props.location
      ? {
          latitude: props.location.latitude,
          longitude: props.location.longitude,
        }
      : { latitude: 45.4642, longitude: 9.19 }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.location ? props.location.type : 1);
  const categories = [
    { label: "Custom", value: 1 },
    { label: "Hospital", value: 2 },
    { label: "Restaurant", value: 3 },
    { label: "Supermarket", value: 4 },
  ];
  const [items, setItems] = useState(categories);

  // const response = fetch(
  //   `http://www.overpass-api.de/api/interpreter?data=[out:json];node
  //   ["shop"="supermarket"]
  //   (41.884387437208,12.480683326721,41.898699521063,12.503321170807);
  //   out;`
  // )
  //   .then((response) => response.json())
  //   .then((data) => console.log(data.elements));

  // const setLocation = () => {};

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View
          style={{
            backgroundColor: "rgba(28,115,180,255)",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              ...PAGEHEAD,
              marginHorizontal: SIZES.padding,
              marginTop: SIZES.padding,
            }}
          >
            Location
          </Text>
          <View
            style={{
              width: "100%",
              padding: SIZES.padding,
              justifyContent: "center",
            }}
          >
            <DropDownPicker
              style={styles.dropdown}
              dropDownContainerStyle={styles.container}
              textStyle={{
                color: COLORS.secondary,
                ...FONTS.h2_bold,
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
          </View>
          <MapView
            style={styles.map}
            zoomControlEnabled={true}
            initialRegion={{
              latitude: 45.4642,
              longitude: 9.19,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              draggable
              pinColor="rgb(28,115,180)"
              title="Hold to drag"
              coordinate={coordinates}
              onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
            />
          </MapView>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.button} onPress={props.close}>
              <Text style={{ ...FONTS.h2_bold, color: "rgb(28,115,180)" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.setLocation(coordinates)}
            >
              <Text style={{ ...FONTS.h2_bold, color: "rgb(28,115,180)" }}>
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
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
    width: Dimensions.get("window").width / 1.3,
    height: Dimensions.get("window").height / 2.3,
  },
  bottom: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: COLORS.accent,
    // borderTopWidth: 3,
    // borderColor: COLORS.secondary,
  },
  button: {
    height: 40,
    width: 80,
    borderRadius: SIZES.textBoxRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: COLORS.accent,
    marginHorizontal: SIZES.margin,
    width: "78.5%",
    padding: 10,
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
    width: "80%",
    borderRadius: SIZES.borderRadius,
    borderWidth: 0,
  },
});
