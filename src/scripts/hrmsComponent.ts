
import { ComponentData } from './utils/constants';

export class HrmsComponent {

  // date from input
  private data: string;
  // will highlight data or not
  private willHightlightData: boolean;
  // error message
  private errMsg: {

  };
  // instance for singleton
  private static instance: HrmsComponent;

  private constructor() {

  }

  init() {

  }

  handle(): ComponentData {
    return {
      input: ['1'],
      outputPlain: ['1'],
      outputRich: ['1'],
    };
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
