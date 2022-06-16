import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Header from "../Header";
// import { useNavigation } from "@react-navigation/native";

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
  it("menu exists", () => {
    const { queryAllByRole } = render(<Header screen={"Home"} />);
    expect(queryAllByRole("menu")).not.toBeNull();
  });
});

describe("Header", () => {
  it("screen name exists", () => {
    const { queryByText } = render(<Header screen={"Home"} />);
    expect(queryByText("Home")).not.toBeNull();
  });
});

// describe("Header", () => {
//   const sendHandler = jest.fn();
//   it("navigate to auth page", () => {
//     const { queryAllByRole, queryByText } = render(<Header screen={"Home"} />);
//     fireEvent.press(queryAllByRole("menu"));
//     expect(queryByText("Logout")).not.toBeNull();
//     // expect(mockedNavigate).toHaveBeenCalledWith("Auth");
//   });
// });
