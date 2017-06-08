import { sample, sampleSize, fill } from 'lodash';

const mockDataTail = '.';

const mockH1Head = [
  '1H NMR (400 MHz, cdcl3) δ ',
  '1H NMR (400 MHz, cdcl3) δ ',
  '1H NMR (400 MHz, dmso) δ ',
  '1H NMR (400 MHz, dmso) δ ',
  '1H NMR (400 MHz, cd3od) δ ',
  '1H NMR (400 MHz, c6d6) δ ',
  '1H NMR (400 MHz, d2o) δ ',
];
const mockH1Peak = [
  '15.91 (s, 1H)',
  '15.81(s, 1H)',
  '15.71(s,1H)',
  '15.61  (s,  1H)',
  '15.51 (s, 88H)',
  '15.41 (s, J = 2.2 Hz, 2H)',
  '14.91 - 14.94 (s, 3H)',
  '14.41 (d, J = 7.7 Hz, 1H)',
  '13.91 (d, 1H)',
  '13.41 - 13.29 (t, J = 6.6 Hz, 2H)',
  '12.91 - 12.90 (d, J = 12.0 Hz, 3H)',
  '11.91 (m, 1H)',
  '11.41 - 11.61 (m, 3H)',
  '10.91 – 10.29 (m, 1H)',
  '10.41 (dd, J = 12.1, 2.3 Hz, 3H)',
  '9.91 (dd, J = 4.2 Hz, 3H)',
  '9.41 (qq, J = 12.1, 2.3 Hz, 3H)',
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

const mockC13Peak = fill(Array(400), 0).map((data) => {
  const rnd = Math.random();
  let head;
  if (rnd < 0.7) {
    head = (160 * Math.random()).toFixed(2);
  } else if (rnd < 0.85) {
    head = (160 * Math.random()).toFixed(1);
  } else {
    head = (160 * Math.random()).toFixed(1);
  }
  const dataTail = ['()', '(1)', '(2C)', '6C)'];
  let tail = '';
  if (Math.random() < 0.5) {
    tail = dataTail[Math.floor(dataTail.length * Math.random())] ;
  }
  return head + tail;
});

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

export const mockRealData = `(6-methyl-3-phenylquinolin-2-yl)(phenyl)methanone (4a)\
Yield 72%; 232.8 mg; yellow solid; mp 94–96℃; IR (KBr): 1673, 1618, 1198, cm–1; 1H NMR (600 MHz, \
CDCl3) δ 8.18 (s, 1H), 8.07 (s,1H), 7.87(s, 2H), 7.69 (s, 1H), 7.61 (d, \
J = 8.4 Hz, 1H),7.53 (t, J = 7.8 Hz, 1H), 7.41- 7.37 (m, 4H), 7.33 – 7.28 (m, 3H), 2.59 (s, 3H). \
13C NMR (150 MHz, CDCl3) δ 195.2, 155.3, 144.6, 138.1, 137.9, 136.5, 136.2, 134.0, 133.5, 132.5,\
 130.5, 129.3, 128.9, 128.6, 128.4, 128.1, 127.8, 126.5, 21.8 . HRMS (ESI): m/z [M+H]+ calcd for\
  C23H18NO: 324.1383; found: 324.1379.
 
(6-methyl-3-phenylquinolin-2-yl)(p-tolyl)methanone (4b) 
Yield 65%;219.3 mg; yellow solid; mp 63–65℃; IR (KBr): 1168, 1603, 904,829, 757, 738, 700 cm–1; \
1H NMR (600 MHz, CDCl3) δ 8.14 (s, 1H), 8.05 (d, J = 8.4 Hz, 1H), 7.77 (d, J = 7.8 Hz, 2H), 7.65 (\
s, 1H), 7.57 (d, J = 8.4 Hz, 1H), 7.38 (d, J = 6.6 Hz, 2H), 7.32 – 7.23 (m, 3H), 7.17 (d, J = 8.\
4 Hz, 2H), 2.55 (s, 3H), 2.35 (s, 3H).  13C NMR (150 MHz, CDCl3) δ 194.8, 155.5, 144.5, 144.3\
, 137.91, 137.87, 136.3, 133.9, 133.7, 132.3, 130.5, 129.2, 129.0, 128.9, 128.5, 128.0, 127.7\
, 126.4, 21.72, 21.65 ; HRMS(ESI): m/z [M+H]+ calcd for C24H20NO: 338.1539; found: 338.1537.
 
(4-methoxyphenyl)(6-methyl-3-phenylquinolin-2-yl)methanone (4c)
Yield 69%; 243.8 mg; yellow oil; IR (KBr): 1662, 1593, 1317,1264, 1153, 703 cm–1; 1H NMR (600 \
MHz, CDCl3) δ 8.14 (s, 1H), 8.05 (d, J = 9.0 Hz, 1H), 7.85 (d, J = 9.0 Hz, 2H), 7.65 (s, 1H), \
7.57 (d, J = 8.4 Hz, 1H), 7.39 (d, J = 7.2 Hz, 2H), 7.32 – 7.26 (m, 3H), 6.85 (d, J = 8.4 Hz, \
2H), 3.80 (s, 3H), 2.55 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 193.8, 163.7, 155.6, 144.5, 137.\
9, 137.8, 136.3, 133.8, 132.8, 132.3, 129.3, 129.1, 128.8, 128.4, 128.0, 127.7, 126.4, 113\
.6, 55.4, 21.7 , HRMS(ESI): m/z [M+H]+ calcd for C24H20NO2:354.1489; found: 354.1483.
 
(4-ethoxyphenyl)(6-methyl-3-phenylquinolin-2-yl)methanone (4d)
Yield 65%; 238.8 mg; yellow oil; IR (KBr): 1664, 1597, 1257,1150, 699 cm–1; 1H NMR (600 MHz\
, CDCl3) δ 8.16 (s, 1H), 8.06 (d, J = 9.0 Hz, 1H), 7.84 (d, J = 9.0 Hz, 2H), 7.67 (s, 1H),\
 7.60 (d, J = 8.4 Hz, 1H), 7.39 (d, J = 7.2 Hz, 2H), 7.33 – 7.28 (m, 3H), 6.85 (d, J = 9.0 H\
 z, 2H), 4.09 – 4.04 (m, 2H), 2.59 (s, 3H), 1.42 (t, J = 7.2 Hz, 3H).  13C NMR (150 MHz, CDCl3)\
  δ 193.9, 163.3, 155.8, 144.6, 138.0, 137.9, 136.4, 133.9, 132.9, 132.4, 129.2, 129.1, 128.9, 12\
8.5, 128.1, 127.8, 126.5, 114.1, 63.7, 21.7, 14.6  , HRMS(ESI): m/z [M+H]+ calcd for C25H22\
NO2: 368.1645; found: 368.1639.

benzo[d][1,3]dioxol-5-yl(6-methyl-3-phenylquinolin-2-yl)methanone (4e)
Yield 63%; 231.5mg; yellow solid; mp 72–74℃; IR (KBr): 1662, 1486, 1443,1264, 1240, 744 cm–1; 1H\
 NMR (600 MHz, CDCl3) δ 8.14 (s, 1H), 8.05 (d, J = 8.4 Hz, 1H), 7.65 (s, 1H), 7.58 (d, J = 8.4 Hz\
 , 1H), 7.40 (s, 1H), 7.38 (d, J = 7.8 Hz, 3H), 7.33 – 7.28 (m, 3H), 6.74 (d, J = 7.8 Hz, 1H), 5.98\
  (s, 2H), 2.56 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 193.4, 155.4, 152.2, 148.0, 144.5, 138.0, 137.9\
  , 136.4, 133.8, 132.4, 131.0, 129.1, 128.8, 128.5, 128.0, 127.9, 127.8, 126.4, 109.3, 107.8, \
  101.8, 21.7  ; HRMS(ESI): m/z [M+H]+ calcd for C24H18NO3: 368.1281; found: 368.1286.
 
(6-methyl-3-phenylquinolin-2-yl)(4-nitrophenyl)methanone (4f)
Yield 68%; 250.5 mg; yellow solid; mp 203–205℃; IR (KBr): 1682, 1517, 1345,700, cm–1; 1H NMR (600\
 MHz, CDCl3) δ 8.24 (d, J = 8.4 Hz, 2H), 8.21 (s, 1H), 8.05 (d, J = 8.4 Hz, 3H), 7.71 (s, 1H), 7.64\
  (d, J = 8.4 Hz, 1H), 7.36 – 7.31 (m, 5H), 2.61 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 193.2, 153.7,\
   150.2, 144.6, 141.0, 138.9, 137.6, 136.9, 134.3, 132.9, 131.3, 129.3, 128.9, 128.7, 128.4, 128.1\
   , 126.5, 123.5, 21.8. HRMS(ESI): m/z [M+H]+ calcd for C23H17N2O3: 369.1234; found: 369.1236.
 
(6-methyl-3-phenylquinolin-2-yl)(3-nitrophenyl)methanone(4g)
Yield 63%; 232.1 mg; yellow solid; mp 88–90℃; IR (KBr): 1668, 903, 701 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.17 (s, 1H), 8.06 (d, J = 8.4 Hz, 1H), 7.87 (d, J = 7.8 Hz, 2H), 7.67 (s, 1H), 7.60 (d, J = 8.4 Hz, 1H), 7.52 (t, J = 7.2 Hz, 1H), 7.39 (t, J = 7.2 Hz, 4H), 7.31 (t, J = 7.2 Hz, 2H), 2.58 (s, 3H).  13C NMR (150 MHz, CDCl3) δ 195.2, 155.3, 144.6, 138.1, 137.9, 136.4, 136.2, 134.0, 133.4, 132.5, 130.4, 129.3, 129.2, 128.9, 128.5, 128.3, 128.1, 127.9,127.8, 126.5, 21.7. HRMS(ESI): m/z [M+H]+ calcd for C22H14N2O3: 354.0999; found: 354.0992.\n
(4-chlorophenyl)(6-methyl-3-phenylquinolin-2-yl)methanone (4h)
Yield 72%; 257.6 mg; yellow solid; mp 110–112℃; IR (KBr): 1674, 1584, 906,829, 702 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.17 (s, 1H), 8.06 (d, J = 8.4 Hz, 1H), 7.82 (d, J = 9.0 Hz, 2H), 7.68 (s, 1H), 7.61 (d, J = 8.4 Hz, 1H), 7.38 – 7.34 (m, 4H), 7.34 – 7.29 (m, 3H), 2.58 (s, 3H).  13C NMR (150 MHz, CDCl3) δ 193.8, 154.6, 144.5, 139.9, 138.4, 137.7, 136.7, 134.6, 134.0, 132.6, 131.8, 129.2, 128.9, 128.7, 128.6, 128.2, 127.9, 126.5, 21.8. HRMS(ESI): m/z [M+H]+ calcd for C23H17ClNO: 358.0993; found: 358.0990.
 
 (3,4-dichlorophenyl)(6-methyl-3-phenylquinolin-2-yl)methanone (4i)
Yield 63%; 247.1 mg; yellow solid; mp 133–135℃; IR (KBr): 1679, 1642, 1292,828, 774, 703 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.19 (s, 1H), 8.06 (d, J = 8.4 Hz, 1H), 7.99 (s, 1H), 7.73 (d, J = 7.8 Hz, 1H), 7.70 (s, 1H), 7.63 (d, J = 7.8 Hz, 1H), 7.49 (d, J = 7.8 Hz, 1H), 7.35 (s, 5H), 2.60 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 192.7, 153.9, 144.5, 138.7, 138.0, 137.7, 136.8, 135.9, 134.2, 132.7, 132.2, 130.5, 129.5, 129.3, 128.9, 128.8, 128.7, 128.3, 128.0, 126.5, 21.8. HRMS(ESI): m/z [M+H]+ calcd for C23H16Cl2NO: 392.0603; found: 392.0608.
 
(4-bromophenyl)(6-methyl-3-phenylquinolin-2-yl)methanone (4j)
Yield 73%; 293.7 mg; yellow solid; mp 123–125℃; IR (KBr): 1674, 1639, 1584,905, cm–1; 1H NMR (600 MHz, CDCl3) δ 8.17 (s, 1H), 8.05 (d, J = 8.4 Hz, 1H), 7.75 (d, J = 8.4 Hz, 2H), 7.67 (s, 1H), 7.60 (d, J = 7.8 Hz, 1H), 7.53 (d, J = 8.4 Hz, 2H), 7.38 – 7.28 (m, 5H), 2.58 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 194.0, 154.6, 144.5, 138.3, 137.7, 136.6, 135.0, 134.0, 132.6, 131.9, 131.7, 129.2, 128.9, 128.8, 128.6, 128.2, 127.9, 126.5, 21.7. HRMS(ESI): m/z [M+H]+ calcd for C23H17BrNO: 402.0488; found: 402.0486.
 
(6-methyl-3-phenylquinolin-2-yl)(naphthalen-1-yl)methanone (4k)
Yield 61%; 227.8 mg; yellow oil; IR (KBr): 1665, 904, 827,779, 698cm–1; 1H NMR (600 MHz, CDCl3) δ 8.94 (d, J = 8.4 Hz, 1H), 8.13 (s, 1H), 8.07 (d, J = 8.4 Hz, 1H), 7.91 (d, J = 8.4 Hz, 1H), 7.79 (d, J = 8.4 Hz, 1H), 7.67 (d, J = 7.2 Hz, 1H), 7.64 (s, 1H), 7.58 – 7.53 (m, 2H), 7.48 (t, J = 7.8 Hz, 1H), 7.38 (d, J = 7.2 Hz, 2H), 7.32-7.28 (m, 1H), 7.18 (t, J = 7.2 Hz, 2H), 7.12 (t, J = 7.2 Hz, 1H), 2.55 (s, 3H). 13C NMR (150 MHz, CDCl3) δ197.1, 156.5, 144.6, 138.1, 138.0, 136.6, 134.2, 133.9, 133.7, 133.2, 132.4, 131.2, 130.4, 129.3, 128.7, 128.4, 128.21, 128.18, 128.1, 127.5, 126.4, 126.3, 126.2, 123.9, 21.7. HRMS(ESI): m/z [M+H]+ calcd for C27H20NO: 374.1539; found: 374.1537.
 
 (6-methyl-3-phenylquinolin-2-yl)(thiophenmethanone (4l)
Yield 58%; 191.1 mg; red solid; mp 198–200℃; IR (KBr): 1638, 1411, 833,736, cm–1; 1H NMR (600 MHz, CDCl3) δ 8.15 (s, 1H), 8.11 (d, J = 8.4 Hz, 1H), 7.75 – 7.69 (m, 2H), 7.67 (s, 1H), 7.62 (d, J = 8.4 Hz, 1H), 7.43 – 7.33 (m, 5H), 7.11 (t, J = 3.6 Hz, 1H), 2.59 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 186.7, 154.1, 144.4, 143.0, 138.5, 138.2, 137.0, 136.1, 135.5, 134.1, 132.5, 129.3, 128.9, 128.5, 128.4, 128.0, 127.8, 126.5, 21.8. HRMS(ESI): m/z [M+H]+ calcd for C21H 16NOS: 330.0947; found: 330.0944.
 
furan-2-yl(6-methyl-3-phenylquinolin-2-yl)methanone(4m)
Yield 60%; 188.0 mg; yellow solid; mp 156–158℃; IR (KBr): 1651, 1461, 872,774, 702 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.14 (s, 1H), 8.08 (d, J = 8.4 Hz, 1H), 7.65 (s, 1H), 7.62 – 7.58 (m, 2H), 7.41 -7.38 (m, 2H), 7.35 (t, J = 7.2 Hz, 2H), 7.33 – 7.29 (m, 1H), 7.19 (d, J = 9.0 Hz, 1H), 6.51 – 6.48 (m, 1H), 2.56 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 182.2, 153.7, 152.0, 147.7, 144.5, 138.4, 137.9, 136.7, 134.0, 132.5, 129.2, 128.8, 128.5, 128.3, 127.7, 126.4, 122.2, 112.4, 21.7. HRMS(ESI): m/z [M+H]+ calcd for C21H16NO2: 314.1176; found: 314.1180.
 
benzofuran-2-yl(6-methyl-3-phenylquinolin-2-yl)methanone (4n)
Yield 65%; 236.2 mg; yellow solid; mp 164–166℃; IR (KBr): 1665, 1626, 892,743, 702 cm–1;  1H NMR (600 MHz, CDCl3) δ 8.17 (s, 1H), 8.11 (d, J = 8.4 Hz, 1H), 7.69 (s, 1H), 7.66 (d, J = 7.8 Hz, 1H), 7.63 – 7.61 (m, 1H), 7.57 – 7.53 (m, 2H), 7.47 – 7.41 (m, 3H), 7.34 (t, J = 7.2 Hz, 2H), 7.31 – 7.27 (m, 2H), 2.59 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 184.0, 156.1, 153.5, 152.0, 144.5, 138.6, 137.8, 136.9, 134.2, 132.6, 129.3, 128.9, 128.62, 128.60, 128.4, 127.8, 127.1, 126.5, 123.8, 123.50, 118.4, 112.5, 21.8. HRMS(ESI): m/z [M+H]+ calcd for C25H18NO2: 364.1332; found: 364.1322.
  (6-methoxy-3-phenylquinolin-2-yl)(phenyl)methanone (4o)
Yield 71%; 241.0 mg; yellow solid; mp 145–147℃; IR (KBr): 1675, 1621, 1214 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.14 (s, 1H), 8.06 (d, J = 9.6 Hz, 1H), 7.88 (d, J = 7.8 Hz, 2H), 7.52 (t, J = 7.2 Hz, 1H), 7.43 – 7.37 (m, 5H), 7.32 – 7.27 (m, 3H), 7.17 – 7.15 (m, 1H), 3.96 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 195.2, 158.9, 153.6, 142.1, 137.9, 136.3, 135.9, 134.5, 133.3, 131.1, 130.5, 129.3, 128.9, 128.5, 128.3, 127.8, 123.1, 104.8, 55.6. HRMS(ESI): m/z [M+H]+ calcd for C23H18NO 2:340.1332; found: 340.1330.
 
 (6-isopropyl-3-phenylquinolin-2-yl)(phenyl)methanone (4p)
Yield 60%; 210.9 mg; red oil; IR (KBr): 1674, 1596, 1488,1449, 1287, 915, 835, 765, 716, 697 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.21 (s, 1H), 8.11 (d, J = 8.4 Hz, 1H), 7.87 (d, J = 7.8 Hz, 2H), 7.71 (s, 1H),7.68 (d, J = 8.4 Hz, 2H), 7.50 (t, J = 7.2 Hz, 1H), 7.39 – 7.35 (m, 4H), 7.31 – 7.27 (m, 3H), 3.16 – 3.10 (m, 1H), 1.37 (d, J = 7.2 Hz, 6H). 13C NMR (150 MHz, CDCl3) δ 195.1, 155.3, 148.7, 144.8, 137.8, 136.8, 136.1, 133.9, 133.4, 130.4, 130.1, 129.4, 128.9, 128.5, 128.3, 128.1, 127.7, 123.7, 34.1, 23.7. HRMS(ESI): m/z [M+H]+ calcd for C25H22NO: 352.1696; found: 352.1689.
 
ethyl 2-benzoyl-3-phenylquinoline-6-carboxylate (4q)
Yield 68%; 259.4 mg; yellow solid; mp 97–99℃; IR (KBr): 1711, 1678, 1622,1274, 1253, 756, 700,691 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.70 (s, 1H), 8.40 – 8.34 (m, 2H), 8.22 (d, J = 9.0 Hz, 1H), 7.87 (d, J = 8.4 Hz, 2H), 7.55 (t, J = 7.8 Hz, 1H), 7.43 – 7.37 (m, 4H), 7.35 – 7.29 (m, 3H), 4. 51 – 4.45 (m, 2H), 1.47 (t, J = 7.2 Hz, 3H). 13C NMR (150 MHz, CDCl3) δ 194.7, 165.8, 158.2, 147.6, 138.3, 137.0, 135.7, 134.7, 133.7, 130.7, 130.4, 129.8, 129.6, 129.5, 128.9, 128.7, 128.5, 128.2, 127.2, 61.5, 14.3. HRMS(ESI): m/z [M+H]+ calcd for C25H20NO3: 382.1438; found: 382.1435.
 
2-benzoyl-3-phenylquinoline-6-carbonitrile (4r)
Yield 66%; 220.7 mg; yellow solid; mp 163–165℃; IR (KBr): 1684, 1618, 1595,1273, 917, 718, 698 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.36 – 8.31 (m, 2H), 8.26 (d, J = 9.0 Hz, 1H), 7.90 (d, J = 8.4 Hz, 1H), 7.85 (d, J = 7.8 Hz, 2H), 7.58 (t, J = 7.2 Hz, 1H), 7.43 (t, J = 7.2 Hz, 2H), 7.39 – 7.32 (m, 5H).  13C NMR (150 MHz, CDCl3) δ 194.3, 159.1, 146.7, 137.24, 136.5, 135.7, 135.5, 134.0, 133.9, 131.1, 130.6, 130.3, 129.1, 128.9, 128.8, 128.6, 128.5, 127.3, 118.3, 111.6. HRMS(ESI): m/z [M+H]+ calcd for C23H15N2O: 335.1179; found: 335.1170.
 
 (3-(3-methoxyphenyl)-6-methylquinolin-2-yl)(phenyl)methanone (4s)
Yield 62%; 219.1 mg; yellow solid; mp 128–130℃; IR (KBr): 1668, 1608, 1287 cm–1; 1H NMR (300 MHz, CDCl3) δ 8.15 (s, 1H), 8.07 – 8.02 (m, 1H), 7.90 – 7.84 (m, 2H), 7.64 (s, 1H), 7.59 – 7.54 (m, 1H), 7.53 – 7.46 (m, 1H), 7.40 – 7.33 (m, 2H), 7.22 – 7.15 (m, 1H), 6.97 – 6.90 (m, 2H), 6.82 – 6.77 (m, 1H), 3.64 (s, 3H), 2.54 (s, 3H). 13C NMR (75 MHz, CDCl3) δ 195.1, 159.4, 155.3, 144.6, 139.1, 138.0, 136.23, 136.15, 133.7, 133.4, 132.4, 130.3, 129.5, 129.1, 128.3, 128.0, 126.4, 121.3, 114.3, 113.6, 55.0, 21.6. HRMS(ESI): m/z [M+H]+ calcd for C24H20NO2: 354.1489; found: 354.1485.
 
 (6-methyl-3-(p-tolyl)quinolin-2-yl)(phenyl)methanone (4t)
Yield 60%; 202.4 mg; red solid; mp 108–110℃; IR (KBr): 1671, 1652, 1645,1634, 907, 829 cm–1; 1H NMR (600 MHz, CDCl3) δ 8.15 (s, 1H), 8.06 (d, J = 8.4 Hz, 1H), 7.89 (d, J = 7.8 Hz, 2H), 7.66 (s, 1H), 7.60 – 7.56 (m, 1H), 7.53 (d, J = 7.2 Hz, 1H), 7.39 (t, J = 7.8 Hz, 2H), 7.27 (d, J = 7.8 Hz, 2H), 7.11 (d, J = 7.8 Hz, 2H), 2.57 (s, 3H), 2.31 (s, 3H).  13C NMR (150 MHz, CDCl3) δ 195.2, 155.3, 144.3, 138.0, 137.6, 136.4, 136.1, 134.9, 134.0, 133.4, 132.3, 130.5, 129.3, 129.1, 128.8, 128.3, 128.2, 126.4, 21.7, 21.1. HRMS(ESI): m/z [M+H]+ calcd for C24H20NO: 338.1539; found: 338.1536.
 
(3-benzyl-6-methylquinolin-2-yl)(phenyl)methanone (4u)
Yield 80%; 269.9 mg; yellow solid; mp 72–74℃; IR (KBr): 1677, 1597, 1494,1288, 917, 835, 724, 686 cm–1; 1H NMR (600 MHz, CDCl3) δ 7.96 (d, J = 8.4 Hz, 1H), 7.87 (s, 1H), 7.81 (d, J = 7.2 Hz, 2H), 7.51 (d, J = 8.4 Hz, 3H), 7.36 (t, J = 7.8 Hz, 2H), 7.15 (t, J = 7.2 Hz, 2H), 7.12 – 7.06 (m, 3H), 4.22 (s, 2H), 2.51 (s, 3H). 13C NMR (150 MHz, CDCl3) δ 195.4, 155.6, 143.9, 139.0, 137.8, 136.4, 136.0, 133.4, 132.8, 131.8, 130.6, 129.4, 129.0, 128.4, 128.3, 128.2, 126.3, 126.1, 37.7, 21.6. HRMS(ESI): m/z [M+H]+ calcd for C24H20NO: 338.1539; found: 338.1545.
 
(3,6-dimethylquinolin-2-yl)(phenyl)methanone (4v)
Yield 85%; 222.1 mg; yellow solid; mp 134–136℃; IR (KBr): 1663, 1291, 908,830, 728 cm–1;  1H NMR (600 MHz, CDCl3) δ 7.97 – 7.92 (m, 3H), 7.91 (s, 1H), 7.55 (t, J = 7.2 Hz, 1H), 7.51 (s, 1H), 7.49 – 7.46 (m, 1H), 7.42 (t, J = 7.8 Hz, 2H), 2.50 (s, 3H), 2.47 (s, 3H).  13C NMR (150 MHz, CDCl3) δ 195.3, 155.5, 143.8, 137.6, 136.4, 135.9, 133.5, 131.4, 130.5, 128.9, 128.8, 128.3, 125.6, 21.5, 18.4. HRMS(ESI): m/z [M+H]+ calcd for C18H16NO: 262.1226; found: 262.1231.
 
(3-ethyl-6-methylquinolin-2-yl)(phenyl)methanone (4w)
Yield 82%; 225.8 mg; yellow solid; mp 106–108℃; IR (KBr): 1664, 1289, 1173, 912, 832, 732, 661 cm–1; 1H NMR (600 MHz, CDCl3) δ 7.82 (d, J = 7.8 Hz, 2H), 7.79 (d, J = 7.2 Hz, 2H), 7.42 – 7.38 (m, 2H), 7.35 – 7.32 (m, 1H), 7.27 (t, J = 7.8 Hz, 2H), 2.72 – 2.66 (m, 2H), 2.35 (s, 3H), 1.10 (t, J = 7.8 Hz, 3H). 13C NMR (150 MHz, CDCl3) δ 195.3, 155.5, 143.7, 137.4, 136.0, 134.8, 134.7, 133.4, 131.4, 130.4, 128.8, 128.4, 128.2, 125.8, 24.8, 21.5, 14.9. HRMS(ESI): m/z [M+H]+ calcd for C20H18NO: 276.1383; found: 276.1389.
 
(6-methyl-3-pentylquinolin-2-yl)(phenyl)methanone (4x)
Yield 77%; 244.4 mg; red solid; mp 59–61℃; IR (KBr): 1674, 1651, 1597, 1283, 1171, 915, 719, 701 cm–1; 1H NMR (600 MHz, CDCl3) δ 7.86 – 7.82 (m, 2H), 7.80 (d, J = 7.2 Hz, 2H), 7.44 – 7.39 (m, 2H), 7.35 (d, J = 7.8 Hz, 1H), 7.29 (t, J = 7.2 Hz, 2H), 2.68 (t, J = 7.8 Hz, 2H), 2.38 (s, 3H), 1.53 – 1.45 (m, 2H), 1.12 (s, 4H), 0.70 – 0.64 (m, 3H).    13C NMR (150 MHz, CDCl3) δ 195.3, 155.7, 143.7, 137.4, 136.1, 135.6, 133.7, 133.4, 131.4, 130.5, 128.9, 128.7, 128.3, 125.8, 31.6, 31.3, 30.4, 22.2, 21.5. 13.8, HRMS(ESI): m/z [M+H]+ calcd for C22H24NO: 318.1852; found: 318.1857.
`;
