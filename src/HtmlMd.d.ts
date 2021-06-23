export declare class HtmlMd {
  /**
   * Generates a markdown code from the input.
   * The input can be a HTML string (will be parsed using browser's built-in functions)
   * or an Element containing the content to be parsed. In the later case, the content 
   * of the Element is used to generate the markdown, excluding the most outer element.
   * 
   * @param input The input to use to generate the markdown for.
   */
  generate(input: string|Element): string;
}
