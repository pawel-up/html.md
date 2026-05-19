import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing new lines (<br>)', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('adds new line tag between tags', ({ assert }) => {
    const input = `<p>Test<br>Line</p>`
    const result = factory.generate(input)
    assert.equal(result, 'Test \nLine\n\n')
  })
})
