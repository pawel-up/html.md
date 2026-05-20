# Configuration

## PluginConfig

## SemanticDomOptions

Options for Semantic DOM assertions

### Properties

#### ignoredAttributes

Completely ignore specific attributes.
- `'*'`: Ignores ALL attributes on all elements.
- `['class', 'id']`: Ignores these attributes globally.
- `[{ tags: ['input'], attributes: ['id'] }]`: Ignores specific attributes on specific tags.

**Type:** `"*" | (string | AttributeMatcher)[]`

#### ignoreAttributeValueFor

The attribute MUST exist, but we ignore its value during comparison.
Example: `['data-id', 'aria-describedby']`
Or target specific tags: `[{ tags: ['input'], attributes: ['id'] }]`

**Type:** `(string | AttributeMatcher)[]`

#### ignoreTags

Ignores specific tags completely from the comparison (removes them from the tree).
Example: `['my-custom-element']`

**Type:** `string[]`

#### ignoreChildren

Ignores elements that match the given CSS selectors (removes them from the tree).
Example: `['.item', '#dynamic-child']`

**Type:** `string[]`

#### ignoreTextContent

If true, all text nodes (inner text content) are ignored in the comparison.

**Type:** `boolean`

## HarnessConfig

Configuration options for the browser test harness HTML

### Properties

#### template

Optional custom HTML template.
It can be a function that receives the required scripts and stylesheets and returns the full HTML string.
Alternatively, it can be an HTML string containing the
`<!-- lupa-scripts -->` and `<!-- lupa-stylesheets -->` placeholders.

**Type:** `string | ((context: { scripts: string; stylesheets: string }) => string)`

#### stylesheets

Optional list of absolute or relative CSS file paths to include in the harness.

**Type:** `string[]`

## BaseConfig

Base configuration options

### Properties

#### cwd

Current working directory. It is required to search for
the test files

**Type:** `string`

#### watch

Whether to run tests in watch mode

**Type:** `boolean`

#### timeout

The timeout to apply on all the tests, unless overwritten explicitly

**Type:** `number`

#### retries

The retries to apply on all the tests, unless overwritten explicitly

**Type:** `number`

#### filters

Test filters to apply

**Type:** `Filters`

#### reporters

A hook to configure suites. The callback will be called for each
suite before it gets executed.
A collection of registered reporters. Reporters are not activated by
default. Either you have to activate them using the commandline,
or using the `activated` property.

**Type:** `{ activated: string[]; list?: NamedReporterContract[] }`

#### testPlugins

Browser-side test plugins. Module specifiers that export a default
setup function conforming to WebPluginFn. Executed in the browser
before test files load. Plugins receive the WebRunner, Emitter,
and config.

**Type:** `TestPluginEntry[]`

#### runnerPlugins

Node-side runner plugins. Functions executed in the Node.js
orchestrator. Receive the Node Runner, Emitter, and config.

**Type:** `RunnerPluginFn[]`

#### importer

A custom implementation to import test files.

**Type:** `(filePath: URL) => void | Promise<void>`

#### refiner

Overwrite tests refiner. Check documentation for refiner
usage

**Type:** `Refiner`

#### forceExit

Enable/disable force exiting.

**Type:** `boolean`

#### setup

Global hooks to execute before importing
the test files

**Type:** `SetupHookHandler[]`

#### teardown

Global hooks to execute on teardown

**Type:** `TeardownHookHandler[]`

#### exclude

An array of directories to exclude when searching
for test files.

For example, if you search for test files inside the entire
project, you might want to exclude "node_modules"

**Type:** `string[]`

#### viteConfig

Path to the Vite configuration file.
Do not use together with 'vite'.

**Type:** `string`

#### vite

Inline Vite configuration to merge with Lupa's defaults.
Do not use together with 'viteConfig'.

**Type:** `InlineConfig`

#### coverage

Whether to enable code coverage reporting using istanbul,
or specific options to configure the coverage instrumentation.

**Type:** `boolean | CoverageOptions`

#### harness

Customize the HTML harness environment

**Type:** `HarnessConfig`

#### parallel

Whether to run tests in parallel across browsers and pages

**Type:** `boolean`

#### concurrency

Number of concurrent pages to run per browser.
Can be 'auto' or a specific number.

**Type:** `number | "auto"`

#### list

Whether to output the list of suites and tests

**Type:** `boolean`

## CoverageOptions

Options for configuring code coverage instrumentation

### Properties

#### include

Array of glob patterns to include in coverage

**Type:** `string[]`

#### exclude

Array of glob patterns to exclude from coverage

**Type:** `string[]`

#### extension

Array of file extensions to instrument

**Type:** `string[]`

## NormalizedBaseConfig

BaseConfig after normalized by the config manager

## NormalizedConfig

Config after normalized by the config manager

## TestOptions

Test configuration options.

### Properties

#### title

Test title

**Type:** `string`

**Required:** yes

#### tags

Test tags

**Type:** `string[]`

**Required:** yes

#### timeout

Test timeout

**Type:** `number`

**Required:** yes

#### waitsForDone

Whether the test waits for done

**Type:** `boolean`

#### executor

Test executor

