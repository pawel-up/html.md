import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';

describe('HtmlMd', () => {
  describe('Parsing comments', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    it('produces a simple blockquote', () => {
      const input = `<p>Test</p><!-- comment --><p>world</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test\n\n<!-- comment -->\n\nworld\n\n');
    });
  });
});
