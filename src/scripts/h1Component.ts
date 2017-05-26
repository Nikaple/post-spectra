import { strToPeaksArray, getActiveRadioButton } from './utils/utils';
import { split, map } from 'lodash';

export class H1Component {
    private data: string;
    constructor() {
        this.data = '';
    }

    public init(): void {
        const info$ = Array.from(document.querySelectorAll('input[name="info"]')) as HTMLInputElement[];
        const h1peaks$ = document.getElementById('h1peaks') as HTMLTextAreaElement;
        [...info$, h1peaks$].forEach((elem) => {
            elem.addEventListener('input', this.handle.bind(this));
            elem.addEventListener('change', this.handle.bind(this));
        });
    }

    public handle(): void {
        // get DOM elements
        const $output = document.getElementById('h1output') as HTMLDivElement;
        this.setDataFromInput();
        const data: string[] = split(this.data, /\n/g);
        // Individual strings
        const peaks: string[][] = map(data,strToPeaksArray);
        // NMR frequency
        const freqs = this.getPeaksFromData(data);
        const formattedData = data;//HERE
        console.log(peaks, freqs);
    }
    
    private getCouplingConstant(data) {
        return data.map()
    }
    private setDataFromInput(): void {
        this.data = (<HTMLInputElement>document.getElementById('h1peaks')).value;
    }

    private getPeaksFromData(data: string[]): number[] {
        return data.map(datum => {
            // set default frequency to 600 MHz
            let freq = /(\d+ MHz)/.exec(datum) || ['600'];
            return parseFloat(freq[0]);
        });
    }
}