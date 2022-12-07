const fs = require("fs");
const gutil = require("gulp-util");

const parseAttributes = (el, type) => {
  return (
    el
      .match(new RegExp(`p-${type}:[a-zA-Z]+="(.*?)"`, "gm"))
      ?.reduce((acc, item) => {
        try {
          const [eventName, eventHandler] = [
            item.match(/:([a-zA-Z]+)=/)[1],
            item.match(/"(.*?)"/)[1],
          ];

          acc[eventName] = eventHandler;
          return acc;
        } catch (err) {
          return acc;
        }
      }, {}) || {}
  );
};

module.exports = ({ encoding, path }) => ({
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
  getAttributes(tag, type) {
    try {
      return parseAttributes(tag, type);
    } catch (err) {
      throw new gutil.PluginError("gulp-html-component", err);
    }
  },
  useListeners(component, listeners) {
    component = component.toString();

    Object.entries(listeners).forEach(([name, handler]) => {
      component = component.replace(new RegExp(`p-on:${name}`, "gm"), () => {
        listeners[name] = null;
        return `on${name}="${handler}"`;
      });
    });

    if (component.includes("p-on:listeners")) {
      component = component.replace("p-on:listeners", () => {
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
  useProps(tag, component, props) {
    if (!component) {
      return false;
    }

    component = component.toString();

    Object.entries(props).forEach(([key, value]) => {
      const templateMatch = component.match(
        new RegExp(`{{\\s*?${key}\\s*?}}`, "gm")
      );
      const attributeMatch = component.match(new RegExp(`p-bind:${key}`, "gm"));

      if (!!templateMatch?.length) {
        component = component.replace(templateMatch[0], value);
      }

      if (!!attributeMatch?.length) {
        component = component.replace(attributeMatch[0], `${key}="${value}"`);
      }

      return component;
    });

    const classAttribute = tag.match(/class="(.*?)"/gm);

    if (!!classAttribute?.length) {
      const classes = classAttribute[0].match(/"(.*?)"/)[1];

      component = component.replace(/class="(.*?)"/, (match) => {
        const componentClasses = match.match(/"(.*?)"/)[1];
        return `class="${[componentClasses, classes].join(" ")}"`;
      });
    }

    return new Buffer.from(component, encoding);
  },
});
