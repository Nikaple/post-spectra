import { map, includes, replace, forEach, reduce, findIndex, compact, some, round } from 'lodash';
import { highlightData } from './utils/utils';
import { ComponentData } from './utils/constants';
import { HighlightType } from './utils/nmr';

export class IrComponent {

  // date from input
  private inputtedData: string;
  // will highlight data or not
  private willHighlightData: boolean;
  // error message
  private errMsg: {
    dataErr: string;
    formatErr: string;
    decimalErr: string;
  };
  private domElements: {
    $strict: HTMLInputElement;
  };
  // strict mode switch
  isStrict: boolean;

  // instance for singleton
  private static instance: IrComponent;

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
  private render(hrmsDataArr, hrmsRenderObjs): ComponentData {
    const input = hrmsDataArr.map(data => data.hrms);
    const outputPlain = this.renderStrArrays(hrmsRenderObjs);
    this.willHighlightData = true;
    const outputRich = this.renderStrArrays(hrmsRenderObjs);
    return { input, outputPlain, outputRich };
  }

  private renderStrArrays(irRenderObjs) {
    return '';
  }

  private getIrStrArray() {
    
  }

  private getDangerStr(data: string, errMsg: string, strToReplace?: string): string {
    if (strToReplace === undefined) {
      return highlightData(data, HighlightType.Danger, errMsg);
    }
    const replacement = highlightData(strToReplace, HighlightType.Danger, errMsg);
    return replace(data, strToReplace, replacement);
  }

  private renderOnCondition(
    cond: boolean|undefined,
    strToRender: string,
    type: HighlightType,
    errMsg?: string|undefined,
  ) : string {
    if (cond) {
      return highlightData(strToRender, type, errMsg);
    }
    return strToRender;
  }

  public static get getInstance(): IrComponent {
    if (!IrComponent.instance) {
      IrComponent.instance = new IrComponent();
    }
    return IrComponent.instance;
  }

}
