import { Configuration } from "../interfaces/config.interface";
import { FileSystem } from "../interfaces/file-system.interface";
import { Logger } from "../interfaces/logger.interface";

export class ConfigLoader {
  static DEFAULT_FILE_NAME = "fs-size-checker.json";

  constructor(
    private fileSystem: FileSystem,
    private logger: Logger,
  ) {}

  loadConfig(customPath?: string): Configuration | undefined {
    const configFilePath = this.fileSystem.currentlyWorkingPath(
      customPath || ConfigLoader.DEFAULT_FILE_NAME,
    );

    if (this.fileSystem.isFile(configFilePath)) {
      try {
        const configContent = this.fileSystem.readFile(configFilePath);
        return JSON.parse(configContent) as Configuration;
      } catch (e) {
        this.logger.error(
          `An error accoured while reading file ${configFilePath}`,
        );
        throw e;
      }
    }
  }
}
