import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { UserProvider } from "../../globalvars";
import CategoryPage from "../CategoryPage";

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
    FlatList: View,
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

describe("CategoryPage", () => {
  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <CategoryPage />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("control button rendered", () => {
    const { queryByText } = render(
      <UserProvider>
        <CategoryPage />
      </UserProvider>
    );
    expect(queryByText("+")).not.toBeNull();
  });

  it("dropdown menu rendered", () => {
    const { queryByText } = render(
      <UserProvider>
        <CategoryPage />
      </UserProvider>
    );
    expect(queryByText("All")).not.toBeNull();
  });

  it("card renders", () => {
    const { queryByText } = render(
      <UserProvider>
        <CategoryPage />
      </UserProvider>
    );
    expect(queryByText("test activity")).not.toBeNull();
  });

  it("card edited", () => {
    const { getByText, queryByText } = render(
      <UserProvider>
        <CategoryPage />
      </UserProvider>
    );
    fireEvent.press(getByText("test activity"));
    expect(queryByText("test activity")).not.toBeNull();
  });

  it("add card", () => {
    const msg = "Take a walk";
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
      <UserProvider>
        <CategoryPage />
      </UserProvider>
    );
    fireEvent.press(getByText("+"));
    fireEvent.changeText(getByPlaceholderText("Add New Task"), msg);
    fireEvent.press(getByText("+"));
    expect(queryByPlaceholderText("Add New Task")).toBeNull();
  });

  it("test against snapshot", () => {
    const tree = renderer
      .create(
        <UserProvider>
          <CategoryPage />
        </UserProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
