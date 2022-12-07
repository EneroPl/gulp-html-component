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
  parseListeners(tag) {
    return tag.match(/p-on:[a-zA-Z]+="(.*?)"/gm).reduce((acc, item) => {
      const eventName = item.match(/:([a-zA-Z]+)=/)[1];
      const eventHandler = item.match(/"(.*?)"/)[1];

      acc[eventName] = eventHandler;
      return acc;
    }, {});
  },
  useListeners(component, listeners) {
    component = component.toString();

    Object.entries(listeners).forEach(([name, handler]) => {
      component = component.replace(new RegExp(`p-track:${name}`, "gm"), (matched) => {
        listeners[name] = null;
        return `on${name}="${handler}"`;
      });
    });

    if (component.includes("p-track:listeners")) {
      component = component.replace("p-track:listeners", () => {
        return Object.entries(listeners)
          .filter(([_, value]) => !!value)
          .reduce((acc, [key, handler]) => {
            acc.push(`on${key}="${handler}"`);
            return acc;
          }, [])
          .join(" ");
      });
    }
    
    return new Buffer.from(component, encoding);
  },
  parseProps(tag) {
    try {
      const props =
        tag.match(/p-bind:([a-zA-Z]+)="(.*?)"/gm)?.reduce((acc, prop) => {
          const propName = prop.match(/:([a-zA-Z]+)=/)[1];
          const propValue = prop.match(/"(.*?)"/)[1];

          acc[propName] = propValue;
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
