const peak = '\\d+\\.\\d*';
const peakStrict = '\\d{1,3}\\.\\d{1,2}';
const dataTail = '\\s*[\\s,.;，。；]';
const negative = `(?!\\s*${peak})`;
const positive = `(?=\\s*${peak})`;
const positiveStrict = `(?=${peakStrict})`;
const commaBase = '[,，]';
const comma = ` *${commaBase} *`;
const commaStrict = `${commaBase} `;

// match h1data
const h1Head = '1H NMR.+?';
const h1EndingBeforeTail = '\\dH\\)';

const h1Reg = new RegExp(
  `${h1Head}${h1EndingBeforeTail}${dataTail}${negative}`, 'g');
const h1RegStrict = h1Reg;

// match c13data
const c13Head = '13C NMR.+?';
const c13MHz = 'MHz.+?';
const c13Optional = '(\\(\\d+C?\\))?';

const c13Reg = new RegExp(
`${c13Head}${c13MHz}${peak}${c13Optional}${dataTail}${negative}`, 'g');
const c13RegStrict = c13Reg;

// h1 splitter
const ppm = '(?:\\(ppm\\))?';
const splitHeadAndPeak = `:?\\s*δ\\s*=?\\s*${ppm}`;
const splitHeadAndPeakStrict = `:? δ (?:= )?${ppm}`;
const splitH1Comma = `\\)\\s*${comma}\\s*`;
const splitH1CommaStrict = `\\)${comma} `;

const h1Split = new RegExp(
  `${splitHeadAndPeak}|${splitH1Comma}`);
const h1SplitStrict = new RegExp(
  `${splitHeadAndPeakStrict}|${splitH1CommaStrict}`);

// c13 splitter
const c13Split = new RegExp(
  `${splitHeadAndPeak}|${comma}${positive}`);
const c13SplitStrict = new RegExp(
  `${splitHeadAndPeakStrict}|${commaStrict}${positiveStrict}`);

// determine nucleo type
const nucleo = /1\s?(H)|13\s?(C)(?:\s?NMR)/;
const nucleoStrict = /1(H)|13(C)(?: NMR)/;

// determine frequency
const freq = /(\d+) *MHz/;
const freqStrict = /(\d{2,3}) MHz/;

// determine solvent
const solvent = /(dmso|cdcl3|cd3od|c6d6|d2o)(?:[–−-]d\d)?/i;
const solventStrict = solvent;

// determine data tail
const tail = new RegExp(`${dataTail}^`);
const tailStrict = tail;

// match '7.63 (d, J = 7.9, 1.2, 1.4 Hz, 1H)'
const h1PeakStrict = '\\d{1,2}\\.\\d{2}';
const concaterJ = ' *\\((\\w+), J *= *';
const concaterJStrict = ' \\((\\w+), J = ';
const jNum = '(\\d+\\.?\\d*)';
const jNumStrict = '(\\d{1,2}\\.\\d)';
const nonCaptureComma = '(?:, *)?';
const nonCaptureCommaStrict = '(?:, )?';
const concaterHz = ' *(?:Hz)? *, *';
const concaterHzStrict = ' Hz, ';
const hydrogenCount = '(\\d+)H';

const h1PeakWithJs = new RegExp(
`(${peak})${concaterJ}${jNum}${nonCaptureComma}${jNum}?${nonCaptureComma}` + 
`${jNum}?${concaterHz}${hydrogenCount}`);
const h1PeakWithJsStrict = new RegExp(
`(${h1PeakStrict})${concaterJStrict}${jNumStrict}${nonCaptureComma}${jNumStrict}?` + 
`${nonCaptureComma}${jNumStrict}?${concaterHzStrict}${hydrogenCount}`);

// match 7.80 - 7.55 (m, 3H)
const hyphen = ' *[–−-] *';
const hyphenStrict = ' [–−-] ';
const parenthesisLeft = ' *\\( *';
const parenthesisLeftStrict = ' \\(';
const h1PeakWithoutJs = new RegExp(
`(${peak}(${hyphen}${peak})?)${parenthesisLeft}(\\w+)${comma}(?:${hydrogenCount})`);
const h1PeakWithoutJsStrict = new RegExp(
`(${h1PeakStrict}(${hyphenStrict}${h1PeakStrict})?)${parenthesisLeftStrict}` + 
`(\\w+)${commaStrict}(?:${hydrogenCount})`);

interface RegExes {
  [key: string]: [RegExp, RegExp];
}

// 0: not strict mode
// 1: strict mode
export const nmrRegex: RegExes = {
  h1: [h1Reg, h1RegStrict],
  c13: [c13Reg, c13RegStrict],
  h1Split: [h1Split, h1SplitStrict],
  c13Split: [c13Split, c13SplitStrict],
  nucleo: [nucleo, nucleoStrict],
  freq: [freq, freqStrict],
  tail: [tail, tailStrict],
  solvent: [solvent, solventStrict],
  h1PeakWithJs: [h1PeakWithJs, h1PeakWithJsStrict],
  h1PeakWithoutJs: [h1PeakWithoutJs, h1PeakWithoutJsStrict],
};
