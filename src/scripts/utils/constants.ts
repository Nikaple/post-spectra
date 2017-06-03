// exact mass of electron
export const massOfElectron = 0.000549;

// available solvents
export const solventInfo = {
  dmso: {
    formattedString: 'DMSO-<em>d</em><sub>6</sub>',
    residualRange: [39, 40],
    peaks: 7,
  },
  cdcl3: {
    formattedString: 'CDCl<sub>3</sub>',
    residualRange: [76.5, 77.5],
    peaks: 3,
  },
  ch3oh: {
    formattedString: 'CH<sub>3</sub>OH',
    residualRange: [48.5, 49.5],
    peaks: 7,
  },
  c6d6: {
    formattedString: 'C<sub>6</sub>D<sub>6</sub>',
    residualRange: [127.5, 128.5],
    peaks: 3,
  },
  d2o: {
    formattedString: 'D<sub>2</sub>O',
    residualRange: [],
    peaks: 0,
  },
};

// max and min of NMR frequency
export const maxFreq = 800;
export const minFreq = 100;
