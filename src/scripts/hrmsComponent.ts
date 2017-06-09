import { map } from 'lodash';
import { ComponentData } from './utils/constants';

export class HrmsComponent {

  // date from input
  private inputtedData: string;
  // will highlight data or not
  private willHighlightData: boolean;
  // error message
  private errMsg: {

  };
  // instance for singleton
  private static instance: HrmsComponent;

  private constructor() {
    this.inputtedData = '';
    this.willHighlightData = false;
  }

  init() {

  }

  handle(): ComponentData|null {
    this.reset();
    const hrmsDataArr = this.getHrmsDataArray();
    const parsedData = map(hrmsDataArr, this.parseHrmmsData);
    return null;
  }

  /**
   * reset status, get input data
   * 
   * @private
   * 
   * @memberof H1Component
   */
  private reset() {
    this.inputtedData = (<HTMLInputElement>document.querySelector('#input')).value;
    this.willHighlightData = false;
  } 

  private getHrmsDataArray() {
    const reg = /HRMS.+?(\d+\.\d*)\D*(\d+\.\d*)?/g;
    return this.inputtedData.match(reg);
  }

  private parseHrmsData(hrmsData) {
    const sourceReg = /\((\w+)\)/;
    const ionReg = /\(M( *\+ *)(\w+)\)\+|\[M( *\+ *)(\w+)\]\+/;
    const formulaReg = /for (([A-Z][a-z]?\d*)+)/;
    const dataReg = /(([A-Z][a-z]?\d*)+)\D*(\d+\.\d*)[\w\s,.:;，。；]*(\d+\.\d*)?/;
    // const parsedData = 
    const source = hrmsData.match(sourceReg);
    console.log(source);
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
