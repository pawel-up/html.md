# Functions

## assert

### `assertIsAccessible`
Asserts that a given DOM element or NodeList has no accessibility violations
according to axe-core.

This function integrates axe-core to run accessibility checks on a specified context.
The `element` parameter can be a CSS selector string, a single DOM element, or a NodeList.
When a string is provided, axe-core will query the document for matching elements.
Any violations found will be formatted into a readable error message and trigger an assertion failure.
```ts
assertIsAccessible(assertInstance: Assert, element: string | Element | NodeList, options?: RunOptions): Promise<void>
```
**Parameters:**
- `assertInstance: Assert` — The main Assert instance to track assertions and evaluate
- `element: string | Element | NodeList` — The DOM element(s) to test
- `options: RunOptions` (optional) — axe-core run options
**Returns:** `Promise<void>` — A Promise that resolves when the assertion has been evaluated.
```ts
import { assert } from '@pawel-up/lupa/assert'
await assert.isAccessible('#my-element')
await assert.isAccessible(document.querySelector('main'))
```

### `normalizeDom`
Normalizes a DOM element or HTML string into a deterministic HTML string
for semantic comparison, applying all ignore rules.
```ts
normalizeDom(html: string | Element | DocumentFragment, options: SemanticDomOptions): string
```
**Parameters:**
- `html: string | Element | DocumentFragment` — The HTML string or DOM element to normalize
- `options: SemanticDomOptions` — default: `{}` — Optional options to control the normalization process
**Returns:** `string` — The normalized HTML string
```ts
const normalized = normalizeDom(document.body, {
  ignoreTextContent: true,
  ignoreAttributeValueFor: [
    {
      tags: ['*'],
      attributes: ['class', 'data-testid'],
    },
  ],
})
```

## runner

### `defineConfig`
Define Lupa configuration.

This is an identity function that provides TypeScript autocomplete and type-checking
for your `lupa.config.ts` file. It does not mutate state or hydrate the configuration.
```ts
defineConfig(config: Config): Config
```
**Parameters:**
- `config: Config` — Lupa configuration object
**Returns:** `Config` — Unmodified Lupa configuration object
```ts
import { defineConfig } from '@pawel-up/lupa/runner'

export default defineConfig({
  files: ['tests/**/*.spec.ts'],
  testPlugins: ['@pawel-up/lupa/assert']
})
```

### `runProgrammatic`
Run Lupa programmatically and return the typed output of the given programmatic reporter.
This execution path does not intercept standard process signals and avoids `process.exit()`.
```ts
runProgrammatic<T>(reporter: ProgrammaticReporterContract<T>, options: Partial<Config>): Promise<T>
```
**Parameters:**
- `reporter: ProgrammaticReporterContract<T>`
- `options: Partial<Config>` — default: `{}`
**Returns:** `Promise<T>`
```ts
import { runProgrammatic } from '@pawel-up/lupa/runner'
import { json } from '@pawel-up/lupa/reporters'

const result = await runProgrammatic(json())
```

## Configuration

### `configure`
Configure the Lupa test runner.

This function hydrates the provided configuration options and merges them with parsed CLI arguments.

**Note:** If you are using the standard `npx lupa test` CLI, you do not need to call this manually.
The CLI automatically loads your `lupa.config.ts` and calls `configure()` for you.
This function is exposed primarily for advanced users building custom integrations or programmatic runners.

You must call this function before calling run.
```ts
configure(options: Config, args?: CLIArgs): void
```
**Parameters:**
- `options: Config` — The configuration object. You must provide either a top-level `files` array
                 or a `suites` array to define your test files.
- `args: CLIArgs` (optional) — Optional CLI arguments to override configuration.
**Basic Configuration**
```ts
import { configure, run } from '@pawel-up/lupa/runner'

configure({
  files: ['tests/**/*.spec.ts'],
  testPlugins: ['@pawel-up/lupa/assert']
})

run()
```
**Using Test Suites**
```ts
import { configure, run } from '@pawel-up/lupa/runner'

configure({
  suites: [
    { name: 'components', files: ['tests/components/**/*.spec.ts'] },
    { name: 'e2e', files: ['tests/e2e/**/*.spec.ts'] }
  ],
  timeout: 5000,
  forceExit: true
})

run()
```

