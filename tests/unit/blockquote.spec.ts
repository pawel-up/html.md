import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'
import { wrapElement } from './utils.js'

test.group('HtmlMd / Parsing blockquotes', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('produces a simple blockquote', ({ assert }) => {
    const input = `<blockquote><p>Test world</p></blockquote>`
    const result = factory.generate(input)
    assert.equal(result, '> Test world\n\n')
  })

  test('produces a multiline blockquote', ({ assert }) => {
    const input = `<blockquote><p>Line 1</p><p>Line 2</p></blockquote>`
    const result = factory.generate(input)
    assert.equal(result, '> Line 1\n> Line 2\n\n')
  })

  test('adds other elements inside the quote', ({ assert }) => {
    const input = `<blockquote><p>Line 1</p><ul><li>Line 2</li></ul></blockquote>`
    const result = factory.generate(input)
    assert.equal(result, '> Line 1\n> - Line 2\n\n')
  })

  test('works with HTML element', ({ assert }) => {
    const quote = document.createElement('blockquote')
    const p = document.createElement('p')
    const list = document.createElement('ul')
    const listItem = document.createElement('li')
    listItem.textContent = 'Line 2'
    list.appendChild(listItem)
    p.textContent = 'Line 1'
    quote.appendChild(p)
    quote.appendChild(list)
    const result = factory.generate(wrapElement(quote))
    assert.equal(result, '> Line 1\n> - Line 2\n\n')
  })

  test('produces empty quote', ({ assert }) => {
    const input = `<blockquote></blockquote>`
    const result = factory.generate(input)
    assert.equal(result, '> \n\n')
  })
})
