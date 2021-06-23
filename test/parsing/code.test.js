import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Code blocks', () => {
    describe('Inline code', () => {
      /** @type HtmlMd */
      let factory;
      before(() => { factory = new HtmlMd() });

      it('adds the inline code markers', () => {
        const input = `<p>Test <code>Line</code></p>`;
        const result = factory.generate(input);
        assert.equal(result, 'Test  `Line`\n\n');
      });
    });

    describe('Code blocks', () => {
      /** @type HtmlMd */
      let factory;
      before(() => { factory = new HtmlMd() });

      it('processes single code clock', () => {
        const input = `<pre><code>This is a code</code></pre>`;
        const result = factory.generate(input);
        assert.equal(result, '```\nThis is a code\n```\n\n');
      });

      it('processes inner code', () => {
        const input = `<pre><code>This is &lt;a href="https://domain.com"&gta code&lt;/a&gt</code></pre>`;
        const result = factory.generate(input);
        assert.equal(result, '```\nThis is <a href="https://domain.com">a code</a>\n```\n\n');
      });

      it('ignores invalid <pre>', () => {
        const input = `<pre><p>This is &lt;a href="https://domain.com"&gta code&lt;/a&gt</p></pre>`;
        const result = factory.generate(input);
        assert.equal(result, '');
      });
    });
  });
});
