import { MessageFormatter } from "../interfaces/message-formater.interface";

export class ColorFormatter implements MessageFormatter {
  private readonly colorCodes: { [key: string]: string } = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
  };

  formatMessage(color: string, message: string): string {
    const colorCode =
      this.colorCodes[color.toLowerCase()] || this.colorCodes.reset;
    return `${colorCode}${message}${this.colorCodes.reset}`;
  }
}
