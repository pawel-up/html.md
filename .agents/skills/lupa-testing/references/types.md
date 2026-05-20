# Types & Enums

## assert

### `Constructor`
A generic class constructor
```ts
(args: any[]) => T
```

### `ChaiAssert`
Unnecessary similar methods have been removed
```ts
{ [K in keyof typeof assert]: typeof assert[K] }
```

### `AssertContract`
Assert contract
```ts
Omit<ChaiAssert, "deepStrictEqual" | "nestedInclude" | "notNestedInclude" | "deepNestedInclude" | "notDeepNestedInclude" | "ifError" | "changes" | "changesBy" | "doesNotChange" | "changesButNotBy" | "increases" | "increasesBy" | "doesNotIncrease" | "increasesButNotBy" | "decreases" | "decreasesBy" | "doesNotDecrease" | "doesNotDecreaseBy" | "decreasesButNotBy" | "extensible" | "isExtensible" | "notExtensible" | "isNotExtensible" | "deepProperty" | "notDeepProperty" | "nestedProperty" | "nestedPropertyVal" | "notNestedProperty" | "notNestedPropertyVal" | "deepNestedProperty" | "notDeepNestedProperty" | "deepNestedPropertyVal" | "notDeepNestedPropertyVal" | "hasAnyKeys" | "hasAllKeys" | "containsAllKeys" | "doesNotHaveAnyKeys" | "doesNotHaveAllKeys" | "throw" | "Throw" | "doesNotThrow" | "hasAnyDeepKeys" | "hasAllDeepKeys" | "containsAllDeepKeys" | "doesNotHaveAnyDeepKeys" | "doesNotHaveAllDeepKeys" | "closeTo" | "operator" | "oneOf" | "ownInclude" | "notOwnInclude" | "deepOwnInclude" | "notDeepOwnInclude">
```

### `AnyErrorConstructor`
A more flexible error constructor than `ErrorConstructor` type that allows custom
error classes with any constructor signature
```ts
(args: any[]) => Error
```

### `AttributeMatcher`
Only the combination of tag and attribute names will be used to match the attribute.
**Properties:**
- `tags: string[]` — The list of element tags to match.
- `attributes: string[]` — The list of attributes to match.

## runner

### `SetupHookState`
Global setup hook state
```ts
[[runner: Runner], [error: Error | null, runner: Runner]]
```

### `SetupHookHandler`
Global setup hook handler
```ts
HookHandler<SetupHookState[0], SetupHookState[1]>
```

### `TeardownHookState`
Global teardown hook state
```ts
[[runner: Runner], [error: Error | null, runner: Runner]]
```

### `TeardownHookHandler`
Global teardown hook handler
```ts
HookHandler<TeardownHookState[0], TeardownHookState[1]>
```

### `HooksEvents`
Global set of available hooks
**Properties:**
- `setup: SetupHookState` — Global setup hook
- `teardown: TeardownHookState` — Global teardown hook

### `Filters`
Set of filters you can apply to run only specific tests
```ts
FilteringOptions & { files?: string[]; suites?: string[] }
```

### `TestPluginEntry`
A test plugin entry for browser-side plugins. Can be:
- A bare module specifier string (no options)
- A tuple of [specifier, options] where options must be JSON-serializable
```ts
string | [specifier: string, options: JsonSerializable]
```

### `RunnerPluginFn`
Runner plugin function. Receives the Node runner, emitter, and config.
Executed in the Node.js orchestrator process.
```ts
(context: { config: NormalizedConfig; cliArgs: CLIArgs; runner: Runner; emitter: Emitter }) => void | Promise<void>
```

### `TestFiles`
A collection of test files defined as a glob or a callback
function that returns an array of URLs
```ts
string | string[] | (() => URL[] | Promise<URL[]>)
```

### `TestSuite`
A test suite to register tests under a named suite
**Properties:**
- `name: string` — A unique name for the suite
- `files: TestFiles` — Collection of files associated with the suite. Files should be
defined as a glob or a callback function that returns an array of URLs
- `timeout: number` (optional) — The timeout to apply on all the tests in this suite, unless overwritten explicitly
- `retries: number` (optional) — The retries to apply on all the tests in this suite, unless overwritten explicitly

