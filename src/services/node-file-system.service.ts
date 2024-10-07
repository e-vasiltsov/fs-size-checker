import * as fs from "fs";
import * as path from "path";

import { FileSystem } from "../interfaces/file-system.interface";

export class NodeFileSystem implements FileSystem {
  isDirectory(dirPath: string): boolean {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  isFile(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  }

  getDirectorySize(dirPath: string): bigint {
    let totalSize = BigInt(0);

    function calculateDirSize(currentPath: string) {
      const files = fs.readdirSync(currentPath);

      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath, { bigint: true });

        if (stats.isDirectory()) {
          calculateDirSize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    }

    calculateDirSize(dirPath);

    return totalSize;
  }

  getFileSize(filePath: string): bigint {
    const stats = fs.statSync(filePath, { bigint: true });
    return stats.size;
  }

  toCrossPlatformPath(inputPath: string): string {
    const normalizedPath = path.normalize(inputPath);

    const absolutePath = path.resolve(normalizedPath);

    return absolutePath;
  }
}
