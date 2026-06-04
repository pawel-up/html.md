import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Code blocks / Indentation', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('preserves indentation in plain pre/code block', ({ assert }) => {
    const input = `<pre><code>export default class ProfileAvatarController {
  async update({ request, response }: HttpContext) {
    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    })
  }
}</code></pre>`
    const result = factory.generate(input)
    const expected = [
      '```',
      'export default class ProfileAvatarController {',
      '  async update({ request, response }: HttpContext) {',
      "    const avatar = request.file('avatar', {",
      "      size: '2mb',",
      "      extnames: ['jpg', 'png', 'jpeg']",
      '    })',
      '  }',
      '}',
      '```',
      '\n',
    ].join('\n')
    assert.equal(result, expected)
  })

  test('preserves indentation in syntax highlighted pre/code block', ({ assert }) => {
    const input = `<pre><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">ProfileAvatarController</span> {
  <span class="hljs-keyword">async</span> <span class="hljs-title class_">update</span>({ request, response }: <span class="hljs-title class_">HttpContext</span>) {
    <span class="hljs-keyword">const</span> avatar = request.<span class="hljs-title class_">file</span>(<span class="hljs-string">&#x27;avatar&#x27;</span>, {
      <span class="hljs-attr">size</span>: <span class="hljs-string">&#x27;2mb&#x27;</span>,
      <span class="hljs-attr">extnames</span>: [<span class="hljs-string">&#x27;jpg&#x27;</span>, <span class="hljs-string">&#x27;png&#x27;</span>, <span class="hljs-string">&#x27;jpeg&#x27;</span>]
    })
  }
}</code></pre>`
    const result = factory.generate(input)
    const expected = [
      '```ts',
      'export default class ProfileAvatarController {',
      '  async update({ request, response }: HttpContext) {',
      "    const avatar = request.file('avatar', {",
      "      size: '2mb',",
      "      extnames: ['jpg', 'png', 'jpeg']",
      '    })',
      '  }',
      '}',
      '```',
      '\n',
    ].join('\n')
    assert.equal(result, expected)
  })

  test('preserves indentation when nested inside multiple divs', ({ assert }) => {
    const input = `<div><div><div><pre><code>export default class ProfileAvatarController {
  async update({ request, response }: HttpContext) {
    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    })
  }
}</code></pre></div></div></div>`
    const result = factory.generate(input)
    const expected = [
      '```',
      'export default class ProfileAvatarController {',
      '  async update({ request, response }: HttpContext) {',
      "    const avatar = request.file('avatar', {",
      "      size: '2mb',",
      "      extnames: ['jpg', 'png', 'jpeg']",
      '    })',
      '  }',
      '}',
      '```',
      '\n',
    ].join('\n')
    assert.equal(result, expected)
  })
})
