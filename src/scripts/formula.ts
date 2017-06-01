import { has } from 'lodash';

export class Formula {
  private formula: string;

  /**
   * Creates an instance of Formula.
   * @param {string} formula 
   * 
   * @memberof Formula
   */
  constructor(formula: string) {
    this.formula = formula;
  }

  /**
   * this is only a simple parser, to convert chemical formula (without
   * parenthesis) generated from ChemDraw into formula object
   * @example
   * // returns {C: 13, H: 22, O: 11, Br: 1, Cl: 2}
   * new Formula('C13H22O11BrCl2').parse();
   * // not applicable
   * new Formula('(NH4)2CO3').parse();
   * @returns {object} 
   * @memberof Formula
   */
  public parse(): object {
    const extractorRegex = /([A-Z][a-z]*\d*)/g;
    const elementSet = this.formula.match(extractorRegex) || [];
    const elementsObj = elementSet.reduce(this.convertElementSetToElementsObj.bind(this), {});
    return elementsObj;
  }

  /**
   * return true if formula is empty
   * 
   * @returns {boolean} 
   * 
   * @memberof Formula
   */
  public isEmpty(): boolean {
    return this.toString() === '{}';
  }

  /**
   * get formula in JSON type
   * 
   * @returns {string} 
   * 
   * @memberof Formula
   */
  public toString(): string {
    return JSON.stringify(this.parse());
  }

  /**
   * get formula in string type
   * 
   * @returns {string} 
   * 
   * @memberof Formula
   */
  public getFormula(): string {
    return this.formula;
  }
  
  /**
   * convert an element set to elements object 
   * @example
   * // returns {C: 13, H: 22, O: 11, Br: 1}
   * convertElementSetToElementsObj(["C13","H22","O11","Br"]);
   * @private
   * @param {object} obj 
   * @param {string} element 
   * @returns {object} 
   * 
   * @memberof Formula
   */
  private convertElementSetToElementsObj(obj: object, element: string): object {
    const [elementName, elementNum] = this.splitElementAndNumber(element);
    obj[elementName] = has(obj, elementName)
      ? obj[elementName] + elementNum
      : elementNum;
    return obj;
  }

  /**
   * split element name and count
   * @example
   * // returns ['H', 1]
   * splitElementAndNumber('H');
   * // returns ['C', 10]
   * splitElementAndNumber('C10');
   * @private
   * @param {string} element 
   * @returns {[string, number]} 
   * 
   * @memberof Formula
   */
  private splitElementAndNumber(element: string): [string, number] {
    const getNum = /\d+/;
    const getName = /[A-Za-z]+/;
    const elementNum = element.match(getNum) || 1;
    const elementName = element.match(getName)[0];
    return [elementName, Number(elementNum)];
  }
}
