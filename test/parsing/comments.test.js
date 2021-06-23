import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Parsing comments', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    it('produces a simple blockquote', () => {
      const input = `<p>Test</p><!-- comment --><p>world</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test\n\n<!-- comment -->\n\nworld\n\n');
    });
  });
});
