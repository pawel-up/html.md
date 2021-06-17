import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import HtmlMd from '../index.js';

class ComponentPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'output',
    ]);
    /** @type string */
    this.output = undefined;
    this.componentName = 'HTML.md';
  }

  firstRender() {
    super.firstRender();
    setTimeout(() => {
      const input = /** @type HTMLTextAreaElement */ (document.getElementById('parserInput'));
      // input.value = document.body.outerHTML;
      input.value = `
<h1>This is a test content</h1>
<p>This should be transformed to a paragraph</p>.
<div>Div elements are also a paragraph</div>
<h2>Usage</h2>
`;
    }, 1);
  }

  parseHandler() {
    const input = /** @type HTMLTextAreaElement */ (document.getElementById('parserInput'));
    const content = input.value;
    const parser = new HtmlMd();
    const result = parser.generate(content);
    console.log(result);
  }

  contentTemplate() {
    return html`
      <h2>HTML.md</h2>
      ${this._demoTemplate()}
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

}
const instance = new ComponentPage();
instance.render();
