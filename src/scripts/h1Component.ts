import { strToPeaksArray, getActiveRadioButton } from './utils/utils';
import { chain, split, map, fill, forEach, head, tail, clone, reduce, every } from 'lodash';
import { solvents, MINFREQ, MAXFREQ } from './utils/deviceInfo';

type Nucleo = 'H'|'C'|'F'|'P';
type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq';

interface CouplingConstant {
  value: number;
  index: number;
}

interface Metadata {
  type: Nucleo;
  freq: number;
  solvent: string;
}

interface H1Data {
  peak: string|string[];
  peakType: Multiplet;
  couplingConstants: number|null;
  hydrogenCount: number;
  modified?: boolean;
  error?: string;
}

interface RenderObj {
  meta: Metadata;
  peak: H1Data[];
}

export class H1Component {
  private data: string;
  constructor() {
    this.data = '';
  }

  public init(): void {
    const $info = Array.from(document.querySelectorAll('input[name="info"]')) as HTMLInputElement[];
    const $h1peaks = document.getElementById('h1peaks') as HTMLTextAreaElement;
    [...$info, $h1peaks].forEach((elem) => {
      elem.addEventListener('input', this.handle.bind(this));
      elem.addEventListener('change', this.handle.bind(this));
    });
    this.handle();
  }

  private handle(): void {
    this.setDataFromInput();
    const h1Reg = /(1H NMR.+\)\.)/g;
    // individual compound 1H NMR data strings, handle multiple data from input
    const data = this.data.match(h1Reg);
    if (data === null) {
      this.renderError('Data not valid! Please copy data directly from  MestReNova');
      return;
    }
    // splitting h1data array into describer and data
    const dataArr: string[][] = map(data, (datum) => {
      return split(datum, / δ |, (?=\d+\.\d{2})/g);
    });
    // individual data describer, e.g. [1H NMR (600 MHz, dmso)]
    const describer: string[] = map(dataArr, head);
    // individual meta data, e.g. 
    const metaDataArr: Metadata[] = this.getMetadata(describer);
    if (!every(metaDataArr, this.isMetadataValid)) {
      this.renderError('Device data not valid! Please copy data directly from MestReNova');
      return ;
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
    const peakData: string[][] = map(dataArr, tail);
    // individual peak data objects,
    const peakDataObj = map(peakData, (peakDatum) => {
      return map(peakDatum, this.getPeakDataObj);
    }) as H1Data[][];
    if (!peakDataObj) {
      return ;
    }
    const fixedPeakDataObj: H1Data[][] = map(peakDataObj, (peakDatum, index) => {
      const freq = metaDataArr[index].freq;
      return map(peakDatum, peak => this.fixPeakData(peak, freq));
    });
    this.render(metaDataArr, fixedPeakDataObj);
  }
  
  private render(metaDataArr: Metadata[], peakDataObj: H1Data[][]): void {
    // get DOM elements for output data
    const $output = document.getElementById('h1output') as HTMLDivElement;
    const renderObj:  RenderObj[] = [];
    forEach(metaDataArr, (meta: Metadata, index) => {
      const obj = {} as RenderObj;
      obj.meta = metaDataArr[index];
      obj.peak = peakDataObj[index];
      renderObj.push(obj);
    });
    const renderStrArray: string[] = map(renderObj, (obj: RenderObj) => {
      if (obj.meta.type === 'H') {
        const peakStr = map(obj.peak, this.renderIndividualH1Data);
        return `<sup>1</sup>H NMR (${obj.meta.freq} MHz, ${solvents[obj.meta.solvent]}) δ `
         + peakStr.join(', ');
      }
      return '';
    });
    $output.innerHTML = renderStrArray.join('.<br>') + '.' ;
  }

