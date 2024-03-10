import { html } from 'lit-html';
import { DemoPage } from '../lib/DemoPage.js';
import HtmlMd from '../../src/index.js';
import reactive from '../lib/reactive.js';

class ComponentPage extends DemoPage {
  @reactive()
  output?: string;

  constructor() {
    super();
    this.demoTitle = 'HTML.md';
  }

  async initialize(): Promise<void> {
    this.render();
    await this.raf();
    const value = await this.downloadHtmlContent();
    this.setInput(value);
  }

  async downloadHtmlContent(): Promise<string> {
    const response = await fetch(`/demo/general/html-content.html`);
    if (!response.ok) {
      throw new Error(`Unable to download the demo content.`);
    }
    return response.text();
  }

  setInput(value: string): void {
    const input = document.getElementById('parserInput') as HTMLTextAreaElement;
    input.value = value;
  }

  parseHandler() {
    const input = document.getElementById('parserInput') as HTMLTextAreaElement;
    const content = input.value;
    const parser = new HtmlMd();
    const result = parser.generate(content);
    this.output = result;
  }

  contentTemplate() {
    return html`
    <a href="../">Back</a>
    <div class="demo-container">
      <h2>HTML.md</h2>
      ${this._demoTemplate()}
    </div>
    `;
  }

  _demoTemplate() {
    return html`
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the library with various configuration options.
      </p>

      ${this._inputTemplate()}
      ${this._outputTemplate()}
    </section>
    `;
  }

  _inputTemplate() {
    return html`
    <div class="html-content-input">
      <textarea id="parserInput"></textarea>
      <button @click="${this.parseHandler}">Parse</button>
    </div>
    `;
  }

  _outputTemplate() {
    const { output } = this;
    if (!output) {
      return '';
    }
    return html`
    <div class="markdown-output">
      <pre><code>${output}</code></pre>
    </div>
    `;
  }
}
const instance = new ComponentPage();
instance.initialize();
