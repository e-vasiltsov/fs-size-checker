import {
  ArgumentsValidator,
  ValidationResult,
} from "../interfaces/arguments-validator.interface";
import { ParsedArguments } from "../interfaces/parsed-arguments.interface";

const onlyNumbersRegExp: RegExp = /^\d+(\.\d+)?$/;

export type CliArguments = {
  path: string;
  maxSize: number;
  unit: string;
  ignore: string[];
};

export class CliArgumentsValidator implements ArgumentsValidator<CliArguments> {
  private readonly validUnits = ["B", "KB", "MB", "GB", "TB"];

  parseSafe(args: ParsedArguments[]): ValidationResult<CliArguments> {
    const result: ValidationResult<CliArguments> = {
      success: false,
      data: [],
      errors: [],
    };

    for (const { path, maxSize, unit = "B", ignore = [] } of args) {
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
          message: `Field maxSize should be a number. Value "${maxSize}" not acceptable`,
        });
      }

      const upperCaseUnit = unit.toUpperCase();
      if (!this.validUnits.includes(upperCaseUnit)) {
        result.errors.push({
          field: "unit",
          message: `Field unit must be one of: [ ${this.validUnits.join(", ")} ]. Value "${unit}" not acceptable`,
        });
      }

      if (result.errors.length) {
        return result;
      }

      result.data.push({
        path: path!,
        maxSize: Number(maxSize),
        unit: unit!,
        ignore,
      });
    }

    result.success = true;

    return result;
  }
}
