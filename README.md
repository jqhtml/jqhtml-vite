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

// Import components
import AlertBox from './components/AlertBox.jqhtml';
import Counter from './components/Counter.js';

// Register components
jqhtml.register(AlertBox);
jqhtml.register(Counter);

// Boot when DOM is ready
$(document).ready(async () => {
    await boot();
});
```

### 2. Create components

#### Template-only component

```html
<!-- components/AlertBox.jqhtml -->
<Define:AlertBox tag="div" class="alert">
    <strong><%= this.args.title %></strong>
    <p><%= this.args.message %></p>
</Define:AlertBox>
```

#### Interactive component with JS class

```html
<!-- components/Counter.jqhtml -->
<Define:Counter tag="div" class="counter">
    <button $sid="decrement">-</button>
    <span $sid="display"><%= this.data.count %></span>
    <button $sid="increment">+</button>
</Define:Counter>
```

```javascript
// components/Counter.js
import { Jqhtml_Component } from '@jqhtml/core';
import CounterTemplate from './Counter.jqhtml';

class Counter extends Jqhtml_Component {
    on_create() {
        this.data.count = this.args.initial || 0;
    }

    on_ready() {
        this.$sid('increment').on('click', () => {
            this.data.count++;
            this.$sid('display').text(this.data.count);
        });
        this.$sid('decrement').on('click', () => {
            this.data.count--;
            this.$sid('display').text(this.data.count);
        });
    }
}

export default Counter;
```

### Note on Minification

If your build uses class name mangling, you must either:

1. Add `static component_name = 'Counter'` to each component class, or
2. Use explicit registration:

```javascript
jqhtml.register_template(CounterTemplate);
jqhtml.register_component('Counter', Counter);
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
- **WordPress**: Use [jqhtml/wordpress](https://github.com/jqhtml/jqhtml-wordpress) for PHP template helpers

## Documentation

For complete documentation including template syntax, lifecycle methods, and component patterns:

**https://jqhtml.org/**

## License

MIT - Copyright (c) hansonxyz
