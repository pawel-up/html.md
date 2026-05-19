# Test Suites

Test suites allow you to organize your tests logically by their type or domain. For example, you can create separate suites for component unit tests and end-to-end user flows, keeping their test files in dedicated folders.

When using suites, you configure them in your `lupa.config.ts` file instead of using the top-level `files` property.

```ts
import { configure, run } from '@pawel-up/lupa/runner'

configure({
  suites: [
    {
      name: 'components',
      files: ['tests/components/**/*.spec.ts'],
    },
    {
      name: 'e2e',
      files: ['tests/e2e/**/*.spec.ts'],
    }
  ]
})

run()
```

- You **must not** use the root `files` property when you are using suites.
- Each suite must have a unique `name` and a `files` array to associate test files with the suite.

## Run selected suites

You can run tests for a specific suite by specifying the suite name as a positional argument after your test runner script.

In the following example, only the component tests will run:

```bash
npx lupa test components
```

The following example will run the tests for both the components and the e2e suites:

```bash
npx lupa test components e2e
```

## Lifecycle hooks

Like tests and groups, you can also define lifecycle hooks at the suite level. For example, you can use hooks to spin up an external mock backend server before running the tests in the `e2e` suite.

The `configure` method in the suite configuration object receives an instance of the `Suite` class, and you can use it to register hooks.

```ts
configure({
  suites: [
    {
      name: 'e2e',
      files: ['tests/e2e/**/*.spec.ts'],
      configure(suite) {
        suite.setup(() => {
          const server = createMockServer()
          server.start()

          return () => server.close()
        })
      },
    }
  ]
})
```

## Configure suite groups and tests

You can drill down the layers and configure individual groups or tests directly using the suite instance. This is especially useful if you are writing a custom plugin that needs to inject functionality or hooks onto every test inside a specific suite.

```ts
configure({
  suites: [
    {
      name: 'components',
      files: ['tests/components/**/*.spec.ts'],
      configure(suite) {

        // Target all top level tests
        suite.onTest((test) => {
          test.setup(() => { /* ... */ })
        })

        // Target groups
        suite.onGroup((group) => {
          group.tap((test) => {
             // Target tests inside a group
            test.setup(() => { /* ... */ })
          })
        })
      },
    }
  ]
})
```

## Running suites in parallel

By default, Lupa (like Japa) runs tests serially. However, if you want to speed up your CI pipeline by running entirely separate suites in parallel across different browser instances, you can use a task runner like `concurrently`.

Install `concurrently`:

```bash
npm install -D concurrently
```

Register the scripts in your `package.json`:

```json
{
  "scripts": {
    "test:components": "lupa test components",
    "test:e2e": "lupa test e2e",
    "test:parallel": "concurrently \"npm:test:components\" \"npm:test:e2e\""
  }
}
```

> [!WARNING]
> ### Parallel Mode vs. Watch Mode
> You **cannot** use Parallel Mode and Watch Mode (`--watch`) at the same time.
>
> Because Lupa spins up a real Vite dev server and an interactive Playwright Chrome instance with DevTools in watch mode, attempting to run multiple suites in parallel will result in port collisions and conflicting browser windows.
>
> **Parallel execution should be reserved strictly for headless continuous integration (CI) environments**, where visual debugging is not required.