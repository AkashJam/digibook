import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Card from "../Card";

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: View,
  };
});

const item = {
  id: 0,
  description: "test activity",
  group_id: "0",
  notify: false,
  location: { type: "custom", latitude: 0, longitude: 0 },
  datetime: new Date(),
  completed: false,
  createdOn: new Date().toString(),
  modifiedOn: null,
};

describe("Card", () => {
  const sendHandler = jest.fn();

  it("card exists", () => {
    const { queryByText } = render(<Card task={item} edit={false} />);
    expect(queryByText("test activity")).not.toBeNull();
  });

  it("card is clickable", async () => {
    const { getByText } = render(
      <Card task={item} edit={false} notifyToggle={sendHandler} />
    );
    fireEvent.press(getByText("test activity"));
    await waitFor(() => {
      expect(sendHandler).toHaveBeenCalledWith(item.id, !item.notify);
    });
  });
});
