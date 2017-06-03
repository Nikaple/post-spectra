import { strToPeaksArray,
  getActiveRadioButton,
  clearDOMElement,
  copyFormattedToClipboard } from './utils/utils';
import { some, split, map, 
  fill, forEach, head, 
  tail, clone, reduce, 
  every, indexOf, replace } from 'lodash';
import { solvents, minFreq, maxFreq } from './utils/constants';
import { Nucleo, Multiplet, Metadata, H1Data,
  H1RenderObj, getDataArray, splitDataArray, 
  getDescriberArray, getMetadataFromDescriber, getPeakDataArray, 
  isMetadataError,
} from './utils/nmr';

export enum HighlightType {
  Yellow = 0,
  Red,
}

export class H1Component {

  private data: string;
  private hightlightData: boolean;
  private static instance: H1Component;

  /**
   * Creates an instance of H1Component.
   * 
   * @memberof H1Component
   */
  constructor() {
    this.data = '';
    this.hightlightData = false;
    this.init();
  }

  /**
   * initialize listeners
   * @returns {void}
   * 
   * @memberof H1Component
   */
  private init(): void {
    const $peaks = document.getElementById('h1Peaks') as HTMLTextAreaElement;
    $peaks.addEventListener('input', this.handle.bind(this));
    $peaks.addEventListener('change', this.handle.bind(this));
    this.handle();
  }

  /**
   * handle changes in H1Component
   * 
   * @private
   * @returns {void} 
   * 
   * @memberof H1Component
   */
  private handle(): void {
    this.setDataFromInput();
    this.hightlightData = false;
    const dataArr = getDataArray(this.data, 'H');
    if (dataArr === null) {
      this.renderError('氢谱数据格式不正确！请直接从MestReNova中粘贴');
      return;
    }
    const splittedDataArr: string[][] = splitDataArray(dataArr);
    const describerArr: string[] = getDescriberArray(splittedDataArr);
    const metaDataArr: (Metadata|null)[] = getMetadataFromDescriber(describerArr);
    if (some(metaDataArr, metadata => isMetadataError(metadata, 'H'))) {
      this.renderError('频率或溶剂信息有误！请直接从MestReNova中粘贴');
      return;
    }
    // individual peak data, e.g.
    // [[
    //   '7.21 (d, J = 9.7 Hz, 2H)',
    //   '7.15 (t, J = 11.2 Hz, 1H)', 
    //   '7.65 (dd, J = 12.1, 1.2 Hz, 2H)', 
    //   '7.10 - 6.68 (m, 1H)', 
    //   '4.46 (s, 2H)', 
    //   '2.30 (s, 3H).'
    // ]];
    const peakData: string[][] = getPeakDataArray(splittedDataArr);
    // individual peak data objects,
    const peakDataObj = map(peakData, (peakDatum) => {
      return map(peakDatum, data => this.parseIndividualData(data));
    }) as H1Data[][];
    if (!peakDataObj) {
      return ;
    }
    const fixedPeakDataObj: H1Data[][] = map(peakDataObj, (peakDatum, index) => {
      const freq = (metaDataArr as Metadata[])[index].freq;
      return map(peakDatum, peak => this.fixPeakData(peak, freq));
    });
    this.render(metaDataArr as Metadata[], fixedPeakDataObj);
  }
  
  /**
   * render data to screen
   * 
   * @private
   * @param {Metadata[]} metaDataArr 
   * @param {H1Data[][]} peakDataObj 
   * 
   * @memberof H1Component
   */
  private render(metaDataArr: Metadata[], peakDataObj: H1Data[][]): void {
    const h1RenderObjs:  H1RenderObj[] = [];
    forEach(metaDataArr, (meta: Metadata, index) => {
      const obj = {} as H1RenderObj;
      obj.meta = metaDataArr[index];
      obj.peak = peakDataObj[index];
      h1RenderObjs.push(obj);
    });
    // copy unhighlighted string to clipboard
    copyFormattedToClipboard(this.renderStrArray(h1RenderObjs));
    this.hightlightData = true;
    const highlightedOutput = this.renderStrArray(h1RenderObjs);
    this.renderOutput(`"${highlightedOutput}" has been copied to clipboard.`);
  }

