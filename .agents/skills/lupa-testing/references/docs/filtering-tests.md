# Filtering Tests

Lupa offers several filtering layers to find and run an individual or group of tests. However, an excellent filtering experience starts with an organized test suite. Therefore, we will also discuss common ways to structure the tests properly.

## Using suites

Using test suites is the first step towards dividing your tests by their nature. You should create a separate test suite for unit tests, component tests, browser/e2e tests, and so on.

A great exercise is creating test suites with the resources they need. Also, when you run tests for a specific suite, Lupa will not import test files from other suites, which may result in significantly faster execution time.

```bash
# Filter tests by suite positional argument

npx lupa test components

npx lupa test functional

npx lupa test e2e
```

## Organize using folders

Instead of creating multiple test groups within a single file, you must create nested folders and files to organize your tests.

An example folder structure for organizing tests by `component -> behavior -> scenario` follows:

```text
.
├── components
│   └── button
│       ├── primary.spec.ts
│       └── secondary.spec.ts
```

You can run tests from a specific file or folder as follows:

Run tests from any filename ending with "primary":
```bash
npx lupa test --files="primary"
```

Run tests from any filename ending with "primary" inside the `button` folder:
```bash
npx lupa test --files="button/primary"
```

## Tagging tests

Tagging your tests is a great way to filter tests across multiple test suites and files.

For example, you might have tests interacting with an external mock API spread across multiple files and folders. Instead of applying multiple filters based on the filenames, you can tag these tests using the `test.tags` method and filter them by the tag name.

```ts
test('add payment method', () => {
  // ...
}).tags(['@api_mock'])

test('charge user and create order', () => {
  // ...
}).tags(['@api_mock'])
```

You can run tests with the `@api_mock` tag as follows:
```bash
npx lupa test --tags="@api_mock"
```

You can **ignore tests** with the `@api_mock` tag by negating it with a tilde `~` symbol:
```bash
npx lupa test --tags="~@api_mock"
```

You can also specify multiple tags using the `--tags` filter:
```bash
npx lupa test --tags="@api_mock,@slow"
```

When filtering for multiple tags, all the tests containing **any** mentioned tags will run. You must use the `--match-all` flag if you want to run tests that have **all** the mentioned tags:
```bash
npx lupa test --tags="@api_mock,@slow" --match-all
```

## Filtering by group title

You can filter tests by the group title using the `--groups` filter. The filter accepts the exact title (a substring will not work).

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('polls list', () => {
  test('show list of public polls', () => {})
})
```

```bash
npx lupa test --groups="polls list"
```

## Filtering by test title

You can filter tests by the test title using the `--tests` filter. The filter accepts the exact title (a substring will not work).

```ts
import { test } from '@pawel-up/lupa/testing'

test('show list of public polls', () => {})
```

```bash
npx lupa test --tests="show list of public polls"
```

## Pinning tests

Pinning tests is exceptionally helpful when you want to debug an individual or a group of tests for the time being. You can pin a test using the `test.pin()` method, and Lupa will only run the pinned tests and immediately skip everything else.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('polls list', () => {
  test('show list of public polls', () => {})

  test('show list of participating polls', () => {
    // Lupa will only execute this test
  }).pin()
})
```

### Listing pinned tests

You can view the list of all the currently pinned tests using the `--list-pinned` CLI flag. The output will contain the test title and its source code location.

```bash
npx lupa test --list-pinned
```

## Running failed tests

You can automatically run only the tests that failed during the last run using the `--failed` CLI flag. It will run all the tests if there are no failing tests currently recorded.

```bash
npx lupa test --failed
```