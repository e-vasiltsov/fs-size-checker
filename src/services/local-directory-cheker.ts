import { FileSystem } from "../interfaces/file-system.interface";

export class LocalDirectoryChecker {
  constructor(private fileSystem: FileSystem) {}

  public directoryExists(path: string): boolean {
    return this.fileSystem.isDirectory(path);
  }

  public fileExists(path: string): boolean {
    return this.fileSystem.isFile(path);
  }
}
