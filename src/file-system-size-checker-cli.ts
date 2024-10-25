import { Logger } from "./interfaces/logger.interface";
import { CliArguments } from "./services/cli-arguments-validator";
import { ArgumentsValidator } from "./interfaces/arguments-validator.interface";
import { ArgumentParser } from "./interfaces/argument-parser.interface";
import { FileSystem } from "./interfaces/file-system.interface";
import { SizeCalculatorStrategyFactory } from "./services/size-calculator/size-calculator-strategy";

export class FileSystemSizeCheckerCli {
  constructor(
    private logger: Logger,
    private argumentsValidator: ArgumentsValidator<CliArguments>,
    private argumentsParser: ArgumentParser<string[]>,
    private fileSystem: FileSystem
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

      const sizeCalculator = new SizeCalculatorStrategyFactory(
        this.fileSystem
      ).createStrategy(path);

      if (sizeCalculator === null) {
        this.logger.error(`Path "${path}" does not exist`);
        process.exit(1);
      }

      const totalSizeInBytes = sizeCalculator.calculateSize(path)

      this.logger.info(
        `Total size of "${path}": ${totalSizeInBytes} bytes`,
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
