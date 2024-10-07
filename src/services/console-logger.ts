import { Logger } from "../interfaces/logger.interface";

type Options = Partial<{
  serviceName: string;
}>;

export class ConsoleLogger implements Logger {
  constructor(private options: Options = {}) {}

  info(message: string): void {
    console.log(`${this.getServiceName()}INFO: ${message}`);
  }

  error(message: string, data?: unknown): void {
    if (data) console.error(`${this.getServiceName()}ERROR: ${message}`, data);
    else console.error(`${this.getServiceName()}ERROR: ${message}`);
  }

  private getServiceName() {
    return this.options.serviceName ? `[${this.options.serviceName}] ` : "";
  }
}
