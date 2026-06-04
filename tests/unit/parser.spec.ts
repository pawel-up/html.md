import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parser edge cases', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('handles top-level closed tags without ignoring content', ({ assert }) => {
    const input = `</div><p>This is a content</p>`
    const result = factory.generate(input)
    assert.equal(result, 'This is a content\n\n')
  })
})
