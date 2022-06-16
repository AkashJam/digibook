import SettingsPage from "../SettingsPage";
import renderer from "react-test-renderer";
import { UserProvider } from "../../globalvars";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

// mock navigation
const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: View,
    FontAwesome: View,
    Ionicons: View,
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

describe("SettingsPage", () => {
  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <SettingsPage />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("display name renders", () => {
    const { queryByText } = render(
      <UserProvider>
        <SettingsPage />
      </UserProvider>
    );
    expect(queryByText("tester")).not.toBeNull();
  });

  it("confirm button renders", () => {
    const { queryByText, getByPlaceholderText } = render(
      <UserProvider>
        <SettingsPage />
      </UserProvider>
    );
    fireEvent.changeText(getByPlaceholderText("Enter your name"), "test");
    expect(queryByText("Confirm")).not.toBeNull();
  });

  it("confirm button does not render when invalid input", () => {
    const { queryByText, getByPlaceholderText } = render(
      <UserProvider>
        <SettingsPage />
      </UserProvider>
    );
    fireEvent.changeText(getByPlaceholderText("Enter your name"), "");
    expect(queryByText("Confirm")).toBeNull();
  });

  it("test against snapshot", () => {
    const tree = renderer
      .create(
        <UserProvider>
          <SettingsPage />
        </UserProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
