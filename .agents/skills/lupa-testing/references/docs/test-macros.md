# Test Macros

Test macros are reusable functions that are natively bound to the lifecycle of the currently executing test. They are incredibly useful for creating and destroying temporary resources or state without having to clutter your tests with manual `cleanup` hooks every single time.

Let's look at an example of authenticating a user by setting a JWT in `localStorage` and automatically removing it when the test finishes.

You can write a macro for this using the `test.macro` helper:

- The `test.macro` function accepts a callback function.
- This callback function receives the **currently executed test** as its first argument `t`. Therefore, you can assign it an inline `t.cleanup()` function!
- The callback function can receive additional arguments which you must supply when calling the macro.
- Finally, you can return any value from the callback function to be used inside your test.

```ts
import { test } from '@pawel-up/lupa/testing'

export const loginAs = test.macro((t, userRole: string) => {
  const token = `fake-jwt-for-role-${userRole}`

  /**
   * 1. Set the authenticated state
   */
  localStorage.setItem('auth_token', token)

  /**
   * 2. Assign a hook on the active test to clear the storage
   *    when the test finishes (even if it fails!)
   */
  t.cleanup(() => localStorage.removeItem('auth_token'))

  /**
   * 3. Return the generated token just in case the test needs it
   */
  return token
})
```

Once you have defined a macro, you can simply import it and invoke it inside any test. Because it's a macro, the cleanup logic is handled completely invisibly.

```ts
import { test } from '@pawel-up/lupa/testing'
import { loginAs } from './macros.js'

test('admin dashboard renders correctly', async ({ assert }) => {
  // Sets the token AND registers the cleanup hook automatically!
  const token = loginAs('admin')

  // Render your component, assert, etc.
  assert.isNotNull(localStorage.getItem('auth_token'))
})
```

## Mocking Browser APIs

Macros are also excellent for temporarily mocking global browser APIs. Let's take an example where we want to intercept `window.fetch` to return a mocked response, and then automatically restore the original `fetch` implementation when the test finishes.

```ts
import { test } from '@pawel-up/lupa/testing'

export const mockFetch = test.macro((t, mockData: any) => {

  // Save original
  const originalFetch = window.fetch

  // Replace with mock
  window.fetch = async () => {
    return new Response(JSON.stringify(mockData))
  }

  // Assign the hook to restore the original fetch when the test finishes
  t.cleanup(() => {
    window.fetch = originalFetch
  })
})
```

### Usage

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'
import { mockFetch } from './macros.js'

test('user profile component fetches data', async ({ assert }) => {

  // Intercept all fetch calls and return this payload.
  // We never have to worry about restoring fetch afterwards!
  mockFetch({ name: 'Alice', age: 30 })

  const el = await fixture(html`<user-profile></user-profile>`)
  assert.include(el.textContent, 'Alice')
})
```