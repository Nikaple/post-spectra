<<<<<<< HEAD
import { has, is } from 'lodash';
import { Formula } from './formula';
import elementLookup from './utils/elementLookup';
import { getActiveRadioButton,
  parseLiteralToChemicalFormula,
  clearDOMElement } from './utils/utils';
import { massOfElectron } from './utils/constants';

export class MassComponent {
  private exactMass: number;
  private formulaName: string;
  private productYield: number;
  private mmol: number;
  
  /**
   * Creates an instance of MassComponent.
   * 
   * @memberof MassComponent
   */
  constructor() {
    this.exactMass = 0;
    this.formulaName = '';
    this.productYield = 0;
    this.mmol = 0;
  }

  /**
   * initialize and add event listeners to all related node
   * 
   * @memberof MassComponent
   */
  public init(): void {
    const mass = Array.from(document.querySelectorAll('input[name="mass"]'));
    const ion = Array.from(document.querySelectorAll('input[name="ion"]'));
    [...mass, ...ion].forEach((elem) => {
      elem.addEventListener('input', this.handle.bind(this));
      elem.addEventListener('change', this.handle.bind(this));
    });
  }

  /**
   * handle input/change events
   * 
   * @memberof MassComponent
   */
  private handle(): void {
    // get DOM elements
    const formula$ = document.getElementById('formula') as HTMLInputElement;
    const radios$ = document.querySelectorAll(
        'input[name="ion"]') as NodeListOf<HTMLInputElement>;
    const yield$ = document.getElementById('yield') as HTMLInputElement;
    const mmol$ = document.getElementById('mmol') as HTMLInputElement;

    // initialize
    this.exactMass = 0;
    this.formulaName = formula$.value;
    this.productYield = Number(yield$.value);
    this.mmol = Number(mmol$.value);

    // calculation
    const formula = new Formula(this.formulaName);
    const formulaLiteral = formula.parse();
    const activeIon = getActiveRadioButton(radios$).value;
    const actualIonInSpectrum = this.getActualIonInSpectrum(formula, activeIon);
    const newFormulaName = parseLiteralToChemicalFormula(actualIonInSpectrum);
    const massStr = this.exactMass.toFixed(4);

    // render output
    this.render(newFormulaName);
  }

  /**
   * render calculated formula, yield to screen
   * 
   * @private
   * @param {any} formulaName 
   * 
   * @memberof MassComponent
   */
  private render(formulaName): void {
    if (isNaN(this.exactMass) || !this.exactMass) {
      this.renderError();
    } else {
      this.renderFormula(formulaName);
      this.renderYield(this.productYield, this.mmol);
    }
  }

  /**
   * calculate the actual ion in high-resolution mass spectrum, that is, 
   * original molecule + H/Na/K ion
   * 
   * @private
   * @param {Formula} formula 
   * @param {string} activeIon 
   * @returns {object} 
   * 
   * @memberof MassComponent
   */
  private getActualIonInSpectrum(formula: Formula, activeIon: string): object {
    const formulaLiteral = formula.parse();
    if (!formula.isEmpty()) {
      this.exactMass = this.getExactMassOfMolecule(formula);
      // if activeIon is a chemical element, aka not 'None'
      if (has(elementLookup, activeIon)) {
        formulaLiteral[activeIon] = has(formulaLiteral, activeIon)
          ? formulaLiteral[activeIon] + 1
          : 1;
        this.exactMass += elementLookup[activeIon];
      }
    }
    return formulaLiteral;
  }

  /**
   * calculate exact mass from a Formula object
   * 
   * @private
   * @param {Formula} formula 
   * @returns {number} 
   * 
   * @memberof MassComponent
   */
  private getExactMassOfMolecule(formula: Formula): number {
    const formulaLiteral = formula.parse();
    let mass = 0;
    for (const elem in formulaLiteral) {
      mass += elementLookup[elem] * formulaLiteral[elem];
    }
    return mass;
  }

  /**
   * Render on error
   * 
   * @private
   * 
   * @memberof MassComponent
   */
  private renderError(): void {
    const error$ = document.getElementById('massError') as HTMLDivElement;
    error$.innerHTML = 'Invalid formula !';
    clearDOMElement('#newFormula');
    clearDOMElement('#weight');
  }

  /**
   * Render the formatted formula to screen
   * 
   * @private
   * @param {string} formula 
   * 
   * @memberof MassComponent
   */
  private renderFormula(formula: string): void {
    const newFormula$ = document.getElementById('newFormula') as HTMLDivElement;
    // tslint:disable-next-line:max-line-length
    newFormula$.innerHTML = `HRMS (ESI): m/z [M + H]<sup>+</sup> calcd for ${formula}: ${this.exactMass.toFixed(4)} found: YOURDATA`;
    clearDOMElement('#massError');
    
  }

  /**
   * Render the formatted yield to screen
   * 
   * @private
   * @param {number} productYield 
   * @param {number} mmol 
   * 
   * @memberof MassComponent
   */
  private renderYield(productYield: number, mmol: number): void {
    const weight$ = document.getElementById('weight') as HTMLDivElement;
    const weight = (this.exactMass * productYield / 100 * mmol).toFixed(0);
    weight$.innerHTML = `Yield: ${productYield}% (${weight} mg);`;
    clearDOMElement('#massError');
  }
}
=======
import { has, is, reduce } from 'lodash';
import { Formula } from './formula';
import elementLookup from './utils/elementLookup';
import { getActiveRadioButton,
  parseLiteralToChemicalFormula,
  clearDOMElement } from './utils/utils';
