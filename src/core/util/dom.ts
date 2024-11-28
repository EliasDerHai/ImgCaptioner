import {JSXElement} from 'solid-js';
import {render} from 'solid-js/web';

export const convertJsxToHtmlString = (jsx: JSXElement): string => {
  const tempNode = document.createElement('div');
  render(() => jsx, tempNode);
  const html = tempNode.innerHTML;
  render(() => null, tempNode);
  return html;
};
