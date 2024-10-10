import { ParsedArguments } from "./parsed-arguments.interface";

export interface ArgumentParser<T> {
  parse(args: T): ParsedArguments[];
}
