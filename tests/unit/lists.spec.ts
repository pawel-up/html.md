import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'
import { wrapElement } from './utils.js'

test.group('HtmlMd / Parsing lists / Unordered lists', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('processes a simple list', ({ assert }) => {
    const input = `<ul><li>a</li><li>b</li><li>c</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- a\n- b\n- c\n\n')
  })

  test('processes code inside a list', ({ assert }) => {
    const input = '<ul><li>This is <code>a code</code></li></ul>'
    const result = factory.generate(input)
    assert.equal(result, '- This is `a code`\n\n')
  })

  test('processes a simple list as element', ({ assert }) => {
    const ul = document.createElement('ul')
    ;['a', 'b', 'c'].forEach((content) => {
      const li = document.createElement('li')
      li.innerText = content
      ul.appendChild(li)
    })
    const result = factory.generate(wrapElement(ul))
    assert.equal(result, '- a\n- b\n- c\n\n')
  })

  test('ignores empty list', ({ assert }) => {
    const input = `<ul></ul>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('processes single list item', ({ assert }) => {
    const input = `<ul><li>a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- a\n\n')
  })

  test('processes inner list', ({ assert }) => {
    const input = `<ul><li>test<ul><li>a</li><li>b</li><li>c</li></ul</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- test\n    - a\n    - b\n    - c\n\n')
  })

  test('ignores non list item elements', ({ assert }) => {
    const input = `<ul><p>test</p><li>a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- a\n\n')
  })

  test('ignores empty list item elements', ({ assert }) => {
    const input = `<ul><li></li><li>a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- a\n\n')
  })

  test('processes unchecked checkbox', ({ assert }) => {
    const input = `<ul><li><input type="checkbox">a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- [ ] a\n\n')
  })

  test('processes checked checkbox', ({ assert }) => {
    const input = `<ul><li><input type="checkbox" checked>a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- [x] a\n\n')
  })

  test('ignores invalid input elements', ({ assert }) => {
    const input = `<ul><li><input type="number">a</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- a\n\n')
  })
})

test.group('HtmlMd / Parsing lists / Ordered lists', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('processes a simple list', ({ assert }) => {
    const input = `<ol><li>a</li><li>b</li><li>c</li></ol>`
    const result = factory.generate(input)
    assert.equal(result, '1. a\n1. b\n1. c\n\n')
  })

  test('processes a simple list as element', ({ assert }) => {
    const ul = document.createElement('ol')
    ;['a', 'b', 'c'].forEach((content) => {
      const li = document.createElement('li')
      li.innerText = content
      ul.appendChild(li)
    })
    const result = factory.generate(wrapElement(ul))
    assert.equal(result, '1. a\n1. b\n1. c\n\n')
  })

  test('ignores empty list', ({ assert }) => {
    const input = `<ol></ol>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('processes single list item', ({ assert }) => {
    const input = `<ol><li>a</li></ol>`
    const result = factory.generate(input)
    assert.equal(result, '1. a\n\n')
  })

  test('processes inner list', ({ assert }) => {
    const input = `<ol><li>test<ol><li>a</li><li>b</li><li>c</li></ol</li></ol>`
    const result = factory.generate(input)
    assert.equal(result, '1. test\n    1. a\n    1. b\n    1. c\n\n')
  })

  test('ignores non list item elements', ({ assert }) => {
    const input = `<ol><p>test</p><li>a</li></ol>`
    const result = factory.generate(input)
    assert.equal(result, '1. a\n\n')
  })
})

test.group('HtmlMd / Parsing lists / Mixed lists', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('produces different lists', ({ assert }) => {
    const input = `<ul><li>test<ol><li>a</li><li>b</li><li>c</li></ol</li></ul>`
    const result = factory.generate(input)
    assert.equal(result, '- test\n    1. a\n    1. b\n    1. c\n\n')
  })
})
