import { parseArgs } from "util";
import { ParsedArguments } from "../interfaces/parsed-arguments.interface";
import { Logger } from "../interfaces/logger.interface";
import { ArgumentParser } from "../interfaces/argument-parser.interface";

export class CliArgumentParser implements ArgumentParser<string[]> {
  constructor(private logger: Logger) {}

  parse(args: string[]): ParsedArguments[] {
    const { values, positionals } = parseArgs({
      args,
      options: {
        path: { type: "string", short: "p" },
        "max-size": { type: "string", short: "m" },
        unit: { type: "string", short: "u" },
        help: { type: "boolean", short: "h" },
      },
      allowPositionals: true,
    });

    if (values.help) {
      this.printUsage();
      process.exit(0);
    }

    let result: ParsedArguments = {
      path: values.path as string | undefined,
      maxSize: values["max-size"] as string | undefined,
      unit: values.unit as string | undefined,
    };

    if (!result.path && positionals.length > 0) {
      result.path = positionals[0];
    }

    if (!result.maxSize && positionals.length > 1) {
      result.maxSize = positionals[1];
    }

    if (!result.unit && positionals.length > 2) {
      result.unit = positionals[2];
    }

    return [result];
  }

  private printUsage() {
    this.logger.info(`
Usage: fs-size-checker [options] --path <path> --max-size <max_size> --unit <unit>

Options:
  -p, --path <path>       The path (directory, file) to check
  -m, --max-size <size>   The maximum allowed size
  -u, --unit <unit>       The unit for the size (B) (default: B)
  -h, --help              Display this help message

You can also use positional arguments:
  fs-size-checker <path> <max_size> [unit]

Examples:
  fs-size-checker --path ./dist --max-size 50 --unit B
  fs-size-checker ./dist 50 B
  `);
  }
}
