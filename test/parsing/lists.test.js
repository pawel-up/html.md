import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';
import { wrapElement } from './utils.js';

describe('HtmlMd', () => {
  describe('Parsing lists', () => {
    describe('Unordered lists', () => {
      /** @type HtmlMd */
      let factory;
      before(() => { factory = new HtmlMd() });

      it('processes a simple list', () => {
        const input = `<ul><li>a</li><li>b</li><li>c</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- a\n- b\n- c\n\n');
      });

      it('processes code inside a list', () => {
        const input = '<ul><li>This is <code>a code</code></li></ul>';
        const result = factory.generate(input);
        assert.equal(result, '- This is `a code`\n\n');
      });

      it('processes a simple list as element', () => {
        const ul = document.createElement('ul');
        ['a', 'b', 'c'].forEach((content) => {
          const li = document.createElement('li');
          li.innerText = content;
          ul.appendChild(li);
        })
        const result = factory.generate(wrapElement(ul));
        assert.equal(result, '- a\n- b\n- c\n\n');
      });

      it('ignores empty list', () => {
        const input = `<ul></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '');
      });

      it('processes single list item', () => {
        const input = `<ul><li>a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- a\n\n');
      });

      it('processes inner list', () => {
        const input = `<ul><li>test<ul><li>a</li><li>b</li><li>c</li></ul</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- test\n    - a\n    - b\n    - c\n\n');
      });

      it('ignores non list item elements', () => {
        const input = `<ul><p>test</p><li>a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- a\n\n');
      });

      it('ignores empty list item elements', () => {
        const input = `<ul><li></li><li>a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- a\n\n');
      });

      it('processes unchecked checkbox', () => {
        const input = `<ul><li><input type="checkbox">a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- [ ] a\n\n');
      });

      it('processes checked checkbox', () => {
        const input = `<ul><li><input type="checkbox" checked>a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- [x] a\n\n');
      });

      it('ignores invalid input elements', () => {
        const input = `<ul><li><input type="number">a</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- a\n\n');
      });
    });

    describe('Ordered lists', () => {
      /** @type HtmlMd */
      let factory;
      before(() => { factory = new HtmlMd() });

      it('processes a simple list', () => {
        const input = `<ol><li>a</li><li>b</li><li>c</li></ol>`;
        const result = factory.generate(input);
        assert.equal(result, '1. a\n1. b\n1. c\n\n');
      });

      it('processes a simple list as element', () => {
        const ul = document.createElement('ol');
        ['a', 'b', 'c'].forEach((content) => {
          const li = document.createElement('li');
          li.innerText = content;
          ul.appendChild(li);
        })
        const result = factory.generate(wrapElement(ul));
        assert.equal(result, '1. a\n1. b\n1. c\n\n');
      });

      it('ignores empty list', () => {
        const input = `<ol></ol>`;
        const result = factory.generate(input);
        assert.equal(result, '');
      });

      it('processes single list item', () => {
        const input = `<ol><li>a</li></ol>`;
        const result = factory.generate(input);
        assert.equal(result, '1. a\n\n');
      });

      it('processes inner list', () => {
        const input = `<ol><li>test<ol><li>a</li><li>b</li><li>c</li></ol</li></ol>`;
        const result = factory.generate(input);
        assert.equal(result, '1. test\n    1. a\n    1. b\n    1. c\n\n');
      });

      it('ignores non list item elements', () => {
        const input = `<ol><p>test</p><li>a</li></ol>`;
        const result = factory.generate(input);
        assert.equal(result, '1. a\n\n');
      });
    });

    describe('Mixed lists', () => {
      /** @type HtmlMd */
      let factory;
      before(() => { factory = new HtmlMd() });

      it('produces different lists', () => {
        const input = `<ul><li>test<ol><li>a</li><li>b</li><li>c</li></ol</li></ul>`;
        const result = factory.generate(input);
        assert.equal(result, '- test\n    1. a\n    1. b\n    1. c\n\n');
      });
    });
  });
});