  private renderStrArray(h1RenderObjs: H1RenderObj[]) {
    const formattedPeakStrings = map(h1RenderObjs, (obj: H1RenderObj) => {
      const peakStr = map(obj.peak, this.stringifyIndividualData.bind(this));
      return `<sup>1</sup>H NMR (${obj.meta.freq} MHz, \
      ${solvents[obj.meta.solvent].formattedString}) δ `
       + peakStr.join(', ') + '.';
    });
    const data = getDataArray(this.data, 'H') || [];
    let output = this.data;
    forEach(data, (peakStr, index) => {
      output = this.hightlightData
        ? replace(output, data[index], `<strong>${formattedPeakStrings[index]}</strong>`)
        : replace(output, data[index], formattedPeakStrings[index]);
    });
    return output.replace(/\n/g, '<br>');
  }

  /**
   * render individual peak data to string
   * @example
   * returns '7.10 - 6.68 (m, 1H)'
   * this.stringifyIndividualData({
   *  peak: [7.10, 6.68],
   *  peakType: 'm',
   *  couplingConstants: null,
   *  hydrogenCount: 1
   * });
   * @private
   * @param {H1Data} peakObj 
   * @returns {string} 
   * 
   * @memberof H1Component
   */
  private stringifyIndividualData(peakObj: H1Data): string {
    if (peakObj.couplingConstants === null) {
      if (peakObj.peak.length === 2) {
        // for data similar to '7.10 - 6.68 (m, 1H)'
        return `${peakObj.peak[0]} − ${peakObj.peak[1]} \
        (${peakObj.peakType}, ${peakObj.hydrogenCount}H)`;
      } else if (peakObj.danger === true) {
        // for data similar to '7.15 (dd, J = 11.2, 2.4 Hz, 1H)'
        const placeholder = this.hightlightData
          ? this.highlightPeakData(
            peakObj.peak as string,
            peakObj.errMsg as string,
            HighlightType.Red)
          : peakObj.peak;
        return `${placeholder} (${peakObj.peakType}, \
        ${peakObj.hydrogenCount}H)`;
      } else {
        // for data similar to '2.30 (s, 3H)'
        return `${peakObj.peak} (${peakObj.peakType}, ${peakObj.hydrogenCount}H)`;
      }
    } else {
      // for data similar to '10.15 (d, J = 6.2 Hz, 1H)'
      const renderedCouplingConstants = peakObj.couplingConstants.toFixed(1);
      const renderedCouplingConstant = (this.hightlightData && peakObj.warning)
        ? this.highlightPeakData(
          renderedCouplingConstants, 
          peakObj.errMsg as string, 
          HighlightType.Yellow)
        : renderedCouplingConstants;
      return `${peakObj.peak} (${peakObj.peakType}, <em>J</em> = \
      ${renderedCouplingConstant} Hz, ${peakObj.hydrogenCount}H)`;
    }
  }
  
