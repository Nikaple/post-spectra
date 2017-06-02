import '../styles/base.scss';

import { MassComponent } from './massComponent';
import { H1Component } from './h1Component';

const massComponent = new MassComponent();
massComponent.init();

const h1Component = new H1Component();
h1Component.init();

// import { Formula } from './formula';
// let formula = new Formula('');
// console.log(formula.toString());
