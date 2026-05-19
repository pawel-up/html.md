# Classes

## testing/group

### `Group`
Group class exposes an API to group multiple tests together
and bulk configure them.

NOTE: Nested groups are not supported on purpose.
*extends `default`*
```ts
constructor(title: string, emitter: Emitter, refiner: Refiner): Group
```
**Properties:**
- `options: GroupOptions`
- `tests: Test<any>[]` — An array of tests registered under the given group
- `each: { setup: (handler: TestHooksHandler) => void; teardown: (handler: TestHooksHandler) => void; timeout: (timeout: number) => void; retry: (retries: number) => void; skip: (skip?: boolean | (() => boolean | Promise<boolean>), skipReason?: string) => void; disableTimeout: () => void }` — Shortcut methods to configure tests
- `title: string`
**Methods:**
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.
- `bail(toggle: boolean): this` — Enable/disable the bail mode. In bail mode, all
upcoming tests will be skipped when the current
test fails
- `add(test: Test<any>): this` — Add a test to the group. Adding a test to the group
mutates the test properties
- `tap(callback: (test: Test<any>) => void): this` — Tap into each test and configure it
- `setup(handler: GroupHooksHandler): this` — Define setup hook for the group
- `teardown(handler: GroupHooksHandler): this` — Define teardown hook for the group
- `exec(): Promise<void>` — Execute group hooks and tests
- `toJSON(): RunnerListGroupNode` — Return JSON representation of the group
```ts
const group = new Group('addition', emitter, refiner)
const test = new Test('2 + 2 = 4', emitter, refiner)

group.add(test)
await group.exec()
```
