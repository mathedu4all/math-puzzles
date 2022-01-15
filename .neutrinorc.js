const airbnb = require("@neutrinojs/airbnb");
const reactComponents = require("@neutrinojs/react-components");
const jest = require("@neutrinojs/jest");
const styles = require('@neutrinojs/style-loader');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      extends: ["react-app", "react-app/jest"],
    }),
    reactComponents({
      targets: {
        browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
      }
    }),
    styles({
      loaders: [
        {
          loader: "less-loader",
          useId: "less",
          options: {},
        },
      ],
      ruleId: "less",
      module: true,
      test: /\.less$/,
      modulesTest: /\.module.less$/,
    }),
    jest({
      collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!node_modules/"],
      coverageThreshold: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
      coverageReporters: ["text"],
      transformIgnorePatterns: [
        "/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)",
      ],
    }),
  ],
};
