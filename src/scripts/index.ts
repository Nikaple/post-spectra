import '../styles/base.scss';

// mock data

import { mockH1Data, mockC13Data, mockMassData, mockRealData } from './utils/mock';
const $input = <HTMLInputElement>document.querySelector('#input');
$input.innerHTML = mockH1Data + '\n' + mockC13Data;
// $input.innerHTML = mockRealData;
// $input.innerHTML = `1H NMR (40 MHz, dmso) δ 15.91 (s, 1H).`;

import { AppComponent } from './appComponent';
AppComponent.getInstance;
