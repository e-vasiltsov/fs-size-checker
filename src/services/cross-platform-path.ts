import { FileSystem } from "../interfaces/file-system.interface";

export class LocalCrossPlatformPath {
  constructor(private fileSystem: FileSystem) {}

  toCrossPlatformPath(inputPath: string): string {
    return this.fileSystem.toCrossPlatformPath(inputPath);
  }
}
