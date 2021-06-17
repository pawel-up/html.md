/**
 * Parses the HTML input string to an element.
 * @param {string} input 
 * @returns {Element}
 */
export default function parse(input) {
  const parser = new DOMParser();
  const id = `parsed${Math.random().toFixed(8).substr(2)}`;
  const parsable = `<div id="${id}">${input}</div>`;
  const doc = parser.parseFromString(parsable, 'text/html');
  return doc.getElementById(id);
}
