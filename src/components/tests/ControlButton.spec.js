import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ControlButton from "../Modals/ControlButton";

describe("ControlButton", () => {
  it("button exists", () => {
    const { queryByText } = render(<ControlButton />);
    expect(queryByText("+")).not.toBeNull();
  });

  it("opens text input and add task", () => {
    const msg = "Buy some eggs";
    const sendHandler = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <ControlButton addTask={sendHandler} />
    );
    fireEvent.press(getByText("+"));
    fireEvent.changeText(getByPlaceholderText("Add New Task"), msg);
    fireEvent.press(getByText("+"));
    expect(sendHandler).toHaveBeenCalledWith(msg);
  });

  it("add task not called for empty string", () => {
    const sendHandler = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <ControlButton addTask={sendHandler} />
    );
    fireEvent.press(getByText("+"));
    fireEvent.changeText(getByPlaceholderText("Add New Task"), "");
    fireEvent.press(getByText("+"));
    expect(sendHandler).not.toHaveBeenCalled();
  });

  it("clicking add after task input clears the message field", () => {
    const sendHandler = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <ControlButton addTask={sendHandler} />
    );
    fireEvent.press(getByText("+"));
    fireEvent.changeText(getByPlaceholderText("Add New Task"), "Buy some eggs");
    fireEvent.press(getByText("+"));
    fireEvent.press(getByText("+"));
    expect(getByPlaceholderText("Add New Task")).toHaveProp("value", "");
  });
});