### `loadLupaConfig`
Loads the Lupa configuration from a local file (e.g. lupa.config.ts).
```ts
loadLupaConfig(root: string, configPath?: string): Promise<Config | null>
```
**Parameters:**
- `root: string` — The root directory to search for the configuration file.
- `configPath: string` (optional) — Optional path to the configuration file.
**Returns:** `Promise<Config | null>` — A Promise that resolves to the loaded configuration object, or null if not found.
```ts
import { loadLupaConfig, Config } from '@pawel-up/lupa/runner'

const config = await loadLupaConfig('/path/to/root')
```

## Execution

### `run`
Run the test suite.

This is the primary entry point for running your tests. It uses the configuration
provided by configure.
```ts
run(): Promise<void>
```
**Returns:** `Promise<void>` — A Promise that resolves when the test run is complete,
         or rejects if the test run encounters an error (e.g., uncaught exceptions).
**Throws:** Throws if configuration is missing or invalid.
```ts
import { configure, run } from '@pawel-up/lupa/runner'

configure({
  files: ['tests/**/*.spec.ts'],
  forceExit: true
})

run()
```

## testing

### `test`
Define a new test.

The test callback receives a TestContext which provides
access to assertions, fixtures, and other test utilities.
```ts
test(title: string, callback?: (context: TestContext, done: (error?: any) => void) => void | Promise<void>): Test<undefined>
```
**Parameters:**
- `title: string` — The name of the test.
- `callback: (context: TestContext, done: (error?: any) => void) => void | Promise<void>` (optional) — The function containing the test logic. Can be synchronous or asynchronous.
**Returns:** `Test<undefined>`
```ts
test('math works', ({ assert }) => {
  assert.equal(1 + 1, 2)
})
```

### `aTimeout`
Returns a promise that resolves after the specified number of milliseconds.
```ts
aTimeout(ms: number): Promise<void>
```
**Parameters:**
- `ms: number` — default: `0` — Number of milliseconds to wait
**Returns:** `Promise<void>` — Promise that resolves after the specified number of milliseconds
```typescript
await aTimeout(1000)
```

### `nextFrame`
Returns a promise that resolves after the next browser animation frame.
```ts
nextFrame(): Promise<void>
```
**Returns:** `Promise<void>` — Promise that resolves after the next browser animation frame
```typescript
await nextFrame()
```

### `oneEvent`
Returns a promise that resolves when the specified event is dispatched on the element.
```ts
oneEvent<T, E>(element: EventTarget, eventName: string): Promise<E>
```
**Parameters:**
- `element: EventTarget`
- `eventName: string` — Name of the event to wait for
**Returns:** `Promise<E>` — Promise that resolves when the specified event is dispatched on the element
```typescript
const event = await oneEvent(element, 'click')
assert.strictEqual(event.type, 'click')
```

### `waitUntil`
Polls the condition function until it returns true or the timeout is reached.

If the condition function throws an error, the error is suppressed and the polling
continues until the condition returns true or the timeout expires. The `interval`
option determines the delay between polling attempts (default is 50ms), and the
`timeout` option determines the maximum total duration before the promise rejects
with the provided `message` (default is 1000ms).
```ts
waitUntil(condition: () => boolean | Promise<boolean>, message: string, options: { timeout?: number; interval?: number }): Promise<void>
```
**Parameters:**
- `condition: () => boolean | Promise<boolean>` — Function to poll
- `message: string` — default: `'waitUntil timed out'` — Message to use when throwing an error
- `options: { timeout?: number; interval?: number }` — default: `{}` — Options for waitUntil
**Returns:** `Promise<void>` — Promise that resolves when the condition is met
```typescript
await waitUntil(() => element.textContent === 'Hello')
```

## DOM

### `fixture`
Renders a HTML string or a Lit template into a dedicated fixture container and mounts it to the DOM.

The fixture is automatically cleaned up and removed from the DOM
when the current test or group finishes.
```ts
fixture<T>(template: TemplateTypes, options?: FixtureRenderOptions): Promise<T>
```
**Parameters:**
- `template: TemplateTypes` — A string of HTML or a `lit-html` template created using the `html` tag.
- `options: FixtureRenderOptions` (optional)
**Returns:** `Promise<T>` — A promise that resolves to the rendered DOM Element.
```ts
test('renders lit template', async ({ assert }) => {
  const el = await fixture<HTMLButtonElement>(html`<button>Click me</button>`)
  assert.equal(el.textContent, 'Click me')
})

test('renders string template', async ({ assert }) => {
  const el = await fixture<HTMLDivElement>('<div id="test"></div>')
  assert.equal(el.id, 'test')
})
```

## commands

