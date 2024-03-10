# HTML.md

No-dependency, ESM based, in browser HTML to markdown converter.

A library that takes an HTML string or a reference to an Element and translates it to a Markdown code.

Note, this library works in a **browser** environment only. This won't work in `Node.js`.

[![Published on NPM](https://img.shields.io/npm/v/@pawel-up/html.md.svg)](https://www.npmjs.com/package/@pawel-up/html.md)

[![Tests and publishing](https://github.com/jarrodek/html.md/actions/workflows/deployment.yml/badge.svg)](https://github.com/jarrodek/html.md/actions/workflows/deployment.yml)

## Usage

### Installation

```sh
npm install --save @pawel-up/html.md
```

### Basic example

```javascript
import HtmlMd from '@pawel-up/html.md';

const parser = new HtmlMd();
const markdown = parser.generate(`<p>This is a <code>markdown</code> output</p>`);
// This is a `markdown` output\n\n
```

### Processing HTML element

```javascript
import HtmlMd from '@pawel-up/html.md';

const parser = new HtmlMd();
const markdown = parser.generate(document.body);
```

Note, when passing an element, the most outer element is ignored and treated as a container. The generated markdown only contains child nodes.

## Development

```sh
git clone https://github.com/jarrodek/html.md
cd html.md
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## License

<!-- HTML.md © 2021 by Pawel Psztyc is licensed under CC BY 4.0. -->

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">HTML.md</span> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/jarrodek">Pawel Uchida-Psztyc</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"></a></p>
