import { Tooltip } from './utils/tooltip';
import { pullAll, forEach, compact, replace, chain, includes } from 'lodash';
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

    // bind event listeners
    const $checkboxes = Array.from(document.querySelectorAll('input[name="h1-checkbox"]'));
    const $peaks = document.getElementById('input') as HTMLTextAreaElement;
    forEach([$peaks, ...$checkboxes], (el) => {
      el.addEventListener('input', this.handle.bind(this));
      el.addEventListener('change', this.handle.bind(this));
    });

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
    const h1Data = H1Component.getInstance.handle();
    const c13Data = C13Component.getInstance.handle();
    const hrmsData = HrmsComponent.getInstance.handle();
    const componentsData = compact([h1Data, c13Data, hrmsData]);
    if (componentsData.length < 3) {
      // this.renderError();
      return;
    }
    this.render(<ComponentData[]>componentsData);
  }


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
