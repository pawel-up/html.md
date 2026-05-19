# Customizing the HTML Test Harness

Sometimes you need to inject global stylesheets (like a CSS reset or design system variables) into the browser environment, or you might need a very specific HTML structure surrounding your tests.

Lupa allows you to customize the underlying HTML document via the `harness` configuration block in your `lupa.config.ts` file.

---

## 1. Injecting Global Stylesheets

The simplest way to customize your harness is by injecting global CSS. This is perfect for loading fonts, CSS resets, or your application's design system tokens.

Lupa accepts an array of strings. External URLs (like Google Fonts) are injected directly, while local paths are automatically resolved and served through Vite's module pipeline!

```ts
import { configure } from '@pawel-up/lupa/runner'

configure({
  suites: [
    { name: 'unit', files: ['tests/**/*.test.ts'] }
  ],
  harness: {
    stylesheets: [
      // External URLs are injected as-is
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
      // Local files are resolved relative to the current working directory
      './src/styles/reset.css',
      './src/styles/theme.css'
    ]
  }
})
```

---

## 2. Using a Custom String Template

If you need to define custom HTML elements outside of your test fixtures (e.g., adding an `<div id="app"></div>` root, or setting `<html lang="en" class="dark">`), you can provide a custom HTML string.

When using a string template, **you must include the `<!-- lupa-stylesheets -->` and `<!-- lupa-scripts -->` placeholders** so Lupa knows where to inject the testing framework and configuration payload.

```ts
import { configure } from '@pawel-up/lupa/runner'

configure({
  suites: [
    { name: 'unit', files: ['tests/**/*.test.ts'] }
  ],
  harness: {
    stylesheets: ['./src/styles/theme.css'],
    template: `
      <!DOCTYPE html>
      <html lang="en" class="dark">
        <head>
          <meta charset="utf-8">
          <title>Custom Theme Tests</title>
          <!-- lupa-stylesheets -->
        </head>
        <body>
          <div id="app-root"></div>
          <!-- lupa-scripts -->
        </body>
      </html>
    `
  }
})
```

---

## 3. Using a Dynamic Function Template

For the highest level of control, you can define `template` as a function. The function receives an object containing the resolved `scripts` and `stylesheets` HTML strings.

This is highly useful if you need to programmatically construct the document based on environment variables or external logic.

```ts
import { configure } from '@pawel-up/lupa/runner'

configure({
  suites: [
    { name: 'unit', files: ['tests/**/*.test.ts'] }
  ],
  harness: {
    stylesheets: ['./src/styles/theme.css'],
    template: ({ scripts, stylesheets }) => {
      const isDarkMode = process.env.TEST_THEME === 'dark'
      const themeClass = isDarkMode ? 'theme-dark' : 'theme-light'

      return `
        <!DOCTYPE html>
        <html lang="en" class="${themeClass}">
          <head>
            <meta charset="utf-8">
            <title>Lupa Tests (${themeClass})</title>
            ${stylesheets}
          </head>
          <body>
            ${scripts}
          </body>
        </html>
      `
    }
  }
})
```