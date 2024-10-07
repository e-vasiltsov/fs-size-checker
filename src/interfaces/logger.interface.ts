export interface Logger {
  info(message: string): void;
  error(message: string, data?: unknown): void;
}
