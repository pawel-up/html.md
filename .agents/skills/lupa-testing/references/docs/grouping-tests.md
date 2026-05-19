# Grouping Tests

You may group a collection of related tests using the `test.group` method.

The `test.group` method accepts the group title as the first parameter and a callback function as the second parameter. The callback function receives an instance of the `Group` class.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('Maths.add', (group) => {
  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

You may use the `group` object to bulk configure tests that are part of the surrounded group. In the following example, we define a timeout, after which a test will be marked as failed if not completed.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('register user', (group) => {
  group.each.timeout(1000 * 60)

  test('create a new user', async ({ assert }) => {
    // This test will timeout after 60 seconds
  })
})
```

## Defining lifecycle hooks

You may define lifecycle hooks for individual or all the tests using the `group` object.

In the following example, we define a lifecycle hook using the `each.setup` method to render a generic DOM fixture before every test, and remove it afterward.

```ts
import { test, fixture, html } from '@pawel-up/lupa/testing'

test.group('register user', (group) => {

  group.each.setup(async () => {
    const el = await fixture(html`<div id="wrapper"></div>`)

    // Optional: Return a cleanup function
    return () => {
      console.log('Test finished')
    }
  })

  test('can interact with wrapper', async ({ assert }) => {
    const el = document.getElementById('wrapper')
    assert.isNotNull(el)
  })
})
```

## Tapping into tests

You may use the `group.tap` method to access the underlying test object for each test defined within the group.

This method opens possibilities for bulk/conditionally configuring tests. For example, dynamically appending metadata to test titles.

```ts
import { test } from '@pawel-up/lupa/testing'

test.group('polls list', (group) => {

  group.tap((t) => {
    t.options.title = `[UI] ${t.options.title}`
  })

  test('shows list of public polls', () => {})
  test('shows list of participating polls', () => {})
  test('shows list of authored polls', () => {})
})
```

## Can I write nested groups?

Like Japa, **Lupa does not allow creating nested groups.** We share the same opinionated design choice when creating this test framework.

### Use folders over groups for organization
A common use case for nested groups is the organization of tests. The same level of organization can be achieved through nested files and folders. In fact, creating nested folders offers better filtering capabilities and makes it easy to visualize the depth of your tests by looking at the folder structure.

### Prefer duplication over wrong abstractions
Another use-case for nested groups is to use layers of lifecycle hooks and avoid duplication at all costs. While writing the code to get an object in just one place sounds good in theory, it can be problematic when you have long test files and want to track every usage of a variable to ensure that you are not accidentally mutating it between nested suites.