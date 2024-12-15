import { MessageFormatter } from "../../../src/interfaces/message-formater.interface";
import { ConsoleLogger } from "../../../src/utils/console-logger";

describe("ConsoleLogger", () => {
  let mockFormatter: jest.Mocked<MessageFormatter>;

  beforeEach(() => {
    mockFormatter = {
      formatMessage: jest.fn((color, message) => `[${color}] ${message}`),
    };

    // Mock console methods
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("info", () => {
    it("should log an info message without a formatter", () => {
      const logger = new ConsoleLogger();
      logger.info("Test message");

      expect(console.log).toHaveBeenCalledWith("Test message");
    });

    it("should log an info message with a formatter", () => {
      const logger = new ConsoleLogger({}, mockFormatter);
      logger.info("Test message");

      expect(mockFormatter.formatMessage).toHaveBeenCalledWith(
        "yellow",
        "INFO: Test message",
      );
      expect(console.log).toHaveBeenCalledWith("[yellow] INFO: Test message");
    });

    it("should include the service name in the formatted message", () => {
      const logger = new ConsoleLogger(
        { serviceName: "TestService" },
        mockFormatter,
      );
      logger.info("Test message");

      expect(mockFormatter.formatMessage).toHaveBeenCalledWith(
        "yellow",
        "[TestService] INFO: Test message",
      );
      expect(console.log).toHaveBeenCalledWith(
        "[yellow] [TestService] INFO: Test message",
      );
    });
  });

  describe("error", () => {
    it("should log an error message without additional data", () => {
      const logger = new ConsoleLogger();
      logger.error("Error occurred");

      expect(console.error).toHaveBeenCalledWith("Error occurred");
    });

    it("should log an error message with additional data", () => {
      const logger = new ConsoleLogger();
      const errorData = { code: 500 };

      logger.error("Error occurred", errorData);

      expect(console.error).toHaveBeenCalledWith("Error occurred", errorData);
    });

    it("should log an error message with a formatter", () => {
      const logger = new ConsoleLogger({}, mockFormatter);
      const errorData = { code: 500 };

      logger.error("Error occurred", errorData);

      expect(mockFormatter.formatMessage).toHaveBeenCalledWith(
        "red",
        "ERROR: Error occurred",
      );
      expect(console.error).toHaveBeenCalledWith(
        "[red] ERROR: Error occurred",
        errorData,
      );
    });
  });
});