### `setViewport`
Sets the viewport size of the browser.
```ts
setViewport(viewport: Viewport): Promise<void>
```
**Parameters:**
- `viewport: Viewport` — The viewport size.
**Returns:** `Promise<void>` — A promise that resolves when the viewport size is set.
```ts
   await setViewport({
       width: 1024,
       height: 768,
   })
```

### `emulateMedia`
Emulates browser media, such as screen/print or color scheme, to be used in
CSS media queries.

Note that the `forcedColors` option does not work in WebKit.
```ts
emulateMedia(media: Media): Promise<void>
```
**Parameters:**
- `media: Media` — The media features to emulate.
**Returns:** `Promise<void>` — A promise that resolves when the media features are emulated.
```ts
   await emulateMedia({
       colorScheme: 'dark',
       reducedMotion: 'reduce',
   })
```
```ts
   await emulateMedia({
       media: 'print',
   })
```
```ts
   await emulateMedia({
       forcedColors: 'active',
   })
```

### `sendKeys`
Sends a string of keys for the browser to press (all at once, as with single keys
or shortcuts; e.g. `{press: 'Tab'}` or `{press: 'Shift+a'}` or
`{press: 'Option+ArrowUp}`) or type (in sequence, e.g. `{type: 'Your name'}`) natively.

For specific documentation of the strings to leverage here, see the Playwright documentation:

- `press`: https://playwright.dev/docs/api/class-keyboard#keyboardpresskey-options
- `type`: https://playwright.dev/docs/api/class-keyboard#keyboardtypetext-options
```ts
sendKeys(payload: SendKeysPayload): Promise<void>
```
**Parameters:**
- `payload: SendKeysPayload` — An object including a `press` or `type` property an the associated string
    for the browser runner to apply via that input method.
**Returns:** `Promise<void>` — A promise that resolves when the keys are sent.
```ts
   await sendKeys({
       press: 'Tab',
   })
```
```ts
   await sendKeys({
       type: 'Your address',
   })
```

### `sendMouse`
Sends an action for the mouse to move it to a specific position or click a mouse button (left, middle, or right).

WARNING: When moving the mouse or holding down a mouse button, the mouse stays in this state as long as
you do not explicitly move it to another position or release the button. For this reason, it is recommended
to reset the mouse state with the `resetMouse` command after each test case manipulating the mouse to avoid
unexpected side effects.
```ts
sendMouse(payload: SendMousePayload): Promise<void>
```
**Parameters:**
- `payload: SendMousePayload` — An object representing a mouse action specified by the `type` property (move, click, down, up)
    and including some properties to configure this action.
**Returns:** `Promise<void>` — A promise that resolves when the mouse events are sent.
```ts
   await sendMouse({
       type: 'move',
       position: [100, 100]
   })
```
```ts
   await sendMouse({
       type: 'click',
       position: [100, 100],
       button: 'right'
   })
```
```ts
   await sendMouse({
       type: 'down'
   })
```

### `resetMouse`
Resets the mouse position to (0, 0) and releases mouse buttons.

Use this command to reset the mouse state after mouse manipulations by the `sendMouse` command.
```ts
resetMouse(): Promise<void>
```
**Returns:** `Promise<void>` — A promise that resolves when the mouse state is reset.
```
it('does something with the mouse', () => {
  await sendMouse({ type: 'move', position: [150, 150] })
  await sendMouse({ type: 'down', button: 'middle' })
})

afterEach(() => {
  await resetMouse()
})
```

### `selectOption`
Selects an option in a <select> element by value or label
```ts
selectOption(payload: SelectOptionPayload): Promise<void>
```
**Parameters:**
- `payload: SelectOptionPayload` — The option to select.
**Returns:** `Promise<void>` — A promise that resolves when the option is selected.
```
it('natively selects an option by value', async () => {
 const valueToSelect = 'first'
 const select = document.querySelector('#testSelect')

 await selectOption({ selector: '#testSelect', value: valueToSelect })

 expect(select.value).to.equal(valueToSelect)
})
```

### `query`
Creates a locator that can execute multiple actions like click, type, etc.
It interacts with the Playwright's Page object, but via RPC calls.
```ts
query(query: LocatorQuery): Locator
```
**Parameters:**
- `query: LocatorQuery` — The query to use to locate the element.
**Returns:** `Locator` — A locator.
```typescript
import { query } from '@pawel-up/lupa/commands'

await query({ text: 'Submit' }).click()
```
```typescript
import { query } from '@pawel-up/lupa/commands'

await query({ label: 'Subscribe' }).check()
```
```typescript
import { query } from '@pawel-up/lupa/commands'

await query({ placeholder: 'Username' }).fill('admin')
```
