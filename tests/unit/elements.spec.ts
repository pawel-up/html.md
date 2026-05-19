import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Parsing html elements', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  let children: Element[] = []

  function add(element: Element): void {
    children.push(element)
    document.body.appendChild(element)
  }

  function clear(): void {
    children.forEach((elm) => elm.parentNode!.removeChild(elm))
    children = []
  }

  test('parses the body of the document', ({ assert }) => {
    const header = document.createElement('h1')
    header.textContent = 'test header'
    add(header)
    const p = document.createElement('p')
    p.textContent = 'test paragraph'
    add(p)
    const result = factory.generate(document.body)
    clear()
    assert.include(result, '# test header\n\n', 'has the header')
    assert.include(result, 'test paragraph\n\n', 'has the paragraph')
  })
})
