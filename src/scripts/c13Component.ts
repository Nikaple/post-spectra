import { clearDOMElement } from './utils/utils';
import { compact, difference, map, split, head, tail, some, clone } from 'lodash';
import { Nucleo, Metadata, C13Data, handleNMRData,
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
    const metadataArr = parsedData.metadataArr as Metadata[];
    const peakDataCopy = clone(peakData);
    const deletedPeaks = map(peakData)
    // 先计算删除的peaks，然后再对数据作处理。
    // const fixedPeakData = map(peakDataCopy, (peakDatum, index) => {
    //   const roundedPeaks = map(peakDatum, (data) => {
    //     return this.fixC13Peaks(data, metadataArr[index].solvent);
    //   });
    //   const compactedPeaks = compact(roundedPeaks);
    //   return compactedPeaks;
    // }) as C13Data[][];
    // const deletedPeaks = map(peakData, (peakDatum, index) => {
    //   debugger;
    //   return difference(peakDatum, fixedPeakData[index]);
    // });
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
  
  private render() {
    
  }

  private setDataFromInput(): void {
    this.data = (<HTMLInputElement>document.getElementById('c13Peaks')).value;
  }

  private fixC13Peaks(peak: C13Data, solvent: string): C13Data|null {
    const solventPeakRange: number[] = solventInfo[solvent].residualRange;
    const peakValue = Number(peak);
    if (peakValue >= solventPeakRange[0] && peakValue <= solventPeakRange[1]) {
      return null;
    }
    return <C13Data>peakValue.toFixed(1);
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
