import { pullAll } from 'lodash';
import { H1Component } from './h1Component';
import { C13Component } from './c13Component';
import { HrmsComponent } from './hrmsComponent';
import { ComponentData } from './utils/nmr';

export class RenderComponent {
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
  private static instance: RenderComponent;
  
  /**
   * Creates an instance of RenderComponent.
   * 
   * @memberof RenderComponent
   */
  private constructor() {
    this.$input = document.querySelector('#input') as HTMLTextAreaElement;
    this.$output = document.querySelector('#output') as HTMLDivElement;
    // this.inputText = this.$input.value;
    this.acquiredData = [];
  }

  private init() {
    
  }

  acquireData(componentData: ComponentData) {
    this.acquiredData.push(componentData);
    // console.log(this.acquiredData);
    // (<HTMLDivElement>document.querySelector('#h1Output')).innerHTML = JSON.stringify(this.acquiredData);
    this.render();
  }
  
  /**
   * Handles data from other components
   * 
   * @private
   * 
   * @memberof RenderComponent
   */
  private handle() {
    // clear data
    this.acquiredData = [];
    const hrmsData = HrmsComponent.getInstance.emit();

  }

  public render() {
    if(this.acquiredData.length === 0) {
      return;
    }
    const zz = this.acquiredData[0];
    const yy = zz.outputRich[0];
    // console.log(yy, zz);
    (<HTMLDivElement>document.querySelector('#h1Output')).innerHTML = yy;
  }

  /**
   * Creates an unique instance of RenderComponent
   * 
   * @readonly
   * @static
   * @type {RenderComponent}
   * @memberof RenderComponent
   */
  public static get getInstance(): RenderComponent {
    if (!RenderComponent.instance) {
      return new RenderComponent();
    }
    return RenderComponent.instance;
  }
}