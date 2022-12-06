# HTML Components

When we work with static pages, like landing pages or other small-scale projects, there are often blocks of code that have to be duplicated in an html file or given to JavaScript, creating separate block rendering functions.

I thought that both options have disadvantages: Abundance of duplicate code; extra JavaScript logic, where there is no talk of extensibility and universality. Therefore, I decided to make this utility capable of working both on its own for more comfortable work with display components without having to think about display logic.

# Install

This package is not available for usage yet

# Usage

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

```
// page.html
<body>
  <div class="component__content">
    Hello World
  </div>
</body>
```
