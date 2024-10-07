import { SizeCalculator } from "../interfaces/size-calculator.interface";
import { FileSystem } from "../interfaces/file-system.interface";

export class LocalSizeCalculator implements SizeCalculator {
  constructor(private fileSystem: FileSystem) {}

  public calculateSize(path: string): bigint {
    if (this.fileSystem.isFile(path)) {
      return this.fileSystem.getFileSize(path);
    }

    return this.fileSystem.getDirectorySize(path);
  }
}
