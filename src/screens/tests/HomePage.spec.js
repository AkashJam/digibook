import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { UserProvider } from "../../globalvars";
import HomePage from "../HomePage";

// to mock login function fetch
require("jest-fetch-mock").enableMocks();
fetchMock.dontMock();

jest.mock("react-native-root-toast", () => {
  const { View } = require("react-native");
  return {
    Toast: View,
  };
});

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: View,
  };
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: View,
    Ionicons: View,
  };
});

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    MapView: View,
    Marker: View,
  };
});

jest.mock("expo-constants", () => {
  const Constants = { isDevice: false };
  return Constants;
});

// mock navigation
const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe("HomePage", () => {
  const date = new Date().toDateString();

  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <HomePage />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("date is rendered", () => {
    const { queryByText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    expect(queryByText(date)).not.toBeNull();
  });

  it("control button rendered", () => {
    const { queryByText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    expect(queryByText("+")).not.toBeNull();
  });

  it("input task rendered", () => {
    const { getByText, queryByPlaceholderText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    fireEvent.press(getByText("+"));
    expect(queryByPlaceholderText("Add New Task")).not.toBeNull();
  });

  it("card renders", () => {
    const { queryByText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    expect(queryByText("test activity")).not.toBeNull();
  });

  it("edit card", () => {
    const { getByText, queryByText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    fireEvent.press(getByText("test activity"));
    expect(queryByText("test activity")).not.toBeNull();
  });

  it("add card", () => {
    const msg = "Take a walk";
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
      <UserProvider>
        <HomePage />
      </UserProvider>
    );
    fireEvent.press(getByText("+"));
    fireEvent.changeText(getByPlaceholderText("Add New Task"), msg);
    fireEvent.press(getByText("+"));
    expect(queryByPlaceholderText("Add New Task")).toBeNull();
  });
});
