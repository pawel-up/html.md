# Introduction

Lupa comes with everything you need to test your modern frontend applications and Web Components natively in the browser.

Unlike other testing frameworks that attempt to simulate the browser environment in Node.js using `jsdom` or `happy-dom`, Lupa focuses on **real browser execution**. By orchestrating Playwright under the hood and driving tests through Vite, Lupa ensures that your tests run in the exact same environment your users experience.

Despite running in a real browser, Lupa provides an elegant, expressive, and bloat-free testing API heavily inspired by the beloved [Japa](https://japa.dev/) framework.

## Native Browser Execution
Popular testing frameworks like Jest or Vitest (by default) execute your code in a simulated Node.js DOM. While fast, this often leads to subtle bugs where tests pass in Node.js but fail in a real browser due to missing or incorrectly polyfilled Web APIs.

Lupa fundamentally solves this:
- **No Polyfills:** Your components have access to the real `window`, real `document`, and real Web APIs (like `IntersectionObserver`, Canvas, or WebGL).
- **Accurate Rendering:** Because tests run in a real browser, CSS stylesheets, web fonts, and layout calculations are perfectly accurate.
- **Visual Debugging:** Lupa provides an interactive debug mode where you can visually inspect your DOM fixtures directly in Chrome/Edge DevTools while the test is paused.

## Powered by Vite
Lupa doesn't try to reinvent the build pipeline. It hooks directly into your existing Vite infrastructure.

- Got a project already using Vite? Lupa will automatically merge with your existing `vite.config.ts`.
- TypeScript, JSX, Lit templates, and PostCSS are supported out-of-the-box with zero additional configuration required.

## What else does Lupa have to offer?

Lupa ticks almost every checkbox to provide a world-class frontend testing experience:

- **Elegant API:** An intuitive, chainable test definition API (`test`, `test.group`, `test.macro`).
- **Template Support:** First-class support for rendering `lit-html` templates and standard HTML strings via the `fixture()` helper.
- **Automatic Cleanup:** DOM fixtures are automatically unmounted and cleaned up between test runs.
- **Datasets:** Write data-driven tests seamlessly with `test.with()`.
- **Advanced Hook System:** Global and group-level `setup`, `teardown`, and inline `cleanup` hooks.
- **Headless & Interactive Modes:** Run headless in CI using Playwright, or in "watch" mode locally with a visual UI.
- **Built-in Assertions:** Ships with a robust assertion library built on top of Chai, ready to use immediately.