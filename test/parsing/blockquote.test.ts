import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';
import { wrapElement } from './utils.js';

describe('HtmlMd', () => {
  describe('Parsing blockquotes', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    it('produces a simple blockquote', () => {
      const input = `<blockquote><p>Test world</p></blockquote>`;
      const result = factory.generate(input);
      assert.equal(result, '> Test world\n\n');
    });

    it('produces a multiline blockquote', () => {
      const input = `<blockquote><p>Line 1</p><p>Line 2</p></blockquote>`;
      const result = factory.generate(input);
      assert.equal(result, '> Line 1\n> Line 2\n\n');
    });

    it('adds other elements inside the quote', () => {
      const input = `<blockquote><p>Line 1</p><ul><li>Line 2</li></ul></blockquote>`;
      const result = factory.generate(input);
      assert.equal(result, '> Line 1\n> - Line 2\n\n');
    });

    it('works with HTML element', () => {
      const quote = document.createElement('blockquote');
      const p = document.createElement('p');
      const list = document.createElement('ul');
      const listItem = document.createElement('li');
      listItem.textContent = 'Line 2';
      list.appendChild(listItem);
      p.textContent = 'Line 1';
      quote.appendChild(p);
      quote.appendChild(list);
      const result = factory.generate(wrapElement(quote));
      assert.equal(result, '> Line 1\n> - Line 2\n\n');
    });

    it('produces empty quote', () => {
      const input = `<blockquote></blockquote>`;
      const result = factory.generate(input);
      assert.equal(result, '> \n\n');
    });
  });
});
