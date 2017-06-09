import { map } from 'lodash';
import { ComponentData } from './utils/constants';

interface HrmsData {
  source: string;
  ion: string;
  formula: string;
  exactMass: number;
  foundMass?: number;
}

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
    if (hrmsDataArr === null) {
      return null;
    }
    const parsedData = map(hrmsDataArr, this.parseHrmsData);
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

  private getHrmsDataArray(): RegExpMatchArray|null {
    const reg = /HRMS.+?(\d+\.\d*)\D*(\d+\.\d*)?/g;
    return this.inputtedData.match(reg);
  }

  private parseHrmsData(hrmsData: string) {
    const sourceReg = /\((\w+)\)/;
    const ionReg = /\(M( *\+ *)(\w+)\)\+|\[M( *\+ *)(\w+)\]\+/;
    const formulaReg = /for (([A-Z][a-z]?\d*)+)/;
    const dataReg = /(([A-Z][a-z]?\d*)+)\D*(\d+\.\d*)\D+(\d+\.\d*)?/;
    // const parsedData = 
    const source = hrmsData.match(sourceReg);
    const ion = hrmsData.match(ionReg);
    const data = hrmsData.match(dataReg);
    console.log(source, ion, data);
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
