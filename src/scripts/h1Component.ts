import { strToPeaksArray,
  getActiveRadioButton,
  clearDOMElement,
  copyFormattedToClipboard } from './utils/utils';
import { some, split, map, 
  fill, forEach, head, 
  tail, clone, reduce, 
  every, indexOf, replace,
  slice, join, chain,
  compact } from 'lodash';
import { solventInfo, minFreq, maxFreq } from './utils/constants';
import { Nucleo, Multiplet, Metadata, H1Data,
  H1RenderObj, handleNMRData, getDataArray,
  HighlightType, highlightPeakData, isSinglePeak,
  isMultiplePeak, isMultiplePeakWithCouplingConstant, isPeak,
} from './utils/nmr';


const peakRangePlaceholder = 'PEAKRANGE';

export class H1Component {

  // data from input
  private data: string;
  // highlight data or not
  private hightlightData: boolean;
  // error message
  private errMsg: {
    dataErr: string;
    infoErr: string;
    peakErr: string;
  };
  // instance for singleton
  private static instance: H1Component;

  /**
   * Creates an instance of H1Component.
   * 
   * @memberof H1Component
   */
  constructor() {
    this.data = '';
    this.hightlightData = false;
    this.errMsg = {
      dataErr: '谱图数据格式不正确！请直接从MestReNova中粘贴。例如：',
      infoErr: '频率或溶剂信息有误！请直接从MestReNova中粘贴',
      peakErr: '谱峰数据不正确！请直接从MestReNova中粘贴！错误的内容已用红色标出: <br>',
    };
    this.init();
  }

  /**
   * initialize listeners
   * @returns {void}
   * 
   * @memberof H1Component
   */
  private init(): void {
    const $checkboxes = Array.from(document.querySelectorAll('input[name="h1-checkbox"]'));
    const $peaks = document.getElementById('h1Peaks') as HTMLTextAreaElement;
    forEach([$peaks, ...$checkboxes], (nd) => {
      nd.addEventListener('input', this.handle.bind(this));
      nd.addEventListener('change', this.handle.bind(this));
    });
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
    this.reset();
    const parsedData = handleNMRData('H', this);
    if (parsedData === null) {
      return;
    }
    const peakData = parsedData.peakData;
    const metadataArr = <Metadata[]>parsedData.metadataArr;
    // individual peak data objects,
    const peakDataObj = map(peakData, (peakDatum) => {
      return map(peakDatum, data => this.parseIndividualData(data));
    }) as H1Data[][];
    if (!peakDataObj) {
      return;
    }
    const fixedPeakDataObj: H1Data[][] = map(peakDataObj, (peakDatum, index) => {
      const freq = (metadataArr as Metadata[])[index].freq;
      return map(peakDatum, peak => this.fixPeakData(peak, freq));
    });
    this.render(metadataArr, fixedPeakDataObj);
  }
  
  /**
   * reset status
   * 
   * @private
   * 
   * @memberof H1Component
   */
  private reset() {
    this.setDataFromInput();
    this.hightlightData = false;
  } 

  /**
   * render data to screen
   * 
   * @private
   * @param {Metadata[]} metadataArr 
   * @param {H1Data[][]} peakDataObj 
   * 
   * @memberof H1Component
   */
  private render(metadataArr: Metadata[], peakDataObj: H1Data[][]): void {
    const h1RenderObjs:  H1RenderObj[] = [];
    forEach(metadataArr, (meta: Metadata, index) => {
      const obj = {} as H1RenderObj;
      obj.meta = metadataArr[index];
      obj.peak = peakDataObj[index];
      h1RenderObjs.push(obj);
    });
    // copy unhighlighted string to clipboard
    copyFormattedToClipboard(this.renderStrArray(h1RenderObjs));
    this.hightlightData = true;
    const highlightedOutput = this.renderStrArray(h1RenderObjs);
    this.renderOutput(`"${highlightedOutput}" has been copied to clipboard.`);
  }

