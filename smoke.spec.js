import React from "react";
import renderer from "react-test-renderer";
import App from "./App";
// import { useFonts } from "expo-font"

jest.mock("expo-font", () => {
  // const actualFonts = jest.requireActual('expo-fonts');
  return {
    // ...actualFonts,
    useFonts: () => {
      return [{ fontsLoaded: true }];
    },
  };
});

jest.mock("expo-constants", () => {
  const Constants = { isDevice: false };
  return Constants;
});

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: View,
  };
});

jest.mock("react-native-root-toast", () => {
  const { View } = require("react-native");
  return {
    Toast: View,
  };
});

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    MapView: View,
    Marker: View,
  };
});

// describe("truth", () => {
//   it("is true", () => {
//     expect(true).toEqual(true);
//   });
// });

// it("checks if Async Storage is used", async () => {
//   await asyncOperationOnAsyncStorage();

//   expect(AsyncStorage.getItem).toBeCalledWith("DN_userlog");
// });

it("renders without crashing", () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

it("test against snapshot", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});


