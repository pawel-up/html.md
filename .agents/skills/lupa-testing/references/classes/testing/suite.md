# Classes

## testing/suite

### `Suite`
The Suite class exposes the API to run a group of tests
or independent tests together as part of a suite.

You can think of suites as
  - unit tests suite
  - e2e tests suites
  - and so on
*extends `default`*
```ts
constructor(name: string, emitter: Emitter, refiner: Refiner): Suite
```
**Properties:**
- `stack: (Test<any> | Group)[]` — A collection of tests and groups both
- `filesCount: number` — Number of files in the suite
- `name: string`
**Methods:**
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.
- `add(testOrGroup: Test<any> | Group): this` — Add a test or a group to the execution stack
- `onTest(callback: (test: Test<any>) => void): this` — Tap into each test and configure it
- `onGroup(callback: (group: Group) => void): this` — Tap into each group and configure it
- `bail(toggle: boolean): this` — Enable/disable the bail mode. In bail mode, all
upcoming tests/group will be skipped when the current
test fails
- `setup(handler: SuiteHooksHandler): this` — Register a test setup function
- `teardown(handler: SuiteHooksHandler): this` — Register a test teardown function
- `exec(): Promise<void>` — Execute suite groups, tests and hooks
- `toJSON(): RunnerListSuiteNode` — Return JSON representation of the suite
```ts
const suite = new Suite('unit', emitter)
const group = new Group('addition', emitter, refiner)
const test = new Test('2 + 2 = 4', emitter, refiner)

suite.add(group)
group.add(test)

// Runs all the tests inside the registered group
await suite.exec()
```
