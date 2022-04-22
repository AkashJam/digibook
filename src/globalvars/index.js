
import Toast from "react-native-root-toast";
import React, { useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const user = {
  username: "",
  activities: [],
};

const toastTime = 2000;

//AsyncStorage.setItem(`${username}_log`, JSON.stringify([])); Needs to be added to the reducer

const reducer = (state, action) => {
  let log = [];
  switch (action.type) {
    case "set_user":
      return {
        username: action.user.username,
        activities: action.user.activities,
      };

    case "add_task":
      let id = state.activities.length + 1;
      let newTask = {
        id: id,
        key: `item-${id}`,
        taskName: action.taskName,
        group: null,
        notify: false,
        location: null,
        periodicity: "Once",
        datetime: action.datetime !== undefined ? action.datetime : null,
        completed: false,
        active: true,
        createdOn: new Date().toDateString(),
        modifiedOn: null,
      };
      log = [newTask, ...state.activities];
      toastr("Task added.", toastTime);
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log));
      return {
        username: state.username,
        activities: log,
      };

    case "rename_task":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            taskName: action.taskName,
            modifiedOn: new Date().toDateString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Task renamed.", toastTime);
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log));
      return {
        username: state.username,
        activities: log,
      };

    case "change_datetime":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            datetime: action.datetime,
            modifiedOn: new Date().toDateString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Date and time changed.", toastTime);
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log));
      return {
        username: state.username,
        activities: log,
      };

    case "change_location":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return {
            ...activity,
            location: action.location,
            modifiedOn: new Date().toDateString(),
          };
        } else {
          return activity;
        }
      });
      toastr("Location changed.", toastTime);
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log));
      return {
        username: state.username,
        activities: log,
      };

    case "toggle_alarm":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          toastr(activity.notify ? "Alarm Off" : "Alarm On.", toastTime);
          return {
            ...activity,
            notify: !activity.notify,
            modifiedOn: new Date().toDateString(),
          };
        } else {
          return activity;
        }
      });
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log));
      return {
        username: state.username,
        activities: log,
      };

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
            datetime: new Date().toDateString(),
            modifiedOn: new Date().toDateString(),
          };
        } else {
          return activity;
        }
      });
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log))
      return {
        username: state.username,
        activities: log,
      };

    case "delete_task":
      log = state.activities.map((activity) => {
        if (activity.id === action.id) {
          return { ...activity, active: false, modifiedOn: new Date().toDateString() };
        } else {
          return activity;
        }
      });
      toastr("Task deleted.", toastTime);
      AsyncStorage.setItem(`${state.username}_log`, JSON.stringify(log))
      return {
        username: state.username,
        activities: log,
      };

    default:
      return state;
  }
}
  

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
