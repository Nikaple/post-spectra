import { clearDOMElement } from './utils/utils';

export class C13Component {
  private inputData: string;
  private hightlightData: boolean;
  private static instance: C13Component;

  constructor() {
    this.inputData = '';
    this.hightlightData = false;
    this.init();
  }

  private init() {
    const $c13peaks = document.getElementById('c13Peaks') as HTMLTextAreaElement;
    $c13peaks.addEventListener('input', this.handle.bind(this));
    $c13peaks.addEventListener('change', this.handle.bind(this));
    this.handle();
  }

  private handle() {
    this.setDataFromInput();
    this.hightlightData = false;
    const data = this.getDataArray();
    if (data === null) {
      this.renderError('碳谱数据格式不正确！请直接从MestReNova中粘贴');
      return;
    }
  }

  private render() {
    
  }

  private setDataFromInput(): void {
    this.inputData = (<HTMLInputElement>document.getElementById('c13Peaks')).value;
  }

  private getDataArray() {
    // 13C NMR data ends with '.' or ';'
    const c13Reg = /13C NMR.+?\d{1,3}\.\d[\.;\s]/g;
    // individual compound 13C NMR data strings, handle multiple data from input
    return this.inputData.match(c13Reg);
  }

  private renderOutput(str): void {
    this.clearC13DOMElements();
    if (this.inputData !== '') {
      const $output = document.getElementById('c13Output') as HTMLDivElement;
      $output.innerHTML = str;
    }
  }

  private renderError(msg): void {
    this.clearC13DOMElements();
    if (this.inputData !== '') {
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
