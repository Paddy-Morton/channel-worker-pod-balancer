module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        compiler: "ttypescript",
      },
    ],
  },
  setupFiles: ["<rootDir>config.ts"],
};
