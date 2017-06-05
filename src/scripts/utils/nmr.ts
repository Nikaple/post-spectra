import { map, head, tail, split, some, includes } from 'lodash';
import { minFreq, maxFreq, solventInfo } from './constants';

export type Nucleo = 'H'|'C'|'F'|'P';
export type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq'|'br';

export enum HighlightType {
  Yellow = 0,
  Red,
}

export interface Metadata {
  type: Nucleo;
  freq: number;
  solvent: string;
}

export interface H1Data {
  peak: string|string[];
  peakType: Multiplet;
  couplingConstants: number[]|null;
  hydrogenCount: number;
  danger?: boolean; // highlight to red or not
  warning?: boolean; // highlight to yellow or not
  peakTypeError?: boolean; // peakType error or not  
  errMsg?: string; // message on hover
}

export type C13Data = string|null;

export interface H1RenderObj {
  meta: Metadata;
  peak: H1Data[];
}

export interface C13RenderObj {
  meta: Metadata;
  peak: C13Data[];
}

interface ParsedData {
  peakData: string[][];
  metadataArr: (Metadata|null)[];
}

/**
 * return if the peak is multiple peak (with coupling constant)
 * 
 * @export
 * @param {Multiplet} peak 
 * @param {boolean} [isGeneral] 
 * @returns 
 */
export function isPeak(peak: Multiplet) {
  const peakLookup: Multiplet[] = ['s', 'd', 't', 'q', 'dd', 'dt', 'td',
    'ddd', 'ddt', 'dq', 'br', 'm'];
  return includes(peakLookup, peak);
}

/**
 * return if the peak is single peak or broad peak (no coupling constant)
 * 
 * @export
 * @param {Multiplet} peak 
 * @returns {boolean} 
 */
export function isSinglePeak(peak: Multiplet): boolean {
  const singlePeakLookup: Multiplet[] = ['s', 'br'];
  return includes(singlePeakLookup, peak);
}

/**
 * return if the peak is multiple peak (with coupling constant)
 * 
 * @export
 * @param {Multiplet} peak 
 * @param {boolean} [isGeneral] 
 * @returns 
 */
export function isMultiplePeakWithCouplingConstant(peak: Multiplet, isGeneral?: boolean) {
  const multiplePeakLookup: Multiplet[] = isGeneral
    ? ['d', 't', 'q', 'dd', 'dt', 'td', 'ddd', 'ddt', 'dq']
    : ['d', 't', 'q'];
  return includes(multiplePeakLookup, peak);
}

/**
 * return if the peak is multiple peak
 * 
 * @export
 * @param {Multiplet} peak 
 * @returns 
 */
export function isMultiplePeak(peak: Multiplet) {
  return peak === 'm';
}


/**
 * highlight peak data with tooltip
 * 
 * @export
 * @param {string} str 
 * @param {HighlightType} [type] 
 * @param {string} [errMsg] 
 * @returns 
 */
export function highlightPeakData(str: string, type?: HighlightType, errMsg?: string) {
  const tooltipAttribute = errMsg ? `data-tooltip="${errMsg}"` : '';
  if (type === HighlightType.Red) {
    return `<span class="danger-text" ${tooltipAttribute}>${str}</span>`;
  } else if (type === HighlightType.Yellow) {
    return `<span class="warning-text" ${tooltipAttribute}">${str}</span>`;
  }
  return str;
}

export function handleNMRData(type: Nucleo, thisArg): ParsedData | null {
  const dataArr = getDataArray(thisArg.data, type);
  if (dataArr === null) {
    thisArg.renderError(thisArg.errMsg.dataErr);
    return null;
  }
  const splittedDataArr: string[][] = splitDataArray(dataArr);
  const describerArr: string[] = getDescriberArray(splittedDataArr);
  const metadataArr: (Metadata|null)[] = getMetadataFromDescriber(describerArr);
  const peakData: string[][] = getPeakDataArray(splittedDataArr);
  if (some(metadataArr, metadata => isMetadataError(metadata, type))) {
    thisArg.renderError(thisArg.errMsg.infoErr);
    return null;
  }
  return { peakData, metadataArr };
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
  // 1H NMR data starts with 13C NMR and ends with ',.;，。；' or white space
  const h1Reg = /1H NMR.+\dH\) ?[ ,.;，。；]+?/g;
  // 13C NMR data starts with 13C NMR and ends with ',.;，。；' or white space
  const c13Reg = /13C NMR.+MHz.+?\d+\.?\d*(\(\d*\))? ?[ ,.;，。；](?! *\d\.?\d*)/g;
  switch (type) {
    case 'H': { 
      nmrReg = h1Reg;
      break;
    }
    case 'C': { 
      nmrReg = c13Reg;
      break;
    }
    default: { // falls back to 1H NMR on default
      nmrReg = h1Reg;
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
function splitDataArray(dataArr: string[]) {
  return map(dataArr, (datum) => {
    return split(datum, / *δ *=? *(?:\(ppm\))?|, *(?!\d+\.\d+\s+\w)(?=\d+\.\d*)/g);
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
function getDescriberArray(splittedDataArr): string[] {
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
function getPeakDataArray(splittedDataArr): string[][] {
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
function getMetadataFromDescriber(describerArr: string[]): (Metadata|null)[] {
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
function isMetadataError(meta: Metadata|null, type: Nucleo): boolean {
  if (!meta) {
    return false;
  }
  // decrease the frequency to 1/4 when calculating 13C NMR
  const decay = type === 'H' ? 1 : 4;
  return meta.freq < minFreq / decay
    || meta.freq > maxFreq / decay
    || !solventInfo[meta.solvent];
}
