import { test } from '@pawel-up/lupa/testing'
import HtmlMd from '../../src/index.js'

async function getTable(name: string) {
  const response = await fetch(`/tests/unit/tables/${name}.html`)
  return response.text()
}

test.group('HtmlMd / Parsing tables / Basic tables', (group) => {
  let code: string

  group.setup(async () => {
    const input = await getTable('simple')
    const factory = new HtmlMd()
    code = factory.generate(input)
  })

  test('creates a table markup', ({ assert }) => {
    assert.isNotEmpty(code)
  })

  test('has the headers part', ({ assert }) => {
    const parts = code.split('\n')
    assert.equal(parts[0], '| Col 1  | Col 2  | Col 3  |')
  })

  test('has the table separator part', ({ assert }) => {
    const parts = code.split('\n')
    assert.equal(parts[1], '| ------ | ------ | ------ |')
  })

  test('has the rows part', ({ assert }) => {
    const parts = code.split('\n')
    assert.equal(parts[2], '| Cell 1 | Cell 2 | Cell 3 |')
  })

  test('adds new lines after the table', ({ assert }) => {
    assert.isTrue(code.endsWith('\n\n'))
  })
})

test.group('HtmlMd / Parsing tables / Content alignment', (group) => {
  let code: string
  group.setup(async () => {
    const input = await getTable('alignment')
    const factory = new HtmlMd()
    code = factory.generate(input)
  })

  test('creates the table markup', ({ assert }) => {
    assert.isNotEmpty(code)
  })

  test('has the left alignment symbol', ({ assert }) => {
    const parts = code.split('\n')
    const separators = parts[1].split('|')
    assert.equal(separators[1], ' :------------------------------ ')
  })

  test('has the center alignment symbol', ({ assert }) => {
    const parts = code.split('\n')
    const separators = parts[1].split('|')
    assert.equal(separators[2], ' :----------------: ')
  })

  test('has the right alignment symbol', ({ assert }) => {
    const parts = code.split('\n')
    const separators = parts[1].split('|')
    assert.equal(separators[3], ' --------------------: ')
  })

  test('aligns headers', ({ assert }) => {
    const parts = code.split('\n')
    const headers = parts[0].split('|')
    assert.equal(headers[1], ' Column 1                        ', 'Column #1 is left aligned')
    assert.equal(headers[2], '      Column 2      ', 'Column #2 is center aligned')
    assert.equal(headers[3], '              Column 3 ', 'Column #3 is right aligned')
  })

  test('aligns rows', ({ assert }) => {
    const parts = code.split('\n')
    const row = parts[2].split('|')
    assert.equal(row[1], ' Cell 1                          ', 'Row #1 is left aligned')
    assert.equal(row[2], '       Cell 2       ', 'Row #2 is center aligned')
    assert.equal(row[3], '                Cell 3 ', 'Row #3 is right aligned')
  })

  test('has the same size for headers and rows', ({ assert }) => {
    const parts = code.split('\n')
    const headers = parts[0].split('|')
    const row1 = parts[2].split('|')
    const row2 = parts[3].split('|')
    assert.strictEqual(headers[1].length, row1[1].length, 'r1c1 equal to the header')
    assert.strictEqual(headers[1].length, row2[1].length, 'r2c1 equal to the header')
    assert.strictEqual(headers[2].length, row1[2].length, 'r1c2 equal to the header')
    assert.strictEqual(headers[2].length, row2[2].length, 'r2c2 equal to the header')
    assert.strictEqual(headers[3].length, row1[3].length, 'r1c3 equal to the header')
    assert.strictEqual(headers[3].length, row2[3].length, 'r2c3 equal to the header')
  })
})

test.group('HtmlMd / Parsing tables / Content formatting', (group) => {
  let code: string
  group.setup(async () => {
    const input = await getTable('formatting')
    const factory = new HtmlMd()
    code = factory.generate(input)
  })

  test('adds a link in a cell', ({ assert }) => {
    const parts = code.split('\n')
    const row1 = parts[2].split('|')
    assert.equal(row1[1], ' Click the [Link](<https://google.com/>) ')
  })

  test('adds an inline code', ({ assert }) => {
    const parts = code.split('\n')
    const row1 = parts[2].split('|')
    assert.equal(row1[2], ' This is a `code` inline. ')
  })

  test('adds text formatting', ({ assert }) => {
    const parts = code.split('\n')
    const row1 = parts[2].split('|')
    assert.equal(row1[3], ' And this is *Emphasis*, **bold**, and ~~deleted~~. ')
  })
})

test.group('HtmlMd / Parsing tables / Empty cells handing', (group) => {
  let code: string
  group.setup(async () => {
    const input = await getTable('empty-cells')
    const factory = new HtmlMd()
    code = factory.generate(input)
  })

  test('adds empty cells', ({ assert }) => {
    const parts = code.split('\n')
    const row1 = parts[2].split('|')
    assert.equal(row1[1], '       ', 'Cell 1 is empty')
    assert.equal(row1[2], ' Cell 2 ', 'Cell 2 has content')
    assert.equal(row1[3], '       ', 'Cell 3 is empty')
  })
})
