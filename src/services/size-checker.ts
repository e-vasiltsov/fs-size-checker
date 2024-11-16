import { SizeChecker } from "../interfaces/size-checker.interface";
import {
  SizeConverter,
  SizeUnit,
} from "../interfaces/size-converter.interface";

export class SizeCheckerImpl implements SizeChecker {
  constructor(private converter: SizeConverter) {}

  compareSizeAgainstLimit(
    totalSizeInBytes: bigint,
    maxSize: number,
    unit: SizeUnit,
  ): boolean {
    const maxSizeInBytes = this.converter.convertToBytes(maxSize, unit);

    if (totalSizeInBytes > maxSizeInBytes) {
      return false;
    }

    return true;
  }
}
