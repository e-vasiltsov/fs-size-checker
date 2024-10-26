import * as fs from "fs";
import * as path from "path";

import { FileSystem } from "../interfaces/file-system.interface";

export class NodeFileSystem implements FileSystem {
  isDirectory(dirPath: string): boolean {
    const crossPlatformPath = this.toCrossPlatformPath(dirPath);
    return (
      fs.existsSync(crossPlatformPath) &&
      fs.statSync(crossPlatformPath).isDirectory()
    );
  }

  isFile(filePath: string): boolean {
    const crossPlatformPath = this.toCrossPlatformPath(filePath);
    return (
      fs.existsSync(crossPlatformPath) &&
      fs.statSync(crossPlatformPath).isFile()
    );
  }

  getDirectorySize(dirPath: string, ignoreList: string[]): bigint {
    let totalSize = BigInt(0);
    const crossPlatformPath = this.toCrossPlatformPath(dirPath);

    function calculateDirSize(currentPath: string) {
      const files = fs.readdirSync(currentPath);

      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath, { bigint: true });

        const fileName = path.basename(filePath); // Get the file or folder name
        // Skip files or folders if they are in the ignore list
        if (ignoreList.includes(fileName)) {
          continue;
        }

        if (stats.isDirectory()) {
          calculateDirSize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    }

    calculateDirSize(crossPlatformPath);

    return totalSize;
  }

  getFileSize(filePath: string): bigint {
    const crossPlatformPath = this.toCrossPlatformPath(filePath);
    const stats = fs.statSync(crossPlatformPath, { bigint: true });
    return stats.size;
  }

  toCrossPlatformPath(inputPath: string): string {
    const normalizedPath = path.normalize(inputPath);

    const absolutePath = path.resolve(normalizedPath);

    return absolutePath;
  }

  /** Helper function to extract the root folder from a pattern */
  extractRootFolder(pattern: string): string {
    const doubleStarIndex = pattern.indexOf("/**/");
    if (doubleStarIndex !== -1) {
      return pattern.slice(0, doubleStarIndex); // Everything before '/**/' is the root
    }
    return path.dirname(pattern); // If no '/**/', root is the directory of the pattern
  }

  getFilesByRegExpPatern(
    dirPath: string,
    pattern: string,
    allFiles: string[] = [],
    recurse: boolean = true,
    ignoreList: string[],
  ): string[] {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      const fileName = path.basename(filePath); // Get the file or folder name
      // Skip files or folders if they are in the ignore list
      if (ignoreList.includes(fileName)) {
        continue;
      }

      if (stats.isDirectory()) {
        if (recurse) {
          // Only recurse into subdirectories if '**/' is in the pattern
          this.getFilesByRegExpPatern(
            filePath,
            pattern,
            allFiles,
            recurse,
            ignoreList,
          );
        }
      } else if (this.matchesPattern(filePath, pattern)) {
        // Only add files that match the pattern (both filename and extension)
        allFiles.push(filePath);
      }
    }

    return allFiles;
  }

  // Helper function to match files by both name pattern and extension
  matchesPattern(filePath: string, pattern: string): boolean {
    const baseNamePattern = path.basename(pattern); // Extracts filename pattern, e.g., "app-chunk-*.ts"
    const regexPattern = new RegExp(
      "^" + baseNamePattern.replace(/\*/g, ".*") + "$",
    ); // Convert wildcard to regex
    const fileName = path.basename(filePath);

    return regexPattern.test(fileName);
  }

  getGlobFilesSize(pathPatern: string, ignoreList: string[]): bigint {
    const rootDir = this.extractRootFolder(pathPatern);
    const shouldRecurse = this.shouldRecurse(pathPatern);

    const files = this.getFilesByRegExpPatern(
      rootDir,
      pathPatern,
      [],
      shouldRecurse,
      ignoreList,
    );
    let totalSize = BigInt(0);

    for (const file of files) {
      totalSize += fs.statSync(file, { bigint: true }).size;
    }

    return totalSize;
  }

  private shouldRecurse(pattern: string): boolean {
    return pattern.includes("/**/");
  }
}
