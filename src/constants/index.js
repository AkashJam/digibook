import { StatusBar, Platform } from "react-native";

const COLORS = {
  primary: "#00A6FB", //Blue Jeans rgb(0, 166, 251)
  secondary: "#363635", //Jet
  accent: "#F6F0ED", //Isabelline
  red: "#A53F2B", //Chinese Red
  orange: "#FF8200",
  yellow: "#D5A021", //GoldenRod
  green: "rgb(127,184,0)", //"#7FB800", //Apple Green     India Green rgb(62, 137, 20)
};

const SIZES = {
  padding: "4%",
  margin: "2%",
  borderRadius: 15,
  textBoxRadius: 25,
  h1: 24,
  h2: 20,
  p: 16,
};

const FONTS = {
  h1_bold: { fontSize: SIZES.h1, fontFamily: "Caviar_Dreams_Bold" },
  h2_bold: { fontSize: SIZES.h2, fontFamily: "Caviar_Dreams_Bold" },
  p_regular: { fontSize: SIZES.p, fontFamily: "Fredoka_Regular" },
};

const SHADOW = {
  elevation: 5,
  shadowColor: COLORS.secondary,
  shadowOffset: { width: 5, height: 12 },
  shadowRadius: 12,
};

const PAGE = {
  paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight + 10,
  flex: 1,
  backgroundColor: COLORS.primary,
  padding: SIZES.padding,
};

const PAGEHEAD = {
  ...FONTS.h1_bold,
  color: COLORS.accent,
  padding: SIZES.padding,
};

export { COLORS, SIZES, FONTS, SHADOW, PAGE, PAGEHEAD };
