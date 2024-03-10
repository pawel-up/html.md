/**
 * Parses the HTML input string to an element.
 */
export default function parse(input: string): Element {
  const parser = new DOMParser();
  const id = `parsed${Math.random().toFixed(8).substr(2)}`;
  const parsable = `<div id="${id}">${input}</div>`;
  const doc = parser.parseFromString(parsable, 'text/html');
  const result = doc.getElementById(id);
  if (!result) {
    throw new Error(`Element ${id} not found`);
  }
  return result;
}
