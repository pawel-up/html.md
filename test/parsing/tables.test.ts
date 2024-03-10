import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';

describe('HtmlMd', () => {
  describe('Parsing tables', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    async function getTable(name: string) {
      const response = await fetch(`/test/parsing/tables/${name}.html`);
      return response.text();
    }

    describe('Basic tables', () => {
      let code: string;
      before(async () => {
        const input = await getTable('simple');
        code = factory.generate(input);
      });

      it('creates a table markup', () => {
        assert.isNotEmpty(code);
      });

      it('has the headers part', () => {
        const parts = code.split('\n');
        assert.equal(parts[0], '| Col 1  | Col 2  | Col 3  |');
      });

      it('has the table separator part', () => {
        const parts = code.split('\n');
        assert.equal(parts[1], '| ------ | ------ | ------ |');
      });

      it('has the rows part', () => {
        const parts = code.split('\n');
        assert.equal(parts[2], '| Cell 1 | Cell 2 | Cell 3 |');
      });

      it('adds new lines after the table', () => {
        assert.isTrue(code.endsWith('\n\n'));
      });
    });

    describe('Content alignment', () => {
      let code: string;
      before(async () => {
        const input = await getTable('alignment');
        code = factory.generate(input);
      });

      it('creates the table markup', () => {
        assert.isNotEmpty(code);
      });

      it('has the left alignment symbol', () => {
        const parts = code.split('\n');
        const separators = parts[1].split('|');
        assert.equal(separators[1], ' :------------------------------ ');
      });

      it('has the center alignment symbol', () => {
        const parts = code.split('\n');
        const separators = parts[1].split('|');
        assert.equal(separators[2], ' :----------------: ');
      });

      it('has the right alignment symbol', () => {
        const parts = code.split('\n');
        const separators = parts[1].split('|');
        assert.equal(separators[3], ' --------------------: ');
      });

      it('aligns headers', () => {
        const parts = code.split('\n');
        const headers = parts[0].split('|');
        assert.equal(headers[1], ' Column 1                        ', 'Column #1 is left aligned');
        assert.equal(headers[2], '      Column 2      ', 'Column #2 is center aligned');
        assert.equal(headers[3], '              Column 3 ', 'Column #3 is right aligned');
      });

      it('aligns rows', () => {
        const parts = code.split('\n');
        const row = parts[2].split('|');
        assert.equal(row[1], ' Cell 1                          ', 'Row #1 is left aligned');
        assert.equal(row[2], '       Cell 2       ', 'Row #2 is center aligned');
        assert.equal(row[3], '                Cell 3 ', 'Row #3 is right aligned');
      });

      it('has the same size for headers and rows', () => {
        const parts = code.split('\n');
        const headers = parts[0].split('|');
        const row1 = parts[2].split('|');
        const row2 = parts[3].split('|');
        assert.strictEqual(headers[1].length, row1[1].length, 'r1c1 equal to the header');
        assert.strictEqual(headers[1].length, row2[1].length, 'r2c1 equal to the header');
        assert.strictEqual(headers[2].length, row1[2].length, 'r1c2 equal to the header');
        assert.strictEqual(headers[2].length, row2[2].length, 'r2c2 equal to the header');
        assert.strictEqual(headers[3].length, row1[3].length, 'r1c3 equal to the header');
        assert.strictEqual(headers[3].length, row2[3].length, 'r2c3 equal to the header');
      });
    });

    describe('Content formatting', () => {
      let code: string;
      before(async () => {
        const input = await getTable('formatting');
        code = factory.generate(input);
      });

      it('adds a link in a cell', () => {
        const parts = code.split('\n');
        const row1 = parts[2].split('|');
        assert.equal(row1[1], ' Click the [Link](<https://google.com/>) ');
      });

      it('adds an inline code', () => {
        const parts = code.split('\n');
        const row1 = parts[2].split('|');
        assert.equal(row1[2], ' This is a `code` inline. ');
      });

      it('adds text formatting', () => {
        const parts = code.split('\n');
        const row1 = parts[2].split('|');
        assert.equal(row1[3], ' And this is *Emphasis*, **bold**, and ~~deleted~~. ');
      });
    });

    describe('Empty cells handing', () => {
      let code: string;
      before(async () => {
        const input = await getTable('empty-cells');
        code = factory.generate(input);
      });

      it('adds empty cells', () => {
        const parts = code.split('\n');
        const row1 = parts[2].split('|');
        assert.equal(row1[1], '       ', 'Cell 1 is empty');
        assert.equal(row1[2], ' Cell 2 ', 'Cell 2 has content');
        assert.equal(row1[3], '       ', 'Cell 3 is empty');
      });
    });
  });
});
