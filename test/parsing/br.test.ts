import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';

describe('HtmlMd', () => {
  describe('Parsing new lines (<br>)', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    it('adds new line tag between tags', () => {
      const input = `<p>Test<br>Line</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test \nLine\n\n');
    });
  });
});