  private renderIndividualH1Data(peakObj: H1Data): string {
    if (peakObj.couplingConstants === null) {
      if (peakObj.peak.length === 2) {
        // for data similar to '7.10 - 6.68 (m, 1H)'
        return `${peakObj.peak[0]} - ${peakObj.peak[1]} \
        (${peakObj.peakType}, ${peakObj.hydrogenCount}H)`;
      } else if (peakObj.modified === true) {
        // for data similar to '7.15 (dd, J = 11.2, 2.4 Hz, 1H)';
        return `<span class="warning-text">PLACEHOLDER</span> (${peakObj.peakType}, \
        ${peakObj.hydrogenCount}H)`;
      } else {
        return `${peakObj.peak} (${peakObj.peakType}, ${peakObj.hydrogenCount}H)`;
      }
    } else {
      return `${peakObj.peak} (${peakObj.peakType}, <em>J</em> = \
      ${peakObj.couplingConstants} Hz, ${peakObj.hydrogenCount}H)`;
    }
  }
  /**
   * returns object form of peak data
   * @example 
   * [[
   *   {"peak":"7.21","peakType":"d","couplingConstants":9.7,"hydrogenCount":2},
   *   {"peak":"7.15","peakType":"t","couplingConstants":11.2,"hydrogenCount":1},
   *   {"peak":["7.10","6.68"],"peakType":"m","couplingConstants":null,"hydrogenCount":1},
   *   {"peak":"4.46","peakType":"s","couplingConstants":null,"hydrogenCount":2},
   *   {"peak":"2.30","peakType":"s","couplingConstants":null,"hydrogenCount":3}
   * ]]
   * @private
   * @param {string} data 
   * @returns {(H1Data|void)} 
   * 
   * @memberof H1Component
   */
  private getPeakDataObj(data: string): H1Data|void {
    const regexWithCoupling = 
    /(\d+\.\d{2}) \((\w+), J = (\d+\.\d+)(?:, \d+\.\d+)?(?: Hz, (\d+)H\))/g;
    const regexWithoutCoupling = /(\d+\.\d{2}( - \d+\.\d{2})?) \((\w+), (?:(\d+)H\))/g;
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
      const peakArr = nonCouplingMatch[1].split(' - ');
      const peak = peakArr.length === 1 ? peakArr[0] : peakArr;
      return {
        peak,
        peakType: nonCouplingMatch[3] as Multiplet,
        couplingConstants: null,
        hydrogenCount: +nonCouplingMatch[4],
      };
    } else {
      this.renderError('Peak data not valid! Please copy data directly from  MestReNova');
      return;
    }
  }

  private fixPeakData(peakDatum: H1Data, freq: number): H1Data {
    const peakDatumCopy = clone(peakDatum);
    // m & not range => error
    if (peakDatumCopy.peakType === 'm') {
      if (peakDatumCopy.peak.length === 1) {
        peakDatumCopy.peak = '';
        peakDatumCopy.error = 'm peaks with single peak value was reported';
      }
    } else if (peakDatumCopy.peakType === 'd' ||
      peakDatumCopy.peakType === 't') {
      if (!this.isCouplingConstantValid(<number>peakDatumCopy.couplingConstants, freq)) {
        peakDatumCopy.couplingConstants = 
        this.roundCouplingConstant(<number>peakDatumCopy.couplingConstants, freq);
        peakDatumCopy.modified = true;
      }
    } else if (peakDatum.peakType !== 's') {
      // treat other types of multiplet as m peak
      peakDatumCopy.modified = true;
      peakDatumCopy.peakType = 'm';
      peakDatumCopy.peak = '';
      peakDatumCopy.couplingConstants = null;
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

  private isMetadataValid(meta: Metadata) {
    return meta.freq > MINFREQ
    && meta.freq < MAXFREQ
    && solvents[meta.solvent];
  }

  private setDataFromInput(): void {
    this.data = (<HTMLInputElement>document.getElementById('h1peaks')).value;
  }

  private getMetadata(data: string[]) {
    return data.map((datum) => {
      const nucleo = /\d+(\w)(?: NMR)/.exec(datum) || [];
      const freq = /(\d+) MHz/.exec(datum) || [];
      const solvent = /, (\w+)\)/.exec(datum) || [];
      if (!nucleo || !freq || !solvent) {
        this.renderError('Device data not valid! Please copy data directly from MestReNova');
      }
      return {
        type: nucleo[1] as Nucleo,
        freq: +freq[1],
        solvent: solvent[1],
      };
    });
  }

  private renderError(msg): void {
    const $error = document.getElementById('h1Error') as HTMLDivElement;
    $error.innerHTML = msg;
  }
}
