const fs=require("fs"),gutil=require("gulp-util"),through=require("through2"),Worker=require("./helpers/worker.js"),initialOptions={path:"./src",encoding:"utf8"};module.exports=(t=initialOptions)=>{let r=Worker(t);return through.obj(function(e,n,i){if(e.isNull()){i(null,e);return}if(e.isStream()){i(new gutil.PluginError("gulp-html-component","Streaming not supported"));return}try{r.components().forEach(({name:n,component:i})=>{let o=e.contents.toString().replace(RegExp(`<${n}(.*)?(\\/)?>(.*<\\/${n}>)?`,"gm"),t=>{if(e.contents.toString().includes(n)){let o=r.getAttributes(t,"on"),s=r.getAttributes(t,"bind"),u=i;return u=r.useListeners(u,o),u=r.useProps(t,u,s)}});e.contents=new Buffer.from(o,t.encoding)}),this.push(e),i()}catch(o){this.emit("error",o)}})};