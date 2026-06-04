/**
 * Configuration options for the HTML to Markdown converter.
 */
export interface HtmlMdOptions {
  /**
   * The markdown dialect/flavor to target.
   * - `'gfm'`: GitHub Flavored Markdown (default). Supports tables, task lists, and strikethroughs.
   * - `'commonmark'`: Standard CommonMark specifications. Strikethrough and task lists are
   *   disabled; tables are stripped.
   * - `'slack'`: Slack-flavored mrkdwn. Uses single asterisks for bold (`*text*`),
   *   underscores for italics (`_text_`), bullets (`•`) for lists, and converts headers
   *   to bold text.
   *
   * @default 'gfm'
   */
  flavor?: 'gfm' | 'commonmark' | 'slack'

  /**
   * If true, preserves unhandled/non-standard HTML tags (e.g. `<details>`, `<iframe>`) as raw HTML
   * in the generated markdown output. If false, they are omitted.
   *
   * @default false
   */
  keepHtml?: boolean

  /**
   * Custom processing rules for specific HTML elements.
   * The keys are HTML tag names (in lowercase), and the values are functions that take
   * the DOM HTMLElement and return the generated markdown string.
   *
   * @example
   * ```ts
   * const options: HtmlMdOptions = {
   *   rules: {
   *     'custom-badge': (node) => `[BADGE: ${node.textContent}]`,
   *   }
   * }
   * ```
   */
  rules?: Record<string, (node: HTMLElement) => string>
}
