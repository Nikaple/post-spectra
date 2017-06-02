// Chemical element dictionary
export interface MassIndicator {
  element: Element;
  mass: number;
}

export const elementLookup: MassIndicator[] = [
  { element: 'H', mass: 1.007825 },
  { element: 'He', mass: 4.002603 },
  { element: 'Li', mass: 7.016005 },
  { element: 'Be', mass: 9.012183 },
  { element: 'B', mass: 11.009305 },
  { element: 'C', mass: 12 },
  { element: 'N', mass: 14.003074 },
  { element: 'O', mass: 15.994915 },
  { element: 'F', mass: 18.998403 },
  { element: 'Ne', mass: 19.992439 },
  { element: 'Na', mass: 22.98977 },
  { element: 'Mg', mass: 23.985045 },
  { element: 'Al', mass: 26.981541 },
  { element: 'Si', mass: 27.976928 },
  { element: 'P', mass: 30.973763 },
  { element: 'S', mass: 31.972072 },
  { element: 'Cl', mass: 34.968853 },
  { element: 'Ar', mass: 39.962383 },
  { element: 'K', mass: 38.963708 },
  { element: 'Ca', mass: 39.962591 },
  { element: 'Sc', mass: 44.955914 },
  { element: 'Ti', mass: 47.947947 },
  { element: 'V', mass: 50.943963 },
  { element: 'Cr', mass: 51.94051 },
  { element: 'Mn', mass: 54.938046 },
  { element: 'Fe', mass: 55.934939 },
  { element: 'Co', mass: 58.933198 },
  { element: 'Ni', mass: 57.935347 },
  { element: 'Cu', mass: 62.929599 },
  { element: 'Zn', mass: 63.929145 },
  { element: 'Ga', mass: 68.925581 },
  { element: 'Ge', mass: 73.921179 },
  { element: 'As', mass: 74.921596 },
  { element: 'Se', mass: 79.916521 },
  { element: 'Br', mass: 78.918336 },
  { element: 'Kr', mass: 83.911506 },
  { element: 'Rb', mass: 84.9118 },
  { element: 'Sr', mass: 87.905625 },
  { element: 'Y', mass: 88.905856 },
  { element: 'Zr', mass: 89.904708 },
  { element: 'Nb', mass: 92.906378 },
  { element: 'Mo', mass: 97.905405 },
  { element: 'Ru', mass: 101.90434 },
  { element: 'Rh', mass: 102.905503 },
  { element: 'Pd', mass: 105.903475 },
  { element: 'Ag', mass: 106.905095 },
  { element: 'Cd', mass: 113.903361 },
  { element: 'In', mass: 114.903875 },
  { element: 'Sn', mass: 119.902199 },
  { element: 'Sb', mass: 120.903824 },
  { element: 'Te', mass: 129.906229 },
  { element: 'I', mass: 126.904477 },
  { element: 'Xe', mass: 131.904148 },
  { element: 'Cs', mass: 132.905433 },
  { element: 'Ba', mass: 137.905236 },
  { element: 'La', mass: 138.906355 },
  { element: 'Ce', mass: 139.905442 },
  { element: 'Pr', mass: 140.907657 },
  { element: 'Nd', mass: 141.907731 },
  { element: 'Sm', mass: 151.919741 },
  { element: 'Eu', mass: 152.921243 },
  { element: 'Gd', mass: 157.924111 },
  { element: 'Tb', mass: 158.92535 },
  { element: 'Dy', mass: 163.929183 },
  { element: 'Ho', mass: 164.930332 },
  { element: 'Er', mass: 165.930305 },
  { element: 'Tm', mass: 168.934225 },
  { element: 'Yb', mass: 173.938873 },
  { element: 'Lu', mass: 174.940785 },
  { element: 'Hf', mass: 179.946561 },
  { element: 'Ta', mass: 180.948014 },
  { element: 'W', mass: 183.950953 },
  { element: 'Re', mass: 186.955765 },
  { element: 'Os', mass: 191.961487 },
  { element: 'Ir', mass: 192.962942 },
  { element: 'Pt', mass: 194.964785 },
  { element: 'Au', mass: 196.96656 },
  { element: 'Hg', mass: 201.970632 },
  { element: 'Tl', mass: 204.97441 },
  { element: 'Pb', mass: 207.976641 },
  { element: 'Bi', mass: 208.980388 },
  { element: 'Th', mass: 232.038054 },
  { element: 'U', mass: 238.050786 },
];

export type Element =
  'H' |
  'He' |
  'Li' |
  'Be' |
  'B' |
  'C' |
  'N' |
  'O' |
  'F' |
  'Ne' |
  'Na' |
  'Mg' |
  'Al' |
  'Si' |
  'P' |
  'S' |
  'Cl' |
  'Ar' |
  'K' |
  'Ca' |
  'Sc' |
  'Ti' |
  'V' |
  'Cr' |
  'Mn' |
  'Fe' |
  'Co' |
  'Ni' |
  'Cu' |
  'Zn' |
  'Ga' |
  'Ge' |
  'As' |
  'Se' |
  'Br' |
  'Kr' |
  'Rb' |
  'Sr' |
  'Y' |
  'Zr' |
  'Nb' |
  'Mo' |
  'Ru' |
  'Rh' |
  'Pd' |
  'Ag' |
  'Cd' |
  'In' |
  'Sn' |
  'Sb' |
  'Te' |
  'I' |
  'Xe' |
  'Cs' |
  'Ba' |
  'La' |
  'Ce' |
  'Pr' |
  'Nd' |
  'Sm' |
  'Eu' |
  'Gd' |
  'Tb' |
  'Dy' |
  'Ho' |
  'Er' |
  'Tm' |
  'Yb' |
  'Lu' |
  'Hf' |
  'Ta' |
  'W' |
  'Re' |
  'Os' |
  'Ir' |
  'Pt' |
  'Au' |
  'Hg' |
  'Tl' |
  'Pb' |
  'Bi' |
  'Th' |
  'U';
