# Assertions

Lupa doesn't force a specific assertion library onto you. You are free to use any browser-compatible assertion library you like (such as Chai, expect, or standard Node `assert` polyfills) simply by importing them directly into your test files.

However, Lupa does ship with an officially supported, first-party assertion plugin: `@pawel-up/lupa/assert`. It provides a clean, chainable API built on top of Chai, and seamlessly integrates with Lupa's test context.

## Installing the Assert Plugin

To use the built-in assert library, you need to register it as a test plugin inside your runner configuration.

Update your `lupa.config.ts` file to include `@pawel-up/lupa/assert` in the `testPlugins` array:

```ts
import { defineConfig } from '@pawel-up/lupa/runner'
import { spec } from '@pawel-up/lupa/reporters'

export default defineConfig({
  suites: [
    {
      name: 'unit',
      files: ['tests/**/*.test.ts'],
    },
  ],
  testPlugins: ['@pawel-up/lupa/assert'], // Register the assert plugin
  reporters: {
    activated: ['progress'],
    list: [spec()],
  },
})
```

## TypeScript Configuration

Because plugins extend the base `TestContext` dynamically at runtime, TypeScript doesn't automatically know that the `assert` property exists on the context object.

To tell the TypeScript compiler about the `assert` property, you must use **Module Augmentation**. You can place this declaration directly at the bottom of your `lupa.config.ts` file, or inside a dedicated `global.d.ts` file in your project.

```ts
import type { Assert } from '@pawel-up/lupa/assert'

// ... your defineConfig() logic ...

declare module '@pawel-up/lupa/testing' {
  interface TestContext {
    assert: Assert
  }
}
```

Once you've added this augmentation, your editor will provide full autocomplete and type safety for the `assert` object inside all of your tests.

## Using Assertions

With the plugin registered and TypeScript configured, the `assert` object is injected into the context of every test.

```ts
import { test } from '@pawel-up/lupa/testing'

test('validates user input', ({ assert }) => {
  const username = 'pawel'

  // You now have full autocomplete on the assert object!
  assert.equal(username, 'pawel')
  assert.isString(username)
  assert.lengthOf(username, 5)
})
```

For a comprehensive list of all available assertion methods, you can rely on your IDE's autocomplete, as the `Assert` type provides extensive JSDoc descriptions and examples for every available assertion.

## Core Assertions API

