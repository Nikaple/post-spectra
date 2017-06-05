import { sample, sampleSize, fill } from 'lodash';

const mockDataTail = '.';

const mockH1Head = [
  '1H NMR (400 MHz, cdcl3) δ ',
  '1H NMR (600 MHz, cdcl3) δ ',
  '1H NMR (400 MHz, dmso) δ ',
  '1H NMR (500 MHz, dmso) δ ',
  '1H NMR (400 MHz, cd3od) δ ',
  '1H NMR (300 MHz, c6d6) δ ',
  '1H NMR (400 MHz, d2o) δ ',
];
const mockH1Peak = [
  '15.91 (s, 1H)',
  '15.71 (s, J = 2.2 Hz, 2H)',
  '15.51 - 15.44 (s, 3H)',
  '15.31 (d, J = 7.7 Hz, 1H)',
  '15.21 (d, 1H)',
  '15.11 - 14.99 (t, J = 6.6 Hz, 2H)',
  '15.01 - 15.00 (d, J = 12.0 Hz, 3H)',
  '14.91 (m, 1H)',
  '14.51 - 14.71 (m, 3H)',
  '14.31 – 14.29 (m, 1H)',
  '14.11 (dd, J = 12.1, 2.3 Hz, 3H)',
  '13.91 (dd, J = 4.2 Hz, 3H)',
  '12.71 (qq, J = 12.1, 2.3 Hz, 3H)',
];

export const mockH1Data = mockH1Peak
  .map(data => `${sample(mockH1Head)}${data}${mockDataTail}`)
  .join('\n');

const mockC13Head = [
  '13C NMR (100 MHz, cdcl3) δ ',
  '13C NMR (150 MHz, cdcl3) δ ',
  '13C NMR (100 MHz, dmso) δ ',
  '13C NMR (125 MHz, dmso) δ ',
  '13C NMR (100 MHz, cd3od) δ ',
  '13C NMR (75 MHz, c6d6) δ ',
  '13C NMR (100 MHz, d2o) δ ',
];

const mockC13Peak = fill(Array(400), 0).map(data => (160 * Math.random()).toFixed(2));

export const mockC13Data = mockC13Head
.map((head) => {
  return `${head}${sampleSize(mockC13Peak, 20).join(', ')}${mockDataTail}`;
})
.join('\n');

export const mockMassData = {
  formula: 'C8H16O5BrCl2S2',
  hrmsData: '405.9081',
  mmol: '0.5',
  yield: '50',
};
