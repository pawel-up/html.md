/**
 * Parses the HTML input string to an element.
 */
const parser = new DOMParser()

export default function parse(input: string): Element {
  const doc = parser.parseFromString(input, 'text/html')
  const wrapper = doc.createElement('div')
  while (doc.body.firstChild) {
    wrapper.appendChild(doc.body.firstChild)
  }
  return wrapper
}
