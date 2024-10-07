export type ValidationResult<T> = {
  success: boolean;
  data: T[];
  errors: {
    field: string;
    message: string;
  }[];
};

export interface ArgumentsValidator<T> {
  parseSafe(data: unknown): ValidationResult<T>;
}
