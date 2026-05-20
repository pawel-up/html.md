# Network Mocking

Lupa provides powerful, native network interception out of the box. Because Lupa executes your tests within a real browser via **Playwright**, there is no "magic" involved—no monkey-patching of `fetch` or overriding `XMLHttpRequest`. The interception happens at the browser's network layer. This means any request made by your component, a third-party script, or an iframe can be seamlessly intercepted.

## Basic Mocking

You can mock network traffic by accessing the `network` fixture within your test context. The `network.mock()` method takes a URL pattern and a response payload, and instructs the browser to fulfill any matching requests with that payload.

Here is a basic example of mocking a successful `200 OK` response:

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'

test('loads and displays user data', async ({ assert, network }) => {
  // 1. Setup the network mock
  await network.mock('/api/users/1', {
    status: 200,
    body: JSON.stringify({ id: 1, name: 'Alice', role: 'admin' }),
    headers: { 'Content-Type': 'application/json' }
  })

  // 2. Mount the component that fires the request
  await fixture(html`<user-profile user-id="1"></user-profile>`)

  // 3. Assert on the DOM
  assert.dom.hasText(document.querySelector('.user-name'), 'Alice')
})
```

### Mocking Network Errors

Because Lupa controls the underlying browser network layer, you can simulate hard network failures by passing the `error` property. This property accepts standard Playwright error strings (e.g., `'internetdisconnected'`, `'connectionrefused'`, `'timedout'`, `'aborted'`). This is invaluable for testing your application's offline or error-boundary states:

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'

test('displays offline fallback when network drops', async ({ assert, network }) => {
  // Mock a hard network failure
  await network.mock('/api/users/1', {
    error: 'internetdisconnected'
  })

  await fixture(html`<user-profile user-id="1"></user-profile>`)

  assert.dom.isVisible(document.querySelector('.offline-banner'))
})
```

## Asserting on Network Traffic

Lupa provides a suite of assertions to verify that your mocks were hit exactly as expected. Because network requests originate in the browser but your tests run in Node.js, Lupa has to ferry this data across an asynchronous boundary.

To handle this, Lupa's network assertions automatically **poll** the browser until the condition is met (or until a timeout occurs). The available assertions are:
- `await mock.assert.calledOnce()`
- `await mock.assert.calledTimes(n)`
- `await mock.assert.notCalled()`

### The Golden Rule: Action ➔ Await Assert ➔ Read Snapshot

Once you verify the request happened, you often want to inspect *what* was sent (the body, headers, or query parameters). You can do this using synchronous getters like `mock.lastRequest()`.

However, because these getters return an immediate, synchronous snapshot of the current state, **you must always `await` an assertion before reading the request**. If you try to read it immediately after mounting a component, the request likely hasn't finished crossing the browser-to-Node RPC boundary yet, resulting in missing or stale data.

#### ❌ The Wrong Way (Race Condition)

```ts
test('submits form', async ({ assert, network }) => {
  const mock = await network.mock('/api/submit', { status: 200 })

  // 1. Action
  await fixture(html`<my-form></my-form>`)

  // 2. Read (DANGER! The request might not have settled yet)
  const req = mock.lastRequest() // Likely returns undefined!

  // 3. Assert
  assert.equal(req?.body, '{"name":"Alice"}')
})
```

#### ✅ The Right Way

```ts
test('submits form', async ({ assert, network }) => {
  const mock = await network.mock('/api/submit', { status: 200 })

  // 1. Action
  await fixture(html`<my-form></my-form>`)

  // 2. Await Assert (Guarantees the network layer has settled)
  await mock.assert.calledOnce()

  // 3. Read Snapshot (Now 100% safe to read)
  const req = mock.lastRequest()

  assert.equal(req?.method, 'POST')
  assert.deepEqual(JSON.parse(req?.body as string), { name: 'Alice' })
})
```

