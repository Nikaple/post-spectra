// exact mass of electron
export const massOfElectron = 0.000549;

// solvent info implementation
export interface SolventInfo {
  formattedString: string;
  residualRange: number[];
  peaks: number;
}

export interface SolventsInfo {
  [key: string]: SolventInfo;
}

// available solvents
export const solventsInfo: SolventsInfo = {
  dmso: {
    formattedString: 'DMSO-<em>d</em><sub>6</sub>',
    residualRange: [38.7, 40.3],
    peaks: 7,
  },
  cdcl3: {
    formattedString: 'CDCl<sub>3</sub>',
    residualRange: [76.3, 77.7],
    peaks: 3,
  },
  cd3od: {
    formattedString: 'CD<sub>3</sub>OD',
    residualRange: [48.3, 49.7],
    peaks: 7,
  },
  c6d6: {
    formattedString: 'C<sub>6</sub>D<sub>6</sub>',
    residualRange: [127.3, 128.7],
    peaks: 3,
  },
  d2o: {
    formattedString: 'D<sub>2</sub>O',
    residualRange: [0, 0],
    peaks: 0,
  },
};

// max and min of NMR frequency
export const maxFreq = 800;
export const minFreq = 100;

export interface ComponentData {
  input: string[];
  outputPlain: string[];
  outputRich: string[];
}
