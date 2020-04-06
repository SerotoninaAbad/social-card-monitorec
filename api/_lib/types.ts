export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface LastDayStats {
  confirmed: number;
  deaths: number;
  possibleDeaths: number;
  suspicious: number;
  negatives: number;
  recoveries: number;
}
