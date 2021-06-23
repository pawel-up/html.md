import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Parsing block elements', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    it('adds content from a section', () => {
      const input = `<section><p>Test</p><hr><p>Line</p></section>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test\n\n---\n\nLine\n\n');
    });

    it('adds content from a header', () => {
      const input = `<header><h1>Test</h1></header>`;
      const result = factory.generate(input);
      assert.equal(result, '# Test\n\n');
    });
  });
});
