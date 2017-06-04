const mockH1Head = '1H NMR (400 MHz, cdcl3) δ ';
const mockH1Tail = '.';
const mockH1Peak = [
  '15.91 (s, 1H)',
  '15.71 (s, J = 2.2 Hz, 2H)',
  '15.51 - 15.44 (s, 3H)',
  '15.31 (d, J = 7.7 Hz, 1H)',
  '15.21 (d, 1H)',
  '15.11 - 14.99 (t, J = 6.6 Hz, 2H)',
  '14.91 (m, 1H)',
  '14.51 - 14.71 (m, 3H)',
  '14.31 – 14.29 (m, 1H)',
  '14.11 (dd, J = 12.1, 2.3 Hz, 3H)',
  '13.91 (dd, J = 4.2 Hz, 3H)',
  '12.71 (qq, J = 12.1, 2.3 Hz, 3H)',
];

export const mockH1Data = 
// `1H NMR (400 MHz, cdcl3) δ 13.71 - 12.71 (dd, J = 12.1, 2.3 Hz, 3H).`;
mockH1Peak.map(data => `${mockH1Head}${data}${mockH1Tail}`).join('\n');
// tslint:disable-next-line:max-line-length
const mockC13Data = `13C NMR (101 MHz, cdcl3) δ 167.62, 156.32, 150.71, 146.34, 134.60, 133.13, 132.33, 129.20, 128.40, 126.95, 124.13, 123.83, 123.57, 119.58, 82.51, 77.32, 77.00, 76.88, 76.68, 51.82.
13C NMR (151 MHz, cdcl3) δ 161.52, 160.79, 150.79, 138.47, 133.18, 130.09, 128.59, 128.34, 128.23, 125.64, 121.64, 112.94, 77.21, 77.00, 76.79.`;

const mockMassData = {
  formula: 'CH3COOH',
  mmol: 0.5,
  yield: 50,
};
