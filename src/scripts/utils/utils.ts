import { forIn } from 'lodash';

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
export function parseLiteralToChemicalFormula(formulaLiteral: object): string {
  let formulaString = '';
  forIn(formulaLiteral, (value, key) => {
    formulaString += key;
    formulaString += value === 1 ? '' : `<sub>${value}</sub>`;
  });
  return formulaString;
}

export function clearDOMElement(selector: string): void {
  Array.from(document.querySelectorAll(selector)).forEach(elem => elem.innerHTML = '');
}


// convert the mestrenova data to peaks array
export function strToPeaksArray(str) {
  return str.match(/(\d{1,3}\.\d+)/g);
}
