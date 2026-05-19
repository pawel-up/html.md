# Classes

## assert

### `Assert`
The Assert class is derived from chai.assert to allow support
for additional assertion methods and assertion planning.

Also some of the methods from chai.assert are not available
and some additional methods have been added.
*extends `default`*
*implements `AssertContract`*
```ts
constructor(): Assert
```
**Properties:**
- `assertions: { planned?: number; total: number; mismatchError: Error | null; validate: any }` — Tracking assertions
- `Assertion: AssertionStatic`
- `AssertionError: typeof AssertionError`
**Methods:**
- `macro<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds a macro (property or method) to the class prototype.
Macros are standard properties that get added to the class prototype,
making them available on all instances of the class.
- `instanceProperty<T, K>(this: T, name: K, value: InstanceType<T>[K]): void` — Adds an instance property that will be assigned to each instance during construction.
Unlike macros which are added to the prototype, instance properties are unique to each instance.
- `getter<T, K>(this: T, name: K, accumulator: () => InstanceType<T>[K], singleton?: boolean): void` — Adds a getter property to the class prototype using Object.defineProperty.
Getters are computed properties that are evaluated each time they are accessed,
unless the singleton flag is enabled.
- `incrementAssertionsCount(): void` — Increments the assertions count by 1
- `plan(assertionsToExpect: number): this` — Plan assertions to expect by the end of this test

This method is used to declare the number of assertions you expect to run
in a test. If the number of assertions that actually run does not match
the planned number, the test will fail.
- `evaluate(expression: any, message: string, stackProps: { actual: any; expected: any; operator: string; showDiff?: boolean; prefix?: string; thisObject?: any }): void` — Evaluate an expression and raise AssertionError if expression
is not truthy

This method is used internally by other assertion methods to evaluate expressions
and raise AssertionError if the expression is not truthy.
- `assert(expression: any, message?: string): void` — Assert an expression to be truthy.
Optionally define the error message

@example:
assert(isTrue(foo))
assert(foo === 'bar')
assert(age > 18, 'Not allowed to enter the club')
- `fail(message?: string): never` — Throws a failure.
- `isOk(value: unknown, message?: string): void` — Assert the value is truthy
- `ok(value: unknown, message?: string): void` — Assert the value is truthy
- `isNotOk<T>(value: T, message?: string): void` — Assert the value is falsy
- `notOk<T>(value: T, message?: string): void` — Assert the value is falsy
- `equal<T>(actual: T, expected: T, message?: string): void` — Assert two values are equal but not strictly. The comparison
is same as "foo == bar".
- `notEqual<T>(actual: T, expected: T, message?: string): void` — Assert two values are not equal. The comparison
is same as "foo != bar".
- `strictEqual<T>(actual: T, expected: T, message?: string): void` — Assert two values are strictly equal. The comparison
is same as "foo === bar".
- `notStrictEqual<T>(actual: T, expected: T, message?: string): void` — Assert two values are not strictly equal. The comparison
is same as "foo !== bar".
- `deepEqual<T>(actual: T, expected: T, message?: string): void` — Assert two values are deeply equal. The order of items in
an array should be same for the assertion to pass.
- `notDeepEqual<T>(actual: T, expected: T, message?: string): void` — Assert two values are not deeply equal.
- `isAbove(valueToCheck: Date, valueToBeAbove: Date, message?: string): void` — Assert if the actual Date is above the expected Date.
- `isAtLeast(valueToCheck: Date, valueToBeAtLeast: Date, message?: string): void` — Assert if the actual value is above or same as the expected value.
- `isBelow(valueToCheck: Date, valueToBeBelow: Date, message?: string): void` — Assert if the actual value is below the expected value.
- `isAtMost(valueToCheck: Date, valueToBeAtMost: Date, message?: string): void` — Assert if the actual value is below or same as the expected value.
- `isTrue(value: unknown, message?: string): void` — Assert the value is a boolean (true).
- `isNotTrue<T>(value: T, message?: string): void` — Assert the value is anything, but not true
- `isFalse(value: unknown, message?: string): void` — Assert the value is boolean (false)
- `isNotFalse<T>(value: T, message?: string): void` — Assert the value is anything but not false
- `isNull(value: unknown, message?: string): void` — Assert the value is null
- `isNotNull<T>(value: T, message?: string): void` — Assert the value is anything but not null
- `isNaN<T>(value: T, message?: string): void` — Assert the value is NaN
- `isNotNaN<T>(value: T, message?: string): void` — Assert the value is anything, but not NaN
- `exists<T>(value: T, message?: string): void` — Asserts the value is not "null" or "undefined"
- `notExists(value: unknown, message?: string): void` — Asserts the value is "null" or "undefined"
- `isUndefined(value: unknown, message?: string): void` — Asserts the value is explicitly "undefined"
- `isDefined<T>(value: T, message?: string): void` — Asserts the value is anything, but not "undefined"
- `isFunction<T>(value: T, message?: string): void` — Assert the value is a function
- `isNotFunction<T>(value: T, message?: string): void` — Assert the value is not a function
- `isObject<T>(value: T, message?: string): void` — Assert the value to a valid object literal
- `isNotObject<T>(value: T, message?: string): void` — Assert the value to not be an object literal
- `isArray<T>(value: T, message?: string): void` — Assert the value to be a valid array
- `isNotArray<T>(value: T, message?: string): void` — Assert the value to not be an array
- `isString<T>(value: T, message?: string): void` — Assert the value to be a string literal
- `isNotString<T>(value: T, message?: string): void` — Assert the value to not be a string literal
- `isNumber<T>(value: T, message?: string): void` — Assert the value to be a valid number
- `isNotNumber<T>(value: T, message?: string): void` — Assert the value to not be a valid number
- `isFinite<T>(value: T, message?: string): void` — Assert the value to be a number and no NaN or Infinity
- `isBoolean<T>(value: T, message?: string): void` — Assert the value is a boolean
- `isNotBoolean<T>(value: T, message?: string): void` — Assert the value is anything, but not a boolean
- `typeOf<T>(value: T, type: string, message?: string): void` — Assert the typeof value matches the expected type
- `notTypeOf<T>(value: T, type: string, message?: string): void` — Assert the typeof value is not same as the expected type
- `instanceOf<T>(value: T, constructor: Constructor<T>, message?: string): void` — Assert value to be an instance of the expected class
- `notInstanceOf<T, U>(value: T, type: Constructor<U>, message?: string): void` — Assert value to NOT be an instance of the expected
class
- `include(haystack: string, needle: string, message?: string): void` — Asserts that haystack includes needle.
- `notInclude(haystack: string, needle: string, message?: string): void` — Asserts that haystack does not include needle.
- `deepInclude(haystack: string, needle: string, message?: string): void` — Asserts that haystack includes needle. Deep equality is used.
- `notDeepInclude(haystack: string, needle: string, message?: string): void` — Asserts that haystack does not include needle. Deep equality is used.
- `match(value: string, regexp: RegExp, message?: string): void` — Assert the value to match the given regular expression
- `notMatch(value: string, regexp: RegExp, message?: string): void` — Assert the value to NOT match the given regular expression
- `property<T>(object: T, property: string, message?: string): void` — Assert an object to contain a property
- `notProperty<T>(object: T, property: string, message?: string): void` — Assert an object to NOT contain a property
- `propertyVal<T, V>(object: T, property: string, value: V, message?: string): void` — Assert an object property to match the expected value

Use deepPropertyVal for deep comparing the value
- `notPropertyVal<T, V>(object: T, property: string, value: V, message?: string): void` — Assert an object property to NOT match the expected value
- `deepPropertyVal<T, V>(object: T, property: string, value: V, message?: string): void` — Assert an object property to deeply match the expected value
- `notDeepPropertyVal<T, V>(object: T, property: string, value: V, message?: string): void` — Assert an object property to NOT deeply match the expected value
- `lengthOf<T>(object: T, length: number, message?: string): void` — Assert length of an array, map or set to match the expected value
- `properties<T>(object: T, keys: Record<string, any> | (string | object)[], message?: string): void` — Assert the object has all of the expected properties
- `anyProperties<T>(object: T, keys: Record<string, any> | (string | object)[], message?: string): void` — Assert the object has any of the expected properties
- `onlyProperties<T>(object: T, keys: Record<string, any> | (string | object)[], message?: string): void` — Assert the object has only the expected properties. Extra
properties will fail the assertion
- `notAnyProperties<T>(object: T, keys: Record<string, any> | (string | object)[], message?: string): void` — Assert the object to not have any of the mentioned properties
- `notAllProperties<T>(object: T, keys: Record<string, any> | (string | object)[], message?: string): void` — Assert the object to not have all of the mentioned properties
- `throws(fn: () => unknown): void` — Expect the function to throw an exception.
- `doesNotThrow(fn: () => unknown): void` — Expect the function to not throw an exception.
- `closeTo(actual: number, expected: number, delta: number, message?: string): void` — Assert the value is closer to the expected value + delta
- `approximately(actual: number, expected: number, delta: number, message?: string): void` — Assert the value is equal to the expected value +/- delta range
- `sameMembers<T>(set1: T[], set2: T[], message?: string): void` — Assert two arrays to have same members. The values comparison
is same the `assert.equal` method.

Use sameDeepMembers for deep comparison
- `notSameMembers<T>(set1: T[], set2: T[], message?: string): void` — Assert two arrays to NOT have same members. The values comparison
is same the `assert.notEqual` method.

Use notSameDeepMembers for deep comparison
- `sameDeepMembers<T>(set1: T[], set2: T[], message?: string): void` — Assert two arrays to have same members.
- `notSameDeepMembers<T>(set1: T[], set2: T[], message?: string): void` — Assert two arrays to NOT have same members.
- `sameOrderedMembers<T>(set1: T[], set2: T[], message?: string): void` — Expect two arrays to have same members and in the same order.

The values comparison is same the `assert.equal` method.
Use sameDeepOrderedMembers for deep comparison
- `notSameOrderedMembers<T>(set1: T[], set2: T[], message?: string): void` — Expect two arrays to either have different members or in
different order

The values comparison is same the `assert.notEqual` method.
Use notSameDeepOrderedMembers for deep comparison
- `sameDeepOrderedMembers<T>(set1: T[], set2: T[], message?: string): void` — Expect two arrays to have same members and in the same order.

The values comparison is same the `assert.deepEqual` method.
- `notSameDeepOrderedMembers<T>(set1: T[], set2: T[], message?: string): void` — Expect two arrays to either have different members or in
different order

The values comparison is same the `assert.notDeepEqual` method.
Use notSameDeepOrderedMembers for deep comparison
- `includeMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is a subset of a given array.

