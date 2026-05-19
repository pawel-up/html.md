# Classes

## testing

### `TestContext`
A fresh copy of test context is shared with all the tests.
Note, this runs in the browser context.
*extends `default`*
```ts
constructor(test: Test): TestContext
```
**Properties:**
- `cleanup: (cleanupCallback: TestHooksCleanupHandler) => void`
- `test: Test`
- `assert: Assert`
- `network: Network`
**Methods:**
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.

### `Emitter`
Runner emitter
*extends `default<Events>`*
```ts
constructor<Events>(options?: Options<Events>): Emitter<Events>
```
**Properties:**
- `isDebugEnabled: boolean` — Toggle debug mode for all instances.

Default: `true` if the `DEBUG` environment variable is set to `emittery` or `*`, otherwise `false`.
- `listenerAdded: typeof listenerAdded` — Fires when an event listener was added.

An object with `listener` and `eventName` (if `on` or `off` was used) is provided as event data.
- `listenerRemoved: typeof listenerRemoved` — Fires when an event listener was removed.

An object with `listener` and `eventName` (if `on` or `off` was used) is provided as event data.
- `debug: DebugOptions<Events>` — Debugging options for the current instance.
**Methods:**
- `mixin(emitteryPropertyName: string | symbol, methodNames?: readonly string[]): (klass: T, context?: ClassDecoratorContext<T>) => T` — In TypeScript, it returns a decorator which mixins `Emittery` as property `emitteryPropertyName` and `methodNames`, or all `Emittery` methods if `methodNames` is not defined, into the target class.
- `onError(errorHandler: (error: any) => void | Promise<void>): void` — Define onError handler invoked when `emit` fails
- `on<Name>(eventName: Name | readonly Name[], listener: (eventData: Events[Name]) => void | Promise<void>): UnsubscribeFunction` — Override Emittery's `on` to unwrap the `{ name, data }` payload that Emittery v1 passes.
Japa reporters expect the raw data object, not the wrapped one.
- `emit<Name>(eventName: Name, eventData?: Events[Name], allowMetaEvents?: boolean): Promise<void>` — Emit event
- `events<Name>(eventName: Name | readonly Name[], options?: { signal?: AbortSignal }): AsyncIterableIterator<EventDataPair<Events, Name>, any, any> & AsyncDisposable` — Get an async iterator which buffers data each time an event is emitted.

Call `return()` on the iterator to remove the subscription. You can also pass an AbortSignal to cancel the subscription externally, or use `await using` for automatic cleanup.
- `off<Name>(eventName: Name | readonly Name[], listener: (event: EventDataPair<Events & OmnipresentEventData, Name>) => void | Promise<void>): void` — Remove one or more event subscriptions.
- `once<Name>(eventName: Name | readonly Name[], predicate?: (event: EventDataPair<Events & OmnipresentEventData, Name>) => boolean): EmitteryOncePromise<EventDataPair<Events & OmnipresentEventData, Name>>` — Subscribe to one or more events only once. It will be unsubscribed after the first event that matches the predicate (if provided).

The second argument can be a predicate function or an options object with `predicate` and/or `signal`.
- `emitSerial<Name>(eventName: Name): Promise<void>` — Same as `emit()`, but it waits for each listener to resolve before triggering the next one. This can be useful if your events depend on each other. Although ideally they should not. Prefer `emit()` whenever possible.

If any of the listeners throw/reject, the returned promise will be rejected with the error and the remaining listeners will *not* be called.
- `onAny(listener: (event: EventDataPair<Events, keyof Events>) => void | Promise<void>, options?: { signal?: AbortSignal }): UnsubscribeFunction` — Subscribe to be notified about any event.
- `anyEvent(options?: { signal?: AbortSignal }): AsyncIterableIterator<EventDataPair<Events, keyof Events>, any, any> & AsyncDisposable` — Get an async iterator which buffers an event object each time an event is emitted.

Call `return()` on the iterator to remove the subscription. You can also pass an AbortSignal to cancel the subscription externally, or use `await using` for automatic cleanup.
- `offAny(listener: (event: EventDataPair<Events, keyof Events>) => void | Promise<void>): void` — Remove an `onAny` subscription.
- `clearListeners<Name>(eventName?: Name | readonly Name[]): void` — Clear all event listeners on the instance.

If `eventNames` is given, only the listeners for those events are cleared. Accepts a single event name or an array.
- `init<Name>(eventName: Name, initFn: () => void | (() => void)): UnsubscribeFunction` — Register a function to be called when the first `.on()` listener subscribes to `eventName`. The `initFn` can optionally return a cleanup (deinit) function, which is called when the last `.on()` listener unsubscribes (or when `clearListeners()` removes all listeners for that event).

If `.on()` listeners already exist when `init()` is called, `initFn` is called immediately.

Note: Lifecycle hooks only apply to `.on()` listeners. Subscriptions via `.events()` async iterators do not trigger the init or deinit functions.
- `listenerCount<Name>(eventName?: Name | readonly Name[]): number` — The number of listeners for the `eventName` or all events if not specified.
- `logIfDebugEnabled<Name>(type: string, eventName?: Name, eventData?: Events[Name]): void` — Log debug information if debug mode is enabled (either globally via `Emittery.isDebugEnabled` or per-instance via `debug.enabled`).
- `bindMethods(target: Record<string, unknown>, methodNames?: readonly string[]): void` — Bind the given `methodNames`, or all `Emittery` methods if `methodNames` is not defined, into the `target` object.

### `WebRunner`
The WebRunner class exposes the API to register test suites and execute
them sequentially in the browser.
*extends `default`*
```ts
constructor(emitter: Emitter): WebRunner
```
**Properties:**
- `suites: Suite[]` — A collection of suites
**Methods:**
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.
- `add(suite: Suite): this` — Add a suite to the runner
- `onSuite(callback: (suite: Suite) => void): this` — Tap into each suite and configure it
- `bail(toggle: boolean): this` — Enable/disable the bail mode. In bail mode, all
upcoming suites/groups/tests will be skipped
when the current test fails
- `start(): Promise<void>` — Start the test runner process. The method emits
"runner:start" event
- `exec(): Promise<void>` — Execute runner suites
- `end(): Promise<void>` — End the runner process. Emits "runner:end" event
