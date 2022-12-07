const fs = require("fs");
const gutil = require("gulp-util");
const through = require("through2");
const Worker = require("./helpers/worker.js");

const initialOptions = {
  path: "./src",
  encoding: "utf8",
};

module.exports = (options = initialOptions) => {
  const worker = Worker(options);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(
        new gutil.PluginError("gulp-html-component", "Streaming not supported")
      );
      return;
    }

    try {
      worker.components().forEach(({ name, component }) => {
        const handler = file.contents
          .toString()
          .replace(
            new RegExp(`<${name}(.*)?(\\/)?>(.*<\\/${name}>)?`, "gm"),
            (tag) => {
              if (file.contents.toString().includes(name)) {
                const listeners = worker.getAttributes(tag, "on");
                const props = worker.getAttributes(tag, "bind");

                let outputComponent = component;
                outputComponent = worker.useListeners(
                  outputComponent,
                  listeners
                );
                outputComponent = worker.useProps(tag, outputComponent, props);

                return outputComponent;
              }
            }
          );

        file.contents = new Buffer.from(handler, options.encoding);
      });

      this.push(file);
      cb();
    } catch (err) {
      this.emit("error", err);
    }
  });
};
