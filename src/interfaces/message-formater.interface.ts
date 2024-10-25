import { Colors } from "../services/color-formater";

export interface MessageFormatter {
  formatMessage(level: Colors, message: string): string;
}
