
import { RenderComponent } from "./renderComponent";

export class HrmsComponent {

  // date from input
  private data: string;
  // will highlight data or not
  private willHightlightData: boolean;
  // error message
  private errMsg: {

  }
  // instance for singleton
  private static instance: HrmsComponent;

  private constructor() {

  }

  init() {

  }

  handle() {

  }

  emit() {
    const emittedData = {
      input: ['1'],
      outputPlain: ['2'],
      outputRich: ['3'],
    }
    RenderComponent.getInstance.acquireData(emittedData);
  }

  public static get getInstance(): HrmsComponent {
    if (!HrmsComponent.instance) {
      return new HrmsComponent();
    }
    return HrmsComponent.instance;
  }

}
