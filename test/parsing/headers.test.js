import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';
import { wrapElement } from './utils.js';

describe('HtmlMd', () => {
  describe('Parsing headers', () => {
    [
      1, 2, 3, 4, 5, 6,
    ].forEach((level) => {
      const prefix = ''.padEnd(level, '#');

      it(`parses simple string with the h${level} as string input`, () => {
        const factory = new HtmlMd();
        const txt = 'This is a content';
        const input = `<h${level}>${txt}</h${level}>`;
        const result = factory.generate(input);
        assert.equal(result, `${prefix} ${txt}\n\n`);
      });

      it(`parses simple string with the h${level} as element`, () => {
        const factory = new HtmlMd();
        const txt = 'This is a content';
        const header = document.createElement(`h${level}`);
        header.innerText = txt;
        const result = factory.generate(wrapElement(header));
        assert.equal(result, `${prefix} ${txt}\n\n`);
      });

      it(`parses string with inner elements for the h${level}`, () => {
        const factory = new HtmlMd();
        const txt = 'This is <code>a content</code> header';
        const input = `<h${level}>${txt}</h${level}>`;
        const result = factory.generate(input);
        assert.equal(result, `${prefix} This is \`a content\` header\n\n`);
      });

      it(`parses h${level} as element with inner elements`, () => {
        const factory = new HtmlMd();
        const header = document.createElement(`h${level}`);
        header.append(new Text('This is '));
        const inner = document.createElement('code');
        inner.innerText = 'a content';
        header.append(inner);
        header.append(new Text(' header'));
        const result = factory.generate(wrapElement(header));
        assert.equal(result, `${prefix} This is \`a content\` header\n\n`);
      });

      it(`clears empty lines`, () => {
        const factory = new HtmlMd();
        const txt = 'This is a content';
        const input = `\n\n\n<h${level}>${txt}</h${level}>\n\n\n`;
        const result = factory.generate(input);
        assert.equal(result, `${prefix} ${txt}\n\n`);
      });
    });

    it('ignores invalid headers', () => {
      const factory = new HtmlMd();
      const txt = 'This is a content header';
      const input = `<h7>${txt}</h7>`;
      const result = factory.generate(input);
      assert.equal(result, ``);
    });

    it('produces empty headers', () => {
      const factory = new HtmlMd();
      const input = `<h1></h1>`;
      const result = factory.generate(input);
      assert.equal(result, `# \n\n`);
    });
  });
});
