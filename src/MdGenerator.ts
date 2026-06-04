import { clean } from './Utils.js'
import type { HtmlMdOptions } from './HtmlMdOptions.js'

export class MdGenerator {
  private options: HtmlMdOptions

  constructor(options: HtmlMdOptions = {}) {
    this.options = {
      flavor: 'gfm',
      keepHtml: false,
      ...options,
    }
  }

  /**
   * Generates a markdown content from an Element.
   * @returns The generated markdown.
   */
  generate(root: Element): string {
    clean(root)
    const { childNodes } = root
    const txt = Array.from(childNodes).map((node) => this.processNode(node))
    return txt.join('')
  }

  /**
   * Processes a single node.
   * @returns The generated code for the node.
   */
  processNode(node: ChildNode): string {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return this.processTextNode(node as Text)
      case Node.COMMENT_NODE:
        return this.processCommentNode(node as Comment)
      case Node.ELEMENT_NODE:
        return this.processElementNode(node as Element)
      default:
        return ''
    }
  }

  /**
   * Helper to check if a node is at the start of a markdown line.
   */
  isAtStartOfLine(node: ChildNode): boolean {
    let current: ChildNode | null = node
    while (current) {
      const prev: ChildNode | null = current.previousSibling
      if (prev) {
        if (prev.nodeType === Node.TEXT_NODE) {
          const val = prev.nodeValue || ''
          if (val.trim() === '') {
            current = prev
            continue
          }
          return false
        }
        if (prev.nodeName.toLowerCase() === 'br') {
          return true
        }
        const blockTags = [
          'div',
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'li',
          'ul',
          'ol',
          'pre',
          'blockquote',
          'table',
          'tr',
          'td',
          'th',
          'hr',
        ]
        if (blockTags.includes(prev.nodeName.toLowerCase())) {
          return true
        }
        return false
      }

      const parent: ParentNode | null = current.parentNode
      if (!parent) {
        return true
      }
      const blockTags = [
        'div',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'li',
        'ul',
        'ol',
        'pre',
        'blockquote',
        'table',
        'tr',
        'td',
        'th',
        'hr',
        'body',
      ]
      if (blockTags.includes(parent.nodeName.toLowerCase())) {
        return true
      }
      current = parent as unknown as ChildNode
    }
    return true
  }

  /**
   * Process a text node and returns the markup.
   */
  processTextNode(node: Text): string {
    let value = node.nodeValue
    if (!value) {
      return ''
    }
    value = value.replace(/ +/g, ' ')
    value = value.replace(/([*_~|`])/g, '\\$1')
    value = value.replace(/]([\s]*)\(/g, '\\]$1\\(')

    const isStart = this.isAtStartOfLine(node)
    if (isStart) {
      value = value.replace(/^(\s*)>/g, '\\$1>')
      value = value.replace(/^#/gm, '\\#')
      value = value.replace(/^(\s*)([-=]{3,})(\s*)$/, '$1\\$2$3')
      value = value.replace(/^( {0,3}\d+)\./gm, '$1\\.')
      value = value.replace(/^( {0,3})([+-])/gm, '$1\\$2')
      value = value.replace(/^ {0,3}\[([\S \t]*?)]:/gm, '\\[$1]:')
    } else {
      value = value.replace(/\n#/g, '\n\\#')
      value = value.replace(/\n( {0,3}\d+)\./g, '\n$1\\.')
      value = value.replace(/\n( {0,3})([+-])/g, '\n$1\\$2')
      value = value.replace(/\n {0,3}\[([\S \t]*?)]:/g, '\n\\[$1]:')
    }

    return value
  }

  /**
   * Process a comment node and returns the markup.
   */
  processCommentNode(node: Comment): string {
    return `<!--${node.data}-->\n\n`
  }

  /**
   * Processes an node that is an element.
   */
  processElementNode(node: Element): string {
    const { localName } = node
    if (
      ['script', 'link', 'head', 'body', 'html', 'meta', 'title', 'style', 'h7', 'h8', 'h9', 'button'].includes(
        localName
      )
    ) {
      // we don't like them. And their children.
      return ''
    }
    const typedHtmlElement = node as HTMLElement

    // 1. Custom Rules check first
    if (this.options.rules && localName in this.options.rules) {
      return this.options.rules[localName](typedHtmlElement)
    }

    if (['div', 'p'].includes(localName)) {
      const data = this.processParagraph(typedHtmlElement)
      if (data) {
        return `${data}\n\n`
      }
      return data
    }
    if (['section', 'header'].includes(localName)) {
      let data = this.processBlockElement(typedHtmlElement)
      if (data) {
        data += '\n\n'
      }
      return data
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(localName)) {
      const data = this.processHeader(typedHtmlElement)
      return `${data}\n\n`
    }
    if (['ul', 'ol'].includes(localName)) {
      let data = this.processList(typedHtmlElement)
      if (data) {
        data += '\n\n'
      }
      return data
    }
    if (localName === 'code') {
      return this.processInlineCode(typedHtmlElement)
    }
    if (['pre'].includes(localName)) {
      let data = this.processCodeBlock(typedHtmlElement)
      if (data) {
        data += '\n\n'
      }
      return data
    }
    if (localName === 'a') {
      return this.processAnchor(node as HTMLAnchorElement)
    }
    if (localName === 'hr') {
      const data = this.processHorizontalLine()
      return `${data}\n\n`
    }
    if (['b', 'strong'].includes(localName)) {
      return this.processBold(typedHtmlElement)
    }
    if (['em', 'i'].includes(localName)) {
      return this.processEmphasis(typedHtmlElement)
    }
    if (localName === 'blockquote') {
      const data = this.processBlockquote(typedHtmlElement)
      return `${data}\n\n`
    }
    if (localName === 'del') {
      return this.processStrikeThrough(typedHtmlElement)
    }
    if (localName === 'img') {
      return this.processImage(node as HTMLImageElement)
    }
    if (localName === 'br') {
      return this.processNewLine()
    }
    if (localName === 'table') {
      if (this.options.flavor !== 'commonmark' && this.options.flavor !== 'slack') {
        let data = this.processTable(typedHtmlElement)
        if (data) {
          data += '\n\n'
        }
        return data
      }
    }
    if (localName === 'span') {
      let content = ''
      if (node.hasChildNodes()) {
        content = Array.from(node.childNodes)
          .map((child) => this.processNode(child))
          .join('')
      }
      return this.applyStyles(typedHtmlElement, content)
    }
    if (localName === 'figure') {
      const img = typedHtmlElement.querySelector('img')
      const figcaption = typedHtmlElement.querySelector('figcaption')
      if (img) {
        let markdown = this.processImage(img as HTMLImageElement)
        if (figcaption) {
          const captionText = figcaption.textContent || ''
          if (captionText) {
            markdown += `\n*${captionText.trim()}*`
          }
        }
        return `${markdown}\n\n`
      }
    }

    if (this.options.keepHtml) {
      return node.outerHTML
    }

    // fallback style parsing
    let content = ''
    if (node.hasChildNodes()) {
      content = Array.from(node.childNodes)
        .map((child) => this.processNode(child))
        .join('')
    }
    return this.applyStyles(typedHtmlElement, content)
  }

  /**
   * Processes H1-h6 elements.
   * Note, this does not add new lines after the header content.
   */
  processHeader(node: HTMLElement): string {
    if (this.options.flavor === 'slack') {
      let result = ''
      if (node.hasChildNodes()) {
        const { childNodes } = node
        const content = Array.from(childNodes).map((child) => this.processNode(child))
        result += content.join('').trim()
      }
      return `*${result}*`
    }
    const cnt = Number(node.localName.replace('h', ''))
    if (Number.isNaN(cnt)) {
      return ''
    }
    const keyword = new Array(cnt).fill('#').join('')
    let headerText = ''
    if (node.hasChildNodes()) {
      const { childNodes } = node
      const content = Array.from(childNodes).map((child) => this.processNode(child))
      headerText = content.join('').trim()
    }
    return `${keyword} ${headerText}`
  }

  /**
   * Processes the paragraph element and returns the markup.
   * Note, this does not add new lines after the paragraph content.
   */
  processParagraph(node: HTMLElement): string {
    let result = ''
    if (node.hasChildNodes()) {
      const { childNodes } = node
      const content = Array.from(childNodes)
        .map((child) => this.processNode(child))
        .filter((code) => !!code)
      result += content.join('')
      result = result.trim()
    }
    return result
  }

  /**
   * Processes a block elements without any sematic meaning (from markdown pov) like headers, sections, etc.
   * Note, this does not add new lines after the paragraph content.
   */
  processBlockElement(node: HTMLElement): string {
    let result = ''
    if (node.hasChildNodes()) {
      const { childNodes } = node
      const content = Array.from(childNodes).map((child) => this.processNode(child))
      result += content.join('')
      result = result.trim()
    }
    return result
  }

  /**
   * Processes a <code> block.
   */
  processCodeBlock(node: HTMLElement): string {
    let isBlock = false
    let block: HTMLElement | undefined
    if (node.localName === 'pre' && node.children[0] && node.children[0].localName === 'code') {
      block = node.children[0] as HTMLElement
      isBlock = true
    } else if (node.localName === 'code') {
      block = node
    }
    if (!block) {
      return ''
    }
    const marker = isBlock ? '```' : '`'
    const blockNl = isBlock ? '\n' : ''
    let code = block.textContent || ''
    if (isBlock && !code.endsWith('\n')) {
      code += blockNl
    }
    let lang = ''
    if (isBlock) {
      const classAttr = `${node.getAttribute('class') || ''} ${block.getAttribute('class') || ''}`
      const match = classAttr.match(/(?:^|\s)(?:language|lang)-(\S+)/)
      if (match) {
        lang = match[1]
      }
    }
    return `${marker}${lang}${blockNl}${code}${marker}`
  }

  /**
   * Processes the `<a>` element.
   */
  processAnchor(node: HTMLAnchorElement): string {
    const { href, childNodes } = node
    if (!href && node.hasChildNodes()) {
      // named anchors (<a name="">) count as regular stuff (?)
      return this.processParagraph(node)
    }
    if (!node.hasChildNodes()) {
      return ''
    }
    const parts = Array.from(childNodes).map((child) => this.processNode(child))
    const txt = parts.join('')
    if (!txt) {
      return txt
    }
    const title = node.hasAttribute('title') ? ` "${node.getAttribute('title')}"` : ''
    return `[${txt}](<${href}>${title})`
  }

  /**
   * Processes the `<ul>` and `ol` elements.
   */
  processList(node: HTMLElement): string {
    let result = ''
    if (!node.hasChildNodes()) {
      return result
    }
    const { childNodes, localName } = node
    const isOrdered = localName === 'ol'
    const markerType = isOrdered ? '1. ' : this.options.flavor === 'slack' ? '• ' : '- '
    const parts = Array.from(childNodes).map((child) => {
      const name = (child as Element).localName
      if (!name || name !== 'li') {
        // we ignore everything that is not a list item.
        // Sub-lists are children of a list item.
        return ''
      }
      let data = this.processListItem(child as HTMLElement)
      if (data) {
        data = `${markerType}${data}`
      }
      return data
    })
    result = parts.join('')
    return result.trim()
  }

  /**
   * Specializes in processing list items.
   */
  processListItem(node: HTMLElement): string {
    let result = ''
    if (!node.hasChildNodes()) {
      return result
    }
    const { childNodes } = node
    let isFirstText = true
    Array.from(childNodes).forEach((child) => {
      const typedInput = child as HTMLInputElement
      if (typedInput.localName === 'input' && typedInput.type === 'checkbox') {
        if (this.options.flavor !== 'commonmark' && this.options.flavor !== 'slack') {
          result += `[${typedInput.checked ? 'x' : ' '}] `
          isFirstText = false
        }
      } else if (['ul', 'ol'].includes(typedInput.localName)) {
        const data = this.processNode(child)
        if (data) {
          result += `\n${data}`
        }
      } else {
        let childText = this.processNode(child)
        if (isFirstText) {
          childText = childText.replace(/^\s+/, '')
          if (childText) {
            isFirstText = false
          }
        }
        result += childText
      }
    })
    if (!/\n$/.test(result)) {
      result += '\n'
    } else {
      // indent
      result = result
        .split('\n')
        .join('\n    ')
        .replace(/^ {4}$/gm, '')
        .replace(/\n\n+/g, '\n\n')
    }
    return result
  }

  /**
   * Specializes in processing `<code>` that is not inside the `<pre>`.
   */
  processInlineCode(node: HTMLElement): string {
    return `\`${node.innerHTML}\``
  }

  /**
   * Processes the `<em>` element.
   */
  processEmphasis(node: HTMLElement): string {
    if (!node.hasChildNodes()) {
      return ''
    }
    const { childNodes } = node
    const marker = this.options.flavor === 'slack' ? '_' : '*'
    const parts = Array.from(childNodes).map((child) => this.processNode(child))
    return `${marker}${parts.join('')}${marker}`
  }

  /**
   * Processes a `<b>` or `<strong>` block.
   */
  processBold(node: HTMLElement): string {
    if (!node.hasChildNodes()) {
      return ''
    }
    const { childNodes } = node
    const marker = this.options.flavor === 'slack' ? '*' : '**'
    const parts = Array.from(childNodes).map((child) => this.processNode(child))
    return `${marker}${parts.join('')}${marker}`
  }

  /**
   * Processes a horizontal line element.
   */
  processHorizontalLine(): string {
    return `---`
  }

  /**
   * Processes a `<blockquote>` element.
   */
  processBlockquote(node: HTMLElement): string {
    const prefix = '> '
    if (!node.hasChildNodes()) {
      // nothing much to do here. however, editors may want to visualize this anyway.
      return prefix
    }
    const { childNodes } = node
    const parts = Array.from(childNodes)
      .map((child) => this.processNode(child))
      .filter((txt) => !!txt)
      .map((txt) => txt.trim())
    return `${prefix}${parts.join(`\n${prefix}`)}`
  }

  /**
   * Processes a `<del>` element.
   */
  processStrikeThrough(node: HTMLElement): string {
    if (!node.hasChildNodes()) {
      return ''
    }
    const { childNodes } = node
    const parts = Array.from(childNodes)
      .map((child) => this.processNode(child))
      .filter((txt) => !!txt)
      .map((txt) => txt.trim())

    if (this.options.flavor === 'commonmark') {
      return parts.join(' ')
    }
    const prefix = this.options.flavor === 'slack' ? '~' : '~~'
    return `${prefix}${parts.join(' ')}${prefix}`
  }

  /**
   * Processes an `<img>` element.
   */
  processImage(node: HTMLImageElement): string {
    const { src, alt, width, height, title } = node
    if (!src) {
      return ''
    }
    const parts = []
    parts.push(`![${alt}]`)
    parts.push(`(`)
    parts.push(`<${src}>`)
    if (width && height) {
      parts.push(` =${width}x${height}`)
    }
    if (title) {
      parts.push(` "${title}"`)
    }
    parts.push(`)`)
    return parts.join('')
  }

  /**
   * Processes the `<br/>` element.
   */
  processNewLine(): string {
    return '\n'
  }

  /**
   * Processes a `<table>` element.
   */
  processTable(node: HTMLElement): string {
    const headings = Array.from(node.querySelectorAll('thead > tr > th')) as HTMLElement[]
    const rows = Array.from(node.querySelectorAll('tbody > tr')) as HTMLElement[]

    const tableModel: string[][] = [[], []]
    headings.forEach((child, i) => {
      let cellAlign = '---'
      const content = this.processTableCell(child)
      if (child.hasAttribute('style')) {
        const { textAlign } = child.style
        switch (textAlign) {
          case 'left':
            cellAlign = ':---'
            break
          case 'right':
            cellAlign = '---:'
            break
          case 'center':
            cellAlign = ':---:'
            break
          default:
        }
      }
      tableModel[0][i] = content.trim()
      tableModel[1][i] = cellAlign
    })

    rows.forEach((row) => {
      const index = tableModel.push([]) - 1
      const cols = row.getElementsByTagName('td')
      Array.from(cols).forEach((cell) => {
        const content = this.processTableCell(cell)
        tableModel[index].push(content)
      })
    })

    const columnsSize = this.computeColumnSpace(tableModel)
    const parts: string[] = []
    tableModel.forEach((cells, row) => {
      cells.forEach((content, col) => {
        if (row === 1) {
          if (!content.startsWith(':') && content.endsWith(':')) {
            cells[col] = content.padStart(columnsSize[col], '-')
          } else if (content.endsWith(':')) {
            cells[col] = content.slice(-1).padEnd(columnsSize[col] - 1, '-')
            cells[col] += ':'
          } else {
            cells[col] = content.padEnd(columnsSize[col], '-')
          }
        } else {
          const alignment = tableModel[1][col]
          if (!alignment.startsWith(':') && alignment.endsWith(':')) {
            cells[col] = content.padStart(columnsSize[col])
          } else if (alignment.startsWith(':') && alignment.endsWith(':')) {
            cells[col] = content
              .padStart(content.length + Math.floor((columnsSize[col] - content.length) / 2))
              .padEnd(columnsSize[col])
          } else {
            cells[col] = content.padEnd(columnsSize[col])
          }
        }
      })
      parts.push(`| ${cells.join(' | ')} |`)
    })
    return parts.join('\n')
  }

  /**
   * Processes a table cell.
   */
  processTableCell(node: HTMLElement): string {
    if (!node.hasChildNodes()) {
      return ''
    }
    const { childNodes } = node
    const parts = Array.from(childNodes)
      .map((child) => this.processNode(child))
      .filter((txt) => !!txt)
      .map((txt) => txt.trim())
    return parts.join(' ').replace(/ ([,.])/g, '$1')
  }

  /**
   * Computes the size of each column in the table.
   */
  computeColumnSpace(tableModel: string[][]): number[] {
    const defaultSize = 3
    const cols = new Array(tableModel.length).fill(defaultSize)
    tableModel.forEach((cells) => {
      cells.forEach((content, col) => {
        const { length } = content
        if (length > cols[col]) {
          cols[col] = length
        }
      })
    })
    return cols
  }

  /**
   * Parses inline CSS style attribute into a key-value record.
   */
  parseStyles(node: HTMLElement): Record<string, string> {
    const styleAttr = node.getAttribute('style') || ''
    const styles: Record<string, string> = {}
    styleAttr.split(';').forEach((pair) => {
      const parts = pair.split(':')
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase()
        const value = parts.slice(1).join(':').trim().toLowerCase()
        styles[key] = value
      }
    })
    return styles
  }

  /**
   * Wraps the processed element content in markdown syntax based on CSS inline styles.
   */
  applyStyles(node: HTMLElement, content: string): string {
    const styles = this.parseStyles(node)
    let result = content

    const isBold = styles['font-weight'] === 'bold' || parseInt(styles['font-weight'], 10) >= 600
    const isItalic = styles['font-style'] === 'italic' || styles['font-style'] === 'oblique'
    const isStrike =
      styles['text-decoration'] === 'line-through' ||
      styles['text-decoration-line'] === 'line-through' ||
      (styles['text-decoration'] && styles['text-decoration'].includes('line-through'))

    if (isBold) {
      const prefix = this.options.flavor === 'slack' ? '*' : '**'
      result = `${prefix}${result}${prefix}`
    }
    if (isItalic) {
      const prefix = this.options.flavor === 'slack' ? '_' : '*'
      result = `${prefix}${result}${prefix}`
    }
    if (isStrike) {
      if (this.options.flavor === 'slack') {
        result = `~${result}~`
      } else if (this.options.flavor !== 'commonmark') {
        result = `~~${result}~~`
      }
    }
    return result
  }
}
