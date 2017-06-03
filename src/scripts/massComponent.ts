import { some, reduce, keys, findIndex, find } from 'lodash';
import { ElementCountPair, Formula } from './utils/formula';
import { elementLookup, Element } from './utils/element';
import {
  getActiveRadioButton,
  parseLiteralToChemicalFormula,
  clearDOMElement,
} from './utils/utils';
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
  // the unique instance of singleton
  private static instance: MassComponent;

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
    this.init();
  }

  /**
   * initialize and add event listeners to all related node
   * 
   * @memberof MassComponent
   */
  private init(): void {
    const $mass = Array.from(document.querySelectorAll('input[name="mass"]'));
    const $ion = Array.from(document.querySelectorAll('input[name="ion"]'));
    [...$mass, ...$ion].forEach((elem) => {
      elem.addEventListener('input', this.handle.bind(this));
      elem.addEventListener('change', this.handle.bind(this));
    });
    this.handle();
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
  private getActualIonInSpectrum(formula: Formula, activeIon: string): ElementCountPair[] {
    const formulaLiteral = formula.parse();
    if (!formula.isEmpty()) {
      this.exactMass = this.getExactMassOfMolecule(formula);
      // if activeIon is a chemical element, aka not 'None'
      const isElement = some(elementLookup, massObj => massObj.element === activeIon);
      if (isElement) {
        const ionIndex = findIndex(formulaLiteral, elemCountPair => 
        elemCountPair.element === activeIon);
        if (~ionIndex) {
          formulaLiteral[ionIndex].count += 1;
        } else {
          formulaLiteral.push({
            element: activeIon as Element,
            count: 1,
          });
          this.substrateElectronFromExactMass();
        }
        this.addElementToExactMass(activeIon);
      }
    }
    return formulaLiteral;
  }

  private substrateElectronFromExactMass() {
    this.exactMass -= massOfElectron;
  }

  private addElementToExactMass(element) {
    this.exactMass += find(elementLookup, massObj => massObj.element === element).mass;
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
    const mass = reduce(formulaLiteral, (total, elem: ElementCountPair) => {
      const currentElement = elem.element as Element;
      const lookupIndex = findIndex(elementLookup, massObj => massObj.element === currentElement);
      // TODO: error handling
      if (~lookupIndex) {
        const currentMass = elementLookup[lookupIndex].mass;
        total += currentMass * elem.count;
        return total;
      } else {
        this.renderError();
        return total;
      }
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
    $newFormula.innerHTML = `HRMS (ESI): m/z [M + H]<sup>+</sup> calcd for \
      ${formula}: ${this.exactMass.toFixed(4)} found: YOURDATA`;
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

  public static getInstance(): MassComponent {
    if (!MassComponent.instance) {
      return new MassComponent();
    }
    return MassComponent.instance;
  }
}
