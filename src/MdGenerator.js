/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { clean } from './Utils.js';

export class MdGenerator {
  /**
   * Generates a markdown content from an Element.
   * @param {Element} root 
   * @returns {string} The generated markdown.
   */
  generate(root) {
    clean(root);
    const { childNodes } = root;
    const txt = Array.from(childNodes).map(node => this.processNode(node));
    return txt.join('');
  }

  /**
   * Processes a single node.
   * @param {ChildNode} node
   * @returns {string} The generated code for the node.
   */
  processNode(node) {
    switch (node.nodeType) {
      case Node.TEXT_NODE: return this.processTextNode(/** @type Text */ (node));
      case Node.COMMENT_NODE: return this.processCommentNode(/** @type Comment */ (node));
      case Node.ELEMENT_NODE: return this.processElementNode(/** @type Element */ (node));
      default: // console.log(node);
    }
    return '';
  }

  /**
   * Process a text node and returns the markup.
   * @param {Text} node
   * @returns {string}
   */
  processTextNode(node) {
    let value = node.nodeValue;
    value = value.replace(/ +/g, ' ');
    value = value.replace(/([*_~|`])/g, '\\$1');
    value = value.replace(/^(\s*)>/g, '\\$1>');
    value = value.replace(/^#/gm, '\\#');
    value = value.replace(/^(\s*)([-=]{3,})(\s*)$/, '$1\\$2$3');
    value = value.replace(/^( {0,3}\d+)\./gm, '$1\\.');
    value = value.replace(/^( {0,3})([+-])/gm, '$1\\$2');
    value = value.replace(/]([\s]*)\(/g, '\\]$1\\(');
    value = value.replace(/^ {0,3}\[([\S \t]*?)]:/gm, '\\[$1]:');
    return value;
    // const { textContent } = node;
    // const value = textContent.trim();
    // if (!value) {
    //   return '';
    // }
    // this.parts.push(value);
    // return {
    //   addedPart: true,
    // };
  }

  /**
   * Process a comment node and returns the markup.
   * @param {Comment} node
   * @returns {string}
   */
  processCommentNode(node) {
    return `<!--${node.data}-->\n\n`;
  }

  /**
   * Processes an node that is an element.
   * @param {Element} node 
   * @returns {string}
   */
  processElementNode(node) {
    const { localName } = node;
    if (['script', 'link', 'head', 'body', 'html', 'meta', 'title', 'style'].includes(localName)) {
      // we don't like them. And their children.
      return '';
    }
    const typedHtmlElement = /** @type HTMLElement */ (node);
    if (['div', 'p'].includes(localName)) {
      const data = this.processParagraph(typedHtmlElement);
      if (data) {
        return `${data}\n\n`;
      }
      return data;
    }
    if (['div', 'section', 'header'].includes(localName)) {
      return this.processBlockElement(typedHtmlElement);
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(localName)) {
      const data = this.processHeader(typedHtmlElement);
      if (data) {
        return `${data}\n\n`;
      }
      return data;
    }
    if (['ul', 'ol'].includes(localName)) {
      let data = this.processList(typedHtmlElement);
      if (data) {
        data += '\n\n';
      }
      return data;
    }
    if (localName === 'code') {
      return this.processInlineCode(typedHtmlElement);
    }
    if (['pre'].includes(localName)) {
      let data = this.processCodeBlock(typedHtmlElement);
      if (data) {
        data += '\n\n';
      }
      return data;
    }
    if (localName === 'a') {
      return this.processAnchor(/** @type HTMLAnchorElement */ (node));
    }
    if (localName === 'hr') {
      const data = this.processHorizontalLine();
      return `${data}\n\n`;
    }
    if (['b', 'strong'].includes(localName)) {
      return this.processBold(typedHtmlElement);
    }
    if (['em', 'i'].includes(localName)) {
      return this.processEmphasis(typedHtmlElement);
    }
    if (localName === 'blockquote') {
      let data = this.processBlockquote(typedHtmlElement);
      if (data) {
        data += '\n\n';
      }
      return data;
    }
    if (localName === 'del') {
      return this.processStrikeThrough(typedHtmlElement);
    }
    if (localName === 'img') {
      return this.processImage(/** @type HTMLImageElement */ (node));
    }
    if (localName === 'br') {
      return this.processNewLine();
    }
    if (localName === 'table') {
      let data = this.processTable(typedHtmlElement);
      if (data) {
        data += '\n\n';
      }
      return data;
    }
    // console.log('Unhandled element', localName, node);
    return '';
  }

  /**
   * Processes H1-h6 elements.
   * Note, this does not add new lines after the header content.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processHeader(node) {
    const cnt = Number(node.localName.replace('h', ''));
    if (Number.isNaN(cnt)) {
      return '';
    }
    const keyword = new Array(cnt).fill('#').join('');
    let result = `${keyword} `;
    if (node.hasChildNodes()) {
      const { childNodes } = node;
      const content = Array.from(childNodes).map(child => this.processNode(child));
      result += content.join('');
    }
    return result;
  }

  /**
   * Processes the paragraph element and returns the markup.
   * Note, this does not add new lines after the paragraph content.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processParagraph(node) {
    let result = '';
    if (node.hasChildNodes()) {
      const { childNodes } = node;
      const content = Array.from(childNodes).map(child => this.processNode(child)).filter(code => !!code);
      result += content.join(' ');
      result = result.trim();
    }
    return result;
  }

  /**
   * Processes a block elements without any sematic meaning (from markdown pov) like headers, sections, etc.
   * Note, this does not add new lines after the paragraph content.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processBlockElement(node) {
    let result = '';
    if (node.hasChildNodes()) {
      const { childNodes } = node;
      const content = Array.from(childNodes).map(child => this.processNode(child));
      result += content.join('');
      result = result.trim();
    }
    return result;
  }

  /**
   * Processes a <code> block.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processCodeBlock(node) {
    let isBlock = false;
    /** @type HTMLElement */
    let block;
    if (node.localName === 'pre' && node.children[0] && node.children[0].localName === 'code') {
      // eslint-disable-next-line prefer-destructuring
      block = /** @type HTMLElement */ (node.children[0]);
      isBlock = true;
    } else if (node.localName === 'code') {
      block = node;
    }
    if (!block) {
      return '';
    }
    const marker = isBlock ? '```' : '`';
    const blockNl = isBlock ? '\n' : '';
    let code = block.textContent;
    if (isBlock && !code.endsWith('\n')) {
      code += blockNl;
    }
    return `${marker}${blockNl}${code}${marker}`;
  }

  /**
   * Processes the `<a>` element.
   * @param {HTMLAnchorElement} node 
   * @returns {string}
   */
  processAnchor(node) {
    const { href, childNodes } = node;
    if (!href && node.hasChildNodes()) {
      // named anchors (<a name="">) count as regular stuff (?)
      return this.processParagraph(node);
    }
    if (!node.hasChildNodes()) {
      return '';
    }
    const parts = Array.from(childNodes).map(child => this.processNode(child));
    const txt = parts.join('');
    if (!txt) {
      return txt;
    }
    const title = node.hasAttribute('title') ? ` "${node.getAttribute('title')}"` : '';
    return `[${txt}](<${href}>${title})`;
  }

  /**
   * Processes the `<ul>` and `ol` elements.
   * @param {HTMLElement} node
   * @returns {string}
   */
  processList(node) {
    let result = '';
    if (!node.hasChildNodes()) {
      return result;
    }
    const { childNodes, localName } = node;
    const isOrdered = localName === 'ol';
    const markerType = isOrdered ? '1. ' : '- ';
    const parts = Array.from(childNodes).map((child) => {
      const name = /** @type Element */ (child).localName;
      if (!name || name !== 'li') {
        // we ignore everything that is not a list item.
        // Sub-lists are children of a list item.
        return '';
      }
      let data = this.processListItem(/** @type HTMLElement */ (child));
      if (data) {
        data = `${markerType}${data}`;
      }
      return data;
    });
    result = parts.join('');
    return result.trim();
  }

  /**
   * Specializes in processing list items.
   * @param {HTMLElement} node
   * @returns {string}
   */
  processListItem(node) {
    let result = '';
    if (!node.hasChildNodes()) {
      return result;
    }
    const { childNodes } = node;
    Array.from(childNodes).forEach((child) => {
      const elm = /** @type HTMLInputElement */ (child);
      if (elm.localName === 'input' && elm.type === 'checkbox') {
        result += `[${elm.checked ? 'x' : ' '}] `;
      } else if (['ul', 'ol'].includes(elm.localName)) {
        const data = this.processNode(child);
        if (data) {
          result += `\n${data}`
        }
      } else {
        result += this.processNode(child);
      }
    });
    if (!/\n$/.test(result)) {
      result += '\n';
    } else {
      // indent
      result = result.split('\n').join('\n    ').replace(/^ {4}$/gm, '').replace(/\n\n+/g, '\n\n');
    }
    return result;
  }
  
  /**
   * Specializes in processing `<code>` that is not inside the `<pre>`.
   * @param {HTMLElement} node
   * @returns {string}
   */
  processInlineCode(node) {
    return `\`${node.innerHTML}\``;
  }

  /**
   * Processes the `<em>` element.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processEmphasis(node) {
    if (!node.hasChildNodes()) {
      return '';
    }
    const { childNodes } = node;
    const marker = '*';
    const parts = Array.from(childNodes).map(child => this.processNode(child));
    return `${marker}${parts.join('')}${marker}`;
  }

  /**
   * Processes a `<b>` or `<strong>` block.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processBold(node) {
    if (!node.hasChildNodes()) {
      return '';
    }
    const { childNodes } = node;
    const marker = '**';
    const parts = Array.from(childNodes).map(child => this.processNode(child));
    return `${marker}${parts.join('')}${marker}`;
  }

  /**
   * Processes a horizontal line element.
   * @returns string
   */
  processHorizontalLine() {
    return `---`;
  }

  /**
   * Processes a `<blockquote>` element.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processBlockquote(node) {
    const prefix = '> ';
    if (!node.hasChildNodes()) {
      // nothing much to do here. however, editors may want to visualize this anyway.
      return prefix;
    }
    const { childNodes } = node;
    const parts = Array.from(childNodes).map(child => this.processNode(child)).filter(txt => !!txt).map(txt => txt.trim());
    return `${prefix}${parts.join(`\n${prefix}`)}`;
  }

  /**
   * Processes a `<del>` element.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processStrikeThrough(node) {
    if (!node.hasChildNodes()) {
      return '';
    }
    const prefix = '~~';
    const { childNodes } = node;
    const parts = Array.from(childNodes).map(child => this.processNode(child)).filter(txt => !!txt).map(txt => txt.trim());
    return `${prefix}${parts.join(' ')}${prefix}`;
  }

  /**
   * Processes an `<img>` element.
   * @param {HTMLImageElement} node 
   * @returns {string}
   */
  processImage(node) {
    const { src, alt, width, height, title } = node;
    if (!src) {
      return '';
    }
    const parts = [];
    parts.push(`![${alt}]`);
    parts.push(`(`);
    parts.push(`<${src}>`);
    if (width && height) {
      parts.push(` =${width}x${height}`);
    }
    if (title) {
      parts.push(` "${title}"`);
    }
    parts.push(`)`);
    return parts.join('');
  }

  /**
   * Processes the `<br/>` element.
   * @returns {string}
   */
  processNewLine() {
    return '\n';
  }

  /**
   * Processes a `<table>` element.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processTable(node) {
    const headings = /** @type HTMLElement[] */ (Array.from(node.querySelectorAll('thead > tr > th')));
    const rows = /** @type HTMLElement[] */ (Array.from(node.querySelectorAll('tbody > tr')));

    /** @type string[][] */
    const tableModel = [[], []];
    headings.forEach((child, i) => {
      let cellAlign = '---';
      const content = this.processTableCell(child);
      if (child.hasAttribute('style')) {
        const { textAlign } = child.style;
        switch (textAlign) {
          case 'left': cellAlign = ':---'; break;
          case 'right': cellAlign = '---:'; break;
          case 'center': cellAlign = ':---:'; break;
          default:
        }
      }
      tableModel[0][i] = content.trim();
      tableModel[1][i] = cellAlign;
    });

    rows.forEach((row) => {
      const index = tableModel.push([]) - 1;
      const cols = row.getElementsByTagName('td');
      Array.from(cols).forEach((cell) => {
        const content = this.processTableCell(cell);
        tableModel[index].push(content);
      });
    });

    const columnsSize = this.computeColumnSpace(tableModel);
    const parts = [];
    tableModel.forEach((cells, row) => {
      cells.forEach((content, col) => {
        if (row === 1) {
          if (!content.startsWith(':') && content.endsWith(':')) {
            cells[col] = content.padStart(columnsSize[col], '-')
          } else if (content.endsWith(':')) {
            cells[col] = content.slice(-1).padEnd(columnsSize[col] - 1, '-');
            cells[col] += ':';
          } else {
            cells[col] = content.padEnd(columnsSize[col], '-');
          }
        } else {
          cells[col] = content.padEnd(columnsSize[col]);
        }
      });
      parts.push(`| ${cells.join(' | ')} |`);
    });
    return parts.join('\n');
  }

  /**
   * Processes a table cell.
   * @param {HTMLElement} node 
   * @returns {string}
   */
  processTableCell(node) {
    if (!node.hasChildNodes()) {
      return '';
    }
    const { childNodes } = node;
    const parts = Array.from(childNodes).map(child => this.processNode(child)).filter(txt => !!txt).map(txt => txt.trim());
    return parts.join('');
  }

  /**
   * Computes the size of each column in the table.
   * @param {string[][]} tableModel 
   * @returns {number[]}
   */
  computeColumnSpace(tableModel) {
    const defaultSize = 3;
    const cols = new Array(tableModel.length - 1).fill(defaultSize);
    tableModel.forEach((cells) => {
      cells.forEach((content, col) => {
        const { length } = content;
        if (length > cols[col]) {
          cols[col] = length;
        }
      });
    });
    return cols;
  }
}
