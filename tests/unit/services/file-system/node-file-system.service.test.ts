import * as path from "path";
import fs from "node:fs";

import { NodeFileSystem } from "../../../../src/services/node-file-system.service";

describe("NodeFileSystem", () => {
  const testDir = path.join(__dirname, "mock-files");
  const nestedDir = path.join(testDir, "nested-folder");
  let fileSystem: NodeFileSystem;

  beforeEach(() => {
    fileSystem = new NodeFileSystem();
  });

  beforeAll(() => {
    // Set up test directory and files
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    if (!fs.existsSync(nestedDir)) {
      fs.mkdirSync(nestedDir, { recursive: true });
    }

    // Create files in the main test directory
    fs.writeFileSync(path.join(testDir, "file1.txt"), "File 1 content");
    fs.writeFileSync(path.join(testDir, "file2.txt"), "File 2 content");

    // Create files in the nested folder
    fs.writeFileSync(
      path.join(nestedDir, "nestedFile1.txt"),
      "Nested File 1 content",
    );
    fs.writeFileSync(
      path.join(nestedDir, "nestedFile2.txt"),
      "Nested File 2 content",
    );
  });

  afterAll(() => {
    // Clean up test directory and files
    const deleteFilesAndDirs = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively delete nested directories
          deleteFilesAndDirs(filePath);
        } else {
          fs.unlinkSync(filePath); // Delete file
        }
      }
      fs.rmdirSync(dir); // Remove the directory
    };

    deleteFilesAndDirs(testDir);
  });

  test("should read files in the main directory", () => {
    const files = fs.readdirSync(testDir);
    expect(files).toContain("file1.txt");
    expect(files).toContain("file2.txt");
    expect(files).toContain("nested-folder"); // Should list the nested folder
    expect(files.length).toBe(3);
  });

  test("should read files in the nested folder", () => {
    const filesInNestedDir = fs.readdirSync(nestedDir);
    expect(filesInNestedDir).toContain("nestedFile1.txt");
    expect(filesInNestedDir).toContain("nestedFile2.txt");
    expect(filesInNestedDir.length).toBe(2);
  });

  describe("isDirectory", () => {
    it("should return false when wrong directory name", () => {
      const isDirectory = fileSystem.isDirectory("wrong-directory-name");
      expect(isDirectory).toBeFalsy();
    });

    it("should return true when directory exists", () => {
      const isDirectory = fileSystem.isDirectory(testDir);
      expect(isDirectory).toBeTruthy();
    });
  });

  describe("getDirectorySize", () => {
    it("should return size of directory in bytes as bigint type", () => {
      const files = fileSystem.getDirectorySize(testDir, []);
      expect(files).toStrictEqual(70n);
    });

    it("should return zero because all files ignored", () => {
      const files = fileSystem.getDirectorySize(testDir, [
        "file1.txt",
        "file2.txt",
        "nestedFile1.txt",
        "nestedFile2.txt",
      ]);
      expect(files).toBe(0n);
    });
  });

  describe("toCrossPlatformPath", () => {
    it("should handle Unix-style relative paths", () => {
      const input = "../../dist";
      const expectedPath = path.resolve("../../dist");

      const crossPlatformPath = fileSystem.toCrossPlatformPath(input);
      expect(crossPlatformPath).toBe(expectedPath);
    });

    it("should handle Windows-style relative paths", () => {
      const input = "..\\..\\dist";
      const expected = path.resolve("..\\..\\dist");

      const crossPlatformPath = fileSystem.toCrossPlatformPath(input);
      expect(crossPlatformPath).toBe(expected);
    });

    it("should handle mixed-style paths", () => {
      const input = "../dist\\nested";
      const expected = path.resolve("../dist\\nested");

      const crossPlatformPath = fileSystem.toCrossPlatformPath(input);
      expect(crossPlatformPath).toBe(expected);
    });
  });

  describe("isFile", () => {
    it("should return true when file exist", () => {
      const file1Path = path.join(testDir, "file1.txt");
      const isFile = fileSystem.isFile(file1Path);
      expect(isFile).toBeTruthy();
    });
  });

  describe("getFileSize", () => {
    it("should return size of file in bytes as bigint type", () => {
      const file1Path = path.join(testDir, "file1.txt");
      const fileSize = fileSystem.getFileSize(file1Path);
      expect(fileSize).toStrictEqual(14n);
    });
  });

  describe("extractRootFolder", () => {
    it("should extract the root folder from a pattern with '**/'", () => {
      const root = fileSystem.extractRootFolder("/mock/root/**/subdir/*.txt");
      expect(root).toBe("/mock/root");
    });

    it("should extract the root folder from a simple path", () => {
      const root = fileSystem.extractRootFolder("/mock/root/subdir/*.txt");
      expect(root).toBe("/mock/root/subdir");
    });
  });

  describe("getFilesByRegExpPatern", () => {
    it("should return files matching a specific pattern in nested directories when recursion is enabled", () => {
      const pattern = "*.txt"; // Match all .txt files
      const ignoreList: string[] = [];
      const result = fileSystem.getFilesByRegExpPatern(
        testDir,
        pattern,
        [],
        true, // Recurse into subdirectories
        ignoreList,
      );

      expect(result).toContain(path.join(testDir, "file1.txt"));
      expect(result).toContain(path.join(testDir, "file2.txt"));
      expect(result).toContain(path.join(nestedDir, "nestedFile1.txt"));
      expect(result).toContain(path.join(nestedDir, "nestedFile2.txt"));
      expect(result.length).toBe(4);
    });

    it("should return length 0 because all file ignored", () => {
      const pattern = "*.txt"; // Match all .txt files
      const ignoreList: string[] = [
        "file1.txt",
        "file2.txt",
        "nestedFile1.txt",
        "nestedFile2.txt",
      ];
      const result = fileSystem.getFilesByRegExpPatern(
        testDir,
        pattern,
        [],
        true, // Recurse into subdirectories
        ignoreList,
      );

      expect(result.length).toBe(0);
    });

    it("should return files matching a specific pattern in nested directories when recursion is disabled", () => {
      const pattern = "*.txt"; // Match all .txt files
      const ignoreList: string[] = [];
      const result = fileSystem.getFilesByRegExpPatern(
        testDir,
        pattern,
        [],
        false,
        ignoreList,
      );

      expect(result).toContain(path.join(testDir, "file1.txt"));
      expect(result).toContain(path.join(testDir, "file2.txt"));
      expect(result.length).toBe(2);
    });
  });

  describe("matchesPattern", () => {
    it("should return true for a file name that matches the pattern", () => {
      const fileName = "file1.txt";
      const pattern = "*.txt"; // Match any .txt file
      const result = fileSystem.matchesPattern(fileName, pattern);

      expect(result).toBe(true);
    });

    it("should return false for a file name that does not match the pattern", () => {
      const fileName = "file1.js";
      const pattern = "*.txt"; // Match any .txt file
      const result = fileSystem.matchesPattern(fileName, pattern);

      expect(result).toBe(false);
    });
  });

  describe("getGlobFilesSize", () => {
    const testDir = path.join(__dirname, "mock-files");
    // const nestedDir = path.join(testDir, "nested-folder");

    it("should calculate the total size of all files matching a glob pattern", () => {
      const globPattern = `${testDir}/**/*.txt`; // Match all .txt files recursively
      const ignoreList: string[] = [];

      const totalSize = fileSystem.getGlobFilesSize(globPattern, ignoreList);

      // Sizes: file1.txt (14), file2.txt (14), nestedFile1.txt (21), nestedFile2.txt (21)
      expect(totalSize).toBe(70n);
    });

    it("should calculate size of files in the root folder only when glob does not recurse", () => {
      const globPattern = `${testDir}/*.txt`; // Match .txt files only in the root directory
      const ignoreList: string[] = [];

      const totalSize = fileSystem.getGlobFilesSize(globPattern, ignoreList);

      // Sizes: file1.txt (14), file2.txt (14)
      expect(totalSize).toBe(28n);
    });
  });

  describe("currentlyWorkingPath", () => {
    it("should return the current working directory", () => {
      const expectedPath = process.cwd(); // The actual current working directory
      const result = fileSystem.currentlyWorkingPath("");
      expect(result).toBe(expectedPath);
    });
  });

  describe("readFile", () => {
    it("should read files in the nested folder", () => {
      const result = fileSystem.readFile(nestedDir + "/nestedFile1.txt");
      expect(result).toBe("Nested File 1 content");
    });
  });
});
