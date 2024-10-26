export interface FileSystem {
  isDirectory(path: string): boolean;
  isFile(path: string): boolean;
  getDirectorySize(path: string, ignoreList: string[]): bigint;
  toCrossPlatformPath(path: string): string;
  getFileSize(path: string): bigint;
  extractRootFolder(pattern: string): string;
  getGlobFilesSize(pattern: string, ignoreList: string[]): bigint;
}
