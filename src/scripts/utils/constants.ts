// solvent info implementation
export interface SolventInfo {
  formattedString: string;
  residualRange: number[];
  peaks: number;
  peakType: string[];
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
    peakType: ['septet', '七重峰'],
  },
  cdcl3: {
    formattedString: 'CDCl<sub>3</sub>',
    residualRange: [76.5, 77.5],
    peaks: 3,
    peakType: ['triplet', '三重峰'],
  },
  cd3od: {
    formattedString: 'CD<sub>3</sub>OD',
    residualRange: [48.3, 49.7],
    peaks: 7,
    peakType: ['septet', '七重峰'],
  },
  c6d6: {
    formattedString: 'C<sub>6</sub>D<sub>6</sub>',
    residualRange: [127.3, 128.7],
    peaks: 3,
    peakType: ['triplet', '三重峰'],
  },
  d2o: {
    formattedString: 'D<sub>2</sub>O',
    residualRange: [0, 0],
    peaks: 0,
    peakType: ['none', '无峰'],
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

export const descriptions = {
  ribbons: [['View Guide', '查看帮助'], ['中文版', 'English Ver.']],
  configs: [['Vague multiplets', '将非d, t, q峰当做m峰处理'],
            ['Auto fix <em>J</em>', '自动校正J值'],
            ['Strict mode', '严格模式'],
            ['Auto copy', '自动复制']],
};
// exact mass of electron
export const massOfElectron = 0.000549;
