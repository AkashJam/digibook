import renderer from "react-test-renderer";
import { UserProvider } from "../../globalvars";
import ActivityPage from "../ActivityPage";
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

jest.mock("expo-constants", () => {
  const Constants = { isDevice: false };
  return Constants;
});

jest.mock("react-native-root-toast", () => {
  const { View } = require("react-native");
  return {
    Toast: View,
  };
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: View,
    MaterialIcons: View,
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

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    FlatList: View,
  };
});

describe("ActivityPage", () => {
  const date = new Date().toDateString();

  const route = { params: { id: 0 } };

  it("renders without crashing", () => {
    const rendered = renderer
      .create(
        <UserProvider>
          <ActivityPage route={route} />
        </UserProvider>
      )
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it("group renders", async () => {
    const { queryByText } = render(
      <UserProvider>
        <ActivityPage route={route} />
      </UserProvider>
    );

    await waitFor(() => {
      expect(queryByText("Ok")).not.toBeNull();
    });
  });

  it("group renders", async () => {
    const { queryByText } = render(
      <UserProvider>
        <ActivityPage route={route} />
      </UserProvider>
    );

    await waitFor(() => {
      expect(queryByText("Cancel")).not.toBeNull();
    });
  });

  it("group renders", async () => {
    const { queryByText } = render(
      <UserProvider>
        <ActivityPage route={route} />
      </UserProvider>
    );
    await waitFor(() => {
      expect(queryByText("All")).toBeNull();
    });
  });

  it("description renders", async () => {
    const { queryByPlaceholderText } = render(
      <UserProvider>
        <ActivityPage route={route} />
      </UserProvider>
    );
    await waitFor(() => {
      expect(queryByPlaceholderText("Add New Task")).not.toBeNull();
    });
  });
});
