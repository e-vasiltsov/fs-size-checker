import { Logger } from "./interfaces/logger.interface";
import { CliArguments } from "./services/cli-arguments-validator";
import { ArgumentsValidator } from "./interfaces/arguments-validator.interface";
import { ArgumentParser } from "./interfaces/argument-parser.interface";
import { FileSystem } from "./interfaces/file-system.interface";
import { SizeCalculatorStrategyFactory } from "./services/size-calculator/size-calculator-strategy";
import { SizeChecker } from "./interfaces/size-checker.interface";
import { SizeConverter } from "./interfaces/size-converter.interface";
import { Config } from "./interfaces/config.interface";

export class FileSystemSizeCheckerCli {
  constructor(
    private logger: Logger,
    private argumentsValidator: ArgumentsValidator<CliArguments>,
    private argumentsParser: ArgumentParser<string[]>,
    private fileSystem: FileSystem,
    private sizeChecker: SizeChecker,
    private sizeConverter: SizeConverter,
    private config: Config,
  ) {}

  public execute(): void {
    try {
      const parsedArguments = this.argumentsParser.parse(process.argv.slice(2));

      const configuration = this.config.loadConfig(
        parsedArguments.at(0)?.config,
      )?.sizeCheckList;

      const validationResult = this.argumentsValidator.parseSafe(
        configuration || parsedArguments,
      );
      if (!validationResult.success) {
        validationResult.errors.forEach((error) => {
          this.logger.error(error.message);
        });
        process.exit(1);
      }

      for (const { path, maxSize, ignore, unit } of validationResult.data) {
        const sizeCalculator = new SizeCalculatorStrategyFactory(
          this.fileSystem,
        ).createStrategy(path);

        if (sizeCalculator === null) {
          this.logger.error(`Path "${path}" does not exist`);
          process.exit(1);
        }

        const totalSizeInBytes = sizeCalculator.calculateSize(path, ignore);

        this.logger.info(`Total size of "${path}": ${totalSizeInBytes}`);

        if (
          !this.sizeChecker.compareSizeAgainstLimit(
            totalSizeInBytes,
            maxSize,
            unit,
          )
        ) {
          this.logger.error(
            `Total size of (${this.sizeConverter.formatSize(totalSizeInBytes, unit)}) is more then max size (${maxSize} ${unit}})`,
          );
        }
      }

      process.exit(1);
    } catch (e) {
      this.logger.error("Unexpected error occured =>\n", e);
      process.exit(1);
    }
  }
}
