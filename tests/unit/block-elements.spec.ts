import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing block elements', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('adds content from a section', ({ assert }) => {
    const input = `<section><p>Test</p><hr><p>Line</p></section>`
    const result = factory.generate(input)
    assert.equal(result, 'Test\n\n---\n\nLine\n\n')
  })

  test('adds content from a header', ({ assert }) => {
    const input = `<header><h1>Test</h1></header>`
    const result = factory.generate(input)
    assert.equal(result, '# Test\n\n')
  })
})
