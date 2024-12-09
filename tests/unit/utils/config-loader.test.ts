import { FileSystem } from "../../../src/interfaces/file-system.interface";
import { Config } from "../../../src/interfaces/config.interface";
import { ConfigLoader } from "../../../src/utils/config-loader";

describe("ConfigLoader", () => {
  let fileSystemMock: jest.Mocked<FileSystem>;
  let configLoader: Config;

  beforeEach(() => {
    // Create a mocked instance of FileSystem
    fileSystemMock = {
      isDirectory: jest.fn(),
      getDirectorySize: jest.fn(),
      toCrossPlatformPath: jest.fn(),
      getFileSize: jest.fn(),
      extractRootFolder: jest.fn(),
      getGlobFilesSize: jest.fn(),
      currentlyWorkingPath: jest.fn(),
      isFile: jest.fn(),
      readFile: jest.fn(),
    };

    // Initialize ConfigLoader with the mocked FileSystem
    configLoader = new ConfigLoader(fileSystemMock);
  });

  it("should load configuration from the default config file when no custom path is provided", () => {
    const mockConfig = { maxSize: 5000 };
    const mockFilePath = "/mock/path/fs-size-checker.json";

    fileSystemMock.currentlyWorkingPath.mockReturnValue(mockFilePath);
    fileSystemMock.isFile.mockReturnValue(true);
    fileSystemMock.readFile.mockReturnValue(JSON.stringify(mockConfig));

    const config = configLoader.loadConfig(undefined);

    expect(fileSystemMock.currentlyWorkingPath).toHaveBeenCalledWith(
        ConfigLoader.DEFAULT_FILE_NAME
    );
    expect(fileSystemMock.isFile).toHaveBeenCalledWith(mockFilePath);
    expect(fileSystemMock.readFile).toHaveBeenCalledWith(mockFilePath);
    expect(config).toEqual(mockConfig);
  });

  it("should load configuration from a custom path when provided", () => {
    const mockConfig = { maxSize: 10000 };
    const customPath = "/custom/config.json";

    fileSystemMock.currentlyWorkingPath.mockReturnValue(customPath);
    fileSystemMock.isFile.mockReturnValue(true);
    fileSystemMock.readFile.mockReturnValue(JSON.stringify(mockConfig));

    const config = configLoader.loadConfig(customPath);

    expect(fileSystemMock.currentlyWorkingPath).toHaveBeenCalledWith(customPath);
    expect(fileSystemMock.isFile).toHaveBeenCalledWith(customPath);
    expect(fileSystemMock.readFile).toHaveBeenCalledWith(customPath);
    expect(config).toEqual(mockConfig);
  });

  it("should return undefined if the configuration file does not exist", () => {
    const mockFilePath = "/mock/path/fs-size-checker.json";

    fileSystemMock.currentlyWorkingPath.mockReturnValue(mockFilePath);
    fileSystemMock.isFile.mockReturnValue(false);

    const config = configLoader.loadConfig(undefined);

    expect(fileSystemMock.currentlyWorkingPath).toHaveBeenCalledWith(
        ConfigLoader.DEFAULT_FILE_NAME
    );
    expect(fileSystemMock.isFile).toHaveBeenCalledWith(mockFilePath);
    expect(fileSystemMock.readFile).not.toHaveBeenCalled();
    expect(config).toBeUndefined();
  });
});
