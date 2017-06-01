import { strToPeaksArray, getActiveRadioButton } from './utils/utils';
import { split, map, fill, forEach, head, tail } from 'lodash';

interface CouplingConstant {
  value: number;
  index: number;
}

interface H1Data {
  input: string,
  peaks: string[],
  couplingConstants: CouplingConstant[]
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
    let data = this.data.match(h1Reg);
    if (data === null) {
      this.renderError();
      return;
    }
    // splitting h1data array into describer and data
    const dataArr: string[][] = map(data, (datum) => {
      return split(datum, / δ |, (?=\d\.\d+)/g);
    });
    // individual data describer, e.g. 1H NMR (600 MHz, dmso)
    const describer: string[] = map(dataArr, head);
    // individual NMR frequencies
    const freqs: number[] = this.getFreqs(describer);
    // individual peak data
    const peakdata: string[][] = map(dataArr, tail);
    // arrays for coupling constants
    const couplingConstants: (CouplingConstant[] | null)[] = forEach(peakdata, //TODO
    );
    const H1Datas: H1Data[] = fill(Array(data.length), {});
    H1Datas.forEach((datum, ind) => {
      datum.input = data[ind] || '';
      datum.peaks = peakdata[ind].map(peak => Number(peak).toFixed(1));
      datum.couplingConstants = couplingConstants[ind];
    });
    
    console.log(couplingConstants);
  }
  
  // not found => null
  private getCouplingConstant(data: string[]) {
    return data.map((datum) => {
      const reg = /J = (\d+\.\d+)/g;
      const couplingConstants: CouplingConstant[] = [];
      let currentMatch: RegExpExecArray | null;
      while (currentMatch = reg.exec(datum)) {
        couplingConstants.push({
          value: parseFloat(currentMatch[1]),
          index: currentMatch.index
        });
      }
      return couplingConstants;
    });
  }

  private setDataFromInput(): void {
    this.data = (<HTMLInputElement>document.getElementById('h1peaks')).value;
  }

  private getFreqs(data: string[]): number[] {
    return data.map((datum) => {
      console.log(datum);
      // set default frequency to 600 MHz
      const freq = datum.match(/\d+ MHz/) || ['600'];
      return parseInt(freq[0], 10);
    });
  }

  private renderError(): void {
    const $error = document.getElementById('massError') as HTMLDivElement;
    $error.innerHTML = 'Invalid formula !';
  }
}
