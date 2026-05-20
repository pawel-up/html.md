import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

test.group('HtmlMd / Ignored tags', (group) => {
  let factory: HtmlMd
  group.setup(() => {
    factory = new HtmlMd()
  })

  test('ignores the <script> tag', ({ assert }) => {
    const input = `<script>var a = "";</script>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('ignores the <script> tag with source', ({ assert }) => {
    const input = `<script src="/test.js"></script>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('ignores the <link> tag', ({ assert }) => {
    const input = `<link rel="stylesheet" href="./test.css" />`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('ignores the <head> tag', ({ assert }) => {
    const input = `<head><meta charset="utf-8"></head>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })

  test('ignores the <style> tag', ({ assert }) => {
    const input = `<style>.test { display: block; }</style>`
    const result = factory.generate(input)
    assert.equal(result, '')
  })
})
