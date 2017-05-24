import { Formula } from './formula';

describe('Formula', () => {
  const formulas = [
    new Formula(''),
    new Formula('C'),
    new Formula('NaC2H2COOH'),
    new Formula('C12H22O3BrCl2')
  ];
  it('should be able to parse a formula', () => {
    const result = [
      {},
      { C: 1 },
      { C: 3, H: 5, O: 2, Na: 1 },
      { C: 12, H: 22, O: 3, Br: 1, Cl: 2 }
    ];
    formulas.forEach((formula, index) => {
      expect(formula.parse()).toBe(result[index]);
    });
  });
});
