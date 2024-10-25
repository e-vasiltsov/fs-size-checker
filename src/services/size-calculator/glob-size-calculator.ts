import { SizeCalculator } from '../../interfaces/size-calculator.interface';
import { FileSystem } from '../../interfaces/file-system.interface';

export class GlobStrategy implements SizeCalculator {
  constructor(private fileSystem: FileSystem) {}

  calculateSize(path: string): bigint {
    return this.fileSystem.getGlobFilesSize(path);
  }
}
