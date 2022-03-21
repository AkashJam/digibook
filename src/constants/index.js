const COLORS = {
  primary: "#00A6FB", //Blue Jeans
  secondary: "#363635", //Jet
  accent: "#F6F0ED", //Isabelline
  red: "#FF0000",
  orange: "#FF8200",
  yellow: "#D5A021", //GoldenRod
  green: "#3E8914", //India Green
};

const SIZES = {
  padding: "5%",
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

export { COLORS, SIZES, FONTS, SHADOW };
