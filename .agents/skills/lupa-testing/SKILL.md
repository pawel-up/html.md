---
description: "A lightning-fast, Vite-powered browser testing framework for Web Components with an elegant, Japa-inspired API. Use when: Building a programmatic test runner or custom CLI integration.. Also: testing, web-components, browser-runner, vite, playwright, japa, dom, test-runner, shadow-dom, lit-html, browser-testing, component-testing."
license: Apache-2.0
name: pawel-up-lupa
---

# @pawel-up/lupa

A lightning-fast, Vite-powered browser testing framework for Web Components with an elegant, Japa-inspired API.

## Features

- **Native Browser Execution:** Tests run inside actual browsers (Chromium, Firefox, WebKit) via Playwright. No DOM mocks.
- **Lightning Fast:** Uses Vite as the dev server. No bundling required, resulting in instant boot times.
- **Intelligent Watch Mode:** A dependency-aware incremental test watcher. Change a component, and Lupa instantly re-runs *only* the tests that import it.
- **Interactive Debugging:** Focus on a single test file and press `d` to pop open a headed browser with Chrome DevTools already open and attached.
- **Network Interception:** Full control over network traffic via a lightweight, typed API to mock, route, and assert on HTTP requests made from the browser.
- **Test Grouping & Suites:** Organize your testing architecture intuitively with structured groups, tags, and execution suites.
- **Data-Driven Datasets:** Avoid boilerplate by feeding dynamic datasets into parameterized tests.
- **Browser-Specific Macros:** Create extensible test setups and custom assertions that run flawlessly inside the browser sandbox.

## When to Use

**Use this skill when:**
- Building a programmatic test runner or custom CLI integration. → use `configure`
- You need to programmatically load and parse the Lupa configuration from a file. → use `loadLupaConfig`
- Rendering templates and Custom Elements into the DOM for interaction → use `fixture`

**Do NOT use when:**
- You are already inside a running test or suite. (`configure`)
- Testing pure logic or functions that do not require a DOM (`fixture`)

API surface: 20 functions, 13 classes, 110 types, 10 constants

## NEVER

- NEVER call this inside a test suite or hook. Fix: Call it only once at the end of your execution script.

## Troubleshooting

- **Watch Mode Collisions:** You cannot run `npx lupa test` with both `--watch` and a parallel suite runner like `concurrently`. Multiple browser instances and Vite dev servers will conflict. Use parallelization strictly in headless CI environments.
- **Hanging Tests:** If a test is failing to exit or hanging indefinitely, ensure that any external asynchronous resources (like custom servers) instantiated in `setup()` hooks return a proper cleanup function (e.g., `return () => server.close()`). Lupa guarantees execution of teardown cleanups even when assertions fail.

## Configuration

25 configuration interfaces — see references/config.md for details.

## Quick Reference

**Key functions:** `assertIsAccessible` (Asserts that a given DOM element or NodeList has no accessibility violations
according to axe-core), `configure` (Configure the Lupa test runner), `run` (Run the test suite), `loadLupaConfig` (Loads the Lupa configuration from a local file (e), `waitUntil` (Polls the condition function until it returns true or the timeout is reached), `fixture` (Renders a HTML string or a Lit template into a dedicated fixture container and mounts it to the DOM)

*153 exports total — see references/ for full API.*

## Documentation

- **assertions** — # Assertions

Lupa doesn't force a specific assertion library onto you.
- **cli** — # Lupa CLI Reference

Lupa provides a lightweight, interactive Command-Line Interface to help you run tests, scaffold environments, and import agent skills into your workspace.
- **commands** — # Browser Commands

Lupa provides a powerful set of commands to interact with the browser and DOM elements natively during your tests.
- **customizing-harness** — # Customizing the HTML Test Harness

Sometimes you need to inject global stylesheets (like a CSS reset or design system variables) into the browser environment, or you might need a very specific HTML structure surrounding your tests.
- **datasets** — # Datasets

Datasets allow you to run a specific test multiple times with different data every time.
- **exceptions** — # Exceptions

We all write tests that deal with exceptions and promise rejections.
- **filtering-tests** — # Filtering Tests

Lupa offers several filtering layers to find and run an individual or group of tests.
- **grouping-tests** — # Grouping Tests

You may group a collection of related tests using the `test.
- **installation** — # Installation and Usage

Lupa requires Node.
- **introduction** — # Introduction

Lupa comes with everything you need to test your modern frontend applications and Web Components natively in the browser.
- **lifecycle-hooks** — # Lifecycle Hooks

Lifecycle hooks are functions you can run before or after a test or a group of tests.
- **network-mocking** — # Network Mocking

Lupa provides powerful, native network interception out of the box.
- **skipping-tests** — # Skipping Tests

Sometimes, you might run into situations where you want to skip specific tests temporarily.
- **test-macros** — # Test Macros

Test macros are reusable functions that are natively bound to the lifecycle of the currently executing test.
- **test-reporters** — # Test Reporters

Test reporters are used to collect test progress and display a summary after the tests have been executed.
- **test-suites** — # Test Suites

Test suites allow you to organize your tests logically by their type or domain.
- **vite-configuration** — # Configuring Vite

Lupa runs your tests inside a headless browser using [Vite](https://vitejs.

See `references/docs/` for full guides (17 total).

## References

Load these on demand — do NOT read all at once:

- When calling any function → read `references/functions.md` for full signatures, parameters, and return types
- When using a class → browse `references/classes/` for grouped indexes, properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When using exported constants → read `references/variables.md`
- When configuring options → read `references/config.md` for all settings and defaults
- When learning concepts or workflows → browse `references/docs/` by category

## Links

- [Repository](https://github.com/pawel-up/lupa)
- Author: Pawel Uchida-Psztyc