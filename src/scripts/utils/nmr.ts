import { map, head, tail, split, some, includes, trimEnd, chain, last, initial } from 'lodash';
import { minFreq, maxFreq, solventsInfo } from './constants';
import { nmrRegex } from './regex';
import { highlightData } from './utils';


export type Nucleo = 'H'|'C';
export type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq'|'br'
  |'br s'|'br d'|'brs'|'brd'|'quint'|'sext'|'hept'|'tq'|'dddd';
export type C13Data = string|null;

type JCountType = {
  [key: string]: number;
};
// tslint:disable-next-line:variable-name
export const JCount: JCountType = {
  d: 1,
  t: 1,
  q: 1,
  quint: 1,
  sext: 1,
  hept: 1,
  br: 1,
  brs: 1,
  'br s': 1,
  dd: 2,
  dt: 2,
  td: 2,
  dq: 2,
  'br d': 2,
  brd: 2,
  tq: 2,
  ddd: 3,
  ddt: 3,
  dddd: 4,
};

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
  Js: number[]|null;
  hydrogenCount: number;
  danger?: boolean; // highlight to red or not
  warning?: boolean; // highlight to yellow or not
  peakTypeError?: boolean; // peakType error or not  
  errMsg?: string; // message on hover
}

export interface H1RenderObj {
  meta: Metadata;
  peak: H1Data[];
  tail: string;
}

interface ParsedData {
  peakData: string[][];
  metadataArr: (Metadata|null)[];
  tailArr: string[];
}

export interface C13RenderObj {
  meta: Metadata;
  peak: C13Data[];
  tail: string;
}


/**
 * return if the peak is peak
 * 
 * @export
 * @param {Multiplet} peak
 * @returns 
 */
export function isPeak(peak: Multiplet) {
  const peakLookup: Multiplet[] = ['s', 'd', 't', 'q', 'dd', 'dt', 'td',
    'ddd', 'ddt', 'dq', 'br', 'm', 'br s', 'br d', 'brs', 'brd', 'quint',
    'sext', 'hept', 'tq', 'dddd'];
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
  const singlePeakLookup: Multiplet[] = ['s', 'br', 'br s', 'brs'];
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
export function isMultiplePeakWithJ(peak: Multiplet, isGeneral?: boolean) {
  const multiplePeakLookup: Multiplet[] = isGeneral
    ? ['d', 't', 'q', 'dd', 'dt', 'td', 'ddd', 'ddt', 'dq', 'brd', 'br d',
      'quint', 'sext', 'hept', 'tq', 'ddt', 'dddd', 'tq']
    : ['d', 't', 'q', 'brd', 'br d'];
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

export function handleNMRData(thisArg: any, type: Nucleo, isStrict: boolean): ParsedData | null {
  thisArg.matchedData = getDataArray(thisArg.inputtedData, type, isStrict);
  if (thisArg.matchedData === null) {
    thisArg.renderError(thisArg.errMsg.dataErr);
    return null;
  }
  const splittedDataArray = splitDataArray(thisArg.matchedData, type, isStrict);
  const rawTailArr = map(splittedDataArray, last);
  const tailArr = parseTailData(rawTailArr, isStrict);
  const describerArr: string[] = getDescriberArray(splittedDataArray);
  const metadataArr: (Metadata|null)[] = parseMetadata(describerArr, isStrict);
  if (some(metadataArr, metadata => isMetadataError(metadata, type))) {
    thisArg.renderError(thisArg.errMsg.infoErr);
    return null;
  }
  const rawPeakData = map(splittedDataArray, initial);
  const peakData: string[][] = getPeakDataArray(rawPeakData);
  return { peakData, metadataArr, tailArr };
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
      nmrReg = nmrRegex.h1[Number(isStrict)];
      break;
    }
    case 'C': { 
      nmrReg = nmrRegex.c13[Number(isStrict)];
      break;
    }
    default: { // falls back to 1H NMR on default
      nmrReg = nmrRegex.h1[Number(isStrict)];
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
 * split complete nmr data into pieces (describer + peak data + tail)
 * @example
 * // returns [[
 * // '1H NMR (400 MHz, cdcl3)',
 * // '11.46 (s, 1H),
 * // '8.60 (d, J = 8.2 Hz, 1H)',
 * // '8.54 (dd, J = 7.7, 1.2 Hz, 1H)',
 * // '7.37 – 7.29 (m, 1H)'
 * // '.'
 * // ]]
 * splitDataArray(['1H NMR (400 MHz, cdcl3) δ 11.46 (s, 1H), \
 *   8.60 (d, J = 8.2 Hz, 1H), 8.54 (dd, J = 7.7, 1.2 Hz, 1H), \
 *   7.37 – 7.29 (m, 1H).']);
 * @export
 * @param {string[]} dataArr 
 * @returns 
 */
function splitDataArray(dataArr: string[], type: Nucleo,isStrict: boolean) {
  const trimmedData = map(dataArr, (datum) => {
    const tail = datum.match(/\s*[\s,.;，。；]$/) as RegExpMatchArray;
    trimEnd(datum, ' ,.; ，。；');
    return { main: datum, tail: tail[0] };
  });
  const splitReg = type === 'H' ? nmrRegex.h1Split : nmrRegex.c13Split;
  return map(trimmedData, (datum) => {
    return [...split(datum.main, splitReg[Number(isStrict)]), datum.tail];
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
 * parseMetadata(['1H NMR (400 MHz, cdcl3)', '1H NMR (600 MHz, dmso)'])
 * @export
 * @param {string[]} describerArr 
 * @returns {((Metadata|null)[])} 
 */
function parseMetadata(describerArr: string[], isStrict: boolean): (Metadata|null)[] {
  return map(describerArr, (datum) => {
    const nucleo = datum.match(nmrRegex.nucleo[Number(isStrict)]);
    const freq = datum.match(nmrRegex.freq[Number(isStrict)]);
    const solvent = datum.match(nmrRegex.solvent[Number(isStrict)]);
    if (!nucleo || !freq || !solvent) {
      return null;
    }
    return {
      type: (nucleo[1] || nucleo[2]) as Nucleo,
      freq: +freq[1],
      solvent: solvent[1].toLowerCase(),
    };
  });
}

function parseTailData(tailArr: string[], isStrict: boolean): string[] {
  return map(tailArr, (tail) => {
    if (tail !== '.' && tail !== ';' && isStrict) {
      return highlightData(tail, HighlightType.Danger, '格式有误');
    }
    return tail;
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