When you read the captured request using `lastRequest()`, `firstRequest()`, or `getRequests()`, you receive a `CapturedRequest` object. It's important to understand its shape:
- `body`: Returned as a raw `string` or `ArrayBuffer` (Lupa does *not* auto-deserialize JSON payloads, so you must call `JSON.parse(req.body)` yourself if it's a JSON request).
- `query`: A parsed JavaScript object (`Record<string, string | string[]>`) representing the URL query parameters. Multiple parameters with the same name (e.g., `?filter=a&filter=b`) are grouped into an array.
- `params`: A parsed JavaScript object (`Record<string, string>`) containing any path variables extracted via `URLPattern` (e.g., `:id`).
- `headers`: A parsed JavaScript object (`Record<string, string>`) of all request headers.

## Request Matching

Lupa gives you flexible ways to define which network requests your mock should intercept. You can pass a plain string (with glob support or URLPattern path variables), or an explicit configuration object.

> [!NOTE]
> **Mock Precedence:** If multiple active mocks match the same request (e.g., `/api/*/users` vs `/api/v1/users`), the **most recently registered mock** takes precedence and will handle the request.

### Substring & Glob Matching
By default, passing a string will match any request URL that contains that substring. It also supports standard Playwright glob wildcards (like `*` for single path segments or `**` for deep globbing). Note that wildcard captures cannot be extracted as variables later; they simply allow the request to match.

> [!NOTE]
> **URI Matching Caveat**: Lupa uses the standard `URLPattern` API under the hood. In `URLPattern`, a wildcard prefix like `/*/foo` expects *at least one character* before `/foo`. For convenience and to mimic traditional glob behavior (e.g. ignoring the domain), Lupa will automatically strip a leading `*` from paths that start with `*/`. Thus, `match: '*/api/users/:id'` behaves identically to `match: '/api/users/:id'`, effectively intercepting requests to that path regardless of the domain or origin. Furthermore, `**` or `*` alone are automatically translated to `/*` to match any path.

```ts
// Matches /api/v1/users, /api/v2/users, etc.
await network.mock('/api/*/users', { status: 200 })
```

### Strict Method Matching
If you need to mock a specific HTTP method (e.g., distinguishing a `GET` from a `POST` to the exact same endpoint), you can pass a configuration object instead of a string:

```ts
await network.mock(
  { uri: '/api/submit', method: 'POST' },
  { status: 201 }
)
```

### URLPattern & Path Variables
For dynamic endpoints, Lupa uses standard `URLPattern` matching under the hood. This means you can use path variables (like `:id`) directly in your mock string! The matched variables will be automatically extracted and made available on the `req.params` object:

```ts
// Matches /api/users/123, /api/users/999
await network.mock('/api/users/:id', async (req) => {
  return {
    status: 200,
    body: JSON.stringify({ userId: req.params?.id })
  }
})
```

## Teardown & Lifecycle

### Automatic Test Isolation
One of the core design principles of Lupa is **strict test isolation**. You do **not** need to manually clean up your network mocks at the end of a test.

When a test finishes (whether it passes or fails), Lupa's test runner automatically intercepts the teardown phase, clears all active mocks, and restores the browser's network layer to its default state for the next test.

### Manual Restoration
If you need to test a complex scenario—such as an API endpoint suddenly becoming unavailable mid-session—you can manually disable a specific mock at any time:

```ts
test('handles intermittent API failure', async ({ network }) => {
  const mock = await network.mock('/api/data', { status: 200 })

  // Triggers successful fetch
  await fixture(html`<data-loader></data-loader>`)

  // Restore the original network behavior (removes the mock)
  await mock.restore()

  // Triggers actual network call (or a different mock)
  await document.querySelector('data-loader').refetch()
})
```

### The `times` Parameter
Sometimes you only want to mock an endpoint for the first few requests, allowing subsequent requests to fall through to the real network (or be caught by a different mock). You can achieve this using the `times` configuration option:

```ts
// Only mock the FIRST request to /api/data.
// The second request will bypass this mock.
await network.mock('/api/data', { status: 200 }, { times: 1 })
```

### Explicit Bypass
If your mock handler needs to dynamically decide whether to mock a request or let it fall through to the next available mock (or the real network), you can explicitly return `'bypass'` from your handler function. This is especially useful for selectively mocking requests based on headers, body content, or query parameters:

```ts
await network.mock('/api/users', async (req) => {
  // Only mock requests that ask for the admin user
  if (req.query?.role === 'admin') {
    return { status: 200, body: '{"name":"Admin"}' }
  }

  // Let everything else fall through to the real network
  return 'bypass'
})
```