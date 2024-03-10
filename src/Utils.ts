/* eslint-disable no-plusplus */
/**
 * Cleans the white spaces.
 */
export function clean(node: Element) {
  for (let n = 0; n < node.childNodes.length; ++n) {
    const child = node.childNodes[n] as HTMLElement;
    if (child.nodeType === Node.TEXT_NODE) {
      let value = child.nodeValue;
      if (!value) {
        continue;``
      }
      if (!/\S/.test(value)) {
        node.removeChild(child);
        --n;
      } else {
        value = value.split('\n').join(' ');
        child.nodeValue = value.replace(/(\s)+/g, '$1');
      }
    } else if (child.nodeType === Node.ELEMENT_NODE && !['code', 'pre'].includes(child.localName)) {
      clean(child);
    }
  }
}
