import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Header from "../Header";

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Ionicons: View,
  };
});

const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  // const actualNav = jest.requireActual('@react-navigation/native');
  return {
    // ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe("Header", () => {
  it("options exists", () => {
    const { queryByLabelText } = render(<Header screen={"Home"} />);
    expect(queryByLabelText("menu")).not.toBeNull();
  });
});

describe("Header", () => {
  const sendHandler = jest.fn();
  it("navigate to auth page", () => {
    const { getByLabelText, queryByText } = render(<Header screen={"Home"} />);
    fireEvent.press(getByLabelText("menu"));
    expect(queryByText("Logout")).not.toBeNull();
    // expect(mockedNavigate).toHaveBeenCalledWith("Auth");
  });
});
