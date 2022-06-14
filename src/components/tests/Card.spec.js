import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Card from "../Card";

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: View,
  };
});

describe("Card", () => {
  const item = {
    id: 1,
    description: "Buy some eggs",
    group_id: 1,
    notify: false,
    location: null,
    datetime: null,
    completed: false,
    createdOn: new Date().toString(),
    modifiedOn: null,
  };
  const sendHandler = jest.fn();
  it("card exists", () => {
    const { queryByText } = render(
      <Card
        task={item}
        index={1}
        edit={false}
      />
    );
    expect(queryByText("Buy some eggs")).not.toBeNull();
  });
});
