import { FileSystem } from "../../interfaces/file-system.interface";
import { SizeCalculator } from "../../interfaces/size-calculator.interface";

export class DirectorySizeCalculator implements SizeCalculator {
  constructor(private fileSystem: FileSystem) {}

  public calculateSize(path: string, ignore: string[]): bigint {
    return this.fileSystem.getDirectorySize(path, ignore);
  }
}
