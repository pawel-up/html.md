import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'
import { wrapElement } from './utils.js'

test.group('HtmlMd / Parsing images', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  const imgUrl = 'https://cats.com/'
  const alt = 'This is an image'
  const width = '100'
  const height = '200'
  const title = 'A title'

  test('produces a simple image', ({ assert }) => {
    const input = `<p><img src="${imgUrl}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![](<${imgUrl}>)\n\n`)
  })

  test('adds the alt attribute', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" alt="${alt}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![${alt}](<${imgUrl}>)\n\n`)
  })

  test('adds width and height of the image', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" width="${width}" height="${height}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![](<${imgUrl}> =${width}x${height})\n\n`)
  })

  test('ignores width and height when width is missing', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" height="${height}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![](<${imgUrl}>)\n\n`)
  })

  test('ignores width and height when height is missing', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" width="${width}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![](<${imgUrl}>)\n\n`)
  })

  test('adds the title of the image', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" title="${title}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![](<${imgUrl}> "${title}")\n\n`)
  })

  test('creates a full image definition', ({ assert }) => {
    const input = `<p><img src="${imgUrl}" title="${title}" width="${width}" height="${height}" alt="${alt}"></p>`
    const result = factory.generate(input)
    assert.equal(result, `![${alt}](<${imgUrl}> =${width}x${height} "${title}")\n\n`)
  })

  test('ignores the image when no src attribute', ({ assert }) => {
    const input = `<p><img title="${title}" width="${width}" height="${height}" alt="${alt}"></p>`
    const result = factory.generate(input)
    assert.equal(result, ``)
  })

  test('processes image as an element', ({ assert }) => {
    const img = document.createElement('img')
    img.src = '/tests/unit/dummy.png'
    img.alt = alt
    img.width = Number(width)
    img.setAttribute('height', height)
    img.setAttribute('title', title)
    const result = factory.generate(wrapElement(img))
    assert.match(result, /!\[This is an image\]\(<https?:\/\/[^>]+\/test\/parsing\/dummy\.png> =100x200 "A title"\)/)
  })
})
