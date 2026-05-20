# Installation and Usage

Lupa requires Node.js >= 22.0.0 and works seamlessly with the ES module system.

## Installation

Install the `@pawel-up/lupa` package as a development dependency using your preferred package manager:

```bash
npm install --save-dev @pawel-up/lupa
```

## Configuring Lupa

Because Lupa avoids heavy execution CLI wrappers, you configure and run your tests via a simple entry point file. This allows you to easily inject configuration, environment variables, or other backend setup code before your tests boot.

The easiest way to generate this file is using our interactive initialization CLI:

```bash
npx lupa init
```

This command will ask you a few questions and automatically scaffold a `lupa.config.ts` file, your test directories, and example test files.

Alternatively, you can manually create a `lupa.config.ts` file in the root of your project:

```ts
import { defineConfig } from '@pawel-up/lupa/runner'
import type { Assert } from '@pawel-up/lupa/assert'

export default defineConfig({
  files: ['tests/browser/**/*.spec.ts'],
  testPlugins: ['@pawel-up/lupa/assert'],
})

// 4. Augment TestContext for strong typing
declare module '@pawel-up/lupa/testing' {
  interface TestContext {
    assert: Assert
  }
}
```

### `defineConfig`
The `defineConfig` method sets up the Lupa runner configuration object which the CLI dynamically resolves and executes. You must provide the `files` array (glob patterns pointing to your tests) and any required `testPlugins`.

## Writing your first test

As per your configuration above, your tests should be placed in `tests/browser/` and end with `.spec.ts`.

Let's create our first test:

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'

test('renders text correctly', async ({ assert }) => {
  const el = await fixture(html`<div>Hello World</div>`)
  assert.equal(el.textContent, 'Hello World')
})
```

The test callback function receives a `TestContext`. We destructure `assert` from this context to run expectations against the DOM.

## Creating test groups

You can logically group related tests together using the `test.group` method. Groups allow you to define lifecycle hooks that run before or after every test in the group.

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'

test.group('My Component', (group) => {

  group.setup(() => {
    // Runs once before all tests in this group
  })

  test('button click works', async ({ assert }) => {
    const btn = await fixture(html`<button>Click me</button>`)
    assert.equal(btn.textContent, 'Click me')
  })
})
```

## Running tests

You can run your tests by simply executing your entry point file using Node or `tsx`!

```bash
npx lupa test
```

Lupa's orchestrator also acts as a CLI application, allowing you to pass standard arguments:

```bash
# Run in watch mode with visual DevTools
npx lupa test --watch

# Use a specific Vite config
npx lupa test --vite-config=vite.test.config.ts

# See all available options
npx lupa test --help
```

## Writing assertions

Lupa comes bundled with a powerful assertion plugin built on top of Chai.

Since you registered the `@pawel-up/lupa/assert` plugin in your `lupa.config.ts` file and augmented the `TestContext` interface, the `assert` object is automatically typed and available in every test context.

```ts
test('testing values', ({ assert }) => {
  assert.equal(2 + 2, 4)
  assert.deepEqual({ a: 1 }, { a: 1 })
  assert.isTrue(true)
  assert.match('hello world', /world/)
})
```