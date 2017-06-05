import '../styles/base.scss';

// import { Tooltip } from './utils/tooltip';
// import { RenderComponent } from './renderComponent';
// import { H1Component } from './h1Component';
// import { C13Component } from './c13Component';
// import { MassComponent } from './massComponent';
// import { dataService } from './dataService';

// // mock data

import { mockH1Data, mockC13Data, mockMassData } from './utils/mock';
const $input = <HTMLInputElement>document.getElementById('input');
$input.value = mockH1Data + '\n' + mockC13Data;

// const $formula = document.getElementById('formula') as HTMLInputElement;
// const $hrmsData = document.getElementById('hrmsData') as HTMLInputElement;
// const $yield = document.getElementById('yield') as HTMLInputElement;
// const $mmol = document.getElementById('mmol') as HTMLInputElement;
// $formula.value = mockMassData.formula;
// $hrmsData.value = mockMassData.hrmsData;
// $yield.value = mockMassData.yield;
// $mmol.value = mockMassData.mmol;

// // All components are implemented in singleton pattern
// Tooltip.getInstance;
// RenderComponent.getInstance;
// H1Component.getInstance;
// C13Component.getInstance;
// MassComponent.getInstance;
// RenderComponent.getInstance.render();

import { AppComponent } from './appComponent';
AppComponent.getInstance;
