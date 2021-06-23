export declare class MdGenerator {
  /**
   * Generates a markdown content from an Element.
   * @returns The generated markdown.
   */
  generate(root: Element): string;

  /**
   * Processes a single node.
   * @param node
   * @returns The generated code for the node.
   */
  processNode(node: ChildNode): string;

  /**
   * Process a text node and returns the markup.
   */
  processTextNode(node: Text): string;

  /**
   * Process a comment node and returns the markup.
   */
  processCommentNode(node: Comment): string;

  /**
   * Processes an node that is an element.
   */
  processElementNode(node: Element): string;

  /**
   * Processes H1-h6 elements.
   * Note, this does not add new lines after the header content.
   */
  processHeader(node: HTMLElement): string;

  /**
   * Processes the paragraph element and returns the markup.
   * Note, this does not add new lines after the paragraph content.
   */
  processParagraph(node: HTMLElement): string;

  /**
   * Processes a block elements without any sematic meaning (from markdown pov) like headers, sections, etc.
   * Note, this does not add new lines after the paragraph content.
   */
  processBlockElement(node: HTMLElement): string;

  /**
   * Processes a <code> block.
   */
  processCodeBlock(node: HTMLElement): string;

  /**
   * Processes the `<a>` element.
   */
  processAnchor(node: HTMLAnchorElement): string;

  /**
   * Processes the `<ul>` and `ol` elements.
   */
  processList(node: HTMLElement): string;

  /**
   * Specializes in processing list items.
   */
  processListItem(node: HTMLElement): string;
  
  /**
   * Specializes in processing `<code>` that is not inside the `<pre>`.
   */
  processInlineCode(node: HTMLElement): string;

  /**
   * Processes the `<em>` element.
   */
  processEmphasis(node: HTMLElement): string;

  /**
   * Processes a `<b>` or `<strong>` block.
   */
  processBold(node: HTMLElement): string;

  /**
   * Processes a horizontal line element.
   */
  processHorizontalLine(): string;

  /**
   * Processes a `<blockquote>` element.
   */
  processBlockquote(node: HTMLElement): string;

  /**
   * Processes a `<del>` element.
   */
  processStrikeThrough(node: HTMLElement): string;

  /**
   * Processes an `<img>` element.
   */
  processImage(node: HTMLImageElement): string;

  /**
   * Processes the `<br/>` element.
   */
  processNewLine(): string;

  /**
   * Processes a `<table>` element.
   */
  processTable(node: HTMLElement): string;

  /**
   * Processes a table cell.
   */
  processTableCell(node: HTMLElement): string;

  /**
   * Computes the size of each column in the table.
   */
  computeColumnSpace(tableModel: string[][]): number[];
}
