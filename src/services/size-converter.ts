import {
  SizeConverter,
  SizeUnit,
} from "../interfaces/size-converter.interface";

export class SizeConverterImpl implements SizeConverter {
  public supportedSizeUnits(): SizeUnit[] {
    return ["B", "KB", "MB", "GB", "TB"];
  }

  private static unitFactors: { [key in SizeUnit]: bigint } = {
    B: 1n,
    KB: 1_000n,
    MB: 1_000_000n,
    GB: 1_000_000_000n,
    TB: 1_000_000_000_000n,
  };

  convertToBytes(size: number, unit: SizeUnit): number {
    const factor = SizeConverterImpl.unitFactors[unit];
    return size * Number(factor);
  }

  formatSize(bytes: bigint, unit: SizeUnit): string {
    const factor = SizeConverterImpl.unitFactors[unit];

    // Calculate the whole and fractional parts
    const wholePart = bytes / factor;
    const remainder = bytes % factor;

    // If there is no fractional part, return only the whole part
    if (remainder === 0n) {
      return `${wholePart} ${unit}`;
    }

    // Calculate the fractional part as a decimal
    const fractionalPart = Number(remainder) / Number(factor);

    // Combine the whole and fractional parts into a string
    return `${wholePart}${fractionalPart.toString().slice(1)} ${unit}`;
  }
}
