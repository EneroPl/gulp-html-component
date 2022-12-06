"use strict";
const fs = require("fs");
const gutil = require("gulp-util");
const through = require("through2");

const initialOptions = {
  path: "./src",
  encoding: "utf8",
};

module.exports = (options = initialOptions) => {
  const BASE_DIR = options.path + "/components";

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(
        new gutil.PluginError("gulp-html-components", "Streaming not supported")
      );
      return;
    }

    try {
      const data = file.contents.toString();

      fs.readdir(BASE_DIR, { withFileTypes: true }, (_, components) => {
        components.forEach((component) => {
          const [name] = component.name.split(".");

          if (data.includes(name)) {
            file.contents = new Buffer(
              file.contents
                .toString()
                .replace(
                  new RegExp(`<${name}(.*)?(\\/)?>(.*<\\/${name}>)?`, "gm"),
                  (matched) => {
                    const props =
                      matched
                        .match(/p-[a-zA-Z]+=".*"/gm)
                        ?.reduce((acc, prop) => {
                          let [key, value] = prop.split("=");

                          key = key.split("-")[1];
                          value = JSON.parse(value);

                          acc[key] = value;
                          return acc;
                        }, {}) || {};

                    let content = fs
                      .readFileSync(BASE_DIR + "/" + component.name)
                      .toString();

                    Object.entries(props).forEach(([key, value]) => {
                      content = content.replace(
                        new RegExp(`{{\\s*?${key}\\s*?}}`, "gm"),
                        value
                      );
                    });

                    return new Buffer.from(content, options.encoding);
                  }
                )
            );
          }
        });

        this.push(file);
        cb();
      });
    } catch (err) {
      this.emit("error", err);
    }
  });
};
