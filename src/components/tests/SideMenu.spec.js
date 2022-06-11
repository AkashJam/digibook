import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SideMenu from "../Modals/SideMenu";

describe("SideMenu", () => {
  const sendHandler = jest.fn();
  it("options exists", () => {
    const { queryByText } = render(
      <SideMenu screen={"Home"} active={true} toggleSideMenu={sendHandler} />
    );
    expect(queryByText("Home")).not.toBeNull();
  });
});