The values comparison is same the `assert.equal` method.
Use includeDeepMembers for deep comparison.
- `notIncludeMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is NOT a subset of a given array.

The values comparison is same the `assert.notEqual` method.
Use notIncludeDeepMembers for deep comparison.
- `includeDeepMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is a subset of a given array.

The values comparison is same the `assert.deepEqual` method.
- `notIncludeDeepMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is NOT a subset of a given array.

The values comparison is same the `assert.notDeepEqual` method.
- `includeOrderedMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is a subset of a given array and
in the same order

The values comparison is same the `assert.equal` method.
Use includeDeepOrderedMembers for deep comparison.
- `notIncludeOrderedMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is either not a subset of
a given array or is not in the same order.

The values comparison is same the `assert.notEqual` method.
Use notIncludeDeepOrderedMembers for deep comparison.
- `includeDeepOrderedMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is a subset of a given array and
in the same order

The values comparison is same the `assert.deepEqual` method.
- `notIncludeDeepOrderedMembers<T>(superset: T[], subset: T[], message?: string): void` — Assert the expected array is either not a subset of
a given array or is not in the same order.

The values comparison is same the `assert.notDeepEqual` method.
- `isSealed<T>(object: T, message?: string): void` — Assert the object is sealed.
- `sealed<T>(object: T, message?: string): void` — Assert the object is sealed.
- `isNotSealed<T>(object: T, message?: string): void` — Assert the object is not sealed.
- `notSealed<T>(object: T, message?: string): void` — Assert the object is not sealed.
- `isFrozen<T>(object: T, message?: string): void` — Assert the object is frozen.
- `frozen<T>(object: T, message?: string): void` — Assert the object is frozen.
- `isNotFrozen<T>(object: T, message?: string): void` — Assert the object is not frozen.
- `notFrozen<T>(object: T, message?: string): void` — Assert the object is not frozen.
- `isEmpty<T>(target: T, message?: string): void` — Assert value to be empty
- `empty<T>(target: T, message?: string): void` — Assert value to be empty
- `isNotEmpty<T>(target: T, message?: string): void` — Assert value to not be empty
- `notEmpty<T>(target: T, message?: string): void` — Assert value to not be empty
- `containSubset(haystack: any, needle: any, message?: string): void` — Assert an array or an object to contain a subset of the expected
value. Useful for testing API responses.
- `doesNotContainSubset(haystack: any, needle: any, message?: string): void` — Assert an array or an object does not contain a subset of the
expected value. Useful for testing API responses.
- `containsSubset(haystack: any, needle: any, message?: string): void` — Assert an array or an object to contain a subset of the expected
value. Useful for testing API responses.
- `notContainsSubset(haystack: any, needle: any, message?: string): void` — Assert an array or an object to not contain a subset of the expected
value.
- `oneOf<T>(inList: T, list: T[], message?: string): void` — Assert the value is available in the provided list.
- `rejects(fn: () => unknown, message?: string): Promise<void>` — Assert the function to reject the promise or reject with a specific
error class/message

The method returns a promise
- `doesNotReject(fn: () => unknown, message?: string): Promise<void>` — Assert the function does not rejects the promise or the rejection
does not match the expectations.

The method returns a promise
- `isAccessible(element: string | Element | NodeList, options?: RunOptions): Promise<void>` — Asserts that a given DOM element or NodeList has no accessibility violations
according to axe-core.
```ts
const assert = new Assert()
assert.deepEqual({ id: 1 }, { id: 1 })
```
