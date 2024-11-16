import { FileSystemSizeCheckerCli } from "../file-system-size-checker-cli";
import { ConsoleLogger } from "../services/console-logger";
import { CliArgumentsValidator } from "../services/cli-arguments-validator";
import { NodeFileSystem } from "../services/node-file-system.service";
import { CliArgumentParser } from "../services/cli-argument-parser";
import { ColorFormatter } from "../services/color-formater";
import { SizeCheckerImpl } from "../services/size-checker";
import { SizeConverterImpl } from "../services/size-converter";

export class AppFactory {
  static createCli(): FileSystemSizeCheckerCli {
    const fileSystem = new NodeFileSystem();
    const logger = new ConsoleLogger(
      { serviceName: "fs-size-checker" },
      new ColorFormatter(),
    );
    const argumentsValidator = new CliArgumentsValidator();
    const argumentParser = new CliArgumentParser(logger);
    const sizeConverter = new SizeConverterImpl();
    const sizeChecker = new SizeCheckerImpl(sizeConverter);

    return new FileSystemSizeCheckerCli(
      logger,
      argumentsValidator,
      argumentParser,
      fileSystem,
      sizeChecker,
      sizeConverter,
    );
  }
}
