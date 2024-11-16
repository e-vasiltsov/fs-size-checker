export interface SizeChecker {
  compareSizeAgainstLimit(
    totalSize: bigint,
    maxSize: number,
    unit: string,
  ): boolean;
}