import { massOfElectron } from './utils/constants';

export class MassComponent {
  // exact mass of input molecule
  private exactMass: number;
  // chemical formula of input molecule
  private inputFormula: string;
  // chemical formula for output
  private outputFormula: string;
  // product yield of input molecule
  private productYield: number;
  // mmol of input molecule
  private mmol: number;
  
  /**
   * Creates an instance of MassComponent.
   * 
   * @memberof MassComponent
   */
  constructor() {
    this.exactMass = 0;
    this.inputFormula = '';
    this.outputFormula = '';
    this.productYield = 0;
    this.mmol = 0;
  }

  /**
   * initialize and add event listeners to all related node
   * 
   * @memberof MassComponent
   */
  public init(): void {
    const $mass = Array.from(document.querySelectorAll('input[name="mass"]'));
    const $ion = Array.from(document.querySelectorAll('input[name="ion"]'));
    [...$mass, ...$ion].forEach((elem) => {
      elem.addEventListener('input', this.handle.bind(this));
      elem.addEventListener('change', this.handle.bind(this));
    });
  }

  /**
   * handle input/change events
   * 
   * @memberof MassComponent
   */
  private handle(): void {
    // get DOM elements
    const $formula = document.getElementById('formula') as HTMLInputElement;
    const $radios = document.querySelectorAll(
        'input[name="ion"]') as NodeListOf<HTMLInputElement>;
    const $yield = document.getElementById('yield') as HTMLInputElement;
    const $mmol = document.getElementById('mmol') as HTMLInputElement;

    // initialize
    this.exactMass = 0;
    this.inputFormula = $formula.value;
    this.productYield = Number($yield.value);
    this.mmol = Number($mmol.value);

    // calculation
    const formula = new Formula(this.inputFormula);
    const formulaLiteral = formula.parse();
    const activeIon = getActiveRadioButton($radios).value;
    const actualIonInSpectrum = this.getActualIonInSpectrum(formula, activeIon);
    this.outputFormula = parseLiteralToChemicalFormula(actualIonInSpectrum);
    const massStr = this.exactMass.toFixed(4);

    // render output
    this.render();
  }

  /**
   * render calculated formula, yield to screen
   * 
   * @private
   * 
   * @memberof MassComponent
   */
  private render(): void {
    if (isNaN(this.exactMass) || !this.exactMass) {
      this.renderError();
    } else {
      this.renderFormula(this.outputFormula);
      this.renderYield(this.productYield, this.mmol);
    }
  }

  /**
   * calculate the actual ion in high-resolution mass spectrum, that is, 
   * original molecule + H/Na/K ion
   * 
   * @private
   * @param {Formula} formula 
   * @param {string} activeIon 
   * @returns {object} 
   * 
   * @memberof MassComponent
   */
  private getActualIonInSpectrum(formula: Formula, activeIon: string): object {
    const formulaLiteral = formula.parse();
    if (!formula.isEmpty()) {
      this.exactMass = this.getExactMassOfMolecule(formula);
      // if activeIon is a chemical element, aka not 'None'
      if (has(elementLookup, activeIon)) {
        formulaLiteral[activeIon] = has(formulaLiteral, activeIon)
          ? formulaLiteral[activeIon] + 1
          : 1;
        this.exactMass += elementLookup[activeIon];
      }
    }
    return formulaLiteral;
  }

  /**
   * calculate exact mass from a Formula object
   * 
   * @private
   * @param {Formula} formula 
   * @returns {number} 
   * 
   * @memberof MassComponent
   */
  private getExactMassOfMolecule(formula: Formula): number {
    const formulaLiteral = formula.parse();
    const mass = reduce(formulaLiteral, (total, elemNum, elem) => {
      total += elementLookup[elem] * elemNum;
      return total;
    },                  0);
    return mass;
  }

  /**
   * Render on error
   * 
   * @private
   * 
   * @memberof MassComponent
   */
  private renderError(): void {
    const $error = document.getElementById('massError') as HTMLDivElement;
    $error.innerHTML = 'Invalid formula !';
    clearDOMElement('#newFormula');
    clearDOMElement('#weight');
  }

  /**
   * Render the formatted formula to screen
   * 
   * @private
   * @param {string} formula 
   * 
   * @memberof MassComponent
   */
  private renderFormula(formula: string): void {
    const $newFormula = document.getElementById('newFormula') as HTMLDivElement;
    // tslint:disable-next-line:max-line-length
    $newFormula.innerHTML = `HRMS (ESI): m/z [M + H]<sup>+</sup> calcd for ${formula}: ${this.exactMass.toFixed(4)} found: YOURDATA`;
    clearDOMElement('#massError');
    
  }

  /**
   * Render the formatted yield to screen
   * 
   * @private
   * @param {number} productYield 
   * @param {number} mmol 
   * 
   * @memberof MassComponent
   */
  private renderYield(productYield: number, mmol: number): void {
    const $weight = document.getElementById('weight') as HTMLDivElement;
    const weight = (this.exactMass * productYield / 100 * mmol).toFixed(0);
    $weight.innerHTML = `Yield: ${productYield}% (${weight} mg);`;
    clearDOMElement('#massError');
  }
}
>>>>>>> b85c00bc526045457e738cf73b7fced3bb770c94
