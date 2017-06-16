import { map, includes, replace, forEach, reduce, findIndex, compact, some, round } from 'lodash';
import { highlightData } from './utils/utils';
import { ComponentData,  massOfElectron } from './utils/constants';
import { HighlightType } from './utils/nmr';
import { Formula, ElementCountPair } from './utils/formula';
import { elementLookup, Element } from './utils/element';
import { hrmsRegex } from './utils/regex';

interface HrmsData {
  data: string; // original data
  source: string; // HRMS source, ESI/APCI...
  ion: string; // counter ion, H/Na...
  formula: ElementCountPair[]; // formula object
  exactMass: string; // input exact mass
  foundMass: string; // input found mass
  calcdMass: number; // calculated by program
}

interface YieldWeightHrms {
  hrms: string;
  yield_?: number;
  weight?: number;
  errMsg: string;
}

interface ParsedData {
  yield_: number | undefined;
  weight: number | undefined;
  hrms: string | HrmsData;
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
    decimalErr: string;
    calcErr: string;
    foundErr: string;
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
      decimalErr: '应保留4位小数',
      calcErr: '数据错误，计算值：',
      foundErr: '偏差值应小于0.003',
    };
  }

  public handle() { // : ComponentData|null
    this.reset();
    const hrmsDataArr = this.getHrmsDataArray();
    if (hrmsDataArr === null) {
      return null;
    }
    const validHrmsData = compact(hrmsDataArr) as YieldWeightHrms[];
    const hrmsRenderObj: ParsedData[] = map(validHrmsData, (data, index) => {
      return {
        yield_: data.yield_,
        weight: data.weight,
        hrms: this.parseHrmsData(data.hrms),
      };
    });
    return this.render(validHrmsData, hrmsRenderObj);
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
    this.isStrict = this.domElements.$strict.checked;
  } 


  /**
   * render Component data to appComponent
   * 
   * @private
   * @param {YieldWeightHrms[]} hrmsDataArr 
   * @param {ParsedData[]} hrmsRenderObjs 
   * @returns {ComponentData} 
   * 
   * @memberof HrmsComponent
   */
  private render(hrmsDataArr: YieldWeightHrms[], hrmsRenderObjs: ParsedData[]): ComponentData|null {
    const input = hrmsDataArr.map(data => data.hrms);
    if (input.length === 0) {
      return null;
    }
    const outputPlain = this.renderStrArrays(hrmsRenderObjs);
    this.willHighlightData = true;
    const outputRich = this.renderStrArrays(hrmsRenderObjs);
    return { input, outputPlain, outputRich };
  }

  private renderStrArrays(hrmsRenderObjs: ParsedData[]) {
    const requiredDecimal = 4;
    const maxFoundError = 0.003;
    const dataStringArr = map(hrmsRenderObjs, (hrmsRenderObj) => {
      const { yield_, weight, hrms } = hrmsRenderObj;
      if (typeof hrms === 'string') {
        return this.willHighlightData
          ? `<strong>${hrms}</strong>`
          : hrms;
      }
      const [, fractionE] = hrms.exactMass.split('.');
      const [, fractionF] = hrms.foundMass.split('.');
      const { data } = hrms;
      if (this.isStrict) {
        if (fractionE.length !== requiredDecimal) {
          return this.dangerOnCondition(
            data, 
            this.errMsg.decimalErr, 
            hrms.exactMass);
        }
        if (fractionF.length !== requiredDecimal) {
          return this.dangerOnCondition(
            data,
            this.errMsg.decimalErr,
            String(hrms.foundMass));
        } else if (Number(hrms.foundMass) - Number(hrms.exactMass) > maxFoundError) {
          return this.dangerOnCondition(
            data,
            this.errMsg.foundErr,
            String(hrms.foundMass),
          );
        }
      } else {
        hrms.exactMass = Number(hrms.exactMass).toFixed(4);
      }
      const errorEdge = this.isStrict ? 0 : 0.0001;
      if (round(Math.abs(Number(hrms.exactMass) - hrms.calcdMass), 4) > errorEdge) {
        return this.dangerOnCondition(
          data, 
          `${this.errMsg.calcErr}${hrms.calcdMass.toFixed(4)}`,
          String(hrms.exactMass));
      }
      const validData = this.willHighlightData
        ? `<b>${highlightData(data, HighlightType.Success)}</b>`
        : data;
      return validData;
    });
    return dataStringArr;
  }

  /**
   * return the full data of hrms part
   * 
   * @private
   * @returns {((YieldWeightHrms|null)[]|null)} 
   * 
   * @memberof HrmsComponent
   */
  private getHrmsDataArray(): (YieldWeightHrms|null)[]|null {
    const compoundDataArray = this.inputtedData.split(/\n/g);
    if (compoundDataArray[0] === ''  && compoundDataArray.length === 1) {
      return null;
    }
    const { yieldReg, weightReg, hrmsReg } = hrmsRegex;
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

  /**
   * parse hrms data to individual parts
   * 
   * @private
   * @param {string} hrmsData 
   * @returns {(string|HrmsData)} 
   * 
   * @memberof HrmsComponent
   */
  private parseHrmsData(hrmsData: string): string|HrmsData {
    const { sourceReg, ionReg, formulaReg, dataReg } = hrmsRegex;
    const sourceMatch = hrmsData.match(sourceReg);
    const sourceList = ['ESI', 'APCI', 'EI', 'MALDI', 'CI',
      'FD', 'FI', 'FAB', 'APPI', 'TS', 'PB', 'DART'];
    const ionMatch = hrmsData.match(ionReg);
    const ionList = ['', 'H', 'Na', 'K', 'Cs'];
    const dataMatch = hrmsData.match(dataReg);

    // handle source match
    let source = '';
    if (sourceMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      source = sourceMatch[1];
      const isContained = some(sourceList, (availableSource) => {
        return includes(source, availableSource);
      });
      if (!isContained) {
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
    let exactMass = '';
    let foundMass = '';
    if (dataMatch === null) {
      return this.getDangerStr(hrmsData, this.errMsg.dataErr);
    } else {
      const tempArr = [];
      rawFormula = dataMatch[1];
      exactMass = dataMatch[3];
      foundMass = dataMatch[4];
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
    const data = hrmsData;
    const formulaObj = new Formula(rawFormula);
    const formula = formulaObj.parse() as ElementCountPair[];
    // 381.087745 -> 381.08775 -> 381.0878, not 381.0877
    const calcdMass = round(round(formulaObj.getExactMass() + this.getIonMass(ion), 5), 4);
    return {
      data,
      source,
      ion,
      formula,
      calcdMass,
      exactMass,
      foundMass,
    };
  }

  /**
   * calculate the deviation of exact mass
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

  private dangerOnCondition(
    data: string,
    errMsg: string,
    replace: string|undefined,
  ) : string {
    if (this.willHighlightData) {
      return this.getDangerStr(data, errMsg, replace);
    }
    return data;
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      HrmsComponent.instance = new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
