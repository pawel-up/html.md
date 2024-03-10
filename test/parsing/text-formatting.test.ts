import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';

describe('HtmlMd', () => {
  describe('Text formatting elements', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    it('parses the <del> tag', () => {
      const input = `<del>Test line</del>`;
      const result = factory.generate(input);
      assert.equal(result, '~~Test line~~');
    });

    it('parses the <strong> tag', () => {
      const input = `<strong>Test line</strong>`;
      const result = factory.generate(input);
      assert.equal(result, '**Test line**');
    });

    it('parses the <b> tag', () => {
      const input = `<b>Test line</b>`;
      const result = factory.generate(input);
      assert.equal(result, '**Test line**');
    });

    it('parses the <i> tag', () => {
      const input = `<i>Test line</i>`;
      const result = factory.generate(input);
      assert.equal(result, '*Test line*');
    });

    it('parses the <em> tag', () => {
      const input = `<em>Test line</em>`;
      const result = factory.generate(input);
      assert.equal(result, '*Test line*');
    });

    [
      'b', 'bold', 'i', 'em', 'del'
    ].forEach((tag) => {
      it(`ignores empty ${tag} tag`, () => {
        const input = `<${tag}></${tag}>`;
        const result = factory.generate(input);
        assert.equal(result, '');
      });
    });
  });
});
