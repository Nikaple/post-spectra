import { strToPeaksArray, getActiveRadioButton } from './utils/utils';
import { split, map, fill, forEach, head, tail } from 'lodash';

type Nucleo = 'H'|'C'|'F'|'P';
type Multiplet = 's'|'d'|'t'|'q'|'m'|'dd'|'dt'|'td'|'ddd'|'ddt'|'dq';

interface CouplingConstant {
  value: number;
  index: number;
}

interface Metadata {
  type: 'H' | 'C';
  freq: number;
  solvent: string;
}

interface H1Data {
  peak: string|string[];
  peakType: Multiplet;
  couplingConstants: number|null;
  hydrogenCount: number;
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

  public handle(): void {
    // get DOM elements for output data
    const output$ = document.getElementById('h1output') as HTMLDivElement;
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
      return split(datum, / δ |, (?=\d\.\d+)/g);
    });
    // individual data describer, e.g. 1H NMR (600 MHz, dmso)
    const describer: string[] = map(dataArr, head);
    // individual meta data, e.g. 
    const meta = this.getMetadata(describer);
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
    const peakDataObj: H1Data[][] = map(peakData, (peakDatum) => {
      return map(peakDatum, this.getPeakDataObj);
    });
    if (!peakDataObj) {
      return ;
    }
    const fixedPeakDataObj: H1Data[][] = map(peakDataObj, (peakDatum, index) => {
      const freq = meta[index].freq;
      return map(peakDatum, peak => this.fixPeakData(peak, freq), this);
    }, this);
    console.log(fixedPeakDataObj);
    // const H1Datas: H1Data[] = fill(Array(data.length), {});
    // H1Datas.forEach((datum, ind) => {
    //   datum.input = data[ind] || '';
    //   datum.peaks = peakData[ind].map(peak => Number(peak).toFixed(1));
    //   datum.couplingConstants = couplingConstants[ind];
    // });
    
  }
  
  // not found => null
  private getPeakDataObj(data: string): H1Data|void {
    const regexWithCoupling = /(\d+\.\d{2}) \((\w+), J = (\d+\.\d+)(?:, \d+\.\d+)?(?: Hz, (\d+)H\))/g;
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
      return {
        peak: nonCouplingMatch[1].split(' - '),
        peakType: nonCouplingMatch[3] as Multiplet,
        couplingConstants: null,
        hydrogenCount: +nonCouplingMatch[4],
      };
    } else {
      // this.renderError('Peak data not valid! Please copy data directly from  MestReNova');
      return;
    }
  }

  private fixPeakData(peakDatum: H1Data, freq: number) {
    // m & not range => error
    if (peakDatum.peakType === 'm') {
      if (peakDatum.peak.length === 1) {
        peakDatum.peak = '';
        //TODO
      }
    } else if (peakDatum.peakType !== 's' &&
      peakDatum.peakType !== 'd' &&
      peakDatum.peakType !== 't') {
        if (this.isCouplingConstantValid(<number>peakDatum.couplingConstants, freq)) {
          peakDatum.couplingConstants = this.roundCouplingConstant(<number>peakDatum.couplingConstants, freq);
        }
    } else {
      peakDatum.peakType = 'm';
      //TODO
    }
    
  }

  private roundCouplingConstant(couplingConstant: number, freq: number) {
    const MAGNIFICATION = 1000;
    return Math.round(MAGNIFICATION * couplingConstant / freq) * freq / MAGNIFICATION;
  }

  private isCouplingConstantValid(couplingConstant: number, freq: number) {
    const MAGNIFICATION = 1000;
    return MAGNIFICATION * couplingConstant % freq === 0;
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
        this.renderError('Device data not valid! Please copy data directly from  MestReNova');
      }
      return {
        type: nucleo[1] as Nucleo,
        freq: +freq[1],
        solvent: solvent[1],
      };
    });
  }

  private renderError(msg): void {
    const $error = document.getElementById('massError') as HTMLDivElement;
    $error.innerHTML = msg;
  }
}
