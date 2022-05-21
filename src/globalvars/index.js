import Toast from "react-native-root-toast";
import API from "./api";
import { UserContext, UserProvider } from "./store";

const toastTime = 5000;

const toastr = (msg, duration = toastTime) => {
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

export { toastr, UserContext, UserProvider, API };
