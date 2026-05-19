# Lifecycle Hooks

Lifecycle hooks are functions you can run before or after a test or a group of tests. In Lupa, hooks are registered using the `setup` and `teardown` methods.

- The `setup` hooks are called before the action.
- The `teardown` hooks are called after the action.

```ts
import { test } from '@pawel-up/lupa/testing'

test('add two numbers', () => {
  console.log('executed in the test')
})
  .setup(() => {
    console.log('executed before the test')
  })
  .teardown(() => {
    console.log('executed after the test')
  })
```

If you run the above test, you will see the following output in the browser console:

```text
executed before the test
executed in the test
executed after the test
```

## Using groups

Defining hooks on every single test is not practical. Therefore, you can wrap your tests inside a group and use the `group.each.setup` and `group.each.teardown` methods.

In the following example, the hooks will be executed before and after **every test** inside the group.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('Maths.add', (group) => {

  group.each.setup(() => {
    console.log('executed before the test')
  })

  group.each.teardown(() => {
    console.log('executed after the test')
  })

  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

### Group lifecycle hooks

Similar to tests, groups can also have lifecycle hooks. The hooks defined directly on a group will run once **before all the tests** and once **after all the tests**.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('Maths.add', (group) => {

  group.setup(() => {
    console.log('executed before all the tests')
  })

  group.teardown(() => {
    console.log('executed after all the tests')
  })

  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

## Cleanup functions

Lupa allows you to return cleanup functions from your setup hooks. The sole purpose of a cleanup function is to clear the state created by the hook.

For example, if you create an HTTP mock inside the setup hook, you can use the cleanup function to remove it.

```ts
import { test } from '@pawel-up/lupa/testing'
import { mockFetch, restoreFetch } from 'my-mocking-lib'

test.group('Users.create', (group) => {

  group.each.setup(async () => {
    mockFetch()

    // 👇 Cleanup function
    return async () => restoreFetch()
  })

  test('create a new user', () => {})
})
```

### Wait, shouldn't I use the `teardown` hook?

Teardown hooks are meant to run standalone functions after a test. Whereas the cleanup functions are tightly coupled to the state created by the specific setup function.

In the following example, the first hook throws an exception, and as a result, the second hook is never executed.

Since there is no way for Lupa to know which teardown hook belongs to which setup hook, it will run all of them. The teardown will fail because we are trying to clear `localStorage` that was never set, or restore a spy that was never created.

```ts
test.group('Users.create', (group) => {

  group.each.setup(async () => {
    throw new Error('This hook failed due to some reason')
  })

  group.each.setup(async () => {
    localStorage.setItem('theme', 'dark')
  })

  group.each.teardown(async () => {
    localStorage.removeItem('theme')
  })

  test('create a new user', () => {})
})
```

Now, let's rewrite the same code using the cleanup function. In the following example, the first setup hook throws an exception. As a result, the second setup hook is never executed; therefore, its cleanup function will safely never be executed.

```ts
test.group('Users.create', (group) => {

  group.each.setup(async () => {
    throw new Error('This hook failed due to some reason')
  })

  group.each.setup(async () => {
    localStorage.setItem('theme', 'dark')

    // Will only execute if this setup hook succeeds
    return () => localStorage.removeItem('theme')
  })

  test('create a new user', () => {})
})
```

As a general principle, you should always use **cleanup functions** when destroying state created by a setup hook.

## Inline Cleanup Hooks

In addition to returning cleanup functions from `setup` blocks, Lupa allows you to register cleanup functions dynamically directly from inside your test callbacks using the test context.

This is especially useful for one-off resources.

```ts
import { test } from '@pawel-up/lupa/testing'

test('tests a generic listener', ({ cleanup }) => {

  const listener = () => console.log('scrolling')
  window.addEventListener('scroll', listener)

  // Register cleanup inline
  cleanup(() => {
    window.removeEventListener('scroll', listener)
  })

  // Your assertions...
})
```