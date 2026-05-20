import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Code blocks / Inline code', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('adds the inline code markers', ({ assert }) => {
    const input = `<p>Test <code>Line</code></p>`
    const result = factory.generate(input)
    assert.equal(result, 'Test  `Line`\n\n')
  })
})

test.group('HtmlMd / Code blocks / Code blocks', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('processes single code clock', ({ assert }) => {
    const input = `<pre><code>This is a code</code></pre>`
    const result = factory.generate(input)
    assert.equal(result, '```\nThis is a code\n```\n\n')
  })

  test('processes inner code', ({ assert }) => {
    const input = `<pre><code>This is &lt;a href="https://domain.com"&gta code&lt;/a&gt</code></pre>`
    const result = factory.generate(input)
    assert.equal(result, '```\nThis is <a href="https://domain.com">a code</a>\n```\n\n')
  })

  test('ignores invalid <pre>', ({ assert }) => {
    const input = `<pre><p>This is &lt;a href="https://domain.com"&gta code&lt;/a&gt</p></pre>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })
})
