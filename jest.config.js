module.exports = {
  setupFilesAfterEnv: ["./jest.setup.after.env.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|native-base-*)",
  ],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
  },
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  globals: {
    __DEV__: true,
  },
  verbose: true,
};
