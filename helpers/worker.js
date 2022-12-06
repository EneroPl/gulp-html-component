const fs = require("fs");
const gutil = require("gulp-util");

module.exports = ({ file, encoding, path }) => ({
  components() {
    try {
      const BASE_DIR = path + "/components";

      return fs
        .readdirSync(BASE_DIR, { withFileTypes: true })
        .map(({ name: filename }) => {
          const [name, format] = filename.split(".");

          return {
            name,
            format,
            filename,
            component: fs.readFileSync(`${BASE_DIR}/${filename}`, encoding),
          };
        })
        .filter(({ format }) => format === "html");
    } catch (err) {
      new gutil.PluginError(
        "gulp-html-component",
        `Path "${path}/components" not found.`
      );
    }
  },
  parseProps(tag) {
    try {
      return (
        tag.match(/p-[a-zA-Z]+=".*"/gm)?.reduce((acc, prop) => {
          let [key, value] = prop.split("=");

          key = key.split("-")[1];
          value = JSON.parse(value);

          acc[key] = value;
          return acc;
        }, {}) || {}
      );
    } catch (err) {
      return {};
    }
  },
  useProps(component, props) {
    component = component.toString();

    Object.entries(props).forEach(([key, value]) => {
      component = component.replace(new RegExp(`{{\\s*?${key}\\s*?}}`, "gm"), value);
    });

    return new Buffer.from(component, encoding);
  },
});