  /**
   * render data from individual H1 render objects
   * @example
   * // returns '<sup>1</sup>H NMR (400 MHz, CDCl<sub>3</sub>) δ 7.77 (s, 1H)'
   * renderStrArray([{
   *    meta: {
   *      type: 'H',
   *      solvent: 'cdcl3',
   *      freq: 400,
   *    }
   *    peak: [
   *      {
   *        peak: 7.77,
   *        peakType: 's',
   *        couplingConstants: null,
   *        hydrogenCount: 1,
   *      }
   *    ]
   * }])
   * @private
   * @param {H1RenderObj[]} h1RenderObjs 
   * @returns 
   * 
   * @memberof H1Component
   */
  private renderStrArray(h1RenderObjs: H1RenderObj[]) {
    const formattedPeakStrings = map(h1RenderObjs, (obj: H1RenderObj) => {
      const peakStr = map(obj.peak, this.stringifyPeakData.bind(this));
      return `<sup>1</sup>H NMR (${obj.meta.freq} MHz, \
      ${solventInfo[obj.meta.solvent].formattedString}) δ `
       + peakStr.join(', ');
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
   * render metadata to string
   * @example
   * // returns `<sup>1</sup>H NMR (500 MHz, DMSO-<em>d</em><sub>6</sub>) δ `
   * stringifyMetadata({
   *   type: 'H',
   *   freq: 500,
   *   solvent: dmso,
   * });
   * @private
   * @param {Metadata} metadata 
   * @returns {string}
   * 
   * @memberof H1Component
   */
  private stringifyMetadata(metadata: Metadata) {
    return `<sup>1</sup>H NMR (${metadata.freq} MHz, \
      ${solventInfo[metadata.solvent].formattedString}) δ `;
  }

  /**
   * render individual peak data to string
   * @example
   * // returns '7.10 - 6.68 (m, 1H)'
   * this.stringifyPeakData({
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
  private stringifyPeakData(peakObj: H1Data): string {
    if (!peakObj) {
      return '';
    }
    let formattedPeak = '';
    if (peakObj.peak !== peakRangePlaceholder) {
      formattedPeak = (typeof peakObj.peak === 'string')
      ? Number(peakObj.peak).toFixed(2)
      : `${Number(peakObj.peak[0]).toFixed(2)} − \
        ${Number(peakObj.peak[1]).toFixed(2)}`;
    } else {
      formattedPeak = peakRangePlaceholder;
    }
    const renderedPeak = this.renderOnCondition(
      peakObj.danger,
      formattedPeak,
      HighlightType.Red,
      peakObj.errMsg,
    );
    const renderedPeakType = this.renderOnCondition(
      peakObj.peakTypeError,
      peakObj.peakType,
      HighlightType.Red,
      peakObj.errMsg,
    );
    if (peakObj.couplingConstants === null) {
      // for peak object without J
      return `${renderedPeak} \
      (${renderedPeakType}, ${peakObj.hydrogenCount}H)`;
    } else {
      // for peak object with J
      const formattedCouplingConstant = chain(peakObj.couplingConstants)
        .map(couplingConstant => couplingConstant.toFixed(1))
        .join(', ')
        .value();
      const renderedCouplingConstant = this.renderOnCondition(
        this.hightlightData && peakObj.warning,
        formattedCouplingConstant,
        HighlightType.Yellow,
        <string>peakObj.errMsg,
      );
      return `${renderedPeak} (${renderedPeakType}, <em>J</em> = \
      ${renderedCouplingConstant} Hz, ${peakObj.hydrogenCount}H)`;
    }
  }

  private renderOnCondition(
    cond: boolean|undefined,
    strToRender: string,
    type: HighlightType,
    errMsg: string|undefined,
  ) : string {
    if (cond) {
      return highlightPeakData(strToRender, type, errMsg);
    }
    return strToRender;
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
    /(\d+\.\d*) \((\w+), J = (\d+\.\d*)(?:, *)?(\d+\.\d*)?(?:, *)?(\d+\.\d*)? Hz, (\d+)H\)/g;
    const regexWithoutCoupling = /(\d+\.\d*( *[–−-] *\d+\.\d{2})?) \((\w+), (?:(\d+)H\))/g;
    const couplingMatch = regexWithCoupling.exec(data);
    const nonCouplingMatch = regexWithoutCoupling.exec(data);
    if (couplingMatch) {
      const couplingConstants = chain(couplingMatch)
        .slice(3, 6)
        .map(Number)
        .compact()
        .value();
      return {
        peak: couplingMatch[1],
        peakType: couplingMatch[2] as Multiplet,
        couplingConstants,
        hydrogenCount: +couplingMatch[6],
      };
    } else if (nonCouplingMatch) {
      const peakArr = nonCouplingMatch[1].split(/ *[–−-] */g);
      const peak = peakArr.length === 1 ? peakArr[0] : peakArr;
      const danger = Number(peakArr[0]) < Number(peakArr[1]) ? true : false;
      const errMsg = danger ? '错误：多重峰化学位移区间应由低场向高场书写' : '';
      return {
        peak,
        peakType: nonCouplingMatch[3] as Multiplet,
        couplingConstants: null,
        hydrogenCount: +nonCouplingMatch[4],
        danger,
        errMsg,
      };
    } else {
      const errText = this.data.replace(data, `<span class="danger-text">${data}</span>`);
      this.renderError(this.errMsg.peakErr + errText);
      return;
    }
  }

