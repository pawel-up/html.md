import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Parsing new lines (<br>)', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    it('adds new line tag between tags', () => {
      const input = `<p>Test<br>Line</p>`;
      const result = factory.generate(input);
      assert.equal(result, 'Test \n Line\n\n');
    });
  });
});
