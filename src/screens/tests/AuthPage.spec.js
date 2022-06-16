import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import AuthPage from "../AuthPage";
import { UserProvider } from "../../globalvars";

// to mock login function fetch
require("jest-fetch-mock").enableMocks();
fetchMock.dontMock();

jest.mock("react-native-root-toast", () => {
  const { View } = require("react-native");
  return {
    Toast: View,
  };
});

jest.mock("expo-constants", () => {
  const Constants = { isDevice: false };
  return Constants;
});

const mockedNavigate = jest.fn();

const navigation = {
  navigate: mockedNavigate,
};

describe("AuthPage", () => {
  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <AuthPage />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("username input field exists", () => {
    const { queryByPlaceholderText } = render(
      <UserProvider>
        <AuthPage />
      </UserProvider>
    );
    expect(queryByPlaceholderText("Username")).not.toBeNull();
  });

  it("password input field exists", () => {
    const { queryByPlaceholderText } = render(
      <UserProvider>
        <AuthPage />
      </UserProvider>
    );
    expect(queryByPlaceholderText("Password")).not.toBeNull();
  });

  it("login button initially disabled", () => {
    const { getByText } = render(
      <UserProvider>
        <AuthPage navigation={navigation} />
      </UserProvider>
    );
    fireEvent.press(getByText("LOGIN"));
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("register button initially disabled", () => {
    const { getByText } = render(
      <UserProvider>
        <AuthPage navigation={navigation} />
      </UserProvider>
    );
    fireEvent.press(getByText("REGISTER"));
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("test against snapshot", () => {
    const tree = renderer
      .create(
        <UserProvider>
          <AuthPage />
        </UserProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
