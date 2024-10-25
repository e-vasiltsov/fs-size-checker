import { FileSystem } from "../../interfaces/file-system.interface";
import { SizeCalculator } from "../../interfaces/size-calculator.interface";

export class FileSizeCalculator implements SizeCalculator {
    constructor(private fileSystem: FileSystem) {}
  
    public calculateSize(path: string): bigint {
        return this.fileSystem.getFileSize(path);
    }
  }
  