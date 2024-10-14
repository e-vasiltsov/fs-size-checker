import { Logger } from "../interfaces/logger.interface";
import { MessageFormatter } from "../interfaces/message-formater.interface";

type Options = Partial<{
  serviceName: string;
}>;

export class ConsoleLogger implements Logger {
  constructor(
    private options: Options = {},
    private formatter: MessageFormatter,
  ) {}

  info(message: string): void {
    const formatted = this.formatter.formatMessage(
      "yellow",
      `${this.getServiceName()}INFO: ${message}`,
    );
    console.log(`${formatted}`);
  }

  error(message: string, data?: unknown): void {
    const formatted = this.formatter.formatMessage(
      "red",
      `${this.getServiceName()}ERROR: ${message}`,
    );

    if (data) console.error(formatted, data);
    else console.error(formatted);
  }

  private getServiceName() {
    return this.options.serviceName ? `[${this.options.serviceName}] ` : "";
  }
}
