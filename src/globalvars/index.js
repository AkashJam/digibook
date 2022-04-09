import { Dimensions } from "react-native";
import Toast from "react-native-root-toast";
import { COLORS } from "../constants";


const initialActivities = []; //need to store and take from async storage

function activityLog(state, action) {
  switch (action.type) {
    case 'add':
      return {count: state.count + 1};
    case 'edit':
      return {count: state.count - 1};
    case 'delete':
        return {count: state.count - 1};
    default:
      throw new Error();
  }
}

const globalvars = {
  toast: (msg,duration) => {
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
  },
};

export { globalvars, activityLog, initialActivities };
