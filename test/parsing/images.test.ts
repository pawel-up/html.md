import { assert } from '@open-wc/testing';
import HtmlMd from '../../src/index.js';
import { wrapElement } from './utils.js';

describe('HtmlMd', () => {
  describe('Parsing images', () => {
    let factory: HtmlMd;
    before(() => { factory = new HtmlMd() });

    const imgUrl = 'https://cats.com/';
    const alt = 'This is an image';
    const width = '100';
    const height = '200';
    const title = 'A title';

    it('produces a simple image', () => {
      const input = `<p><img src="${imgUrl}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![](<${imgUrl}>)\n\n`);
    });

    it('adds the alt attribute', () => {
      const input = `<p><img src="${imgUrl}" alt="${alt}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![${alt}](<${imgUrl}>)\n\n`);
    });

    it('adds width and height of the image', () => {
      const input = `<p><img src="${imgUrl}" width="${width}" height="${height}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![](<${imgUrl}> =${width}x${height})\n\n`);
    });

    it('ignores width and height when width is missing', () => {
      const input = `<p><img src="${imgUrl}" height="${height}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![](<${imgUrl}>)\n\n`);
    });

    it('ignores width and height when height is missing', () => {
      const input = `<p><img src="${imgUrl}" width="${width}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![](<${imgUrl}>)\n\n`);
    });

    it('adds the title of the image', () => {
      const input = `<p><img src="${imgUrl}" title="${title}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![](<${imgUrl}> "${title}")\n\n`);
    });

    it('creates a full image definition', () => {
      const input = `<p><img src="${imgUrl}" title="${title}" width="${width}" height="${height}" alt="${alt}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, `![${alt}](<${imgUrl}> =${width}x${height} "${title}")\n\n`);
    });

    it('ignores the image when no src attribute', () => {
      const input = `<p><img title="${title}" width="${width}" height="${height}" alt="${alt}"></p>`;
      const result = factory.generate(input);
      assert.equal(result, ``);
    });

    it('processes image as an element', () => {
      const img = document.createElement('img');
      img.src = '/test/parsing/dummy.png';
      img.alt = alt;
      img.width = Number(width);
      img.setAttribute('height', height);
      img.setAttribute('title', title);
      const result = factory.generate(wrapElement(img));
      assert.equal(result, `![This is an image](<http://localhost:8000/test/parsing/dummy.png> =100x200 "A title")`);
    });
  });
});