### `Config`
Configuration options
```ts
BaseConfig & ({ files: TestFiles } | { suites: TestSuite[] })
```

### `CLIArgs`
Parsed command-line arguments
```ts
{ _?: string[]; tags?: string | string[]; files?: string | string[]; tests?: string | string[]; groups?: string | string[]; timeout?: string; retries?: string; reporters?: string | string[]; forceExit?: boolean; failed?: boolean; help?: boolean; matchAll?: boolean; listPinned?: boolean; bail?: boolean; bailLayer?: string; verbose?: boolean; browser?: string | string[]; viteConfig?: string; coverage?: boolean; parallel?: boolean; concurrency?: string | number; list?: boolean } & Record<string, string | string[] | boolean | number>
```

### `JsonSerializable`
Enforces JSON-serializable values at the type level.
Functions, symbols, undefined, and class instances are rejected.
```ts
string | number | boolean | null | JsonSerializable[] | { [key: string]: JsonSerializable }
```

### `Runner`
The Runner class exposes the API to manage the node process telemetry
and reporters for Lupa tests running in the browser.
**Properties:**
- `summaryBuilder: SummaryBuilder` — Summary builder is used to create the tests summary reported by
multiple reporters. Each report contains a key-value pair
- `reporters: Set<ReporterContract>` — Registered tests reporter
- `failed: unknown`
- `reporterEmitter: Emitter<RunnerEvents>` (optional) — Optional emitter to use for reporters. If not set, the main emitter is used.
Useful for watch mode filtering.

## types

### `TestError`
One of the predefined types of errors that can happen during test execution
```ts
AssertionError<unknown> | Error
```

### `SummaryReporter`
Summary reporters are registered with the SummaryBuilder to
add information to the tests summary output
```ts
() => { key: string; value: string | string[] }[]
```

### `DataSetNode`
Shape of test data set. Should be an array of a function that
returns an array
```ts
undefined | any[] | (() => any[] | Promise<any[]>)
```

### `TestHooksData`
The data given to the setup and the teardown test
hooks
```ts
[[test: Test<any>], [hasError: boolean, test: Test<any>]]
```

### `TestHooksHandler`
The function that can be registered as a test hook
```ts
HookHandler<TestHooksData[0], TestHooksData[1]>
```

### `TestHooksCleanupHandler`
The function that can be registered as a cleanup handler
```ts
CleanupHandler<TestHooksData[1]>
```

### `TestHooks`
Hooks available on a test

### `GroupHooksData`
The data given to the setup and the teardown group
hooks
```ts
[[group: Group], [hasError: boolean, group: Group]]
```

### `GroupHooksHandler`
The callback function given to the "setup" and the "teardown"
methods on a group
```ts
HookHandler<GroupHooksData[0], GroupHooksData[1]>
```

### `GroupHooks`
Hooks available on a group

### `SuiteHooksData`
The data given to the setup and the teardown suite
hooks
```ts
[[suite: Suite], [hasError: boolean, suite: Suite]]
```

### `SuiteHooksHandler`
The function that can be registered as a suite hook
```ts
HookHandler<SuiteHooksData[0], SuiteHooksData[1]>
```

### `SuiteHooks`
Hooks available on a suite

### `PlannedTestSuite`
A test suite that has been planned, with the filesURLs.
```ts
TestSuite & { filesURLs: URL[] }
```

### `TestExecutor`
The function to execute the test
```ts
DataSet extends any[] ? (context: TestContext, value: DataSet[number], done: (error?: any) => void) => void | Promise<void> : DataSet extends () => infer A ? (context: TestContext, value: Awaited<A> extends any[] ? Awaited<A>[number] : Awaited<A>, done?: (error?: any) => void) => void | Promise<void> : (context: TestContext, done: (error?: any) => void) => void | Promise<void>
```

### `TestStartNode`
Data shared during "test:start" event
```ts
Omit<TestOptions, "title"> & { title: { original: string; expanded: string }; isPinned: boolean; dataset?: { size: number; index: number; row: any }; meta: TestMetadata }
```

### `CorrelationIds`
Common correlation IDs for parallel telemetry
**Properties:**
- `browserId: string` — Browser ID
- `file: string` — File path
- `suiteId: string` (optional) — Suite ID
- `groupId: string` (optional) — Group ID

