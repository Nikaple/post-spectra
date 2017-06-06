import { has, some, findIndex, reduce } from 'lodash';
import { Element, elementLookup, isElement } from './element';

export interface ElementCountPair {
  element: Element|null;
  count: number;
}

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
   * // returns [{element: C, count: 13},
   * //   {element: H, count: 22},
   * //   {element: O, count: 11}, 
   * //   {element: Br, count: 1},
   * //   {element: Cl, count: 2}]
   * new Formula('C13H22O11BrCl2').parse();
   * // not applicable
   * new Formula('(NH4)2CO3').parse();
   * @returns {object}
   * @memberof Formula
   */
  public parse(): ElementCountPair[]|null {
    const extractorRegex = /([A-Z][a-z]*\d*)/g;
    const elementSet = this.formula.match(extractorRegex) || [];
    const elementsArr = this.convertElementSetToElementsArr(elementSet);
    return elementsArr;
  }

  /**
   * return true if formula is empty
   * 
   * @returns {boolean} 
   * 
   * @memberof Formula
   */
  public isEmpty(): boolean {
    return this.toString() === '[]';
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
   * convertElementSetToElementsArr(["C13","H22","O11","Br"]);
   * @private
   * @param {object} obj 
   * @param {string} element 
   * @returns {ElementCountPair[]} 
   * 
   * @memberof Formula
   */
  private convertElementSetToElementsArr(elementSet: RegExpMatchArray): (ElementCountPair)[]|null {
    const elementsArr = reduce(
      elementSet,
      (countPairArray: (ElementCountPair)[], elementCountString: string) => {
        const { element, count } = this.splitElementAndNumber(elementCountString);
        const ind = findIndex(countPairArray, (elementPair) => {
          if (elementPair) {
            return elementPair.element === element;
          }
          return false;
        });
        if (~ind) {
          countPairArray[ind].count += count;
        } else {
          const checkedElement = isElement(element) ? element : null;
          countPairArray.push({ element: checkedElement, count });
        }
        return countPairArray;
      },
      [],
    );
    const isElementArrError = some(elementsArr, (countPair) => {
      return countPair.element === null;
    });
    const checkedElementsArr = isElementArrError ? null : elementsArr;
    return checkedElementsArr;
    // elementsArr: (ElementCountPair|null)[], 
    // elementSet: string): (ElementCountPair|null)[] {
    // 
    // const ind = findIndex(elementsArr, elementPair => elementPair.element === element);
    // if (~ind ) {
    //   elementsArr[ind].count += count;
    // } else {
    //   if (!isElement(element)) {
    //     elementsArr.push(null);
    //   } else {
    //     elementsArr.push({ element, count });
    //   };
    // }
    // return elementsArr;
  }

  /**
   * split element name and count
   * @example
   * // returns { element: 'H', count: 1 }
   * splitElementAndNumber('H');
   * // returns { element: 'C', count: 10 }
   * splitElementAndNumber('C10');
   * @private
   * @param {string} element 
   * @returns {ElementCountPair}
   * 
   * @memberof Formula
   */
  private splitElementAndNumber(element: string): ElementCountPair {
    const getNum = /\d+/;
    const getName = /[A-Za-z]+/;
    const elementNum = element.match(getNum) || 1;
    const elementName = element.match(getName) || [];
    return {
      element: elementName[0] as Element, 
      count: Number(elementNum),
    };
  }
}
