/* eslint-disable no-plusplus */
/**
 * Cleans the white spaces.
 * @param {Node} node
 */
export function clean(node) {
  for (let n = 0; n < node.childNodes.length; ++n) {
    const child = /** @type HTMLElement */ (node.childNodes[n]);
    if (child.nodeType === Node.TEXT_NODE) {
      if (!/\S/.test(child.nodeValue)) {
        node.removeChild(child);
        --n;
      } else {
        child.nodeValue = child.nodeValue.split('\n').join(' ');
        child.nodeValue = child.nodeValue.replace(/(\s)+/g, '$1');
      }
    } else if (child.nodeType === Node.ELEMENT_NODE && !['code', 'pre'].includes(child.localName)) {
      clean(child);
    }
  }
}
