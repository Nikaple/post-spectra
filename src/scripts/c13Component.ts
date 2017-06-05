import { clearDOMElement, highlightData } from './utils/utils';
import { map, split, clone, remove, forEach, round, join } from 'lodash';
import {
  Metadata, C13Data, handleNMRData,
  C13RenderObj, getDataArray, HighlightType,
} from './utils/nmr';
import { solventInfo, ComponentData } from './utils/constants'; 

export class C13Component {
  // data from input
  private inputtedData: string;
  // data that match '13C NMR: ....'
  private matchedData: string[]|null;
  // highlight data or not
  private willHighlightData: boolean;
  // error message
  private errMsg: {
    dataErr: string;
    infoErr: string;
    peakErr: string;
  };
  // instance for singleton
  private static instance: C13Component;

  private constructor() {
    this.inputtedData = '';
    this.willHighlightData = false;
    this.errMsg = {
      dataErr: '谱图数据格式不正确！请直接从MestReNova中粘贴',
      infoErr: '频率或溶剂信息有误！请直接从MestReNova中粘贴',
      peakErr: '谱峰数据不正确！请直接从MestReNova中粘贴！错误的内容已用红色标出: <br>',
    };
  }

  public handle(): ComponentData|null {
    this.reset();
    const parsedData = handleNMRData('C', this);
    if (parsedData === null) {
      return null;
    }
    this.matchedData = getDataArray(this.inputtedData, 'C');
    const peakData = parsedData.peakData as C13Data[][];
    const originalMetadataArr = parsedData.metadataArr as Metadata[];
    const metadataArr = map(originalMetadataArr, (metadata) => {
      metadata.freq = this.roundMetadataFreq(metadata.freq);
      return metadata;
    });
    const peakDataCopy = clone(peakData);
    const deletedPeaks = map(peakDataCopy, (peakDatum, index) => {
      return remove(peakDatum, (peak) => {
        return this.isPeakDangerundant(peak, metadataArr[index].solvent);
      });
    });
    const fixedPeakData = map(peakDataCopy, (peakDatum) => {
      return map(peakDatum, this.fixC13Peaks);
    });
    return this.render(metadataArr, fixedPeakData, deletedPeaks);
  }
  
  /**
   * reset status
   * 
   * @private
   * 
   * @memberof C13Component
   */
  private reset() {
    this.setDataFromInput();
    this.willHighlightData = false;
  } 
  
  private render(
    metadataArr: Metadata[],
    peakData: C13Data[][],
    deletedPeaks: C13Data[][],
  ): ComponentData {
    const c13RenderObjs: C13RenderObj[] = [];
    forEach(metadataArr, (meta: Metadata, index) => {
      const obj = {} as C13RenderObj;
      obj.meta = metadataArr[index];
      obj.peak = peakData[index];
      c13RenderObjs.push(obj);
    });
    const input = this.matchedData as string[];
    const outputPlain = this.renderStrArrays(c13RenderObjs, deletedPeaks);
    this.willHighlightData = true;
    const outputRich = this.renderStrArrays(c13RenderObjs, deletedPeaks);
    return { input, outputPlain, outputRich };
  }

  private renderStrArrays(c13RenderObjs: C13RenderObj[], deletedPeaks: C13Data[][]) {
    const formattedPeakStrings = map(c13RenderObjs, (obj: C13RenderObj, index) => {
      const currentSolventInfo = solventInfo[obj.meta.solvent];
      const headStr = `<sup>13</sup>C NMR (${obj.meta.freq} MHz, \
        ${currentSolventInfo.formattedString}) δ `;
      const peakStr = obj.peak.join(', ');
      const highlightedData = headStr + peakStr;
      let type: HighlightType;
      let errMsg = '';
      if (deletedPeaks[index].length !== 0) {
        errMsg = `自动移除的${deletedPeaks[index].length}个峰：\
        ${join(deletedPeaks[index], ', ')}。`;
      } else {
        return highlightedData;
      }
      if (deletedPeaks[index].length > currentSolventInfo.peaks) {
        type = HighlightType.Danger;
        errMsg += `<br>而${currentSolventInfo.formattedString}是${currentSolventInfo.peaks}重峰`;
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
      ${solventInfo[metadata.solvent].formattedString}) δ `;
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

  private setDataFromInput(): void {
    this.inputtedData = (<HTMLInputElement>document.getElementById('input')).value;
  }

  private fixC13Peaks(peak: C13Data): C13Data {
    if (peak === null) {
      return highlightData('数据有误', HighlightType.Danger);
    }
    if (isNaN(Number(peak))) {
      return highlightData(peak, HighlightType.Danger, '数据有误');
    }
    return <C13Data>Number(peak).toFixed(1);
  }

  private isPeakDangerundant(peak, solvent: string) {
    const solventPeakRange: number[] = solventInfo[solvent].residualRange;
    const peakValue = Number(peak);
    return peakValue >= solventPeakRange[0] && peakValue <= solventPeakRange[1];
  }

  private renderError(msg): void {
    clearDOMElement('#output');
    if (this.inputtedData !== '') {
      const $error = document.getElementById('error') as HTMLDivElement;
      $error.innerHTML = msg;
    }
  }

  public static get getInstance(): C13Component {
    if (!C13Component.instance) {
      return new C13Component();
    }
    return C13Component.instance;
  }
}
