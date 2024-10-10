import { Logger } from "./interfaces/logger.interface";
import { DirectoryChecker } from "./interfaces/directory-checker.interface";
import { SizeCalculator } from "./interfaces/size-calculator.interface";
import { CrossPlatformPath } from "./interfaces/cross-platform-path .interface";
import { CliArguments } from "./services/cli-arguments-validator";
import { ArgumentsValidator } from "./interfaces/arguments-validator.interface";
import { ArgumentParser } from "./interfaces/argument-parser.interface";

export class FileSystemSizeCheckerCli {
  constructor(
    private directoryChecker: DirectoryChecker,
    private sizeCalculator: SizeCalculator,
    private crossPlatformPath: CrossPlatformPath,
    private logger: Logger,
    private argumentsValidator: ArgumentsValidator<CliArguments>,
    private argumentsParser: ArgumentParser<string[]>,
  ) {}

  public execute(): void {
    try {
      const parsedArguments = this.argumentsParser.parse(process.argv.slice(2));
      const validationResult =
        this.argumentsValidator.parseSafe(parsedArguments);
      if (!validationResult.success) {
        validationResult.errors.forEach((error) => {
          this.logger.error(error.message);
        });
        process.exit(1);
      }

      const { path, maxSize } = validationResult.data.at(0)!;

      const crossPlatformPath =
        this.crossPlatformPath.toCrossPlatformPath(path);
      if (
        !this.directoryChecker.directoryExists(crossPlatformPath) &&
        !this.directoryChecker.fileExists(crossPlatformPath)
      ) {
        this.logger.error(`Path "${path}" does not exist`);
        process.exit(1);
      }

      const totalSizeInBytes =
        this.sizeCalculator.calculateSize(crossPlatformPath);

      this.logger.info(
        `Total size of "${crossPlatformPath}": ${totalSizeInBytes} bytes`,
      );

      if (totalSizeInBytes > BigInt(maxSize)) {
        this.logger.error(
          `Total size of (${totalSizeInBytes} bytes) is more then max size (${maxSize} bytes)`,
        );
        process.exit(1);
      }
    } catch (e) {
      this.logger.error("Unexpected error occured =>\n", e);
      process.exit(1);
    }
  }
}
