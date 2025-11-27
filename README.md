# @jqhtml/vite-plugin

Vite plugin for compiling `.jqhtml` templates to JavaScript.

## Installation

```bash
npm install @jqhtml/vite-plugin @jqhtml/core jquery
```

## Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import jqhtml from '@jqhtml/vite-plugin';

export default defineConfig({
    plugins: [
        jqhtml(),
    ],
});
```

### Options

```javascript
jqhtml({
    include: ['**/*.jqhtml'],    // Glob patterns to include
    exclude: ['node_modules/**'], // Glob patterns to exclude
    sourcemap: true,              // Enable source maps (default: true in dev)
})
```

## Usage

### 1. Set up your entry point

```javascript
// main.js
import $ from 'jquery';
window.jQuery = window.$ = $;

import jqhtml, { boot, init_jquery_plugin } from '@jqhtml/core';
init_jquery_plugin($);

// Import and register components
import MyComponent from './components/MyComponent.jqhtml';
jqhtml.register(MyComponent);

// Boot when DOM is ready
$(document).ready(async () => {
    await boot();
});
```

### 2. Create components

```html
<!-- components/MyComponent.jqhtml -->
<Define:MyComponent tag="div" class="my-component">
    <h2><%= this.args.title %></h2>
    <p><%= this.args.message %></p>
</Define:MyComponent>
```

### 3. Use in HTML

```html
<div class="_Component_Init"
     data-component-init-name="MyComponent"
     data-component-args='{"title":"Hello","message":"World"}'>
</div>
```

The `boot()` function finds these placeholders and hydrates them into live components.

## Framework Integrations

- **Laravel**: Use [jqhtml/laravel](https://github.com/jqhtml/jqhtml-laravel) for Blade template support
- **WordPress**: Coming soon

## Documentation

For complete documentation including template syntax, lifecycle methods, and component patterns:

**https://jqhtml.org/**

## License

MIT - Copyright (c) hansonxyz
