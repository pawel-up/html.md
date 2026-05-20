import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing anchors', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  const href = 'https://domain.com'

  test('creates a simple anchor tag', ({ assert }) => {
    const input = `<a href="${href}">Hello world</a>`
    const result = factory.generate(input)
    assert.equal(result, '[Hello world](<https://domain.com/>)')
  })

  test('adds the title', ({ assert }) => {
    const input = `<a href="${href}" title="test title">Hello world</a>`
    const result = factory.generate(input)
    assert.equal(result, '[Hello world](<https://domain.com/> "test title")')
  })

  test('produces a text for name anchor', ({ assert }) => {
    const input = `<a name="a-test">Hello world</a>`
    const result = factory.generate(input)
    assert.equal(result, 'Hello world')
  })

  test('ignores empty anchors', ({ assert }) => {
    const input = `<a href="${href}"></a>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('ignores empty inner nodes', ({ assert }) => {
    const input = `<a href="${href}"><i></i></a>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })
})
