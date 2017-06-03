import { clearDOMElement, copyFormattedToClipboard } from './utils/utils';
import { compact, difference, map, split, head,
  tail, some, clone, remove, forEach, replace, round } from 'lodash';
import {
  Nucleo, Metadata, C13Data, handleNMRData,
  C13RenderObj, getDataArray, HighlightType,
  highlightPeakData,
} from './utils/nmr';
import { solventInfo } from './utils/constants'; 

export class C13Component {
  private data: string;
  private hightlightData: boolean;
  private errMsg: {
    dataErr: string;
    infoErr: string;
    peakErr: string;
  };
  private static instance: C13Component;

  constructor() {
    this.data = '';
    this.hightlightData = false;
    this.errMsg = {
      dataErr: '谱图数据格式不正确！请直接从MestReNova中粘贴',
      infoErr: '频率或溶剂信息有误！请直接从MestReNova中粘贴',
      peakErr: '谱峰数据不正确！请直接从MestReNova中粘贴！错误的内容已用红色标出: <br>',
    };
    this.init();
  }

  private init() {
    const $c13peaks = document.getElementById('c13Peaks') as HTMLTextAreaElement;
    $c13peaks.addEventListener('input', this.handle.bind(this));
    $c13peaks.addEventListener('change', this.handle.bind(this));
    this.handle();
  }

  private handle() {
    this.reset();
    const parsedData = handleNMRData('C', this);
    if (parsedData === null) {
      return;
    }
    const peakData = parsedData.peakData as C13Data[][];
    const originalMetadataArr = parsedData.metadataArr as Metadata[];
    const metadataArr = map(originalMetadataArr, (metadata) => {
      metadata.freq = this.roundMetadataFreq(metadata.freq);
      return metadata;
    });
    const peakDataCopy = clone(peakData);
    const deletedPeaks = map(peakDataCopy, (peakDatum, index) => {
      return remove(peakDatum, (peak) => {
        return this.isPeakRedundant(peak, metadataArr[index].solvent);
      });
    });
    const fixedPeakData = map(peakDataCopy, (peakDatum) => {
      return map(peakDatum, this.fixC13Peaks);
    });
    this.render(metadataArr, fixedPeakData, deletedPeaks);
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
    this.hightlightData = false;
  } 
  
  private render(metadataArr: Metadata[], peakData: C13Data[][], deletedPeaks: C13Data[][]) {
    const c13RenderObjs: C13RenderObj[] = [];
    forEach(metadataArr, (meta: Metadata, index) => {
      const obj = {} as C13RenderObj;
      obj.meta = metadataArr[index];
      obj.peak = peakData[index];
      c13RenderObjs.push(obj);
    });
    // copy unhighlighted string to clipboard
    copyFormattedToClipboard(this.renderStrArray(c13RenderObjs, deletedPeaks));
    this.hightlightData = true;
    const highlightedOutput = this.renderStrArray(c13RenderObjs, deletedPeaks);
    this.renderOutput(`"${highlightedOutput}" has been copied to clipboard.`);
  }

  private renderStrArray(c13RenderObjs: C13RenderObj[], deletedPeaks: C13Data[][]) {
    const formattedPeakStrings = map(c13RenderObjs, (obj: C13RenderObj, index) => {
      const peakStr = obj.peak;
      const currentSolventInfo = solventInfo[obj.meta.solvent];
      let type: HighlightType;
      let errMsg = '';
      const highlightedData = `<sup>13</sup>C NMR (${obj.meta.freq} MHz, \
        ${currentSolventInfo.formattedString}) δ \
        ${peakStr.join(', ')}`;
      if (deletedPeaks[index].length !== 0) {
        errMsg = `自动移除的${deletedPeaks[index].length}个峰：\
        ${deletedPeaks[index].toString()}。`;
      } else {
        return highlightedData;
      }
      if (deletedPeaks[index].length > currentSolventInfo.peaks) {
        type = HighlightType.Red;
        errMsg += `<br>而${currentSolventInfo.formattedString}是${currentSolventInfo.peaks}重峰`;
      } else {
        type = HighlightType.Yellow;
      }
      return highlightPeakData(
        highlightedData,
        type,
        errMsg,
        );
    });
    const data = getDataArray(this.data, 'C') || [];
    let output = this.data;
    forEach(data, (peakStr, index) => {
      output = this.hightlightData
        ? replace(output, data[index], `<strong>${formattedPeakStrings[index]}</strong>`)
        : replace(output, data[index], formattedPeakStrings[index]);
    });
    return output.replace(/\n/g, '<br>');
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
    this.data = (<HTMLInputElement>document.getElementById('c13Peaks')).value;
  }

  private fixC13Peaks(peak: C13Data): C13Data {
    if (peak === null) {
      return highlightPeakData('数据有误', HighlightType.Red);
    }
    if (isNaN(Number(peak))) {
      return highlightPeakData(peak, HighlightType.Red, '数据有误');
    }
    return <C13Data>Number(peak).toFixed(1);
  }

  private isPeakRedundant(peak, solvent: string) {
    const solventPeakRange: number[] = solventInfo[solvent].residualRange;
    const peakValue = Number(peak);
    return peakValue >= solventPeakRange[0] && peakValue <= solventPeakRange[1];
  }

  private renderOutput(str): void {
    this.clearC13DOMElements();
    if (this.data !== '') {
      const $output = document.getElementById('c13Output') as HTMLDivElement;
      $output.innerHTML = str;
    }
  }

  private renderError(msg): void {
    this.clearC13DOMElements();
    if (this.data !== '') {
      const $error = document.getElementById('c13Error') as HTMLDivElement;
      $error.innerHTML = msg;
    }
  }

  private clearC13DOMElements(): void {
    clearDOMElement('#c13Error');
    clearDOMElement('#c13Output');
  }

  public static getInstance(): C13Component {
    if (!C13Component.instance) {
      return new C13Component();
    }
    return C13Component.instance;
  }
}
