import { FileSystemSizeCheckerCli } from "../file-system-size-checker-cli";
import { ConsoleLogger } from "../services/console-logger";
import { CliArgumentsValidator } from "../services/cli-arguments-validator";
import { LocalCrossPlatformPath } from "../services/cross-platform-path";
import { NodeFileSystem } from "../services/node-file-system.service";
import { LocalDirectoryChecker } from "../services/local-directory-cheker";
import { LocalSizeCalculator } from "../services/size-calculator";

export class AppFactory {
  static createCli(): FileSystemSizeCheckerCli {
    const fileSystem = new NodeFileSystem();
    const directoryChecker = new LocalDirectoryChecker(fileSystem);
    const dsizeCalculator = new LocalSizeCalculator(fileSystem);
    const logger = new ConsoleLogger({
      serviceName: "fs-size-checker",
    });
    const crossPlatformPath = new LocalCrossPlatformPath(fileSystem);
    const argumentsValidator = new CliArgumentsValidator();

    return new FileSystemSizeCheckerCli(
      directoryChecker,
      dsizeCalculator,
      crossPlatformPath,
      logger,
      argumentsValidator,
    );
  }
}
