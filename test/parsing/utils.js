/**
 * Wraps an element into a div element
 * @param {Element} element 
 * @returns HTMLElement
 */
export function wrapElement(element) {
  const wrapper = document.createElement(`div`);
  wrapper.appendChild(element);
  return wrapper;
}
