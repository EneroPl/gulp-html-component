# HTML Components

When we work with static pages, like landing pages or other small-scale projects, there are often blocks of code that have to be duplicated in an html file or given to JavaScript, creating separate block rendering functions.

I thought that both options have disadvantages: Abundance of duplicate code; extra JavaScript logic, where there is no talk of extensibility and universality. Therefore, I decided to make this utility capable of working both on its own for more comfortable work with display components without having to think about display logic.

# Install

This package is not available for usage yet

# Props

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>path</code></td>
    <td>String</td>
    <td align="center">./src</td>
    <td>Base path from your project.</td>
  </tr>
  <tr>
    <td><code>encoding</code></td>
    <td>String</td>
    <td align="center">utf8</td>
    <td>Base encoding format of your files.</td>
  </tr>
</table>

# Usage

## In gulpfile.js

```javascript
const gulp = require("gulp")
const htmlComponent = require("gulp-html-component");

gulp.task("handle-html", function() {
  return gulp.src("your/path")
    .pipe(htmlComponent({
      // This props are default, you may not set it
      path: "./src",
      encoding: "utf8"
    }))
})
```

## In HTML files

Create `components` dir in `src` directory for usage html components

```
+ src
  + components
    - HelloWorld.html
  - page.html
```

And paste your reusable markup into `HelloWorld.html`:

```html
// components/HelloWorld.html
<div class="component__content">
  Hello World
</div>
```

Then paste component name into `page.html`

```html
// page.html
<body>
  <HelloWorld />
</body>
```

After gulp task completed you can see output like this:

```html
// page.html
<body>
  <div class="component__content">
    Hello World
  </div>
</body>
```

## Using props in component

Use `p-*name*` for thwow prop into your component.

```html
// page.html
<body>
  <HelloWorld p-text="Hello World" />
</body>
```

And use `{{ }}` template to paste your prop.

```html
// components/HelloWorld.html
<div class="component__content">
 {{ text }}
</div>
```

Output:

```html
// page.html
<body>
  <div class="component__content">
    Hello World
  </div>
</body>
```

## Using `slots` in component

This plugin uses the HTML5 `<template>` & `<slot>` tags. So if you have questions about how it works, read the documentation.

```html
// page.html
<body>
  <HelloWorld>
    <template #title>
      Hello World
    </template>
  </HelloWorld>
</body>
```


```html
// components/HelloWorld.html
<div class="component__content">
 <slot name="title"></slot>
</div>
```

Output:

```html
// page.html
<body>
  <div class="component__content">
    Hello World
  </div>
</body>
```
