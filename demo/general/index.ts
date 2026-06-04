import { html } from 'lit-html'
import { DemoPage } from '../lib/DemoPage.js'
import HtmlMd from '../../src/index.js'

class ComponentPage extends DemoPage {
  output?: string

  constructor() {
    super()
    this.demoTitle = 'HTML.md'
  }

  async initialize(): Promise<void> {
    this.render()
    await this.raf()
    const stored = localStorage.getItem('html-md-demo-content')
    if (stored !== null) {
      this.setInput(stored)
      this.parseHandler()
    } else {
      const value = await this.downloadHtmlContent()
      this.setInput(value)
    }
  }

  async downloadHtmlContent(): Promise<string> {
    const response = await fetch(`/demo/general/html-content.html`)
    if (!response.ok) {
      throw new Error(`Unable to download the demo content.`)
    }
    return response.text()
  }

  setInput(value: string): void {
    const input = document.getElementById('parserInput') as HTMLTextAreaElement
    input.value = value
  }

  parseHandler() {
    const input = document.getElementById('parserInput') as HTMLTextAreaElement
    const content = input.value
    localStorage.setItem('html-md-demo-content', content)
    const parser = new HtmlMd()
    const result = parser.generate(content)
    this.output = result
    this.render()
  }

  async resetHandler() {
    localStorage.removeItem('html-md-demo-content')
    const value = await this.downloadHtmlContent()
    this.setInput(value)
    this.output = undefined
    this.render()
  }

  contentTemplate() {
    return html`
      <a href="../">Back</a>
      <div class="demo-container">
        <h2>HTML.md</h2>
        ${this._demoTemplate()}
      </div>
    `
  }

  _demoTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>This demo lets you preview the library with various configuration options.</p>

        ${this._inputTemplate()} ${this._outputTemplate()}
      </section>
    `
  }

  _inputTemplate() {
    return html`
      <div class="html-content-input">
        <textarea id="parserInput"></textarea>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="filled" @click="${this.parseHandler}">Parse</button>
          <button class="outlined" @click="${this.resetHandler}">Reset</button>
        </div>
      </div>
    `
  }

  _outputTemplate() {
    const { output } = this
    if (!output) {
      return ''
    }
    return html`
      <div class="markdown-output">
        <pre><code>${output}</code></pre>
      </div>
    `
  }
}
const instance = new ComponentPage()
instance.initialize()
