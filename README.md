# HTML Component

This plugin provides the ability to create the architecture of HTML components in a project. Easy to plug in and incredibly easy to use, the plugin will allow you to work on landing pages and other projects without having to duplicate HTML code or create a lot of JavaScript functions to render HTML code.

# Install

First, you need to install plugin from someone platform:

```javascript
npm install gulp-html-component
// or
yarn add gulp-html-component
```

and paste it into gulp.task

```javascript
const gulp = require("gulp")
const htmlComponent = require("gulp-html-component")

gulp.task("handle-html", () => {
  return gulp.src("your/path")
    .pipe(htmlComponent())
    .pipe(gulp.dest("your/dist/path"))
})
```

# Usage

Before using the plugin, it is important to know the conditions under which you can mount your components:

- File in `components/` must be CamelCase;
- The name of the component must be exactly the same as it is defined in `components/`;
- The end of a component tag always ends with `/>`.

To use the plugin in HTML code, you just need to create a file structure where the components will be located and the page on which they will be used:

```javascript
// File structure
+ src
  + components
    - Component.html
  - page.html
```

```html
// components/Component.html
<div class="component">
  Hello World
</div>

// page.html
<body>
  <Component />
</body>
```

In output you get pasted `Component.html` into `page.html`:

```html
// page.html (output)
<body>
  <div class="component">
    Hello World
  </div>
</body>
```

# Configuration

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
    <td align="center">"./"</td>
    <td>Base path from your project to directory with <code>components</code> at same level.</td>
  </tr>
  <tr>
    <td><code>encoding</code></td>
    <td>String</td>
    <td align="center">"utf8"</td>
    <td>Base encoding format of your files.</td>
  </tr>
</table>

```javascript
const gulp = require("gulp")
const htmlComponent = require("gulp-html-component")

gulp.task("handle-html", () => {
  return gulp.src("your/path")
    .pipe(htmlComponent({
      // It will check components dir by "./src/components"
      path: "./src",
      encoding: "utf8"
    }))
    .pipe(gulp.dest("your/dist/path"))
})
```

# Component usage

## Props

Property passing is available via the `p-%name%` attribute:

```html
// components/Component.html
<div class="component">
  {{ content }}
</div>

// page.html
<body>
  <Component p-bind:content="Hello World" />
</body>
```

## Listeners

In order to send an event to a component that should fire on the root or specific HTML element, you can use the `p-on` property. If you need to pass all events to the component's parent element, then you don't have to do anything other than add it to the `page.html` page:

```html
// page.html
<body>
  <Component p-bind:content="Hello World" p-on:click="func" />
</body>

// page.html (output)
<div class="component" onclick="func">
  Hello World
</div>
```

### `p-on` for bind listeners

But, if you need to bind an event to a nested element, then `p-on:listeners` will come to the rescue, which will bind all events to the specified element:

```html
// components/Component.html
<div class="component">
  <p class="component__content">{{ content }}</p>
  <!-- Will track listeners to button element -->
  <button p-on:listeners>Click me</button>
</div>
```

Or bind not all, but specific properties individually:

```html
// page.html
<body>
  <Component
    p-bind:content="Hello World"
    p-on:click="onClick"
    p-on:focus="onFocus"
    p-on:input="onInput"
  />
</body>

// components/Component.html
<div class="component">
  <p class="component__content">{{ content }}</p>
  <!-- Will track oninput to input element -->
  <input type="text" p-on:listeners />
  <!-- Will track onclick to button element -->
  <button p-on:click>Click me</button>
</div>
```

Output:

```html
// page.html (output)
<body>
  <div class="component">
    <p class="component__content">Hello World</p>
    <input type="text" onfocus="onFocus" oninput="onInput" />
    <button onclick="onClick">Click me</button>
  </div>
</body>
```
