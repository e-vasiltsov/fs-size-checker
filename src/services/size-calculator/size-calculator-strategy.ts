
import { FileSystem } from "../../interfaces/file-system.interface";
import { SizeCalculator } from "../../interfaces/size-calculator.interface";
import { DirectorySizeCalculator } from "./directory-size-calculator";
import { FileSizeCalculator } from "./file-size-calculator";
import { GlobStrategy } from "./glob-size-calculator";

export class SizeCalculatorStrategyFactory {
    constructor(
      private fileSystem: FileSystem
    ) {}

    createStrategy(path: string): SizeCalculator | null {
        if (path.includes('*')) {
          return new GlobStrategy(this.fileSystem);
        } else if (this.fileSystem.isDirectory(path)) {
        return new FileSizeCalculator(this.fileSystem);
      } else if (this.fileSystem.isFile(path)) {
        return new DirectorySizeCalculator(this.fileSystem);
      } else {
        return null
      }
    }
  }
  