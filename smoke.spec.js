import React from "react";
import renderer from "react-test-renderer";
import App from "./App";

// jest.mock("expo-fonts", () => {
//   const actualFonts = jest.requireActual('expo-fonts');
//   return {
//     ...actualFonts,
//     useFonts: () => jest.fn(),
//   };
// });

describe("truth", () => {
  it("is true", () => {
    expect(true).toEqual(true);
  });
});

// it("checks if Async Storage is used", async () => {
//   await asyncOperationOnAsyncStorage();

//   expect(AsyncStorage.getItem).toBeCalledWith("DN_userlog");
// });

it("App renders without crashing", () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

it("App test against snapshot", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
