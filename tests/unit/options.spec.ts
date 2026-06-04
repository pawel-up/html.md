import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMdOptions / Custom Rules', () => {
  test('executes custom rule for custom HTML tag', ({ assert }) => {
    const factory = new HtmlMd({
      rules: {
        'custom-badge': (node) => `[BADGE: ${node.textContent}]`,
      },
    })
    const result = factory.generate('<p>Status: <custom-badge>Active</custom-badge></p>')
    assert.equal(result, 'Status: [BADGE: Active]\n\n')
  })

  test('overrides default tag processing with custom rule', ({ assert }) => {
    const factory = new HtmlMd({
      rules: {
        strong: (node) => `***${node.textContent}***`,
      },
    })
    const result = factory.generate('<p>This is <strong>important</strong></p>')
    assert.equal(result, 'This is ***important***\n\n')
  })

  test('skips custom rule if return value is falsy', ({ assert }) => {
    const factory = new HtmlMd({
      rules: {
        'skip-tag': () => '',
      },
    })
    const result = factory.generate('<p>Text with <skip-tag>should not appear</skip-tag></p>')
    assert.equal(result, 'Text with\n\n')
  })
})

test.group('HtmlMdOptions / Visual Styles', () => {
  test('converts style="font-weight: bold" to markdown bold', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate('<p>This is <span style="font-weight: bold">bold</span> text</p>')
    assert.equal(result, 'This is **bold** text\n\n')
  })

  test('converts style="font-weight: 700" to markdown bold', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate('<p>This is <span style="font-weight: 700">bold</span> text</p>')
    assert.equal(result, 'This is **bold** text\n\n')
  })

  test('converts style="font-style: italic" to markdown italic', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate('<p>This is <span style="font-style: italic">italic</span> text</p>')
    assert.equal(result, 'This is *italic* text\n\n')
  })

  test('converts style="text-decoration: line-through" to strikethrough', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate(
      '<p>This is <span style="text-decoration: line-through">strikethrough</span> text</p>'
    )
    assert.equal(result, 'This is ~~strikethrough~~ text\n\n')
  })

  test('combines multiple styles together', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate(
      '<p>This is <span style="font-weight: bold; font-style: italic">both</span> text</p>'
    )
    assert.equal(result, 'This is ***both*** text\n\n')
  })
})

test.group('HtmlMdOptions / Markdown Flavors', () => {
  test('CommonMark flavor strips strikethrough syntax', ({ assert }) => {
    const factory = new HtmlMd({ flavor: 'commonmark' })
    const result = factory.generate('<p>This is <del>strikethrough</del> text</p>')
    assert.equal(result, 'This is strikethrough text\n\n')
  })

  test('CommonMark flavor disables task lists', ({ assert }) => {
    const factory = new HtmlMd({ flavor: 'commonmark' })
    const result = factory.generate('<ul><li><input type="checkbox" checked> Item</li></ul>')
    assert.equal(result, '- Item\n\n')
  })

  test('Slack flavor formats bold, italic, strikethrough, and headers', ({ assert }) => {
    const factory = new HtmlMd({ flavor: 'slack' })
    const result = factory.generate(
      '<h1>Header</h1><p>This is <strong>bold</strong> and <em>italic</em> and <del>strikethrough</del></p>'
    )
    assert.equal(result, '*Header*\n\nThis is *bold* and _italic_ and ~strikethrough~\n\n')
  })

  test('Slack flavor uses bullet markers for lists', ({ assert }) => {
    const factory = new HtmlMd({ flavor: 'slack' })
    const result = factory.generate('<ul><li>Item 1</li><li>Item 2</li></ul>')
    assert.equal(result, '• Item 1\n• Item 2\n\n')
  })
})

test.group('HtmlMdOptions / HTML Fallback', () => {
  test('keepHtml: false strips unhandled tags but extracts content', ({ assert }) => {
    const factory = new HtmlMd({ keepHtml: false })
    const result = factory.generate('<p>Hello <custom-details>Click</custom-details> World</p>')
    assert.equal(result, 'Hello Click World\n\n')
  })

  test('keepHtml: true preserves unhandled tags', ({ assert }) => {
    const factory = new HtmlMd({ keepHtml: true })
    const result = factory.generate('<p>Hello <custom-details>Click</custom-details> World</p>')
    assert.equal(result, 'Hello <custom-details>Click</custom-details> World\n\n')
  })
})

test.group('HtmlMdOptions / Figure & Figcaption', () => {
  test('converts figure with image and figcaption', ({ assert }) => {
    const factory = new HtmlMd()
    const result = factory.generate(
      '<figure><img src="https://example.com/image.png" alt="Alt text" /><figcaption>Fig caption text</figcaption></figure>'
    )
    assert.equal(result, '![Alt text](<https://example.com/image.png>)\n*Fig caption text*\n\n')
  })
})
