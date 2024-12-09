export type SizeUnit = "B" | "KB" | "MB" | "GB" | "TB";

export interface SizeConverter {
  convertToBytes(size: number, unit: SizeUnit): number;
  formatSize(bytes: bigint, unit: string): string;
  supportedSizeUnits(): string[];
}