**Type:** `((context: TestContext, done: (error?: any) => void) => void | Promise<void>) | ((context: TestContext, value: any, done: (error?: any) => void) => void | Promise<void>) | ((context: TestContext, value: unknown, done?: (error?: any) => void) => void | Promise<void>)`

#### isTodo

Whether the test is a todo

**Type:** `boolean`

#### isSkipped

Whether the test is skipped

**Type:** `boolean`

#### isFailing

Whether the test is failing

**Type:** `boolean`

#### skipReason

Skip reason

**Type:** `string`

#### failReason

Fail reason

**Type:** `string`

#### retries

Number of retries

**Type:** `number`

#### retryAttempt

Retry attempt number

**Type:** `number`

#### meta

Test metadata

**Type:** `TestMetadata`

**Required:** yes

## GroupOptions

Group options

### Properties

#### title

Group title

**Type:** `string`

**Required:** yes

#### meta

Group metadata

**Type:** `GroupMetadata`

**Required:** yes

## FilteringOptions

Options for filtering and running on selected tests

### Properties

#### tags

Test tags to filter by

**Type:** `string[]`

#### groups

Test groups to filter by

**Type:** `string[]`

#### tests

Test names to filter by

**Type:** `string[]`

## BaseReporterOptions

Base reporter options

### Properties

#### framesMaxLimit

Maximum number of frames to capture

**Type:** `number`

## FixtureRenderOptions

Options for the `fixture` function.

### Properties

#### noWait

By default `fixture` waits for the next animation frame to ensure
elements are upgraded and connected. Set this to `true` to skip this wait.

**Type:** `boolean`

#### host

An object to use as the `this` value for event listeners. It's often
useful to set this to the host component rendering a template.

**Type:** `object`

#### renderBefore

A DOM node before which to render content in the container.

**Type:** `ChildNode | null`

#### creationScope

Node used for cloning the template (`importNode` will be called on this
node). This controls the `ownerDocument` of the rendered DOM, along with
any inherited context. Defaults to the global `document`.

**Type:** `{ importNode: any }`

#### isConnected

The initial connected state for the top-level part being rendered. If no
`isConnected` option is set, `AsyncDirective`s will be connected by
default. Set to `false` if the initial render occurs in a disconnected tree
and `AsyncDirective`s should see `isConnected === false` for their initial
render. The `part.setConnected()` method must be used subsequent to initial
render to change the connected state of the part.

**Type:** `boolean`

## BlurOptions

Options for the blur action.

### Properties

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

## ClearOptions

Options for the clear action.

### Properties

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

## ClickOptions

Options that can be passed to locator actions.

### Properties

#### button

Defaults to `left`.

**Type:** `"right" | "left" | "middle"`

#### clickCount

defaults to 1. See [UIEvent.detail].

**Type:** `number`

#### delay

Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.

**Type:** `number`

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

#### strict

When true, the call requires selector to resolve to a single element. If given selector resolves to more than one
element, the call throws an exception.

**Type:** `boolean`

#### trial

When set, this method only performs the [actionability](https://playwright.dev/docs/actionability) checks and skips the action. Defaults
to `false`. Useful to wait until the element is ready for the action without performing it.

**Type:** `boolean`

#### modifiers

Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores
current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to
"Control" on Windows and Linux and to "Meta" on macOS.

**Type:** `("Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift")[]`

#### position

A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of
the element.

**Type:** `{ x: number; y: number }`

## CheckOptions

Options for the check action.

### Properties

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

#### strict

When true, the call requires selector to resolve to a single element. If given selector resolves to more than one
element, the call throws an exception.

**Type:** `boolean`

#### trial

When set, this method only performs the [actionability](https://playwright.dev/docs/actionability) checks and skips the action. Defaults
to `false`. Useful to wait until the element is ready for the action without performing it.

**Type:** `boolean`

#### position

A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of
the element.

**Type:** `{ x: number; y: number }`

## FillOptions

Options for the fill action.

### Properties

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

#### strict

When true, the call requires selector to resolve to a single element. If given selector resolves to more than one
element, the call throws an exception.

**Type:** `boolean`

## TypeOptions

Options for the type action.

### Properties

#### delay

Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.

**Type:** `number`

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

#### modifiers

Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores
current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to
"Control" on Windows and Linux and to "Meta" on macOS.

**Type:** `("Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift")[]`

## DoubleClickOptions

Options for the double click action.

### Properties

#### button

Defaults to `left`.

**Type:** `"right" | "left" | "middle"`

#### delay

Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.

**Type:** `number`

#### steps

Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor
position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.

**Type:** `number`

#### timeout

Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout`
option in the config, or by using the
[browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout)
or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods.

**Type:** `number`

#### force

Whether to bypass the [actionability](https://playwright.dev/docs/actionability) checks. Defaults to `false`.

**Type:** `boolean`

#### trial

When set, this method only performs the [actionability](https://playwright.dev/docs/actionability) checks and skips the action. Defaults
to `false`. Useful to wait until the element is ready for the action without performing it.

**Type:** `boolean`

#### modifiers

Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores
current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to
"Control" on Windows and Linux and to "Meta" on macOS.

**Type:** `("Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift")[]`

#### position

<!-- truncated -->