### `WithCorrelation`
A type that adds correlation IDs to a type.
These are used with log reporting.
```ts
T & CorrelationIds
```

### `TestEndNode`
Data shared during "test:end" event
```ts
Omit<TestOptions, "title"> & { title: { original: string; expanded: string }; isPinned: boolean; duration: number; hasError: boolean; errors: { phase: "setup" | "test" | "setup:cleanup" | "teardown" | "teardown:cleanup" | "test:cleanup"; error: TestError }[]; retryAttempt?: number; dataset?: { size: number; index: number; row: any } }
```

### `GroupMetadata`
The metadata object associated with a group events.
**Properties:**
- `fileName: string` (optional) — File path in which the group is defined
- `suite: string` (optional) — Suite name in which the group is defined

### `TestMetadata`
The metadata object associated with a test events.
**Properties:**
- `fileName: string` (optional) — File path in which the test is defined
- `suite: string` (optional) — Suite name in which the test is defined
- `group: string` (optional) — Group name in which the test is defined
- `abort: (message: string) => any` (optional) — Abort the test if the condition is met

### `GroupStartNode`
Data shared with "group:start" event
```ts
GroupOptions
```

### `GroupEndNode`
Data shared with "group:end" event
```ts
GroupOptions & { hasError: boolean; errors: { phase: "setup" | "setup:cleanup" | "teardown" | "teardown:cleanup"; error: TestError }[] }
```

### `SuiteStartNode`
Data shared with "suite:start" event
**Properties:**
- `name: string` — Suite name
- `filesCount: number` (optional) — Number of files in the suite

### `SuiteEndNode`
Data shared with "suite:end" event
**Properties:**
- `name: string` — Suite name
- `filesCount: number` (optional) — Number of files in the suite
- `hasError: boolean` — Whether the suite has any errors
- `errors: { phase: "setup" | "setup:cleanup" | "teardown" | "teardown:cleanup"; error: TestError }[]` — Errors that occurred during the suite execution

### `RunnerStartNode`
Data shared with "runner:start" event
**Properties:**
- `estimatedTotalFiles: number` — The number of total files that should be tested.
Used for progress reporting.

### `RunnerEndNode`
Data shared with "runner:end" event
**Properties:**
- `hasError: boolean` — Whether the runner has any errors

### `RunnerImportErrorNode`
Runner import error
**Properties:**
- `file: string` — The file that failed to import
- `error: TestError` — The error that occurred

### `UncaughtExceptionNode`
Uncaught exception
**Properties:**
- `error: TestError` — The error that occurred
- `type: "error" | "rejection"` — Type of exception

### `RunnerListTestNode`
Test node inside the test discovery list tree.
**Properties:**
- `title: string` — The title of the test.
- `tags: string[]` — An array of tags assigned to the test.
- `timeout: number` — The timeout for the test execution in milliseconds.
- `retries: number` (optional) — The number of retries configured for the test, if any.
- `isSkipped: boolean` — Whether the test has been marked as skipped.
- `isTodo: boolean` — Whether the test has been marked as a TODO.
- `meta: TestMetadata` — Metadata associated with the test, such as its location.

### `RunnerListGroupNode`
Group node inside the test discovery list tree.
**Properties:**
- `title: string` — The title of the test group.
- `tests: RunnerListTestNode[]` — A collection of tests directly within this group.
- `groups: RunnerListGroupNode[]` — A collection of nested groups within this group.

### `RunnerListSuiteNode`
Suite node inside the test discovery list tree.
**Properties:**
- `name: string` — The name of the test suite.
- `groups: RunnerListGroupNode[]` — A collection of test groups belonging to this suite.
- `tests: RunnerListTestNode[]` — A collection of tests directly belonging to this suite (not inside any group).

### `RunnerListNode`
Data payload shared with the "runner:list" telemetry event.
**Properties:**
- `suites: RunnerListSuiteNode[]` — A collection of all suites discovered during the dry-run.

### `RunnerPinnedTestsNode`
Runner pinned tests
**Properties:**
- `tests: { title: string; stack: string }[]` — Pinned tests metadata

