import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing comments', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('produces a simple blockquote', ({ assert }) => {
    const input = `<p>Test</p><!-- comment --><p>world</p>`
    const result = factory.generate(input)
    assert.equal(result, 'Test\n\n<!-- comment -->\n\nworld\n\n')
  })
})
