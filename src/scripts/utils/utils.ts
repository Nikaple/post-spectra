import { reduce } from 'lodash';
import { ElementCountPair } from './formula';

/**
 * get the active radio button from a set of radio buttons
 * 
 * @export
 * @param {NodeListOf<HTMLInputElement>} radios 
 * @returns {HTMLInputElement} 
 */
export function getActiveRadioButton(radios: NodeListOf<HTMLInputElement>): HTMLInputElement {
  return Array.from(radios).filter(elem => elem.checked === true)[0];
}

/**
 * Stringify a formula object to chemical formula string
 * 
 * @export
 * @param {object} formulaLiteral 
 * @returns {string} 
 */
export function parseLiteralToChemicalFormula(formulaLiteral: ElementCountPair[]): string {
  const formulaString = 
  reduce(formulaLiteral, 
         (formulaString, elementCountPair: ElementCountPair) => {
           formulaString += elementCountPair.element;
           formulaString += elementCountPair.count === 1 
           ? '' 
           : `<sub>${elementCountPair.count}</sub>`;
           return formulaString;
         },
         '');
  return formulaString;
}

export function clearDOMElement(selector: string): void {
  Array.from(document.querySelectorAll(selector)).forEach(elem => elem.innerHTML = '');
}


// convert the mestrenova data to peaks array
export function strToPeaksArray(str) {
  return str.match(/(\d{1,3}\.\d+)/g);
}

export function copyFormattedToClipboard(str) {
  document.addEventListener('copy', copy);
  document.execCommand('copy');
  document.removeEventListener('copy', copy);
  function copy(e: ClipboardEvent) {
    e.clipboardData.setData('text/html', str);
    e.preventDefault();
  }
}
