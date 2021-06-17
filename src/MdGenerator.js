/** @typedef {import('./types').ProcessNodeOptions} ProcessNodeOptions */

export class MdGenerator {
  constructor() {
    /**
     * @type {string[]}
     */
    this.parts = [];
  }

  /**
   * Generates a markdown content from an Element.
   * @param {Element} root 
   */
  generate(root) {
    this.parts = [];
    const { childNodes } = root;
    Array.from(childNodes).forEach((node) => this.processNode(node));
    console.log(this.parts);
  }

  /**
   * Processes a single node.
   * @param {ChildNode} node 
   * @param {ProcessNodeOptions=} opts
   */
  processNode(node, opts) {
    switch (node.nodeType) {
      case Node.TEXT_NODE: this.processTextNode(/** @type Text */ (node), opts); break;
      case Node.ELEMENT_NODE: this.processElementNode(/** @type Element */ (node)); break;
      default: console.log(node);
    }
  }

  /**
   * Process a text node and adds the content to the stack.
   * @param {Text} node 
   * @param {ProcessNodeOptions=} opts
   */
  processTextNode(node, opts={}) {
    const { textContent } = node;
    const value = textContent.trim();
    if (!value) {
      return;
    }
    if (opts.addLineForTextContent) {
      this.parts.push('\n\n');
    }
    this.parts.push(value);
  }

  /**
   * Processes an node that is an element.
   * @param {Element} node 
   */
  processElementNode(node) {
    const { localName, childNodes } = node;
    if (['script', 'link', 'head', 'body', 'html', 'meta', 'title', 'style'].includes(localName)) {
      // we don't like them. And their children.
      return;
    }
    const typedHtmlElement = /** @type HTMLElement */ (node);
    if (['div', 'p', 'section', 'header'].includes(localName)) {
      // a new line for content
      const processOpts = /** @type ProcessNodeOptions */ ({ addLineForTextContent: true });
      Array.from(childNodes).forEach((node) => this.processNode(node, processOpts));
      return;
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(localName)) {
      this.processHeader(typedHtmlElement);
      return;
    }
    if (['code', 'pre'].includes(localName)) {
      this.processCodeBlock(typedHtmlElement);
      return;
    }
    console.log('LOCAL NAME', localName);
  }

  /**
   * Processes H1-h6 elements.
   * @param {HTMLElement} node 
   */
  processHeader(node) {
    const cnt = Number(node.localName.replace('h', ''));
    if (Number.isNaN(cnt)) {
      return;
    }
    const keyword = new Array(cnt).fill('#').join('');
    this.parts.push(`\n\n${keyword} ${node.textContent}`);
  }

  /**
   * Processes a <code> block.
   * @param {HTMLElement} node 
   */
  processCodeBlock(node) {
    /** @type HTMLElement */
    let block;
    if (node.localName === 'pre' && node.children[0] && node.children[0].localName === 'code') {
      block = /** @type HTMLElement */ (node.children[0]);
    } else if (node.localName === 'code') {
      block = node;
    }
    if (!block) {
      return;
    }
    const marker = '```';
    this.parts.push(`\n\n${marker}${block.textContent}${marker}`);
  }
}
