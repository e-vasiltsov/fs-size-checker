export interface SizeCalculator {
  calculateSize(path: string, ignore: string[]): bigint;
}
