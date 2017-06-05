import '../styles/base.scss';

import { Tooltip } from './utils/tooltip';
import { H1Component } from './h1Component';
import { C13Component } from './c13Component';
import { MassComponent } from './massComponent';

// mock data

// import { mockH1Data } from './utils/mock';
// const $h1Peaks = <HTMLInputElement>document.getElementById('h1Peaks');
// $h1Peaks.value = mockH1Data;

// import { mockC13Data } from './utils/mock';
// const $c13Peaks = <HTMLInputElement>document.getElementById('c13Peaks');
// $c13Peaks.value = mockC13Data;

// import { mockMassData } from './utils/mock';
// const $formula = document.getElementById('formula') as HTMLInputElement;
// const $hrmsData = document.getElementById('hrmsData') as HTMLInputElement;
// const $yield = document.getElementById('yield') as HTMLInputElement;
// const $mmol = document.getElementById('mmol') as HTMLInputElement;
// $formula.value = mockMassData.formula;
// $hrmsData.value = mockMassData.hrmsData;
// $yield.value = mockMassData.yield;
// $mmol.value = mockMassData.mmol;

// All components are implemented in singleton pattern
Tooltip.getInstance;
H1Component.getInstance;
C13Component.getInstance;
MassComponent.getInstance;
