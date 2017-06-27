# Post Spectra

## [Preview](https://nikaple.github.io/) (Not compatible with `Internet Explorer`)

## 中文版说明单击[这里](https://github.com/Nikaple/post-spectra)

## TL;DR

This program accepts two kinds of data:
 - Original data, to be formatted;
 - Formatted data, to be validated.

## Basic usage

### Options

#### - Vague multiplets：Treat all peaks except br, s, br s, d, t, q as m peaks (complex multiplet).

#### - Auto fix *J*：Automatically round the value of coupling constants (J, mHz) to the multiple of frequency of spectroscopy (MHz). E.g. In a 400 MHz <sup>1</sup>H NMR, J = 7.7 Hz will be rounded to 7.6 Hz (7.6 Hz = 7600 mHz, and 7600 is multiple of 400); In a 600 MHz <sup>1</sup>H NMR, J = 7.7 Hz will be rounded to 7.8 Hz.

#### - Strict mode: Format detection is only available under strict mode. (See below for examples)

#### - Auto copy: Auto executing copy command on every input, this is really useful when handling with unformatted original data.

### NMR Data Processing (Using MestReNova as an example)

#### <sup>1</sup>H NMR Data Processing

After finished analyzing the spectra in `MestReNova`, click `Multiplets Analysis` in the tool bar to show coupling constants, then choose `copy` in its dropdown menu. Afterwards, paste the copied data to the program, and paste once again to your `Microsoft Word` **(do not copy here, which means you should paste two times simultaneously)**.

#### <sup>13</sup>C NMR Data Processing

After finished analyzing the spectra in `MestReNova`（记得**定标**）, click your <sup>13</sup>C NMR data, choose `Copy` from the dropdown menu of the tool bar button `Peak Peaking`. Afterwards, paste the copied data to the program, and paste once again to your `Microsoft Word` **(do not copy here, which means you should paste two times simultaneously)**.

### NMR Data Validation

Paste your formatted data directly to the program, and find your error according to the highlight!
  - Not even bold: the program did not recognize your data, if you are certain that your data is correct, please open an issue.
  - Green highlight:
    - Under strict mode, the data is determined to be correct.
    - Under unstrict mode, there may be format errors.
  - Yellow highlight: This piece of data is modified by program.
  - Red highlight: Data is incorrect, please refer to the error messages.
  - Only error message: Please check if your data begins with <sup>**1**</sup>**H/**<sup>**13**</sup>**C NMR** and ends with `.` or `;` (under strict mode).

### Basic Format of NMR Data

  - 2 decimals for <sup>1</sup>H NMR, and 1 decimal for <sup>13</sup>C NMR
  - Leave one space for number and unit (except %).
  - Only use one unit to describe one kind of data
    - √ 7.2, 2.0 Hz
    - × 7.2 Hz, 2.0 Hz
  - Add space on both sides of plus and equal, but you can choose not to add space on both sides of hyphen.

### HRMS Data Validation

The specification for this part came from JOC Style Guide. In a standard HRMS data, reported formula should include the ion in the mass spectroscope. For example, HRMS data of benzene should be reported as: HRMS (ESI/QTOF): m/z [M + H]<sup>+</sup> Calcd for C<sub>6</sub>H<sub>7</sub>, 79.0542; Found 79.0569.

> The reported molecular formulas and Calcd values should include any added atoms (usually H or Na). For example, HRMS (ESI/QTOF) m/z: [M + Na]+ Calcd for C13H17NO3Na, 258.1101; Found 258.1074.  ---- Journal of Organic Chemistry Style Guide

> A Found value within 0.003 m/z unit of the Calcd value of a parent-derived ion, together with other available data (including knowledge of the elements present in reactants and reagents) is usually adequate for supporting a molecular formula for compounds with molecular masses below 1000 amu.  ---- Journal of Organic Chemistry Style Guide

As the record methods for HRMS data varies, and there is no specific format for reporting such data, this program will only validate the ion source, formula, calcd mass, found mass of HRMS data:
  - Only execute a basic check for the validity of ion source, it's acceptable whenever the description of ion source contains common ion sources such as ESI, APCI, EI, MALDI, CI, FD, FI, FAB, APPI, TS, PB, DART, etc.
  - Deviation of calcd mass should be less than 0.0001.
  - Deviation of found mass should be less than 0.003, reference to calcd mass.

### Example of Valid Data

  <sup>1</sup>H NMR (600 MHz, CDCl<sub>3</sub>): δ = 11.43 (s, 1H), 8.28 (d, J = 6.0 Hz, 1H), 7.81 (dd, J = 7.8, 2.4 Hz, 3H), 7.67 (q, J = 8.4 Hz, 1H), 7.38 (br, 1H), 7.24 - 7.01 (m, 1H), 6.70–6.62 (m, 3H), 5.58−5.30 (m, 3H); <sup>13</sup>C NMR (100 MHz, CDCl<sub>3</sub>): δ (ppm) = 144.4, 133.5(1), 133.5(2), 130.8(2C), 129.81, 129.79, 127.62, 127.42; HRMS (ESI): m/z [M + Na]<sup>+</sup> Calcd for C<sub>9</sub>H<sub>14</sub>BrN<sub>3</sub>Na, 266.0263; Found 266.0236.

### Example of Original Data

  1H NMR (400 MHz, dmso-d6) δ 8.01 (br s, 1H), 7.24-7.18 (m, 2H), 6.94 (d, J = 5.3 Hz, 1H), 6.88 (s, 1H), 3.42 (dd, J = 14.4, 5.0 Hz, 1H), 3.10-3.06 (m, 2H), 2.76 (dd, J = 14.0, 12.0 Hz, 1H), 2.66 (d, J = 12.8 Hz, 1H), 2.51 (s, 3H), 2.20 (td, J = 10.8, 4.0 Hz, 1H), 2.18-2.10 (m, 1H), 1.95 (t, J = 11.2 Hz, 1H), 1.12 (q, J = 12.4 Hz, 1H), 1.02 (d, J = 6.8 Hz, 3H); 13C NMR (100 MHz, dmso-d6) δ 133.6, 133.3, 126.2, 123.0, 117.6, 113.2, 112.0, 108.4, 67.0, 65.4, 43.2, 40.8, 39.93, 39.80, 39.66, 39.52, 39.38, 39.24, 39.10, 36.4, 30.6, 26.9, 19.7;

-------------------------------------------------------

### Word Config

#### Set default paste options

In `Microsoft Word`, go to `File -> Options -> Advanced`, choose `Match destination formatting` under `Pasting from other programs`, and your auto formatted characterization data is on the way!

-------------------------------------------------------

### Contributing

Click [here](https://github.com/Nikaple/chem-si-helper/issues) to open an issue, please tell me your data and your expected result.

-------------------------------------------------------

### Contribute

Any contribution will be appreciated. To help improve the project, you can clone this repository and open a pull request, or even open an issue is fine.

After installing [NodeJS](https://nodejs.org) and [Git](https://git-scm.com/), run:
```
git clone https://github.com/Nikaple/chem-si-helper.git
cd chem-si-helper
npm install
npm start
```


## LICENCE

MIT