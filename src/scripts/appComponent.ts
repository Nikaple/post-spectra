import { Tooltip } from './utils/tooltip';
import { pullAll, forEach, compact, replace, chain, includes, round } from 'lodash';
import { H1Component } from './h1Component';
import { C13Component } from './c13Component';
import { HrmsComponent } from './hrmsComponent';
import { ComponentData } from './utils/constants';
import { copyFormattedStrToClipboard, clearDOMElement, highlightData } from './utils/utils';
import { HighlightType } from './utils/nmr';

export class AppComponent {
  // data from input
  private inputText: string;
  // output plain text
  private outputPlainText: string;
  // output text with highlight
  private outputRichText: string;
  // input node
  private $input: HTMLTextAreaElement;
  // output node
  private $output: HTMLDivElement;
  // data collected from other components
  private acquiredData: ComponentData[];
  // instance for singleton
  private static instance: AppComponent;
  
  /**
   * Creates an instance of AppComponent.
   * 
   * @memberof AppComponent
   */
  constructor() {
    this.$input = document.querySelector('#input') as HTMLTextAreaElement;
    this.$output = document.querySelector('#output') as HTMLDivElement;
    // this.inputText = this.$input.value;
    this.acquiredData = [];
    this.init();
  }

  private init() {
    // create all instances
    Tooltip.getInstance;
    H1Component.getInstance;
    C13Component.getInstance;
    HrmsComponent.getInstance;
    
    this.attachEvents();
    // handle changes
    this.handle();
  }

  
  /**
   * Handles data from other components
   * 
   * @private
   * 
   * @memberof AppComponent
   */
  private handle() {
    this.reset();
    const c13Data = C13Component.getInstance.handle();
    const hrmsData = HrmsComponent.getInstance.handle();
    const h1Data = H1Component.getInstance.handle();
    const componentsData = compact([h1Data, c13Data, hrmsData]);
    if (componentsData.length === 0) {
      return;
    }
    this.render(<ComponentData[]>componentsData);
  }

  /**
   * reset output and error strings
   * 
   * @private
   * 
   * @memberof AppComponent
   */
  private reset() {
    if (this.$input.value === '') {
      clearDOMElement('#error');
      clearDOMElement('#output');
    }
  }
  /**
   * render received data to screen
   * 
   * @param {ComponentData[]} componentsData 
   * 
   * @memberof AppComponent
   */
  public render(componentsData: ComponentData[]) {
    // clear error div
    clearDOMElement('#error');
    let plainText = this.$input.value;
    // get plainText by replacing input string with componentData[index].outputPlain[index]
    forEach(componentsData, (componentData) => {
      forEach(componentData.input, (input, index) => {
        plainText = chain(plainText)
          .replace(input, componentData.outputPlain[index])
          .replace(/\n/g, '<br>')
          .value();
      });
    });
    copyFormattedStrToClipboard(plainText);
    let richText = this.$input.value;
    // get plainText by replacing input string with componentData[index].outputPlain[index]
    forEach(componentsData, (componentData) => {
      forEach(componentData.input, (input, index) => {
        const replacement = includes(componentData.outputRich[index], 'data-tooltip')
          ? componentData.outputRich[index]
          : highlightData(componentData.outputRich[index], HighlightType.Success);
        richText = chain(richText)
          .replace(input, replacement)
          .replace(/\n/g, '<br>')
          .value();
      });
    });
    this.$output.innerHTML = richText;
  }

  /**
   * attach all events
   * 
   * @private
   * 
   * @memberof AppComponent
   */
  private attachEvents() {
    this.onTextChange();
    this.onScrollSync();
  }

  /**
   * listen on input of textarea
   * 
   * @private
   * 
   * @memberof AppComponent
   */
  private onTextChange() {
    // bind event listeners
    const $checkboxes = Array.from(document.querySelectorAll('div.checkbox-wrapper input'));
    const $peaks = document.querySelector('#input') as HTMLTextAreaElement;
    forEach([$peaks, ...$checkboxes], (el) => {
      el.addEventListener('input', this.handle.bind(this));
      el.addEventListener('change', this.handle.bind(this));
    });
  }

  /**
   * synchronize input and output by percentage
   * 
   * @private
   * 
   * @memberof AppComponent
   */
  private onScrollSync() {
    const $outputScrollbarHolder = <HTMLDivElement>document.querySelector('.output-container');
    const $inputScrollbarHolder = this.$input;

    let leftScrollFlag = false;
    let rightScrollFlag = false;

    $inputScrollbarHolder.addEventListener('scroll', inputScroll);
    $outputScrollbarHolder.addEventListener('scroll', outputScroll);

    function outputScroll() {
      const scrollPercent = $outputScrollbarHolder.scrollTop / $outputScrollbarHolder.scrollHeight;
      if (!leftScrollFlag) {
        $inputScrollbarHolder.scrollTop = 
        round(scrollPercent * $inputScrollbarHolder.scrollHeight);
        rightScrollFlag = true;
      }
      leftScrollFlag = false;
    }
    function inputScroll() {
      const scrollPercent = $inputScrollbarHolder.scrollTop / $inputScrollbarHolder.scrollHeight;
      if (!rightScrollFlag) {
        $outputScrollbarHolder.scrollTop = 
        round(scrollPercent * $outputScrollbarHolder.scrollHeight);
        leftScrollFlag = true;
      }
      rightScrollFlag = false;
    }
  }
  /**
   * Creates an unique instance of AppComponent
   * 
   * @readonly
   * @static
   * @type {AppComponent}
   * @memberof AppComponent
   */
  public static get getInstance(): AppComponent {
    if (!AppComponent.instance) {
      return new AppComponent();
    }
    return AppComponent.instance;
  }
}
