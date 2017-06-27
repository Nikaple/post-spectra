import { chain, map, split, clone, remove, forEach,
  round, join, trimEnd, last, initial, replace } from 'lodash';
import { ComponentData, solventsInfo } from './utils/constants';
import { handleNMRData, C13Data, Metadata, C13RenderObj, HighlightType } from './utils/nmr';
import { highlightData, clearDOMElement } from './utils/utils';
import { LanguageService } from './utils/language';

export class C13Component {
  // data from input
  private inputtedData: string;
  // data that match '13C NMR: ....'
  private matchedData: string[]|null;
  // highlight data or not
  private willHighlightData: boolean;
  // error message
  private errMsg: {
    dataErr: string[];
    infoErr: string[];
    peakErr: string[];
  };
  // tooltip error message
  private tooltipErrors: (string[]|string[][])[];
  private domElements: {
    $strict: HTMLInputElement;
    $error: HTMLDivElement;
  };
  // strict mode or not
  private isStrict: boolean;
  // instance for singleton
  private static instance: C13Component;

  private constructor() {
    this.inputtedData = '';
    this.willHighlightData = false;
    this.errMsg = {
      dataErr: ['Data not valid! Please copy data straightly from peak analysis programs.',
        '谱图数据格式不正确！请直接从MestReNova中粘贴'],
      infoErr: ['Frequency/solvent not valid! Please copy data straightly \
      from peak analysis programs.',
        '频率或溶剂信息有误！请直接从MestReNova中粘贴'],
      peakErr: ['Peak data not valid! Please copy data straightly from peak analysis programs.',
        '谱峰数据不正确！请直接从MestReNova中粘贴！错误的内容已用红色标出: <br>'],
    };
    this.tooltipErrors = [
      [' peaks have been automatically removed: ', '个峰已被自动移除：'],
      [['But', '但'], [' is ', '是'], ['.', '。']],
      ['Data not valid.', '数据有误'],
    ];
    this.domElements = {
      $error: document.querySelector('#error') as HTMLDivElement,
      $strict: document.querySelector('#strict') as HTMLInputElement,
    };
  }

  public handle(): ComponentData|null {
    this.reset();
    const parsedData = handleNMRData(this, 'C', this.isStrict);
    if (parsedData === null) {
      return null;
    }
    const rawPeakData: C13Data[][] = parsedData.peakData as C13Data[][];
    const peakData: C13Data[][] = map(rawPeakData, (peakArr: string[]) => {
      const lastPeak = trimEnd(last(peakArr), ' ,.;，。；') as C13Data;
      return [...initial(peakArr), lastPeak] as C13Data[];
    });
    const originalMetadataArr: Metadata[] = parsedData.metadataArr as Metadata[];
    const tailArr = parsedData.tailArr;
    const metadataArr: Metadata[] = map(originalMetadataArr, (metadata) => {
      metadata.freq = this.roundMetadataFreq(metadata.freq);
      return metadata;
    });
    const peakDataCopy: C13Data[][] = clone(peakData);
    const deletedPeaks: C13Data[][] = map(peakDataCopy, (peakDatum, index) => {
      return remove(peakDatum, (peak) => {
        return this.isPeakRedundant(peak, metadataArr[index].solvent);
      });
    });
    const fixedPeakData: C13Data[][] = map(peakDataCopy, (peakDatum) => {
      return map(peakDatum, this.fixPeaks);
    });
    return this.render(metadataArr, fixedPeakData, deletedPeaks, tailArr);
  }
  
  /**
   * reset status
   * 
   * @private
   * 
   * @memberof C13Component
   */
  private reset() {
    this.inputtedData = (<HTMLInputElement>document.querySelector('#input')).value;
    this.willHighlightData = false;
    this.isStrict = this.domElements.$strict.checked;
  } 
  
  /**
   * Returns the string to render
   * 
   * @private
   * @param {Metadata[]} metadataArr 
   * @param {C13Data[][]} peakData 
   * @param {C13Data[][]} deletedPeaks 
   * @returns {ComponentData} 
   * 
   * @memberof C13Component
   */
  private render(
    metadataArr: Metadata[],
    peakData: C13Data[][],
    deletedPeaks: C13Data[][],
    tailArr: string[],
  ): ComponentData {
    const c13RenderObjs: C13RenderObj[] = [];
    forEach(metadataArr, (meta: Metadata, index) => {
      const obj = {} as C13RenderObj;
      obj.meta = metadataArr[index];
      obj.peak = peakData[index];
      obj.tail = tailArr[index];
      c13RenderObjs.push(obj);
    });
    const input = this.matchedData as string[];
    const outputPlain = this.renderStrArrays(c13RenderObjs, deletedPeaks);
    this.willHighlightData = true;
    const outputRich = this.renderStrArrays(c13RenderObjs, deletedPeaks);
    return { input, outputPlain, outputRich };
  }

