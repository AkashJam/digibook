import Toast from "react-native-root-toast";
import React, { useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const user = {
  username: "",
  displayName: "",
  collaborators: [],
  groups: [],
  activities: [],
};

const toastTime = 2000;

const localstore = (name, data) =>
  AsyncStorage.setItem(`${name}_log`, JSON.stringify(data)); // Needs to be added to the reducer

const reducer = (state, action) => {
  let id = 0;
  let log = [];
  let obj = {};
  switch (action.type) {
    case "set_user":
      return {
        username: action.user.username,
        displayname: action.user.displayname,
        collaborators: action.user.collaborators,
        groups: action.user.groups,
        activities: action.user.activities,
      };

    case "add_task":
      id = state.activities.length + 1;
      let newTask = {
        id: id,
        key: `item-${id}`,
        name: action.name,
        group: action.group ? action.group : null,
        notify: false,
        location: null,
        datetime: action.datetime !== undefined ? action.datetime : null,
        completed: false,
        active: true,
        createdOn: new Date().toString(),
        modifiedOn: null,
      };
      log = [newTask, ...state.activities];
      toastr("Task added.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "rename_task":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            name: action.name,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Task renamed.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "delete_task":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            active: false,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Task deleted.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "change_group":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            group: action.group,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Group changed.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "change_datetime":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            datetime: action.datetime,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Date and time changed.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "change_location":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            location: action.location,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Location changed.", toastTime);
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "toggle_alarm":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          toastr(activity.notify ? "Alarm Off" : "Alarm On.", toastTime);
          return {
            ...activity,
            notify: !activity.notify,
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "toggle_completion":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          toastr(
            activity.completed ? "Task no longer completed" : "Task completed.",
            toastTime
          );
          return {
            ...activity,
            completed: !activity.completed,
            datetime: new Date().toString(),
            modifiedOn: new Date().toString(),
          };
        } else {
          return activity;
        }
      });
      obj = { ...state, activities: log };
      localstore(state.username, obj);
      return obj;

    case "add_group":
      id = state.groups.length + 2;
      let newGroup = {
        id: id,
        name: action.name,
        active: true,
        createdOn: new Date().toString(),
        modifiedOn: null,
      };
      log = [newGroup, ...state.groups];
      toastr("Group added.", toastTime);
      obj = { ...state, groups: log };
      localstore(state.username, obj);
      return obj;

    case "rename_group":
      log = state.groups.map((group) => {
        if (group.id === action.id) {
          return {
            ...activity,
            name: action.name,
            modifiedOn: new Date().toString(),
          };
        } else {
          return group;
        }
      });
      toastr("Group renamed.", toastTime);
      obj = { ...state, groups: log };
      localstore(state.username, obj);
      return obj;

    case "delete_group":
      log = state.groups.map((group) => {
        if (group.id === action.id) {
          return {
            ...group,
            active: false,
            modifiedOn: new Date().toString(),
          };
        } else {
          return group;
        }
      });
      toastr("Group deleted.", toastTime);
      obj = { ...state, groups: log };
      localstore(state.username, obj);
      return obj;

    default:
      return state;
  }
};

const UserContext = React.createContext({
  state: user,
  dispatch: () => null,
});

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, user);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

const toastr = (msg, duration) => {
  // Add a Toast on screen.
  let toast = Toast.show(msg, {
    duration: Toast.durations.LONG,
    // position: Dimensions.get("window").height/1.005,
    // backgroundColor: COLORS.secondary,
  });

  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  setTimeout(function hideToast() {
    Toast.hide(toast);
  }, duration);
};

export { toastr, UserContext, UserProvider };