  private fixPeakData(peakDatum: H1Data, freq: number): H1Data {
    if (!peakDatum) {
      return peakDatum;
    }
    const $general = document.getElementById('generalMultiplet') as HTMLInputElement;
    const $autoFixJ = document.getElementById('autoFixJ') as HTMLInputElement;
    const isGeneral = !$general.checked;
    const willFixJ = $autoFixJ.checked;
    const peakDatumCopy = clone(peakDatum);
    if (!isPeak(peakDatumCopy.peakType)) {
      peakDatumCopy.peakTypeError = true;
      peakDatumCopy.errMsg = `错误：${peakDatumCopy.peakType}峰类型不存在`; 
    } else {
      if (isMultiplePeak(peakDatumCopy.peakType)) {
        // peak type 'm' should have an range of peak
        if (typeof peakDatumCopy.peak === 'string') {
          peakDatumCopy.danger = true;
          peakDatumCopy.errMsg = '错误：多重峰化学位移应为区间形式';
        }
        if (peakDatumCopy.couplingConstants !== null) {
          // single peaks shouldn't have coupling constants
          peakDatumCopy.warning = true;
          peakDatumCopy.errMsg = `错误：多重峰不存在耦合常数`;
        }
      } else { // all peak types except 'm' should only have one peak value
        if (typeof peakDatumCopy.peak !== 'string') {
          peakDatumCopy.danger = true;
          peakDatumCopy.errMsg = `错误：${peakDatumCopy.peakType}峰化学位移应为单值`;
        }
        if (isSinglePeak(peakDatumCopy.peakType)) {
          if (peakDatumCopy.couplingConstants !== null) {
            // single peaks shouldn't have coupling constants
            peakDatumCopy.peakTypeError = true;
            peakDatumCopy.errMsg = `错误：${peakDatumCopy.peakType}峰不存在耦合常数`;
          }
        } else {
          if (isMultiplePeakWithCouplingConstant(peakDatumCopy.peakType, isGeneral)) {
            // for all peaks with coupling constants
            if (willFixJ) {
              if (!peakDatumCopy.couplingConstants) {
                // multiple peaks should have coupling constants
                peakDatumCopy.peakTypeError = true;
                peakDatumCopy.errMsg = `错误：${peakDatumCopy.peakType}峰应有耦合常数`;
              } else {
                const isAllCouplingConstantValid = every(
                  peakDatumCopy.couplingConstants,
                  (couplingConstant) => {
                    return this.isCouplingConstantValid(couplingConstant, freq);
                  });
                if (!isAllCouplingConstantValid) {
                  peakDatumCopy.couplingConstants = map(
                    peakDatumCopy.couplingConstants,
                    (couplingConstant) => {
                      return this.roundCouplingConstant(couplingConstant, freq);
                    });
                  peakDatumCopy.warning = true;
                  const originalCouplingConstantsString = 
                     chain(<number[]>peakDatum.couplingConstants)
                    .map(data => data.toFixed(1))
                    .join(', ')
                    .value();
                  peakDatumCopy.errMsg = `原始数据： <em>J</em> = \
                  ${originalCouplingConstantsString}`;
                }
              }
            }
          } else {
            // treat other types of multiplet as m peak
            peakDatumCopy.danger = true;
            peakDatumCopy.peakType = 'm';
            peakDatumCopy.peak = peakRangePlaceholder;
            peakDatumCopy.couplingConstants = null;
            peakDatumCopy.errMsg = `警告：已将${peakDatum.peakType}峰标注为多重峰，请从MestReNova中手动输入化学位移数据`;
          }
        }
      }
    }
    return peakDatumCopy;
  }

  private roundCouplingConstant(couplingConstant: number, freq: number): number {
    const MAGNIFICATION = 1000;
    return Math.round(MAGNIFICATION * couplingConstant / freq) * freq / MAGNIFICATION;
  }

  private isCouplingConstantValid(couplingConstant: number|null, freq: number): boolean {
    if (!couplingConstant) {
      return false;
    }
    const MAGNIFICATION = 1000;
    return MAGNIFICATION * couplingConstant % freq === 0;
  }

  private setDataFromInput(): void {
    const $h1Peaks = <HTMLInputElement>document.getElementById('h1Peaks');
    this.data = $h1Peaks.value;
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

  public static get getInstance(): H1Component {
    if (!H1Component.instance) {
      return new H1Component();
    }
    return H1Component.instance;
  }
}
