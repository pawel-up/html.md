# Classes

## assert

### `AssertDom`
DOM-specific assertion methods
```ts
constructor(assertInstance: Assert): AssertDom
```
**Methods:**
- `hasText(element: Element, text: string, message?: string): void` — Asserts that an element contains the specified text content.
Traverses all child nodes to extract text content, trims whitespace,
and checks for substring inclusion.
- `hasClass(element: Element, className: string, message?: string): void` — Asserts that an element has the specified class name.
- `hasAttribute(element: Element, name: string, value?: string, message?: string): void` — Asserts that an element has a specific attribute. If the `value` argument
is provided, it will also assert that the attribute equals that value.
- `isVisible(element: HTMLElement, message?: string): void` — Asserts that an element is visible in the DOM.
Visibility is determined by offsetParent (for layout visibility) or
having getBoundingClientRect dimensions.
Note: This does not account for opacity: 0 or visibility: hidden.
- `isFocused(element: Element, message?: string): void` — Asserts that an element is currently focused (i.e. document.activeElement).
- `hasTagName(element: Element, tag: string, message?: string): void` — Asserts that an element has the specified tag name (case-insensitive).
- `hasStyle(element: Element, property: string, value: string, message?: string): void` — Asserts that an element has the specified computed style property and value.
- `equal(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's outer DOM matches the expected HTML string semantically.

See SemanticDomOptions for options on how to control the comparison.
- `notEqual(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's outer DOM does NOT match the expected HTML string semantically.
- `lightEqual(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's Light DOM (innerHTML) matches the expected HTML string semantically.
- `notLightEqual(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's Light DOM (innerHTML) does NOT match the expected HTML string semantically.
- `shadowEqual(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's Shadow DOM matches the expected HTML string semantically.
- `notShadowEqual(element: Element, expectedHtml: string | Element, options?: SemanticDomOptions, message?: string): void` — Asserts that an element's Shadow DOM does NOT match the expected HTML string semantically.
