# Browser Commands

Lupa provides a powerful set of commands to interact with the browser and DOM elements natively during your tests. These commands are available via the `@pawel-up/lupa/commands` module.

The commands are fully typed and use RPC to communicate directly with the underlying browser (Playwright) runner.

## Locator API

The `query()` function allows you to select elements on the page using a variety of semantic locators and CSS/XPath selectors. It returns a `Locator` object that you can use to interact with the element. Also note that the Locator api is heavily inspired by Playwright's Locator api,
but it is not the same. Only methods relevant to testing (in our opinion) are exposed.

```ts
import { query } from '@pawel-up/lupa/commands'

// Semantic locators
await query({ role: 'button' }).click()
await query({ label: 'Username' }).fill('admin')
await query({ placeholder: 'Search...' }).fill('lupa')
await query({ text: 'Submit' }).click()
await query({ altText: 'Profile Picture' }).click()
await query({ title: 'Close' }).click()
await query({ testId: 'submit-button' }).click()

// Standard locators
await query({ css: '.my-class' }).hover()
await query({ xpath: '//div/p' }).click()
```

### Locator Actions

Once you've selected an element with `query()`, you can execute the following actions on it:

* **`click(options?)`**: Clicks the element.
* **`dblclick(options?)`**: Double-clicks the element.
* **`fill(text, options?)`**: Fills an `<input>`, `<textarea>`, or `[contenteditable]` element.
* **`check(options?)`**: Checks a checkbox or radio button.
* **`uncheck(options?)`**: Unchecks a checkbox or radio button.
* **`clear(options?)`**: Clears the input field.
* **`hover(options?)`**: Hovers the mouse over the element.
* **`press(key, options?)`**: Focuses the element and presses a specific key (e.g., `'Enter'`).
* **`tap(options?)`**: Taps the element (useful for mobile emulation).
* **`blur(options?)`**: Removes focus from the element.

*Note: All actions are asynchronous and should be `await`ed.*

---

## Global Browser Commands

In addition to interacting with specific elements, you can also manipulate the global state of the browser, such as the viewport size, mouse, keyboard, and emulated media.

### `setViewport`

Sets the viewport size of the browser.

```ts
import { setViewport } from '@pawel-up/lupa/commands'

await setViewport({
  width: 1024,
  height: 768,
})
```

### `emulateMedia`

Emulates browser media features, such as screen/print or color schemes, which is useful for testing CSS media queries like dark mode.

```ts
import { emulateMedia } from '@pawel-up/lupa/commands'

// Test dark mode
await emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })

// Test print styles
await emulateMedia({ media: 'print' })
```

### `sendKeys`

Sends a string of keys for the browser to press natively (all at once like a shortcut, or typed in sequence).

```ts
import { sendKeys } from '@pawel-up/lupa/commands'

// Press a shortcut
await sendKeys({ press: 'Shift+a' })
await sendKeys({ press: 'Tab' })

// Type a sequence of characters
await sendKeys({ type: 'Hello World' })
```

### `sendMouse`

Sends raw mouse events (move, click, down, up) to specific coordinates.

*WARNING*: When holding down a mouse button, the mouse stays in that state until explicitly released. Use `resetMouse()` to clean up state between tests.

```ts
import { sendMouse } from '@pawel-up/lupa/commands'

await sendMouse({ type: 'move', position: [100, 100] })
await sendMouse({ type: 'down', button: 'middle' })
```

### `resetMouse`

Resets the mouse position to `(0, 0)` and releases any held mouse buttons. Highly recommended in an `afterEach` hook if you are using `sendMouse`.

```ts
import { resetMouse } from '@pawel-up/lupa/commands'

await resetMouse()
```

### `selectOption`

Selects an option within a `<select>` element by its value.

```ts
import { selectOption } from '@pawel-up/lupa/commands'

await selectOption({
  selector: '#my-dropdown',
  value: 'first-option'
})
```