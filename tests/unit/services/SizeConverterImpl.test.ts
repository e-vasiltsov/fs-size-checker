import { SizeConverter } from "../../../src/interfaces/size-converter.interface";
import { SizeConverterImpl } from "../../../src/services/size-converter";

describe("SizeConverterImpl", () => {
  let sizeConverter: SizeConverter;

  beforeEach(() => {
    sizeConverter = new SizeConverterImpl();
  });

  describe("supportedSizeUnits", () => {
    it("should return all possible units", () => {
      const supportedUnits = sizeConverter.supportedSizeUnits();
      expect(supportedUnits).toEqual(["B", "KB", "MB", "GB", "TB"]);
    });
  });

  describe("convertToBytes", () => {
    it("should correctly convert integer sizes to bytes", () => {
      expect(sizeConverter.convertToBytes(1, "B")).toBe(1);
      expect(sizeConverter.convertToBytes(1, "KB")).toBe(1000);
      expect(sizeConverter.convertToBytes(1, "MB")).toBe(1_000_000);
      expect(sizeConverter.convertToBytes(1, "GB")).toBe(1_000_000_000);
      expect(sizeConverter.convertToBytes(1, "TB")).toBe(1_000_000_000_000);
    });

    it("should correctly convert floating-point sizes to bytes", () => {
      expect(sizeConverter.convertToBytes(1.5, "KB")).toBe(1500);
      expect(sizeConverter.convertToBytes(2.25, "MB")).toBe(2_250_000);
      expect(sizeConverter.convertToBytes(0.001, "GB")).toBe(1_000_000);
      expect(sizeConverter.convertToBytes(0.0005, "TB")).toBe(500_000_000);
    });

    it("should handle zero size correctly", () => {
      expect(sizeConverter.convertToBytes(0, "B")).toBe(0);
      expect(sizeConverter.convertToBytes(0, "KB")).toBe(0);
      expect(sizeConverter.convertToBytes(0, "MB")).toBe(0);
      expect(sizeConverter.convertToBytes(0, "GB")).toBe(0);
      expect(sizeConverter.convertToBytes(0, "TB")).toBe(0);
    });

    it("should handle very small floating-point sizes correctly", () => {
      expect(sizeConverter.convertToBytes(0.0001, "MB")).toBe(100);
      expect(sizeConverter.convertToBytes(0.045365, "MB")).toBe(45365);
      expect(sizeConverter.convertToBytes(0.000001, "GB")).toBe(1000);
    });

    it("should handle large sizes correctly", () => {
      expect(sizeConverter.convertToBytes(1_000_000, "KB")).toBe(1_000_000_000);
      expect(sizeConverter.convertToBytes(1_000, "TB")).toBe(
        1_000_000_000_000_000,
      );
    });
  });

  describe("formatSize", () => {
    it("should correctly format sizes without fractional parts", () => {
      expect(sizeConverter.formatSize(1000n, "B")).toBe("1000 B");
      expect(sizeConverter.formatSize(1_000_000n, "KB")).toBe("1000 KB");
      expect(sizeConverter.formatSize(1_000_000_000n, "MB")).toBe("1000 MB");
      expect(sizeConverter.formatSize(1_000_000_000_000n, "GB")).toBe(
        "1000 GB",
      );
      expect(sizeConverter.formatSize(1_000_000_000_000_000n, "TB")).toBe(
        "1000 TB",
      );
    });

    it("should correctly format sizes with fractional parts", () => {
      expect(sizeConverter.formatSize(41471n, "KB")).toBe("41.471 KB");
      expect(sizeConverter.formatSize(1_234_567n, "MB")).toBe("1.234567 MB");
      expect(sizeConverter.formatSize(1_500_123_456n, "GB")).toBe(
        "1.500123456 GB",
      );
      expect(sizeConverter.formatSize(1_000_567_890_123n, "TB")).toBe(
        "1.000567890123 TB",
      );
    });
  });
});
