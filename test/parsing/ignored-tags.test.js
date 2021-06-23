import { assert } from '@open-wc/testing';
import HtmlMd from '../../index.js';

describe('HtmlMd', () => {
  describe('Ignored tags', () => {
    /** @type HtmlMd */
    let factory;
    before(() => { factory = new HtmlMd() });

    it('ignores the <script> tag', () => {
      const input = `<script>var a = "";</script>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });

    it('ignores the <script> tag with source', () => {
      const input = `<script src="/test.js"></script>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });

    it('ignores the <link> tag', () => {
      const input = `<link rel="stylesheet" href="./test.css" />`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });

    it('ignores the <head> tag', () => {
      const input = `<head><meta charset="utf-8"></head>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });

    it('ignores the <style> tag', () => {
      const input = `<style>.test { display: block; }</style>`;
      const result = factory.generate(input);
      assert.equal(result, '');
    });
  });
});
