export interface DirectoryChecker {
  directoryExists(path: string): boolean;
  fileExists(path: string): boolean;
}
