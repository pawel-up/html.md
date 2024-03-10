/**
 * Wraps an element into a div element
 */
export function wrapElement(element: Element): HTMLElement {
  const wrapper = document.createElement(`div`);
  wrapper.appendChild(element);
  return wrapper;
}
