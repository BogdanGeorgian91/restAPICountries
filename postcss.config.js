const postcssPresetEnv = require("postcss-preset-env");
const postcss = require("postcss");
const postcssCustomMedia = require("postcss-custom-media");
const nested = require("postcss-nested");
const ifMedia = require("postcss-if-media");

const vars = require("postcss-simple-vars");
const fs = require("fs");
const atImport = require("postcss-import");
const css = fs.readFileSync("src/index.css", "utf8");

postcss()
  .use(atImport())
  .process(css, {
    // `from` option is needed here
    from: "src/index.css",
  })
  .then((result) => {
    const output = result.css;

    console.log(output);
  });

module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-simple-vars"),
    require("autoprefixer"),
    require("postcss-if-media"),
    require("postcss-preset-env")({
      stage: 1,
      features: {
        "logical-properties-and-values": false,
        "prefers-color-scheme-query": false,
        "gap-properties": false,
        "custom-properties": false,
        "dir-pseudo-class": false,
        "focus-within-pseudo-class": false,
        "focus-visible-pseudo-class": false,
        "color-functional-notation": false,
      },
    }),
    require("postcss-nested"),
  ],
};

// module.exports = {
//   plugins: [
//     postcssPresetEnv({
//       stage: 0,
//       features: {
//         "logical-properties-and-values": false,
//         "prefers-color-scheme-query": false,
//         "gap-properties": false,
//         "custom-properties": false,
//         "dir-pseudo-class": false,
//         "focus-within-pseudo-class": false,
//         "focus-visible-pseudo-class": false,
//         "color-functional-notation": false,
//       },
//     }),
//   ],
// };