### `FrameworkEvents`
Events emitted natively by the test framework without correlation IDs
**Properties:**
- `test:start: TestStartNode` — Emitted when a test starts.
- `test:end: TestEndNode` — Emitted when a test ends.
- `group:start: GroupOptions` — Emitted when a group starts.
- `group:end: GroupEndNode` — Emitted when a group ends.
- `suite:start: SuiteStartNode` — Emitted when a suite starts.
- `suite:end: SuiteEndNode` — Emitted when a suite ends.
- `uncaught:exception: UncaughtExceptionNode` — Emitted when an uncaught exception occurs.
- `runner:pinned_tests: RunnerPinnedTestsNode` — Emitted when the runner finds pinned tests.
- `runner:list: RunnerListNode` — Emitted when the runner is in list mode and dumps the test tree
- `runner:start: RunnerStartNode` — Emitted when the runner starts.
- `runner:end: RunnerEndNode` — Emitted when the runner ends.
- `runner:import_error: RunnerImportErrorNode` — Emitted when a test file fails to import

### `BrowserTelemetryEvents`
Events emitted by the browser telemetry over WebSocket
**Properties:**
- `test:start: WithCorrelation<TestStartNode>` — Emitted when a test starts.
- `test:end: WithCorrelation<TestEndNode>` — Emitted when a test ends.
- `group:start: WithCorrelation<GroupOptions>` — Emitted when a group starts.
- `group:end: WithCorrelation<GroupEndNode>` — Emitted when a group ends.
- `suite:start: WithCorrelation<SuiteStartNode>` — Emitted when a suite starts.
- `suite:end: WithCorrelation<SuiteEndNode>` — Emitted when a suite ends.
- `uncaught:exception: UncaughtExceptionNode & Partial<CorrelationIds>` — Emitted when an uncaught exception occurs.
- `runner:pinned_tests: RunnerPinnedTestsNode & Partial<CorrelationIds>` — Emitted when the runner finds pinned tests.
- `runner:list: RunnerListNode & Partial<CorrelationIds>` — Emitted when the runner is in list mode and dumps the test tree
- `runner:start: RunnerStartNode & Partial<CorrelationIds>` — Emitted when the runner starts.
- `runner:end: RunnerEndNode & Partial<CorrelationIds>` — Emitted when the runner ends.
- `runner:import_error: RunnerImportErrorNode & Partial<CorrelationIds>` — Emitted when a test file fails to import

### `RunnerEvents`
Events emitted by the Node runner orchestrator.
Includes hydrated browser events and pool lifecycle events.
**Properties:**
- `browser:log: { file: string; type: string; messages: any[] }` — Browser console log
- `test:start: WithCorrelation<TestStartNode>` — Emitted when a test starts.
- `test:end: WithCorrelation<TestEndNode>` — Emitted when a test ends.
- `group:start: WithCorrelation<GroupOptions>` — Emitted when a group starts.
- `group:end: WithCorrelation<GroupEndNode>` — Emitted when a group ends.
- `suite:start: WithCorrelation<SuiteStartNode>` — Emitted when a suite starts.
- `suite:end: WithCorrelation<SuiteEndNode>` — Emitted when a suite ends.
- `uncaught:exception: UncaughtExceptionNode & Partial<CorrelationIds>` — Emitted when an uncaught exception occurs.
- `runner:pinned_tests: RunnerPinnedTestsNode & Partial<CorrelationIds>` — Emitted when the runner finds pinned tests.
- `runner:list: RunnerListNode & Partial<CorrelationIds>` — Emitted when the runner is in list mode and dumps the test tree
- `runner:start: RunnerStartNode & Partial<CorrelationIds>` — Emitted when the runner starts.
- `runner:end: RunnerEndNode & Partial<CorrelationIds>` — Emitted when the runner ends.
- `runner:import_error: RunnerImportErrorNode & Partial<CorrelationIds>` — Emitted when a test file fails to import

### `ReporterHandlerContract`
Type for the reporter handler function
```ts
(runner: Runner, emitter: Emitter<RunnerEvents>, config: NormalizedConfig) => void | Promise<void>
```

### `NamedReporterContract`
Type for a named reporter object.
**Properties:**
- `name: string` — Reporter name
- `usesCLI: boolean` (optional) — Whether the reporter takes exclusive control of the CLI output.

<!-- truncated -->
