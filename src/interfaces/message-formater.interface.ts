export interface MessageFormatter {
  formatMessage(level: string, message: string): string;
}
