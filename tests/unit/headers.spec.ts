import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'
import { wrapElement } from './utils.js'

test.group('HtmlMd / Parsing headers', () => {
  ;[1, 2, 3, 4, 5, 6].forEach((level) => {
    const prefix = ''.padEnd(level, '#')

    test(`parses simple string with the h${level} as string input`, ({ assert }) => {
      const factory = new HtmlMd()
      const txt = 'This is a content'
      const input = `<h${level}>${txt}</h${level}>`
      const result = factory.generate(input)
      assert.equal(result, `${prefix} ${txt}\n\n`)
    })

    test(`parses simple string with the h${level} as element`, ({ assert }) => {
      const factory = new HtmlMd()
      const txt = 'This is a content'
      const header = document.createElement(`h${level}`)
      header.innerText = txt
      const result = factory.generate(wrapElement(header))
      assert.equal(result, `${prefix} ${txt}\n\n`)
    })

    test(`parses string with inner elements for the h${level}`, ({ assert }) => {
      const factory = new HtmlMd()
      const txt = 'This is <code>a content</code> header'
      const input = `<h${level}>${txt}</h${level}>`
      const result = factory.generate(input)
      assert.equal(result, `${prefix} This is \`a content\` header\n\n`)
    })

    test(`parses h${level} as element with inner elements`, ({ assert }) => {
      const factory = new HtmlMd()
      const header = document.createElement(`h${level}`)
      header.append(new Text('This is '))
      const inner = document.createElement('code')
      inner.innerText = 'a content'
      header.append(inner)
      header.append(new Text(' header'))
      const result = factory.generate(wrapElement(header))
      assert.equal(result, `${prefix} This is \`a content\` header\n\n`)
    })

    test(`clears empty lines`, ({ assert }) => {
      const factory = new HtmlMd()
      const txt = 'This is a content'
      const input = `\n\n\n<h${level}>${txt}</h${level}>\n\n\n`
      const result = factory.generate(input)
      assert.equal(result, `${prefix} ${txt}\n\n`)
    })
  })

  test('ignores invalid headers', ({ assert }) => {
    const factory = new HtmlMd()
    const txt = 'This is a content header'
    const input = `<h7>${txt}</h7>`
    const result = factory.generate(input)
    assert.equal(result, ``)
  })

  test('produces empty headers', ({ assert }) => {
    const factory = new HtmlMd()
    const input = `<h1></h1>`
    const result = factory.generate(input)
    assert.equal(result, `# \n\n`)
  })
})
