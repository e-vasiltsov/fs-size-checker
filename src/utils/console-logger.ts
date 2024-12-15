import { Logger } from "../interfaces/logger.interface";
import { MessageFormatter } from "../interfaces/message-formater.interface";

type Options = Partial<{
  serviceName: string;
}>;

export class ConsoleLogger implements Logger {
  constructor(
    private options: Options = {},
    private formatter?: MessageFormatter,
  ) {}

  info(message: string): void {
    if (this.formatter) {
      message = this.formatter.formatMessage(
        "yellow",
        `${this.getServiceName()}INFO: ${message}`,
      );
    }

    console.log(`${message}`);
  }

  error(message: string, data?: unknown): void {
    if (this.formatter) {
      message = this.formatter.formatMessage(
        "red",
        `${this.getServiceName()}ERROR: ${message}`,
      );
    }

    if (data) console.error(message, data);
    else console.error(message);
  }

  private getServiceName() {
    return this.options.serviceName ? `[${this.options.serviceName}] ` : "";
  }
}
