import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Text formatting elements', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('parses the <del> tag', ({ assert }) => {
    const input = `<del>Test line</del>`
    const result = factory.generate(input)
    assert.equal(result, '~~Test line~~')
  })

  test('parses the <strong> tag', ({ assert }) => {
    const input = `<strong>Test line</strong>`
    const result = factory.generate(input)
    assert.equal(result, '**Test line**')
  })

  test('parses the <b> tag', ({ assert }) => {
    const input = `<b>Test line</b>`
    const result = factory.generate(input)
    assert.equal(result, '**Test line**')
  })

  test('parses the <i> tag', ({ assert }) => {
    const input = `<i>Test line</i>`
    const result = factory.generate(input)
    assert.equal(result, '*Test line*')
  })

  test('parses the <em> tag', ({ assert }) => {
    const input = `<em>Test line</em>`
    const result = factory.generate(input)
    assert.equal(result, '*Test line*')
  })
  ;['b', 'bold', 'i', 'em', 'del'].forEach((tag) => {
    test(`ignores empty ${tag} tag`, ({ assert }) => {
      const input = `<${tag}></${tag}>`
      const result = factory.generate(input)
      assert.equal(result, '')
    })
  })
})
