
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
    this.parseHrmmsData();
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
  }

  private parseHrmsData() {
    const hrmsReg = /HRMS.+?\[M\D+(\w+)\].+?(([A-Z][a-z]?\d*)+)\D*(\d+\.\d*)\D*(\d+\.\d*)?/g;
    // const parsedData = 
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
