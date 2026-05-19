# Exceptions

We all write tests that deal with exceptions and promise rejections. For example:
- Assert that a call to an invalid API endpoint rejects the promise with an HTTP 404 error.
- Assert that rendering a component without a required property throws an exception.

Usually, you might wrap these function calls inside a `try/catch` statement and write assertions for the error object.

```ts
import { test } from '@pawel-up/lupa/testing'

test('validate property', ({ assert }) => {
  try {
    validateProperty(undefined)
  } catch (error) {
    assert.equal(error.message, 'Property is required')
  }
})
```

There are two main problems with the `try/catch` statement in testing:

- You will get a "false positive" passing test if the code inside the `try` block **never** raises an exception!
- The `try/catch` statement adds visual noise to your tests, especially when writing nested statements.

To solve this, Lupa's bundled assertion library has dedicated methods to assert a function call throws an exception safely.

## Using dedicated assertion methods

### `assert.throws`

The `assert.throws` method accepts a function as the first parameter and the error message (or regex) you expect as the second parameter.

This method only works with synchronous function calls.

```ts
import { test } from '@pawel-up/lupa/testing'

test('validate property', ({ assert }) => {
  assert.throws(
    () => validateProperty(undefined),
    'Property is required'
  )
})
```

### `assert.rejects`

Similar to `assert.throws`, the `assert.rejects` method also accepts a function and the error message for assertion. However, in this case, the callback function **must** return a Promise.

```ts
import { test } from '@pawel-up/lupa/testing'

test('do not fetch invalid user', async ({ assert }) => {

  await assert.rejects(
    async () => fetchUser(9999),
    /User not found/
  )

})
```

## High order assertion

An elegant alternative API that is completely independent of the assertion library is to expect a test to throw an exception directly on the test instance using the `test.throws` method.

Let's re-write the above two examples with a high-order assertion:

```ts
import { test } from '@pawel-up/lupa/testing'

test('validate property', () => {
  // If this doesn't throw, the test fails
  validateProperty(undefined)
})
.throws('Property is required')
```

```ts
import { test } from '@pawel-up/lupa/testing'

test('do not fetch invalid user', async () => {

  /**
   * This call will throw an exception, and
   * there is no need to handle it within the test callback
   */
  await fetchUser(9999)

})
.throws(/User not found/)
```