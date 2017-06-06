import { map, head, tail, split, some, includes, trimEnd, chain } from 'lodash';
import { minFreq, maxFreq, solventsInfo } from './constants';

export type Nucleo = 'H'|'C'|'F'|'P';
export type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq'|'br';
export type C13Data = string|null;

export enum HighlightType {
  Danger = 0,
  Warning,
  Success,
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

export interface H1RenderObj {
  meta: Metadata;
  peak: H1Data[];
}

interface ParsedData {
  peakData: string[][];
  metadataArr: (Metadata|null)[];
}

export interface C13RenderObj {
  meta: Metadata;
  peak: C13Data[];
}

// 0: not strict mode
// 1: strict mode
export const nmrRegex = {
  h1Reg: [/1H NMR(.+?\dH\) *[ .;，。；]|.+\dH\) *, *)/g,
    /1H NMR.+?(\dH\)[.;])/g],
  c13Reg: [/13C NMR.+MHz.+?\d+\.?\d*(\(\d*\))? ?[ ,.;，。；](?! *\d\.?\d*)/g,
    /13C NMR.+?MHz.+?\d{1,3}\.\d{1,2}(\(\d\))?[.;]/g],
  splitData: [/:? *δ *=? *(?:\(ppm\))?| *[,，] *(?!\d+\.\d+\s+\w)(?=\d+\.\d*)/,
    /:? δ(?: \(ppm\))?(?: ?= )?|, *(?=\d{1,3}\.\d{1,2})/],
  nucleo: [/\d+(\w)(?: NMR)/, /\d{1,2}([A-Z])(?: NMR)/],
  freq: [/(\d+) *MHz/, /(\d{2,3}) MHz/],
  solvent: [/(dmso|cdcl3|cd3od|c6d6|d2o)(?:[–−-]d\d)?/i,
    /(dmso|cdcl3|cd3od|c6d6|d2o)(?:[–−-]d\d)?/i],
  h1PeakWithCouplingConstants: [
    // tslint:disable-next-line:max-line-length
    /(\d+\.?\d*) *\((\w+), J *= *(\d+\.?\d*)(?:, *)?(\d+\.?\d*)?(?:, *)?(\d+\.?\d*)? *(?:Hz)? *, *(\d+)H\)/,
    // tslint:disable-next-line:max-line-length
    /(\d{1,2}\.\d{2}) \((\w+), J = (\d{1,2}\.\d)(?:, )?(\d{1,2}\.\d)?(?:, )?(\d{1,2}\.\d)? Hz, (\d{1,2})H\)/,
  ],
  h1PeakWithoutCouplingConstants: [
    /(\d+\.?\d*( *[–−-] *\d+\.?\d*)?) *\( *(\w+) *, *(?:(\d+)H\))/,
    /(\d{1,2}\.\d{2}( ?[–−-] ?\d{1,2}\.\d{2})?) \((\w+), (\d{1,2})H\)/,
  ],
};

/**
 * return if the peak is peak
 * 
 * @export
 * @param {Multiplet} peak
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

export function handleNMRData(type: Nucleo, thisArg: any, isStrict: boolean): ParsedData | null {
  thisArg.matchedData = getDataArray(thisArg.inputtedData, type, isStrict);
  if (thisArg.matchedData === null) {
    thisArg.renderError(thisArg.errMsg.dataErr);
    return null;
  }
  const splittedDataArray = splitDataArray(thisArg.matchedData, isStrict);
  const describerArr: string[] = getDescriberArray(splittedDataArray);
  const metadataArr: (Metadata|null)[] = getMetadataFromDescriber(describerArr, isStrict);
  if (some(metadataArr, metadata => isMetadataError(metadata, type))) {
    thisArg.renderError(thisArg.errMsg.infoErr);
    return null;
  }
  const peakData: string[][] = getPeakDataArray(splittedDataArray);
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
export function getDataArray(data: string, type: Nucleo, isStrict: boolean): string[]|null {
  let nmrReg: RegExp;
  switch (type) {
    case 'H': { 
      nmrReg = nmrRegex.h1Reg[Number(isStrict)];
      break;
    }
    case 'C': { 
      nmrReg = nmrRegex.c13Reg[Number(isStrict)];
      break;
    }
    default: { // falls back to 1H NMR on default
      nmrReg = nmrRegex.h1Reg[Number(isStrict)];
      break;
    }
  }
  const match = data.match(nmrReg);
  if (match === null) {
    return null;
  }
  return match;
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
function splitDataArray(dataArr: string[], isStrict: boolean) {
  const trimmedData = map(dataArr, datum => trimEnd(datum, ' ,.; ，。；'));
  return map(trimmedData, (datum) => {
    return split(datum, nmrRegex.splitData[Number(isStrict)]);
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
function getDescriberArray(splittedDataArr: string[][]): string[] {
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
function getPeakDataArray(splittedDataArr: string[][]): string[][] {
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
function getMetadataFromDescriber(describerArr: string[], isStrict: boolean): (Metadata|null)[] {
  return describerArr.map((datum) => {
    const nucleo = datum.match(nmrRegex.nucleo[Number(isStrict)]);
    const freq = datum.match(nmrRegex.freq[Number(isStrict)]);
    const solvent = datum.match(nmrRegex.solvent[Number(isStrict)]);
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
    return true;
  }
  // decrease the frequency to 1/4 when calculating 13C NMR
  const decay = type === 'H' ? 1 : 4;
  return meta.freq < minFreq / decay
    || meta.freq > maxFreq / decay
    || !solventsInfo[meta.solvent];
}
