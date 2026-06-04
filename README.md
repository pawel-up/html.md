# HTML.md 📝

> **No-dependency, ESM-based, in-browser HTML to Markdown converter.**

A lightweight, zero-dependency library that takes an HTML string or a DOM `Element` and converts it into clean, well-formatted Markdown.

Perfect for modern web applications, rich text editors, and content migration tools. Designed to be highly readable for both **developers** and **AI agents**.

---

[![Published on NPM](https://img.shields.io/npm/v/@pawel-up/html.md.svg)](https://www.npmjs.com/package/@pawel-up/html.md)
[![Tests and publishing](https://github.com/jarrodek/html.md/actions/workflows/deployment.yml/badge.svg)](https://github.com/jarrodek/html.md/actions/workflows/deployment.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](http://creativecommons.org/licenses/by/4.0/)

---

## 🚀 Key Features

- 📦 **Zero Dependencies** — Extremely lightweight and fast.
- 🌐 **Native ESM** — Built for modern JS bundles and browser environments.
- 🤖 **Syntax Highlighting Detection** — Infers programming languages from PrismJS/Highlight.js tags (e.g., `class="language-js"` or `class="lang-typescript"`).
- 📊 **Table Alignment Support** — Parses column text alignments from inline CSS `text-align` styles.
- ☑️ **Task Lists** — Parses checkboxes (`<input type="checkbox">`) into markdown task lists (`- [ ]` and `- [x]`).
- 🧹 **Robust Whitespace Processing** — Avoids double-spacing issues and preserves correct multiline code indentation even when deeply nested inside container elements.
- 🔏 **Clean Escaping** — Smart line-start escaping prevents normal text symbols from accidentally breaking into markdown formatting.

---

## 💻 Environment Compatibility

> [!IMPORTANT]
> This library is designed to work in **browser environments only** because it utilizes the browser's native `DOMParser` and DOM APIs.
> To use this in **Node.js**, you must shim/mock the global DOM environment using a library like `jsdom`.

---

## 🛠 Usage

### Installation

```bash
npm install --save @pawel-up/html.md
```

### Basic Example (HTML String)

```javascript
import { HtmlMd } from '@pawel-up/html.md'

const parser = new HtmlMd()
const htmlInput = '<p>This is a <strong>strong</strong> text with <code>inline code</code>.</p>'

const markdown = parser.generate(htmlInput)
console.log(markdown)
// Output: This is a **strong** text with `inline code`.\n\n
```

### DOM Element Example

You can pass a live browser DOM element. The outermost element is treated as a container wrapper and ignored; only its children are converted to markdown.

```javascript
import { HtmlMd } from '@pawel-up/html.md'

const parser = new HtmlMd()
const containerElement = document.querySelector('#content-editor')

const markdown = parser.generate(containerElement)
console.log(markdown)
```

---

## 📋 Tag Conversion Map

| HTML Tag                            | Markdown Output / Behavior               | Example Input                                         | Example Output                |
| :---------------------------------- | :--------------------------------------- | :---------------------------------------------------- | :---------------------------- |
| `<h1>` - `<h6>`                     | Headers                                  | `<h1>Header 1</h1>`                                   | `# Header 1\n\n`              |
| `<p>`, `<div>`                      | Paragraph / block separator              | `<p>Hello World</p>`                                  | `Hello World\n\n`             |
| `<b>`, `<strong>`                   | Bold text                                | `<strong>bold</strong>`                               | `**bold**`                    |
| `<i>`, `<em>`                       | Italic text                              | `<em>italic</em>`                                     | `*italic*`                    |
| `<del>`                             | Strikethrough text                       | `<del>strike</del>`                                   | `~~strike~~`                  |
| `<code>`                            | Inline code / Code block tag             | `<code>const a = 1;</code>`                           | `` `const a = 1;` ``          |
| `<pre><code>`                       | Fenced code blocks with language support | `<pre><code class="language-js">...</code></pre>`     | ` ```js\n...\n```\n\n `       |
| `<ul>`, `<ol>`                      | Bulleted / Ordered lists                 | `<ul><li>Item</li></ul>`                              | `- Item\n\n`                  |
| `<li>`                              | Nested list items                        | Nested list hierarchies                               | Indented list formatting      |
| `<input type="checkbox">`           | Task checkbox list                       | `<li><input type="checkbox" checked> task</li>`       | `- [x] task`                  |
| `<blockquote>`                      | Block quotes                             | `<blockquote>Quote</blockquote>`                      | `> Quote\n\n`                 |
| `<a>`                               | Links                                    | `<a href="https://example.com">Link</a>`              | `[Link](https://example.com)` |
| `<img>`                             | Images                                   | `<img src="img.png" alt="logo">`                      | `![logo](img.png)`            |
| `<figure>` / `<figcaption>`         | Figure block with image and caption      | `<figure><img><figcaption>text</figcaption></figure>` | `![alt](img.png)\n*text*\n\n` |
| `<br>`                              | Line breaks                              | `Line 1<br>Line 2`                                    | `Line 1\nLine 2`              |
| `<table>`                           | Markdown table with CSS alignment        | `<table style="text-align:right">...</table>`         | Alignment columns parsed      |
| `<!-- ... -->`                      | HTML comments preserved                  | `<!-- secret comment -->`                             | `<!-- secret comment -->\n\n` |
| `style="..."`                       | Visual styles parsed from inline CSS     | `<span style="font-weight:bold">text</span>`          | `**text**`                    |
| `script`, `style`, `head`, `button` | Ignored entirely with their children     | `<button>Click</button>`                              | `""` (Empty string)           |

---

## ⚙️ Configuration

The `HtmlMd` class constructor accepts an optional configuration object to customize the markdown output format and parsing rules.

```typescript
import { HtmlMd } from '@pawel-up/html.md'
import type { HtmlMdOptions } from '@pawel-up/html.md'

const options: HtmlMdOptions = {
  flavor: 'gfm',
  keepHtml: false,
  rules: {
    'custom-badge': (node) => `[BADGE: ${node.textContent}]`,
  },
}

const parser = new HtmlMd(options)
```

### Options API Reference

| Option     | Type                                            | Default     | Description                                                                                 |
| :--------- | :---------------------------------------------- | :---------- | :------------------------------------------------------------------------------------------ |
| `flavor`   | `'gfm' \| 'commonmark' \| 'slack'`              | `'gfm'`     | The markdown dialect to generate. See **Markdown Flavors** below.                           |
| `keepHtml` | `boolean`                                       | `false`     | If true, preserves unhandled/custom HTML tags intact in output. If false, extracts content. |
| `rules`    | `Record<string, (node: HTMLElement) => string>` | `undefined` | Custom handler functions for specific HTML tags.                                            |

#### 1. Markdown Flavors (`flavor`)

Configure the output flavor to target different markdown parsers/platforms:

- **GitHub Flavored Markdown (`gfm`)**: Supports full standard GFM features including tables, task lists, and strikethroughs (`~~strikethrough~~`).
- **CommonMark (`commonmark`)**: Strict standard CommonMark. Strikethroughs and task lists are disabled; tables are stripped/rendered as inline text content.
- **Slack mrkdwn (`slack`)**: Generates Slack-compatible syntax (e.g. bold as `*text*`, italic as `_text_`, strike as `~text~`, headers as bold text, and lists starting with bullet points `•`).

#### 2. HTML Fallback Mode (`keepHtml`)

Determines how tags that do not map to markdown (like `<details>`, `<aside>`, `<iframe>`) are processed:

- `false` (default): Strips the HTML container tags but processes and outputs their text content and inline styles.
- `true`: Retains the unhandled tags as raw HTML inside the generated markdown output.

#### 3. Custom Rules (`rules`)

Allows defining custom transformer functions for specific HTML elements (by tag name in lowercase). If a custom rule matches, it completely overrides the default rendering behavior for that element and its children.

```typescript
const parser = new HtmlMd({
  rules: {
    // Replace custom badges with a formatted text string
    'custom-badge': (node) => `[BADGE: ${node.textContent}]`,

    // Ignore specific tags (and their children) completely
    'tab-container': () => '',
  },
})
```

---

## 📖 API Reference

### `class HtmlMd`

The main entry point for the library.

#### `constructor(options?: HtmlMdOptions)`

Initializes the parser instance with customizable config options.

#### `generate(input: string | Element): string`

Converts input HTML into a Markdown string.

- **Parameters**:
  - `input`: Either a raw HTML string or a DOM `Element`.
- **Returns**: `string` - The formatted Markdown markup.
- **Throws**:
  - `Error` if the input is falsy or of an unsupported type.

---

## 🔧 Local Development

### Clone & Install

```bash
git clone https://github.com/pawel-up/html.md.git
cd html.md
npm install
```

### Launch Interactive Demo

Runs a local development server hosting the interactive testing UI:

```bash
npm start
```

### Run Unit Tests

Runs the Lupa test runner across headless browsers:

```bash
npm test
```

### Run Linters

```bash
npm run lint
```

---

## 📄 License

HTML.md by [Pawel Uchida-Psztyc](https://github.com/pawel-up) is licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** license.
