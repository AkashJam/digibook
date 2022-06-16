import renderer from "react-test-renderer";
import { CollabMenu } from "../";
import ReactDOM from "react-dom";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

//  parentInstance.children.indexOf is not a function
ReactDOM.createPortal = (node) => node;

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: View,
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

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    FlatList: View,
  };
});

jest.mock("expo-constants", () => {
  const Constants = { isDevice: false };
  return Constants;
});

describe("CollabMenu", () => {
  const sendHandler = jest.fn();
  const user = [];
  it("does not render", () => {
    const rendered = renderer
      .create(
        <CollabMenu
          active={false}
          close={sendHandler}
          id={0}
          owner={true}
          users={user}
          setUsers={sendHandler}
        />
      )
      .toJSON();
    expect(rendered).not.toBeTruthy();
  });

  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <CollabMenu
          active={true}
          close={sendHandler}
          id={1}
          owner={true}
          users={user}
          setUsers={sendHandler}
        />
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("collaborators exists", () => {
    const { queryByText } = render(
      <CollabMenu
        active={true}
        close={sendHandler}
        id={1}
        owner={true}
        users={user}
        setUsers={sendHandler}
      />
    );
    expect(queryByText("Collaborators")).not.toBeNull();
  });
});
