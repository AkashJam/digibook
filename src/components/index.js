import Card from "./Card";
import ControlButton from "./Modals/ControlButton";

function Settings() {
  const today = new Date();
  const [day, setDay] = useState("");
  const [date, setDate] = useState(today);
  switch (today.getDay()) {
    case 0:
      setDay("Sunday");
      break;
    case 1:
      setDay("Monday");
      break;
    case 2:
      setDay("Tuesday");
      break;
    case 3:
      setDay("Wednesday");
      break;
    case 4:
      setDay("Thursday");
      break;
    default:
      break;
  }
  today.getDay();
}

export { Card, Settings, ControlButton };
