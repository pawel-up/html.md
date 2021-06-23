/* eslint-disable class-methods-use-this */
import htmlParser from './HtmlParser.js';
import { MdGenerator } from './MdGenerator.js';

export class HtmlMd {
  /**
   * Generates a markdown code from the input.
   * The input can be a HTML string (will be parsed using browser's built-in functions)
   * or an Element containing the content to be parsed. In the later case, the content 
   * of the Element is used to generate the markdown, excluding the most outer element.
   * 
   * @param {string|Element} input The input to use to generate the markdown for.
   */
  generate(input) {
    if (!input) {
      throw new Error('Expected an input to parse.');
    }
    /** @type Element */
    let root;
    if (typeof input === 'string') {
      root = htmlParser(input);
    } else if (input.nodeType === Node.ELEMENT_NODE) {
      root = /** @type Element */ (input.cloneNode(true));
    } else {
      throw new Error('Invalid input to parse.');
    }
    const generator = new MdGenerator();
    return generator.generate(root);
  }
}
