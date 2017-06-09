import { map, includes, replace, forEach, reduce, findIndex, compact } from 'lodash';
import { highlightData } from './utils/utils';
import { ComponentData } from './utils/constants';
import { HighlightType } from './utils/nmr';
import { Formula, ElementCountPair } from './utils/formula';
import { elementLookup, Element } from './utils/element';

interface HrmsData {
  source: string;
  ion: string;
  formula: ElementCountPair[];
  exactMass: number;
  foundMass: number;
  calcdMass: number;
}

interface YieldWeightHrms {
  hrms: string;
  yield_?: number;
  weight?: number;
  errMsg: string;
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
    };
    this.errMsg = {
      dataErr: '数据有误',
      formatErr: '格式有误',
    };
    this.isStrict = this.domElements.$strict.checked;
  }

  public handle() { // : ComponentData|null
    this.reset();
    const hrmsDataArr = this.getHrmsDataArray();
    if (hrmsDataArr === null) {
      return null;
    }
    const validHrmsData = compact(hrmsDataArr) as YieldWeightHrms[];
    const parsedData = map(validHrmsData, (data, index) => {
      return {
        yield_: data.yield_,
        weight: data.weight,
        hrms: this.parseHrmsData(data.hrms),
      };
    });
 console.log("parsedData ", parsedData);
    // TODO yield & weight logic
    // return this.render(parsedData);
    // const { yield_, weight } = this.getYieldAndWeight(); 
    return null;
  }

  // private render(parsedData) {
  //   // const temp = parsedData.map()
  // }
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

  private getHrmsDataArray(): (YieldWeightHrms|null)[]|null {
    const compoundDataArray = this.inputtedData.split(/\n/g);
    if (compoundDataArray[0] === ''  && compoundDataArray.length === 1) {
      return null;
    }
    const yieldReg = /(\d+\.?\d*)( *)%/;
    const weightReg = /(\d+\.?\d*)( *)mg/;
    const hrmsReg = /HRMS.+?\d+\.\d*\D*(\d+\.\d*)?/;
    const dataArr = map(compoundDataArray, (data) => {
      const yieldMatch = data.match(yieldReg) || [''];
      const weightMatch = data.match(weightReg) || [''];
      const hrmsMatch = data.match(hrmsReg);
      let errMsg = '';
      let hrms = '';
      if (!hrmsMatch) {
        errMsg = this.getDangerStr(data, this.errMsg.formatErr);
        return null;
      } else {
        hrms = hrmsMatch[0];
      }
      if (this.isStrict) {
        if (yieldMatch[2] !== undefined && yieldMatch[2] !== '') {
          errMsg = this.getDangerStr(data, this.errMsg.formatErr, yieldMatch[2]);
        }
        if (weightMatch[2] !== undefined && weightMatch[2] !== ' ') {
          errMsg = this.getDangerStr(data, this.errMsg.formatErr, weightMatch[2]);
        }
      }
      return {
        hrms,
        errMsg,
        yield_: Number(yieldMatch[1]),
        weight: Number(weightMatch[1]),
      };
    });
    return dataArr;
  }

  private parseHrmsData(hrmsData: string): string|HrmsData {
    const sourceReg = /\((\w+)\)/;
    const ionReg = /\(M( *\+? *)(\w*)\)\+|\[M( *\+? *)(\w*)\]\+/;
    const formulaReg = /for (([A-Z][a-z]?\d*)+)/;
    const dataReg = /(([A-Z][a-z]?\d*)+)\D*(\d+\.\d*)\D+(\d+\.\d*)?/;
    // const parsedData = 
    const sourceMatch = hrmsData.match(sourceReg);
    const sourceList = ['ESI', 'APCI', 'EI', 'MALDI', 'CI',
      'FD', 'FI', 'FAB', 'APPI', 'TS', 'PB'];
    const ionMatch = hrmsData.match(ionReg);
    const ionList = ['', 'H', 'Na', 'K', 'Cs'];
    const dataMatch = hrmsData.match(dataReg);

    // handle source match
    let source = '';
    if (sourceMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      source = sourceMatch[1];
      if (!includes(sourceList, source)) {
        return this.getDangerStr(hrmsData, this.errMsg.dataErr, source);
      }
    }

    // handle ionMatch
    let ionPlusSign = '';
    let ion = '';
    if (ionMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      ionPlusSign = ionMatch[1] || ionMatch[3];
      ion = ionMatch[2] || ionMatch[4];
      // match [M]+
      if (ion === '') {
        if (ionPlusSign !== '') {
          return this.getDangerStr(hrmsData, this.errMsg.dataErr, ionMatch[0]);
        }
      } else if (includes(ionList, ion)) {
        // match [M + H]+
        if (this.isStrict && ionPlusSign !== ' + ') {
          return this.getDangerStr(hrmsData, this.errMsg.formatErr, ionMatch[0]);
        }
      } else { 
        return this.getDangerStr(hrmsData, this.errMsg.dataErr, ionMatch[0]);
      }
    }

    // handle data
    let rawFormula = '';
    let exactMass = 0;
    let foundMass = 0;
    if (dataMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      const tempArr = [];
      rawFormula = dataMatch[1];
      exactMass = Number(dataMatch[3]);
      foundMass = Number(dataMatch[4]);
      tempArr.push(rawFormula, exactMass, foundMass);
      for (let i = 0; i < tempArr.length; i += 1) {
        if (!tempArr[i]) {
          return this.getDangerStr(
            hrmsData,
            this.errMsg.dataErr,
            String(tempArr[i]));
        }
      }
      if (!rawFormula) {
        return this.getDangerStr(hrmsData, this.errMsg.dataErr, rawFormula);
      } else {
        if (!new Formula(rawFormula).isValid()) {
          return this.getDangerStr(hrmsData, this.errMsg.dataErr, rawFormula);
        }
      }
    }
    const formulaObj = new Formula(rawFormula);
    const formula = formulaObj.parse() as ElementCountPair[];
    const calcdMass = formulaObj.getExactMass() + this.getIonMass(ion);
    return {
      source,
      ion,
      formula,
      calcdMass,
      exactMass,
      foundMass,
    };
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
  private getIonMass(ion: string): number {
    if (ion === '') {
      return 0;
    } else {
      const massOfElectron = 0.000549;
      // const index = findIndex(elementLookup, massObj => massObj.element === ion);
      // return elementLookup[index].mass - massOfElectron;
      return -massOfElectron;
    }
  }

  private getDangerStr(data: string, errMsg: string, strToReplace?: string): string {
    if (strToReplace === undefined) {
      return highlightData(data, HighlightType.Danger, errMsg);
    }
    const replacement = highlightData(strToReplace, HighlightType.Danger, errMsg);
    return replace(data, strToReplace, replacement);
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
