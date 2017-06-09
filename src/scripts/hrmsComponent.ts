import { map, includes, replace } from 'lodash';
import { highlightData } from './utils/utils'
import { ComponentData } from './utils/constants';
import { HighlightType } from "./utils/nmr";

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
    dataErr: string;
    formatErr: string;
  };
  private domElements: {
    $strict: HTMLInputElement;
  };
  // strict mode switch
  isStrict: boolean;

  // instance for singleton
  private static instance: HrmsComponent;

  private constructor() {
    this.inputtedData = '';
    this.willHighlightData = false;
    this.domElements = {
      $strict: document.querySelector('#strict') as HTMLInputElement,
    }
    this.errMsg = {
      dataErr: '数据有误',
      formatErr: '格式有误',
    };
    this.isStrict = this.domElements.$strict.checked;
  }

  init() {

  }

  handle(): ComponentData|null {
    this.reset();
    const hrmsDataArr = this.getHrmsDataArray();
    if (hrmsDataArr === null) {
      return null;
    }
    const parsedData = map(hrmsDataArr, this.parseHrmsData.bind(this));
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
    const ionReg = /\(M( *\+? *)(\w*)\)\+|\[M( *\+? *)(\w*)\]\+/;
    const formulaReg = /for (([A-Z][a-z]?\d*)+)/;
    const dataReg = /(([A-Z][a-z]?\d*)+)\D*(\d+\.\d*)\D+(\d+\.\d*)?/;
    // const parsedData = 
    const sourceMatch = hrmsData.match(sourceReg);
    const sourceList = ['ESI', 'APCI', 'EI', 'MALDI', 'CI',
      'FD', 'FI', 'FAB', 'APPI', 'TS', 'PB'];
    const ionMatch = hrmsData.match(ionReg);
    const ionList = ['', 'H', 'Na', 'K'];
    const dataMatch = hrmsData.match(dataReg);
    let source = '';
    let ionPlusSign = '';
    let ion = '';

    // handle source match
    if (sourceMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      source = sourceMatch[1];
      if (!includes(sourceList, source)) {
        const highlightedSource = highlightData(source, HighlightType.Danger, this.errMsg.dataErr);
        return this.getDangerStr(hrmsData, this.errMsg.dataErr, source, highlightedSource);
      }
    }

    // handle ionMatch
    if (ionMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      ionPlusSign = ionMatch[1] || ionMatch[3];
      ion = ionMatch[2] || ionMatch[4];
      const highlightedIon = highlightData(ionMatch[0], HighlightType.Danger, this.errMsg.dataErr);
      // match [M]+
      if (ion === '') {
        if (ionPlusSign !== '') {
          ion = highlightedIon;
          return this.getDangerStr(hrmsData, this.errMsg.dataErr, ion, highlightedIon);
        }
      } else if (includes(ionList, ion)) {
        // match [M + H]+
        if (this.isStrict && ionPlusSign !== ' + ') {
          ion = highlightedIon;
          return this.getDangerStr(hrmsData, this.errMsg.dataErr, ion, highlightedIon);
        }
      } else { 
        ion = highlightedIon;
        return this.getDangerStr(hrmsData, this.errMsg.dataErr, ion, highlightedIon);
      }
    }

    // handle data
    if (dataMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      const formula = dataMatch[1];
      const exactMass = dataMatch[3];
      const foundMass = dataMatch[4];
      if (!formula) {

      }
    }
    console.log(dataMatch);
    // console.log(sourceMatch, ionMatch, dataMatch);
  }

  private getDangerStr(
    data: string,
    errMsg: string,
    strToReplace?: string,
    replacement?: string) {
      let replacedData = '';
      if (strToReplace) {
        if (replacement === undefined) {
          return highlightData(data, HighlightType.Danger, errMsg);
        }
        return highlightData(
          replace(data, strToReplace, replacement),
          HighlightType.Danger,
          errMsg,
        );
      }
      return highlightData(replacedData, HighlightType.Danger, errMsg);
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
