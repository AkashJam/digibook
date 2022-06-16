import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LocateMap from "../Modals/LocateMap";
import renderer from "react-test-renderer";
import { UserProvider } from "../../globalvars";

//  parentInstance.children.indexOf is not a function
ReactDOM.createPortal = (node) => node;

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    MapView: View,
    Marker: View,
  };
});

jest.mock("react-native-root-toast", () => {
  const { View } = require("react-native");
  return {
    Toast: View,
  };
});

jest.mock("expo-location", () => {
  //   const actualLoc = jest.requireActual("expo-location");
  const Location = {
    requestForegroundPermissionsAsync: () => {
      return { status: "not granted" };
    },
    // getCurrentPositionAsync: () => then(),
  };
  return Location;
});

describe("LocateMap", () => {
  const sendHandler = jest.fn();
  const loc = { type: "custom", latitude: 0, longitude: 0 };
  it("does not render", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <LocateMap
            map={false}
            location={loc}
            close={sendHandler}
            setLocation={sendHandler}
          />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).not.toBeTruthy();
  });

  it("renders without crashing", async () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <LocateMap
            map={true}
            location={loc}
            close={sendHandler}
            setLocation={sendHandler}
          />
        </UserProvider>
      )
      .toJSON();
    await waitFor(() => {
      expect(rendered).toBeTruthy();
    });
  });

  it("location exists", () => {
    const { queryByText } = render(
      <UserProvider>
        <LocateMap
          map={true}
          location={loc}
          close={sendHandler}
          setLocation={sendHandler}
        />
      </UserProvider>
    );
    expect(queryByText("Location")).not.toBeNull();
  });

  it("dropdown exists", () => {
    const { queryByText } = render(
      <UserProvider>p_regular
        <LocateMap
          map={true}
          location={loc}
          close={sendHandler}
          setLocation={sendHandler}
        />
      </UserProvider>
    );
    expect(queryByText("Custom")).not.toBeNull();
  });
});
