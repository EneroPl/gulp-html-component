const fs = require("fs");
const gutil = require("gulp-util");

module.exports = ({ file, encoding, path }) => ({
  components() {
    try {
      const BASE_DIR = path + "/components";

      return fs
        .readdirSync(BASE_DIR, { withFileTypes: true })
        .filter(({ name }) => name[0] === name[0].toUpperCase())
        .map(({ name: filename }) => {
          const [name, format] = filename.split(".");

          return {
            name,
            format,
            filename,
            component: fs.readFileSync(`${BASE_DIR}/${filename}`, encoding),
          };
        })
        .filter(({ format }) => ["html", "htm"].includes(format));
    } catch (err) {
      throw new gutil.PluginError(
        "gulp-html-component",
        `Path "${path}/components" not found.`
      );
    }
  },
  parseProps(tag) {
    try {
      const props =
        tag.match(/p-[a-zA-Z]+=('.*?'|".*?")/gm)?.reduce((acc, prop) => {
          let [key, value] = prop.split("=");

          key = key.split("-")[1];
          value = JSON.parse(value);

          acc[key] = value;
          return acc;
        }, {}) || {};

      return props;
    } catch (err) {
      throw new gutil.PluginError("gulp-html-plugin", err);
    }
  },
  useProps(component, props) {
    if (!component) {
      return false;
    }

    component = component.toString();

    Object.entries(props).forEach(([key, value]) => {
      component = component.replace(
        new RegExp(`{{\\s*?${key}\\s*?}}`, "gm"),
        value
      );
    });

    return new Buffer.from(component, encoding);
  },
});
