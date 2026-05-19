import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing horizontal lines (<hr>)', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('adds new line tag between tags', ({ assert }) => {
    const input = `<p>Test</p><hr><p>Line</p>`
    const result = factory.generate(input)
    assert.equal(result, 'Test\n\n---\n\nLine\n\n')
  })

  test('adds new line inside a tag', ({ assert }) => {
    const input = `<p>Test<hr>Line</p>`
    const result = factory.generate(input)
    assert.equal(result, 'Test\n\n---\n\nLine')
  })
})
