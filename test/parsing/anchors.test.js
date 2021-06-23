import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Parsing anchors', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    const href = 'https://domain.com';

    it('creates a simple anchor tag', () => {
      const input = `<a href="${href}">Hello world</a>`;
      const result = factory.generate(input);
      assert.equal(result, '[Hello world](<https://domain.com/>)');
    });

    it('adds the title', () => {
      const input = `<a href="${href}" title="test title">Hello world</a>`;
      const result = factory.generate(input);
      assert.equal(result, '[Hello world](<https://domain.com/> "test title")');
    });

    it('produces a text for name anchor', () => {
      const input = `<a name="a-test">Hello world</a>`;
      const result = factory.generate(input);
      assert.equal(result, 'Hello world');
    });

    it('ignores empty anchors', () => {
      const input = `<a href="${href}"></a>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });

    it('ignores empty inner nodes', () => {
      const input = `<a href="${href}"><i></i></a>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });
  });
});