  private renderStrArrays(c13RenderObjs: C13RenderObj[], deletedPeaks: C13Data[][]) {
    const currentLanguage = LanguageService.getInstance.getLanguage();
    const formattedPeakStrings = map(c13RenderObjs, (obj: C13RenderObj, index) => {
      const currentSolventInfo = solventsInfo[obj.meta.solvent];
      const headStr = `<sup>13</sup>C NMR (${obj.meta.freq} MHz, \
        ${currentSolventInfo.formattedString}) δ `;
      const peakStr = obj.peak.join(', ');
      const tailStr = obj.tail;
      const highlightedData = headStr + peakStr + tailStr;

      let type: HighlightType;
      let errMsg = '';
      if (deletedPeaks[index].length !== 0) {
        errMsg = `${deletedPeaks[index].length}${this.tooltipErrors[0][currentLanguage]}\
        ${join(deletedPeaks[index], ', ')}。`;
      } else {
        return highlightedData;
      }
      if (deletedPeaks[index].length > currentSolventInfo.peaks) {
        type = HighlightType.Danger;
        errMsg += `<br>${this.tooltipErrors[1][0][currentLanguage]}\
        ${currentSolventInfo.formattedString}\
        ${this.tooltipErrors[1][1][currentLanguage]}${currentSolventInfo.peakType[currentLanguage]}\
        ${this.tooltipErrors[1][2][currentLanguage]}`;
      } else {
        type = HighlightType.Warning;
      }
      return highlightData(
        highlightedData,
        type,
        errMsg,
        );
    });
    const output = map(formattedPeakStrings, (str) => {
      return this.willHighlightData
        ? `<strong>${str}</strong>`
        : str;
    });
    return output;
  }

  /**
   * render metadata to string
   * @example
   * // returns `<sup>13</sup>C NMR (125 MHz, DMSO-<em>d</em><sub>6</sub>) δ `
   * stringifyMetadata({
   *   type: 'C',
   *   freq: 125,
   *   solvent: dmso,
   * });
   * @private
   * @param {Metadata} metadata 
   * @returns {string}
   * 
   * @memberof H1Component
   */
  private stringifyMetadata(metadata: Metadata) {
    return `<sup>13</sup>C NMR (${metadata.freq} MHz, \
      ${solventsInfo[metadata.solvent].formattedString}) δ `;
  }

  /**
   * round the frequency to multiples of 100
   * 
   * @private
   * @param {any} freq 
   * @returns 
   * 
   * @memberof C13Component
   */
  private roundMetadataFreq(freq: number): number {
    const decay = 4;
    return round(freq * decay, -1) / decay;
  }

  private fixPeaks(peak: C13Data, index: number, data: C13Data[]): C13Data {
    const currentLanguage = LanguageService.getInstance.getLanguage();
    const errorMsg = this.tooltipErrors[2][currentLanguage] as string;
    if (peak === null) {
      return highlightData(errorMsg, HighlightType.Danger);
    }
    // for peaks like '5.2(0) and 13.1(4C)'
    const peakExecArr = /(\d+\.\d*)(\(\d+C?\))?$/.exec(peak) as RegExpExecArray;
    if (!peakExecArr) {
      return highlightData(peak, HighlightType.Danger, errorMsg);
    }
    const peakStr = peakExecArr[1];
    const peakInfo = peakExecArr[2] || '';
    if (isNaN(Number(peakStr))) {
      return highlightData(peakStr, HighlightType.Danger, errorMsg);
    }
    const peakNumber = Number(peakStr);
    const peakWith1Decimal: C13Data = peakNumber.toFixed(1);
    if (peakWith1Decimal === Number(data[index - 1]).toFixed(1)
    || peakWith1Decimal === Number(data[index + 1]).toFixed(1)) {
      return peakNumber.toFixed(2) + peakInfo;
    }
    return peakWith1Decimal + peakInfo;
  }

  private isPeakRedundant(peak: C13Data, solvent: string) {
    const solventPeakRange: number[] = solventsInfo[solvent].residualRange;
    const peakValue = Number(peak);
    return peakValue >= solventPeakRange[0] && peakValue <= solventPeakRange[1];
  }

  private renderError(msg: string): void {
    clearDOMElement('#output');
    if (this.inputtedData !== '') {
      this.domElements.$error.innerHTML = msg;
    }
  }

  public static get getInstance(): C13Component {
    if (!C13Component.instance) {
      C13Component.instance = new C13Component();
    }
    return C13Component.instance;
  }
}
