# Classes

## testing/test

### `Test`
Test class exposes a self contained API to configure and run
tests along with its hooks.
*extends `default`*
```ts
constructor<TestData>(title: string, context: TestContext | ((test: Test<TestData>) => TestContext | Promise<TestContext>), emitter: Emitter, refiner: Refiner, parent?: Group): Test<TestData>
```
**Properties:**
- `executingCallbacks: ((test: Test) => void)[]` — Methods to call before the test callback is executed
- `executedCallbacks: ((test: Test, hasError: boolean, errors: { phase: "setup" | "setup:cleanup" | "teardown" | "teardown:cleanup" | "test" | "test:cleanup"; error: TestError }[]) => void)[]` — Methods to call after the test callback is executed
- `options: TestOptions` — Test options
- `dataset: any[]` (optional) — Reference to the test dataset
- `context: TestContext` — Reference to the test context. Available at the time
of running the test
- `title: string`
- `parent: Group` (optional)
**Methods:**
- `executing(callback: (test: Test) => void): void` — Define a synchronous function to call before running
the test executor callback

Do note: Async methods are not allowed
- `executed(callback: (test: Test, hasError: boolean, errors: { phase: "setup" | "setup:cleanup" | "teardown" | "teardown:cleanup" | "test" | "test:cleanup"; error: TestError }[]) => void): void` — Define a synchronous function to call after running
the test executor callback

Do note: Async methods are not allowed
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.
- `skip(skip: boolean | (() => boolean | Promise<boolean>), skipReason?: string): this` — Skip the test conditionally
- `fails(failReason?: string): this` — Expect the test to fail. Helpful in creating test cases
to showcase bugs
- `timeout(timeout: number): this` — Define custom timeout for the test
- `disableTimeout(): this` — Disable test timeout. It is same as calling `test.timeout(0)`
- `resetTimeout(duration?: number): this` — Reset the timeout from within the test callback.
- `tags(tags: string[], strategy: "replace" | "append" | "prepend"): this` — Assign tags to the test. Later you can use the tags to run
specific tests
- `retry(retries: number): this` — Configure the number of times this test should be retried
when failing.
- `waitForDone(): this` — Wait for the test executor to call done method
- `pin(): this` — Pin current test. Pinning a test will only run the
pinned tests.
- `with<Dataset>(dataset: Dataset): Test<Dataset>` — Define the dataset for the test. The test executor will be invoked
for all the items inside the dataset array
- `run(executor: TestExecutor<TestData>, debuggingError?: Error): this` — Define the test executor function
- `setup(handler: TestHooksHandler): this` — Register a test setup function
- `teardown(handler: TestHooksHandler): this` — Register a test teardown function
- `cleanup(handler: TestHooksCleanupHandler): this` — Register a cleanup hook from within the test
- `exec(): Promise<void>` — Execute test
- `toJSON(): RunnerListTestNode` — Return JSON representation of the test
```ts
const test = new Test('2 + 2 = 4', emitter, refiner)

test.run(async ({ assert }) => {
  assert.equal(2 + 2 , 4)
})
```
