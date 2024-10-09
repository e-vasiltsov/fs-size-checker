import {
  ArgumentsValidator,
  ValidationResult,
} from "../interfaces/arguments-validator.interface";
import { ParsedArguments } from "../interfaces/parsed-arguments.interface";

const onlyNumbersRegExp = /^\d+$/;

export type CliArguments = {
  path: string;
  maxSize: number;
  unit: string;
};

export class CliArgumentsValidator implements ArgumentsValidator<CliArguments> {
  private readonly validUnits = ["B"];

  parseSafe(args: ParsedArguments[]): ValidationResult<CliArguments> {
    const result: ValidationResult<CliArguments> = {
      success: false,
      data: [],
      errors: [],
    };

    const { path, maxSize, unit = "B" } = args[0];

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

    if (!onlyNumbersRegExp.test(maxSize as string)) {
      result.errors.push({
        field: "maxSize",
        message: `Field maxSize should be a number`,
      });
    }

    const upperCaseUnit = unit.toUpperCase();
    if (!this.validUnits.includes(upperCaseUnit)) {
      result.errors.push({
        field: "unit",
        message: `Field unit must be one of: [ ${this.validUnits.join(", ")} ]`,
      });
    }

    if (result.errors.length) {
      return result;
    }

    result.success = true;
    result.data.push({
      path: path!,
      maxSize: Number(maxSize),
      unit: unit!,
    });

    return result;
  }
}