The Assert plugin of Lupa is built on top of the [Chai.js assert](https://www.chaijs.com/api/assert/) package and ships with the following methods:

### `plan`
Plan assertions to expect by the end of this test This method is used to declare the number of assertions you expect to run in a test. If the number of assertions that actually run does not match the planned number, the test will fail.

### `assert`
Assert an expression to be truthy. Optionally define the error message

```ts
assert(isTrue(foo))
assert(foo === 'bar')
assert(age > 18, 'Not allowed to enter the club')
```

### `fail`
Throws a failure. The actual and expected values are not compared. They are available as properties on the `AssertionError`.

```ts
assert.fail() // fail
assert.fail('Error message for the failure')
```

### `isOk`
Assert the value is truthy

```ts
assert.isOk({ hello: 'world' }) // passes
assert.isOk(null) // fails
```

### `ok`
Assert the value is truthy Alias for `isOk`

```ts
assert.ok({ hello: 'world' }) // passes
assert.ok(null) // fails
```

### `isNotOk`
Assert the value is falsy

```ts
assert.isNotOk({ hello: 'world' }) // fails
assert.isNotOk(null) // passes
```

### `notOk`
Assert the value is falsy Alias for `isNotOk`

```ts
assert.notOk({ hello: 'world' }) // fails
assert.notOk(null) // passes
```

### `equal`
Assert two values are equal but not strictly. The comparison is same as "foo == bar".

```ts
assert.equal(3, 3) // passes
assert.equal(3, '3') // passes
assert.equal(Symbol.for('foo'), Symbol.for('foo')) // passes
```

### `notEqual`
Assert two values are not equal. The comparison is same as "foo != bar".

```ts
assert.notEqual(3, 2) // passes
assert.notEqual(3, '2') // passes
assert.notEqual(Symbol.for('foo'), Symbol.for('bar')) // passes
```

### `strictEqual`
Assert two values are strictly equal. The comparison is same as "foo === bar".

```ts
assert.equal(3, 3) // passes
assert.equal(3, '3') // fails
assert.equal(Symbol.for('foo'), Symbol.for('foo')) // passes
```

### `notStrictEqual`
Assert two values are not strictly equal. The comparison is same as "foo !== bar".

```ts
assert.notStrictEqual(3, 2) // passes
assert.notStrictEqual(3, '2') // fails
assert.notStrictEqual(Symbol.for('foo'), Symbol.for('bar')) // passes
```

### `deepEqual`
Assert two values are deeply equal. The order of items in an array should be same for the assertion to pass.

```ts
assert.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // passes
assert.deepEqual({ b: 2, a: 1 }, { a: 1, b: 2 }) // passes
assert.deepEqual([1, 2], [1, 2]) // passes
assert.deepEqual([1, 2], [2, 1]) // fails
assert.deepEqual(/a/, /a/) // passes
assert.deepEqual(
new Date('2020 01 22'),
new Date('2020 01 22')
) // passes
```

### `notDeepEqual`
Assert two values are not deeply equal.

```ts
assert.notDeepEqual({ a: 1, b: 2 }, { a: 1, b: '2' }) // passes
assert.notDeepEqual([1, 2], [2, 1]) // passes
assert.notDeepEqual(
new Date('2020 01 22'),
new Date('2020 01 23')
) // passes
```

### `isAbove`
Assert if the actual Date is above the expected Date.

```ts
assert.isAbove(new Date('2020 12 20'), new Date('2020 12 18')) // passes
```

### `isAtLeast`
Assert if the actual value is above or same as the expected value.

```ts
assert.isAtLeast(new Date('2020 12 20'), new Date('2020 12 20')) // passes
```

### `isBelow`
Assert if the actual value is below the expected value.

```ts
assert.isBelow(new Date('2020 12 20'), new Date('2020 12 24')) // passes
```

### `isAtMost`
Assert if the actual value is below or same as the expected value.

```ts
assert.isAtMost(new Date('2020 12 20'), new Date('2020 12 20')) // passes
```

### `isTrue`
Assert the value is a boolean (true).

```ts
assert.isTrue(true) // passes
assert.isTrue(false) // fails
assert.isTrue(1) // fails
assert.isTrue('foo') // fails
```

### `isNotTrue`
Assert the value is anything, but not true

```ts
assert.isNotTrue(true) // fails
assert.isNotTrue(false) // passes
assert.isNotTrue(1) // passes
assert.isNotTrue('foo') // passes
```

### `isFalse`
Assert the value is boolean (false)

```ts
assert.isFalse(false) // passes
assert.isFalse(true) // fails
assert.isFalse(0) // fails
assert.isFalse(null) // fails
```

### `isNotFalse`
Assert the value is anything but not false

```ts
assert.isNotFalse(false) // fails
assert.isNotFalse(true) // passes
assert.isNotFalse(null) // passes
assert.isNotFalse(undefined) // passes
```

### `isNull`
Assert the value is null

```ts
assert.isNull(null) // passes
assert.isNull(true) // fails
assert.isNull(false) // fails
assert.isNull('foo') // fails
```

### `isNotNull`
Assert the value is anything but not null

```ts
assert.isNotNull(null) // fails
assert.isNotNull(true) // passes
assert.isNotNull(false) // passes
assert.isNotNull('foo') // passes
```

### `isNaN`
Assert the value is NaN

```ts
assert.isNaN(NaN) // passes
assert.isNaN(Number('hello')) // passes
assert.isNaN(true) // fails
assert.isNaN(false) // fails
assert.isNaN(null) // fails
```

### `isNotNaN`
Assert the value is anything, but not NaN

```ts
assert.isNotNaN(NaN) // fails
assert.isNotNaN(Number('hello')) // fails
assert.isNotNaN(true) // passes
assert.isNotNaN(false) // passes
assert.isNotNaN(null) // passes
```

### `exists`
Asserts the value is not "null" or "undefined"

```ts
assert.exists(false) // passes
assert.exists(0) // passes
assert.exists('') // passes
assert.exists(null) // fails
assert.exists(undefined) // fails
```

### `notExists`
Asserts the value is "null" or "undefined"

```ts
assert.notExists(null) // passes
assert.notExists(undefined) // passes
assert.notExists('') // fails
assert.notExists(false) // fails
assert.notExists(0) // fails
```

### `isUndefined`
Asserts the value is explicitly "undefined"

```ts
assert.isUndefined(undefined) // passes
assert.isUndefined(false) // fails
assert.isUndefined(0) // fails
assert.isUndefined('') // fails
assert.isUndefined(null) // fails
```

### `isDefined`
Asserts the value is anything, but not "undefined"

```ts
assert.isDefined(undefined) // fails
assert.isDefined(0) // passes
assert.isDefined(false) // passes
assert.isDefined('') // passes
assert.isDefined(null) // passes
```

### `isFunction`
Assert the value is a function

```ts
assert.isFunction(function foo () {}) // passes
assert.isFunction(() => {}) // passes
assert.isFunction(class Foo {}) // passes
```

### `isNotFunction`
Assert the value is not a function

```ts
assert.isNotFunction({}) // passes
assert.isNotFunction(null) // passes
assert.isNotFunction(() => {}) // fails
```

### `isObject`
Assert the value to a valid object literal

```ts
assert.isObject({}) // passes
assert.isObject(new SomeClass()) // passes
assert.isObject(null) // fails
assert.isObject([]) // fails
```

### `isNotObject`
Assert the value to not be an object literal

```ts
assert.isNotObject(null) // passes
assert.isNotObject([]) // passes
assert.isNotObject({}) // fails
assert.isNotObject(new SomeClass()) // fails
```

### `isArray`
Assert the value to be a valid array

```ts
assert.isArray([]) // passes
assert.isArray({}) // fails
```

### `isNotArray`
Assert the value to not be an array

```ts
assert.isNotArray([]) // fails
assert.isNotArray({}) // passes
```

### `isString`
Assert the value to be a string literal

```ts
assert.isString('') // passes
assert.isString(new String(true)) // passes
assert.isString(1) // fails
```

### `isNotString`
Assert the value to not be a string literal

```ts
assert.isNotString(1) // passes
assert.isNotString('') // fails
assert.isNotString(new String(true)) // fails
```

### `isNumber`
Assert the value to be a valid number

```ts
assert.isNumber(1) // passes
assert.isNumber(new Number('1')) // passes
assert.isNumber('1') // fails
```

### `isNotNumber`
Assert the value to not be a valid number

```ts
assert.isNotNumber('1') // passes
assert.isNotNumber(1) // fails
```

### `isFinite`
Assert the value to be a number and no NaN or Infinity

```ts
assert.isFinite(1) // passes
assert.isFinite(Infinity) // fails
assert.isFinite(NaN) // fails
```

### `isBoolean`
Assert the value is a boolean

```ts
assert.isBoolean(true) // passes
assert.isBoolean(false) // passes
assert.isBoolean(1) // fails
```

### `isNotBoolean`
Assert the value is anything, but not a boolean

```ts
assert.isNotBoolean(1) // passes
assert.isNotBoolean(false) // fails
assert.isNotBoolean(true) // fails
```

### `typeOf`
Assert the typeof value matches the expected type

```ts
assert.typeOf({ foo: 'bar' }, 'object') // passes
assert.typeOf(['admin'], 'array') // passes
assert.typeOf(new Date(), 'date') // passes
```

### `notTypeOf`
Assert the typeof value is not same as the expected type

```ts
assert.notTypeOf({ foo: 'bar' }, 'array') // passes
assert.notTypeOf(['admin'], 'string') // passes
```

### `instanceOf`
Assert value to be an instance of the expected class

```ts
assert.instanceOf(new User(), User) // passes
assert.instanceOf(new User(), Function) // fails
class User extends BaseUser {}
assert.instanceOf(new User(), BaseUser) // passes
```

### `notInstanceOf`
Assert value to NOT be an instance of the expected class

```ts
assert.notInstanceOf(new User(), Function) // passes
assert.notInstanceOf(new User(), User) // fails
```

### `include`
Asserts that haystack includes needle.

### `notInclude`
Asserts that haystack does not include needle.

### `deepInclude`
Asserts that haystack includes needle. Deep equality is used.

### `notDeepInclude`
Asserts that haystack does not include needle. Deep equality is used.

### `match`
Assert the value to match the given regular expression

```ts
assert.match('foobar', /^foo/) // passes
```

### `notMatch`
Assert the value to NOT match the given regular expression

```ts
assert.notMatch('foobar', /^foo/) // fails
```

### `property`
Assert an object to contain a property

```ts
assert.property(
{ id: 1, username: 'virk' },
'id'
) // passes
```

### `notProperty`
Assert an object to NOT contain a property

```ts
assert.notProperty(
{ id: 1, username: 'virk' },
'email'
) // passes
```

### `propertyVal`
Assert an object property to match the expected value Use `deepPropertyVal` for deep comparing the value

```ts
assert.propertyVal(
{ id: 1, username: 'virk' },
'id',
1
) // passes
assert.propertyVal(
{ user: { id: 1 } },
'user',
{ id: 1 }
) // fails
@template T - Type of object.
@template V - Type of value.
```

### `notPropertyVal`
Assert an object property to NOT match the expected value

```ts
assert.notPropertyVal(
{ id: 1, username: 'virk' },
'id',
22
) // passes
@template T - Type of object.
@template V - Type of value.
```

### `deepPropertyVal`
Assert an object property to deeply match the expected value

```ts
assert.deepPropertyVal(
{ user: { id: 1 } },
'user',
{ id: 1 }
) // passes
@template T - Type of object.
@template V - Type of value.
```

### `notDeepPropertyVal`
Assert an object property to NOT deeply match the expected value

```ts
assert.notDeepPropertyVal(
{ user: { id: 1 } },
'user',
{ email: 'foo@bar.com' }
) // passes
@template T - Type of object.
@template V - Type of value.
```

### `lengthOf`
Assert length of an array, map or set to match the expected value

```ts
assert.lengthOf([1, 2, 3], 3)
assert.lengthOf(new Map([[1],[2]]), 2)
assert.lengthOf('hello world', 11)
@template T - Type of object.
```

### `properties`
Assert the object has all of the expected properties

```ts
assert.properties(
{ username: 'virk', age: 22, id: 1 },
['id', 'age']
) // passes
@template T - Type of object.
```

### `anyProperties`
Assert the object has any of the expected properties

```ts
assert.anyProperties(
{ username: 'virk', age: 22, id: 1 },
['id', 'name', 'dob']
) // passes
@template T - Type of object.
```

### `onlyProperties`
Assert the object has only the expected properties. Extra properties will fail the assertion

```ts
assert.onlyProperties(
{ username: 'virk', age: 22, id: 1 },
['id', 'name', 'age']
) // passes
assert.onlyProperties(
{ username: 'virk', age: 22, id: 1 },
['id', 'name']
) // fails
@template T - Type of object.
```

### `notAnyProperties`
Assert the object to not have any of the mentioned properties

```ts
assert.notAnyProperties(
{ id: 1, name: 'foo' },
['email', 'age']
) // passes
assert.notAnyProperties(
{ id: 1, name: 'foo' },
['email', 'id']
) // fails
@template T - Type of object.
```

### `notAllProperties`
Assert the object to not have all of the mentioned properties

```ts
assert.notAllProperties(
{ id: 1, name: 'foo' },
['id', 'name', 'email']
) // passes
@template T - Type of object.
```

### `throws`
Expect the function to throw an exception.

```ts
function foo() { throw new Error('blow up') }
assert.throws(foo) // passes
```

### `doesNotThrow`
Expect the function to not throw an exception.

```ts
assert.doesNotThrow(() => {}) // passes
```

### `closeTo`
Assert the value is closer to the expected value + delta

```ts
assert.closeTo(10, 6, 8) // passes
assert.closeTo(10, 6, 4) // passes
assert.closeTo(10, 20, 10) // passes
```

### `approximately`
Assert the value is equal to the expected value +/- delta range

```ts
assert.approximately(10, 6, 8) // passes
assert.approximately(10, 6, 4) // passes
assert.approximately(10, 20, 10) // passes
```

### `sameMembers`
Assert two arrays to have same members. The values comparison is same the `assert.equal` method. Use `sameDeepMembers` for deep comparison

```ts
assert.sameMembers(
[1, 2, 3],
[1, 2, 3]
) // passes
assert.sameMembers(
[1, { id: 1 }, 3],

<!-- truncated -->