  /**
   * returns object form of peak data
   * @example 
   * [[
   *   {"peak":"7.15","peakType":"t","couplingConstants":11.2,"hydrogenCount":1},
   *   {"peak":["7.10","6.68"],"peakType":"m","couplingConstants":null,"hydrogenCount":1},
   *   {"peak":"4.46","peakType":"s","couplingConstants":null,"hydrogenCount":3},
   * ]]
   * @private
   * @param {string} data 
   * @returns {(H1Data|void)} 
   * 
   * @memberof H1Component
   */
  private parseIndividualData(data: string): H1Data|void {
    const regexWithCoupling = 
    /(\d+\.\d{2}) \((\w+), J = (\d+\.\d+)(?:, \d+\.\d+)?(?: Hz, (\d+)H\))/g;
    const regexWithoutCoupling = /(\d+\.\d{2}( *[–−-] *\d+\.\d{2})?) \((\w+), (?:(\d+)H\))/g;
    const couplingMatch = regexWithCoupling.exec(data);
    const nonCouplingMatch = regexWithoutCoupling.exec(data);
    if (couplingMatch) {
      return {
        peak: couplingMatch[1],
        peakType: couplingMatch[2] as Multiplet,
        couplingConstants: +couplingMatch[3],
        hydrogenCount: +couplingMatch[4],
      };
    } else if (nonCouplingMatch) {
      const peakArr = nonCouplingMatch[1].split(/ *[–−-] */g);
      const peak = peakArr.length === 1 ? peakArr[0] : peakArr;
      return {
        peak,
        peakType: nonCouplingMatch[3] as Multiplet,
        couplingConstants: null,
        hydrogenCount: +nonCouplingMatch[4],
      };
    } else {
      const errText = this.data.replace(data, `<span class="danger-text">${data}</span>`);
      this.renderError(`谱峰数据不正确！请直接从MestReNova中粘贴！错误的内容已用红色标出：\
       <br> ${errText}`);
      return;
    }
  }

  private fixPeakData(peakDatum: H1Data, freq: number): H1Data {
    const peakDatumCopy = clone(peakDatum);
    // m & not range => error
    if (peakDatumCopy.peakType === 'm') {
      if (typeof peakDatumCopy.peak === 'string') {
        peakDatumCopy.danger = true;
        peakDatumCopy.errMsg = '错误：多重峰化学位移不是区间形式';
      }
    } else if (peakDatumCopy.peakType === 'd' ||
      peakDatumCopy.peakType === 't') {
      if (!this.isCouplingConstantValid(<number>peakDatumCopy.couplingConstants, freq)) {
        peakDatumCopy.couplingConstants = 
        this.roundCouplingConstant(<number>peakDatumCopy.couplingConstants, freq);
        peakDatumCopy.warning = true;
        peakDatumCopy.errMsg = `原始数据： <em>J</em> = ${peakDatum.couplingConstants}`;
      }
    } else if (peakDatum.peakType !== 's') {
      // treat other types of multiplet as m peak
      peakDatumCopy.danger = true;
      peakDatumCopy.peakType = 'm';
      peakDatumCopy.peak = 'PEAKRANGE';
      peakDatumCopy.couplingConstants = null;
      peakDatumCopy.errMsg = `警告：已将${peakDatum.peakType}峰标注为多重峰，请从MestReNova中手动输入化学位移数据`;
    }
    return peakDatumCopy;
  }

  private roundCouplingConstant(couplingConstant: number, freq: number): number {
    const MAGNIFICATION = 1000;
    return Math.round(MAGNIFICATION * couplingConstant / freq) * freq / MAGNIFICATION;
  }

  private isCouplingConstantValid(couplingConstant: number, freq: number): boolean {
    const MAGNIFICATION = 1000;
    return MAGNIFICATION * couplingConstant % freq === 0;
  }

  private setDataFromInput(): void {
    this.data = (<HTMLInputElement>document.getElementById('h1Peaks')).value;
  }

  private highlightPeakData(str: string, errMsg: string, type: HighlightType): string {
    if (type === HighlightType.Red) {
      return `<span class="danger-text" data-tooltip="${errMsg}">${str}</span>`;
    } else if (type === HighlightType.Yellow) {
      return `<span class="warning-text" data-tooltip="${errMsg}">${str}</span>`;
    }
    return str;
  }

  private renderOutput(str): void {
    this.clearH1DOMElements();
    if (this.data !== '') {
      const $output = document.getElementById('h1Output') as HTMLDivElement;
      $output.innerHTML = str;
    }
  }

  private renderError(msg): void {
    this.clearH1DOMElements();
    if (this.data !== '') {
      const $error = document.getElementById('h1Error') as HTMLDivElement;
      $error.innerHTML = msg;
    }
  }

  private clearH1DOMElements(): void {
    clearDOMElement('#h1Error');
    clearDOMElement('#h1Output');
  }

  public static getInstance(): H1Component {
    if (!H1Component.instance) {
      return new H1Component();
    }
    return H1Component.instance;
  }
}
