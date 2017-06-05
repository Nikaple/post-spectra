import { ComponentData } from './utils/constants';

export const dataService: ComponentData[] = [];

// export class DataService {
//   private data: ComponentData[];
//   static instance: DataService;
//   constructor() {
//     this.data = [];
//   }
//   public addData(data) {
//     this.data.push(data);
//   }
//   public removeAllData() {
//     this.data = [];
//   }
//   public retrieveData() {
//     return this.data;
//   }
//   static get getInstance(): DataService {
//     if (!DataService.instance) {
//       return new DataService();
//     }
//     return DataService.instance;
//   }
// }
