import {
  ArgumentsValidator,
  ValidationResult,
} from "../interfaces/arguments-validator.interface";

const onlyNumbersRegExp = /\d/;

export type CliArguments = {
  path: string;
  maxSize: number;
};

export class CliArgumentsValidator implements ArgumentsValidator<CliArguments> {
  parseSafe(args: string[]): ValidationResult<CliArguments> {
    const result: ValidationResult<CliArguments> = {
      success: false,
      data: [],
      errors: [],
    };
    const [path, maxSize] = args;

    if (!path) {
      result.errors.push({
        field: "path",
        message: `Field path is required`,
      });
    }

    if (!maxSize) {
      result.errors.push({
        field: "maxSize",
        message: `Field maxSize is required`,
      });
    }

    if (!onlyNumbersRegExp.test(maxSize)) {
      result.errors.push({
        field: "maxSize",
        message: `Field maxSize should be a number`,
      });
    }

    if (result.errors.length) {
      return result;
    }

    result.success = true;
    result.data.push({
      path,
      maxSize: Number(maxSize),
    });

    return result;
  }
}
