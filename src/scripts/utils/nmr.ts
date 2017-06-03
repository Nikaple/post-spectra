import { map, head, tail, split } from 'lodash';
import { minFreq, maxFreq, solvents } from './constants';

export type Nucleo = 'H'|'C'|'F'|'P';
export type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq';

export interface Metadata {
  type: Nucleo;
  freq: number;
  solvent: string;
}

export interface H1Data {
  peak: string|string[];
  peakType: Multiplet;
  couplingConstants: number|null;
  hydrogenCount: number;
  danger?: boolean; // highlight to red or not
  warning?: boolean; // highlight to yellow or not
  errMsg?: string; // message on hover
}

export interface H1RenderObj {
  meta: Metadata;
  peak: H1Data[];
}

/**
 * match the specific type (1H / 13C) of data in the inputted data
 * and trim the last character ('.', ';', or ' ')
 * @example 
 * // returns ['1H NMR (400 MHz, cdcl3) δ 11.46 (s, 1H), \
 * 8.60 (d, J = 8.2 Hz, 1H), 8.54 (dd, J = 7.7, 1.2 Hz, 1H), \
 * 7.37 – 7.29 (m, 1H)']
 * getDataArray('randomText 1H NMR (400 MHz, cdcl3) δ 11.46 (s, 1H), \
 * 8.60 (d, J = 8.2 Hz, 1H), 8.54 (dd, J = 7.7, 1.2 Hz, 1H), \
 * 7.37 – 7.29 (m, 1H). Note: data has to end with ".", ";", or " "', 'H');
 * @export
 * @param {string} data 
 * @param {Nucleo} type 
 * @returns {(string[]|null)} data array of individual NMR data
 */
export function getDataArray(data: string, type: Nucleo): string[]|null {
  let nmrReg: RegExp;
  switch (type) {
    case 'H': { // 1H NMR data starts with 13C NMR and ends with '.' or ';' or white space
      nmrReg = /1H NMR.+\)[\.;\s]/g;
      break;
    }
    case 'C': { // 13C NMR data starts with 13C NMR and ends with '.' or ';' or white space
      nmrReg = /13C NMR.+?\d{1,3}\.\d{1,2}[\.;\s]/g;
      break;
    }
    default: { // falls back to 1H NMR on default
      nmrReg = /1H NMR.+\)[\.;\s]/g;
      break;
    }
  }
  const match = data.match(nmrReg);
  if (match === null) {
    return null;
  } else { // cut the '.' or ';' or white space at the end
    return map(match, str => str.substr(0, str.length - 1));
  }
}

/**
 * split complete nmr data into pieces (describer + peak data)
 * @example
 * // returns [[
 * // '1H NMR (400 MHz, cdcl3)',
 * // '11.46 (s, 1H),
 * // '8.60 (d, J = 8.2 Hz, 1H)',
 * // '8.54 (dd, J = 7.7, 1.2 Hz, 1H)',
 * // '7.37 – 7.29 (m, 1H)'
 * // ]]
 * splitDataArray(['1H NMR (400 MHz, cdcl3) δ 11.46 (s, 1H), \
 *   8.60 (d, J = 8.2 Hz, 1H), 8.54 (dd, J = 7.7, 1.2 Hz, 1H), \
 *   7.37 – 7.29 (m, 1H)']);
 * @export
 * @param {string[]} dataArr 
 * @returns 
 */
export function splitDataArray(dataArr: string[]) {
  return map(dataArr, (datum) => {
    return split(datum, / δ |, *(?!\d+\.\d+\s+\w)(?=\d{1,3}\.\d{1,3})/g);
  });
}

/**
 * get the basic information of nmr
 * @example
 * // returns ['1H NMR (400 MHz, cdcl3)', '1H NMR (600 MHz, dmso)'];
 * getDescriberArray([
 *   [
 *     '1H NMR (400 MHz, cdcl3)',
 *     '11.46 (s, 1H)'
 *   ], [
 *     '1H NMR (600 MHz, dmso)',
 *     '15.46 (m, 1H)'
 *   ]
 * ]);
 * @export
 * @param {any} splittedDataArr 
 * @returns 
 */
export function getDescriberArray(splittedDataArr): string[] {
  return map(splittedDataArr, head);
}

/**
 * get the peak data of nmr
 * @example
 * // returns [
 * //   ['11.46 (s, 1H)', '8.60 (d, J = 8.2 Hz, 1H)'],
 * //   ['15.46 (m, 1H)', '6.66 (t, J = 7.7 Hz, 2H)']
 * // ];
 * getDescriberArray([
 *   [
 *     '1H NMR (400 MHz, cdcl3)',
 *     '11.46 (s, 1H)',
 *     '8.60 (d, J = 8.2 Hz, 1H)',
 *   ], [
 *     '1H NMR (600 MHz, dmso)',
 *     '15.46 (m, 1H)',
 *     '6.66 (t, J = 7.7 Hz, 2H)',
 *   ]
 * ]);
 * @export
 * @param {any} splittedDataArr 
 * @returns {string[][]} 
 */
export function getPeakDataArray(splittedDataArr): string[][] {
  return map(splittedDataArr, tail);
}

/**
 * parse metadata string to object that implements interface Metadata
 * @example
 * // returns [{
 * }]
 * getMetadataFromDescriber(['1H NMR (400 MHz, cdcl3)', '1H NMR (600 MHz, dmso)'])
 * @export
 * @param {string[]} describerArr 
 * @returns {((Metadata|null)[])} 
 */
export function getMetadataFromDescriber(describerArr: string[]): (Metadata|null)[] {
  return describerArr.map((datum) => {
    const nucleo = /\d+(\w)(?: NMR)/.exec(datum);
    const freq = /(\d+) MHz/.exec(datum);
    const solvent = /, (\w+)(:?-d6)?\)/i.exec(datum);
    if (!nucleo || !freq || !solvent) {
      return null;
    }
    return {
      type: nucleo[1] as Nucleo,
      freq: +freq[1],
      solvent: solvent[1].toLowerCase(),
    };
  });
}

/**
 * check the validity of metadata
 * 
 * @export
 * @param {(Metadata|null)} meta 
 * @param {Nucleo} type 
 * @returns {boolean} 
 */
export function isMetadataError(meta: Metadata|null, type: Nucleo): boolean {
  if (!meta) {
    return false;
  }
  // decrease the frequency to 1/4 when calculating 13C NMR
  const decay = type === 'H' ? 1 : 4;
  return meta.freq < minFreq / decay
    || meta.freq > maxFreq / decay
    || !solvents[meta.solvent];
}
