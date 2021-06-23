import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Parsing html elements', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    /** @type Element[] */
    let children = [];

    /** @param {Element} element */
    function add(element) {
      children.push(element);
      document.body.appendChild(element);
    }

    function clear() {
      children.forEach(elm => elm.parentNode.removeChild(elm))
      children = [];
    }

    it('parses the body of the document', () => {
      const header = document.createElement('h1');
      header.textContent = 'test header';
      add(header);
      const p = document.createElement('p');
      p.textContent = 'test paragraph';
      add(p);
      const result = factory.generate(document.body);
      clear();
      assert.include(result, '# test header\n\n', 'has the header');
      assert.include(result, 'test paragraph\n\n', 'has the paragraph');
    });
  });
});
