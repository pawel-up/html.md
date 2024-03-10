import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';

describe('HtmlMd', () => {
  describe('Parsing horizontal lines (<hr>)', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    it('adds new line tag between tags', () => {
      const input = `<p>Test</p><hr><p>Line</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test\n\n---\n\nLine\n\n');
    });

    it('adds new line inside a tag', () => {
      const input = `<p>Test<hr>Line</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test\n\n---\n\nLine');
    });
  });
});
