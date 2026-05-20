# Skipping Tests

Sometimes, you might run into situations where you want to skip specific tests temporarily. Instead of commenting out the code and losing test tracking, you may use the `test.skip` method to prevent specific tests from running.

The `test.skip` method accepts a boolean as the first parameter and skips the test if the value is `true`. Optionally, you can define the reason for skipping the test as the second parameter.

```ts
import { test } from '@pawel-up/lupa/testing'

test('get payments list', async () => {
  // ...
}).skip(true, 'Payments service is down')
```

You can also skip tests conditionally based on external variables. For example, not running specific integration tests in the CI environment:

```ts
import { test } from '@pawel-up/lupa/testing'

const isInCI = !!process.env.CI

test('add two numbers', () => {
  // ...
}).skip(isInCI, 'Do not run this locally')
```

Finally, you may pass a function as the first parameter to lazily evaluate whether or not to skip the test. This is incredibly useful if the decision to skip requires an asynchronous check.

```ts
import { test } from '@pawel-up/lupa/testing'

test('get payments list', async () => {
  // ...
}).skip(async () => {
  const pingStatus = await pingPaymentsService()
  return pingStatus === 'down'
})
```

Skipped tests are safely ignored during execution and are marked as yellow/skipped in the standard console reporter output.

## Creating Todos

Lupa allows you to create placeholder tests without any implementation. You can use **todos** to outline the scenarios you want to test before writing the actual implementation.

You may create a test without passing the callback function, and it will automatically be marked as `todo`.

```ts
import { test } from '@pawel-up/lupa/testing'

test('fail if email is invalid')
test('fail if email is not unique')
test('register user and send welcome email')
test('allow email editing post signup')
```

Todo tests appear natively in the reporter output, reminding you that there is still work to be completed without failing your test suite or CI pipelines.